create table if not exists private.lir9_a1_attempt_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_type text not null check (assessment_type in ('lesson','final')),
  scope_id smallint not null,
  attempt_count smallint not null default 0,
  window_started_at timestamptz not null default now(),
  primary key(user_id,assessment_type,scope_id)
);

create or replace function public.submit_my_a1_lesson_assessment(p_lesson_id integer,p_answers jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  current_user_id uuid:=auth.uid();
  answer_count integer;
  invalid_count integer;
  computed_score integer;
  completed_count integer;
  attempt_count integer;
  existing_score integer;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_lesson_id is null or p_lesson_id<1 or p_lesson_id>45 then raise exception 'Invalid lesson'; end if;
  select count(*) into completed_count from public.lir9_verified_lesson_progress where user_id=current_user_id;
  if p_lesson_id>completed_count+1 then raise exception 'Complete the previous verified lesson first'; end if;
  select score into existing_score from public.lir9_verified_lesson_progress where user_id=current_user_id and lesson_id=p_lesson_id;
  if existing_score is not null then
    return jsonb_build_object('passed',true,'completed_count',completed_count);
  end if;
  insert into private.lir9_a1_attempt_limits(user_id,assessment_type,scope_id,attempt_count,window_started_at)
  values(current_user_id,'lesson',p_lesson_id,1,now())
  on conflict(user_id,assessment_type,scope_id) do update
    set attempt_count=case when private.lir9_a1_attempt_limits.window_started_at<=now()-interval '24 hours' then 1 else private.lir9_a1_attempt_limits.attempt_count+1 end,
        window_started_at=case when private.lir9_a1_attempt_limits.window_started_at<=now()-interval '24 hours' then now() else private.lir9_a1_attempt_limits.window_started_at end
  returning attempt_count into attempt_count;
  if attempt_count>5 then raise exception 'Maximum five attempts per lesson in 24 hours'; end if;
  if jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)<>5 then raise exception 'Exactly five answers are required'; end if;
  select count(*),count(*) filter(where value !~ '^[0-2]$') into answer_count,invalid_count from jsonb_array_elements_text(p_answers);
  if answer_count<>5 or invalid_count>0 then raise exception 'Invalid answer format'; end if;
  select count(*) filter(where a.value::integer=k.correct_option) into computed_score
  from jsonb_array_elements_text(p_answers) with ordinality a(value,ordinality)
  join private.lir9_a1_lesson_answer_keys k on k.lesson_id=p_lesson_id and k.question_index=(a.ordinality-1)::smallint;
  if computed_score>=4 then
    insert into public.lir9_verified_lesson_progress(user_id,lesson_id,score)
    values(current_user_id,p_lesson_id,computed_score)
    on conflict(user_id,lesson_id) do update set score=greatest(public.lir9_verified_lesson_progress.score,excluded.score);
  end if;
  select count(*) into completed_count from public.lir9_verified_lesson_progress where user_id=current_user_id;
  return jsonb_build_object('passed',computed_score>=4,'completed_count',completed_count);
end;
$$;

create or replace function public.submit_my_a1_final_assessment(p_answers jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  current_user_id uuid:=auth.uid();
  answer_count integer;
  invalid_count integer;
  computed_score integer;
  completed_count integer;
  submitted_time timestamptz:=now();
  attempt_count integer;
  previous_score integer;
  previous_submitted_at timestamptz;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  select count(*) into completed_count from public.lir9_verified_lesson_progress where user_id=current_user_id;
  if completed_count<>45 then raise exception 'Complete all 45 verified lessons before taking the final assessment'; end if;
  select score,submitted_at into previous_score,previous_submitted_at from public.lir9_a1_final_assessments where user_id=current_user_id;
  if coalesce(previous_score,0)>=24 then
    return jsonb_build_object('score',previous_score,'submitted_at',previous_submitted_at,'passed',true);
  end if;
  insert into private.lir9_a1_attempt_limits(user_id,assessment_type,scope_id,attempt_count,window_started_at)
  values(current_user_id,'final',0,1,now())
  on conflict(user_id,assessment_type,scope_id) do update
    set attempt_count=case when private.lir9_a1_attempt_limits.window_started_at<=now()-interval '24 hours' then 1 else private.lir9_a1_attempt_limits.attempt_count+1 end,
        window_started_at=case when private.lir9_a1_attempt_limits.window_started_at<=now()-interval '24 hours' then now() else private.lir9_a1_attempt_limits.window_started_at end
  returning attempt_count into attempt_count;
  if attempt_count>5 then raise exception 'Maximum five final assessment attempts in 24 hours'; end if;
  if jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)<>30 then raise exception 'Exactly thirty answers are required'; end if;
  select count(*),count(*) filter(where value !~ '^[0-2]$') into answer_count,invalid_count from jsonb_array_elements_text(p_answers);
  if answer_count<>30 or invalid_count>0 then raise exception 'Invalid answer format'; end if;
  select count(*) filter(where a.value::integer=k.correct_option) into computed_score
  from jsonb_array_elements_text(p_answers) with ordinality a(value,ordinality)
  join private.lir9_a1_final_answer_keys k on k.question_index=(a.ordinality-1)::smallint;
  insert into public.lir9_a1_final_assessments(user_id,score,submitted_at)
  values(current_user_id,computed_score,submitted_time)
  on conflict(user_id) do update set score=excluded.score,submitted_at=excluded.submitted_at;
  return jsonb_build_object('score',computed_score,'submitted_at',submitted_time,'passed',computed_score>=24);
end;
$$;

revoke all on function public.submit_my_a1_lesson_assessment(integer,jsonb) from public,anon;
revoke all on function public.submit_my_a1_final_assessment(jsonb) from public,anon;
grant execute on function public.submit_my_a1_lesson_assessment(integer,jsonb) to authenticated;
grant execute on function public.submit_my_a1_final_assessment(jsonb) to authenticated;