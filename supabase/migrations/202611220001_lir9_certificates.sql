-- LIR9 internal course certificates and public verification.
-- Apply this migration in the Supabase SQL Editor before deploying the frontend.

create table if not exists public.lir9_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  student_name text not null check (char_length(btrim(student_name)) between 1 and 100),
  level text not null check (level = 'A1'),
  score smallint not null check (score between 24 and 30),
  verification_code text not null unique,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, level)
);

alter table public.lir9_certificates enable row level security;
revoke all on table public.lir9_certificates from anon, authenticated;

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
  where lesson_id ~ '^(?:[1-9]|1[0-9]|20)$';

  if completed_count <> 20 then
    raise exception 'Complete all 20 A1 lessons before requesting a certificate';
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

create or replace function public.get_my_a1_certificate()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  certificate_row public.lir9_certificates%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select * into certificate_row
  from public.lir9_certificates
  where user_id = current_user_id and level = 'A1'
    and revoked_at is null;

  if not found then
    return null;
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

create or replace function public.verify_lir9_certificate(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_code text;
  certificate_row public.lir9_certificates%rowtype;
begin
  normalized_code := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9-]', '', 'g'));

  if char_length(normalized_code) < 20 or char_length(normalized_code) > 48 then
    return jsonb_build_object('is_valid', false);
  end if;

  select * into certificate_row
  from public.lir9_certificates
  where verification_code = normalized_code;

  if not found or certificate_row.revoked_at is not null then
    return jsonb_build_object('is_valid', false);
  end if;

  return jsonb_build_object(
    'is_valid', true,
    'student_name', certificate_row.student_name,
    'level', certificate_row.level,
    'score', certificate_row.score,
    'verification_code', certificate_row.verification_code,
    'issued_at', certificate_row.issued_at,
    'status', 'valid'
  );
end;
$$;

revoke all on function public.issue_my_a1_certificate() from public, anon;
revoke all on function public.get_my_a1_certificate() from public, anon;
revoke all on function public.verify_lir9_certificate(text) from public;

grant execute on function public.issue_my_a1_certificate() to authenticated;
grant execute on function public.get_my_a1_certificate() to authenticated;
grant execute on function public.verify_lir9_certificate(text) to anon, authenticated;
