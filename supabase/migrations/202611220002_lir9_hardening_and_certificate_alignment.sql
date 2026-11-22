-- Align certificate eligibility with the 45 lessons in the current A1 curriculum.
-- Harden function search paths and optimize per-user learning-state RLS policies.

drop policy if exists "Users can read their own learning state" on public.user_learning_state;
create policy "Users can read their own learning state"
  on public.user_learning_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own learning state" on public.user_learning_state;
create policy "Users can insert their own learning state"
  on public.user_learning_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own learning state" on public.user_learning_state;
create policy "Users can update their own learning state"
  on public.user_learning_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter function public.get_lirto_daily_usage() set search_path = '';
alter function public.reserve_lirto_daily_message() set search_path = '';
alter function public.release_lirto_daily_message_for_user(uuid) set search_path = '';

-- This is an event-trigger function, not an application RPC endpoint.
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

create or replace function public.issue_my_a1_certificate()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  learning_state jsonb;
  completed_count integer := 0;
  score_text text;
  final_score integer;
  student_display_name text;
  certificate_row public.lir9_certificates%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select state into learning_state
  from public.user_learning_state
  where user_id = current_user_id;

  if not found then
    raise exception 'Learning progress was not found';
  end if;

  select count(distinct lesson_id)
    into completed_count
  from (
    select value as lesson_id
    from jsonb_array_elements_text(
      case
        when jsonb_typeof(learning_state->'completedLessons') = 'array'
          then learning_state->'completedLessons'
        else '[]'::jsonb
      end
    )
  ) completed
  where lesson_id ~ '^(?:[1-9]|[1-3][0-9]|4[0-5])$';

  if completed_count <> 45 then
    raise exception 'Complete all 45 A1 lessons before requesting a certificate';
  end if;

  score_text := learning_state #>> '{a1FinalResult,score}';
  if score_text is null or score_text !~ '^[0-9]{1,2}$' then
    raise exception 'A valid A1 final assessment result is required';
  end if;

  final_score := score_text::integer;
  if final_score < 24 or final_score > 30 then
    raise exception 'The passing score is 24 out of 30';
  end if;

  select coalesce(
    nullif(btrim(raw_user_meta_data->>'display_name'), ''),
    nullif(btrim(raw_user_meta_data->>'full_name'), '')
  )
  into student_display_name
  from auth.users
  where id = current_user_id;

  if student_display_name is null then
    raise exception 'Add a display name to your account before issuing a certificate';
  end if;

  insert into public.lir9_certificates (
    user_id, student_name, level, score, verification_code
  )
  values (
    current_user_id,
    left(student_display_name, 100),
    'A1',
    final_score,
    'LIR9-A1-' || upper(replace(gen_random_uuid()::text, '-', ''))
  )
  on conflict (user_id, level) do nothing;

  select * into certificate_row
  from public.lir9_certificates
  where user_id = current_user_id and level = 'A1';

  if certificate_row.revoked_at is not null then
    raise exception 'This certificate has been revoked; contact LIR9 support';
  end if;

  return jsonb_build_object(
    'student_name', certificate_row.student_name,
    'level', certificate_row.level,
    'score', certificate_row.score,
    'verification_code', certificate_row.verification_code,
    'issued_at', certificate_row.issued_at
  );
end;
$$;
