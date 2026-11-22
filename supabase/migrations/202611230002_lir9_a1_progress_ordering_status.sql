create or replace function public.submit_my_a1_lesson_assessment(p_lesson_id integer,p_answers jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare current_user_id uuid:=auth.uid(); answer_count integer; invalid_count integer; computed_score integer; completed_count integer;
begin
if current_user_id is null then raise exception 'Authentication required'; end if;
if p_lesson_id is null or p_lesson_id<1 or p_lesson_id>45 then raise exception 'Invalid lesson'; end if;
select count(*) into completed_count from public.lir9_verified_lesson_progress where user_id=current_user_id;
if p_lesson_id>completed_count+1 then raise exception 'Complete the previous verified lesson first'; end if;
if jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)<>5 then raise exception 'Exactly five answers are required'; end if;
select count(*),count(*) filter(where value !~ '^[0-2]$') into answer_count,invalid_count from jsonb_array_elements_text(p_answers);
if answer_count<>5 or invalid_count>0 then raise exception 'Invalid answer format'; end if;
select count(*) filter(where a.value::integer=k.correct_option) into computed_score from jsonb_array_elements_text(p_answers) with ordinality a(value,ordinality) join private.lir9_a1_lesson_answer_keys k on k.lesson_id=p_lesson_id and k.question_index=(a.ordinality-1)::smallint;
if computed_score>=4 then insert into public.lir9_verified_lesson_progress(user_id,lesson_id,score) values(current_user_id,p_lesson_id,computed_score) on conflict(user_id,lesson_id) do update set score=greatest(public.lir9_verified_lesson_progress.score,excluded.score); end if;
select count(*) into completed_count from public.lir9_verified_lesson_progress where user_id=current_user_id;
return jsonb_build_object('passed',computed_score>=4,'score',computed_score,'completed_count',completed_count);
end; $$;
create or replace function public.get_my_a1_certificate_status() returns jsonb language plpgsql security definer set search_path='' as $$
declare current_user_id uuid:=auth.uid(); completed_count integer; completed_lessons jsonb; final_score integer; final_submitted_at timestamptz;
begin
if current_user_id is null then raise exception 'Authentication required'; end if;
select count(*),coalesce(jsonb_agg(lesson_id::text order by lesson_id),'[]'::jsonb) into completed_count,completed_lessons from public.lir9_verified_lesson_progress where user_id=current_user_id;
select score,submitted_at into final_score,final_submitted_at from public.lir9_a1_final_assessments where user_id=current_user_id;
return jsonb_build_object('completed_count',completed_count,'completed_lessons',completed_lessons,'final_score',final_score,'final_submitted_at',final_submitted_at,'eligible',completed_count=45 and coalesce(final_score,0)>=24);
end; $$;