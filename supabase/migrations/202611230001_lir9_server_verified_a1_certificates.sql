-- Server-authoritative A1 assessments and certificate eligibility.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.lir9_a1_lesson_answer_keys(lesson_id smallint not null check(lesson_id between 1 and 45),question_index smallint not null check(question_index between 0 and 4),correct_option smallint not null check(correct_option between 0 and 2),primary key(lesson_id,question_index));
create table if not exists private.lir9_a1_final_answer_keys(question_index smallint primary key check(question_index between 0 and 29),correct_option smallint not null check(correct_option between 0 and 2));
insert into private.lir9_a1_lesson_answer_keys(lesson_id,question_index,correct_option) values
(1,0,0),
(1,1,0),
(1,2,0),
(1,3,0),
(1,4,0),
(2,0,1),
(2,1,0),
(2,2,0),
(2,3,0),
(2,4,0),
(3,0,0),
(3,1,1),
(3,2,0),
(3,3,0),
(3,4,0),
(4,0,1),
(4,1,2),
(4,2,0),
(4,3,0),
(4,4,0),
(5,0,0),
(5,1,0),
(5,2,0),
(5,3,0),
(5,4,0),
(6,0,0),
(6,1,0),
(6,2,0),
(6,3,0),
(6,4,0),
(7,0,0),
(7,1,0),
(7,2,0),
(7,3,0),
(7,4,0),
(8,0,0),
(8,1,0),
(8,2,0),
(8,3,0),
(8,4,0),
(9,0,0),
(9,1,0),
(9,2,0),
(9,3,0),
(9,4,0),
(10,0,0),
(10,1,0),
(10,2,1),
(10,3,0),
(10,4,0),
(11,0,0),
(11,1,0),
(11,2,0),
(11,3,0),
(11,4,0),
(12,0,0),
(12,1,0),
(12,2,0),
(12,3,0),
(12,4,0),
(13,0,0),
(13,1,0),
(13,2,0),
(13,3,0),
(13,4,0),
(14,0,0),
(14,1,0),
(14,2,0),
(14,3,0),
(14,4,0),
(15,0,0),
(15,1,0),
(15,2,0),
(15,3,0),
(15,4,0),
(16,0,0),
(16,1,0),
(16,2,0),
(16,3,0),
(16,4,0),
(17,0,0),
(17,1,0),
(17,2,0),
(17,3,0),
(17,4,0),
(18,0,0),
(18,1,0),
(18,2,0),
(18,3,0),
(18,4,0),
(19,0,0),
(19,1,0),
(19,2,0),
(19,3,0),
(19,4,0),
(20,0,0),
(20,1,0),
(20,2,0),
(20,3,0),
(20,4,0),
(21,0,0),
(21,1,1),
(21,2,0),
(21,3,1),
(21,4,0),
(22,0,1),
(22,1,1),
(22,2,0),
(22,3,0),
(22,4,0),
(23,0,1),
(23,1,1),
(23,2,0),
(23,3,1),
(23,4,0),
(24,0,0),
(24,1,1),
(24,2,0),
(24,3,1),
(24,4,0),
(25,0,0),
(25,1,0),
(25,2,0),
(25,3,0),
(25,4,0),
(26,0,0),
(26,1,0),
(26,2,0),
(26,3,0),
(26,4,0),
(27,0,0),
(27,1,0),
(27,2,0),
(27,3,0),
(27,4,0),
(28,0,1),
(28,1,0),
(28,2,0),
(28,3,0),
(28,4,0),
(29,0,0),
(29,1,1),
(29,2,0),
(29,3,0),
(29,4,0),
(30,0,0),
(30,1,0),
(30,2,0),
(30,3,0),
(30,4,0),
(31,0,0),
(31,1,0),
(31,2,0),
(31,3,0),
(31,4,0),
(32,0,0),
(32,1,1),
(32,2,0),
(32,3,0),
(32,4,0),
(33,0,0),
(33,1,0),
(33,2,0),
(33,3,0),
(33,4,0),
(34,0,0),
(34,1,0),
(34,2,0),
(34,3,0),
(34,4,0),
(35,0,0),
(35,1,0),
(35,2,0),
(35,3,0),
(35,4,0),
(36,0,0),
(36,1,0),
(36,2,0),
(36,3,0),
(36,4,0),
(37,0,0),
(37,1,0),
(37,2,0),
(37,3,0),
(37,4,0),
(38,0,0),
(38,1,0),
(38,2,0),
(38,3,0),
(38,4,0),
(39,0,0),
(39,1,0),
(39,2,0),
(39,3,0),
(39,4,0),
(40,0,0),
(40,1,0),
(40,2,0),
(40,3,0),
(40,4,0),
(41,0,0),
(41,1,0),
(41,2,0),
(41,3,0),
(41,4,0),
(42,0,0),
(42,1,0),
(42,2,0),
(42,3,0),
(42,4,0),
(43,0,0),
(43,1,0),
(43,2,0),
(43,3,0),
(43,4,0),
(44,0,0),
(44,1,0),
(44,2,0),
(44,3,0),
(44,4,0),
(45,0,0),
(45,1,0),
(45,2,0),
(45,3,0),
(45,4,0)
on conflict(lesson_id,question_index) do update set correct_option=excluded.correct_option;
insert into private.lir9_a1_final_answer_keys(question_index,correct_option) values
(0,0),
(1,0),
(2,0),
(3,0),
(4,0),
(5,0),
(6,0),
(7,0),
(8,0),
(9,0),
(10,0),
(11,0),
(12,0),
(13,0),
(14,0),
(15,0),
(16,0),
(17,0),
(18,0),
(19,0),
(20,0),
(21,0),
(22,0),
(23,0),
(24,0),
(25,0),
(26,0),
(27,0),
(28,0),
(29,0)
on conflict(question_index) do update set correct_option=excluded.correct_option;
create table if not exists public.lir9_verified_lesson_progress(user_id uuid not null references auth.users(id) on delete cascade,lesson_id smallint not null check(lesson_id between 1 and 45),score smallint not null check(score between 4 and 5),completed_at timestamptz not null default now(),primary key(user_id,lesson_id));
alter table public.lir9_verified_lesson_progress enable row level security;
revoke all on public.lir9_verified_lesson_progress from public,anon,authenticated;
create table if not exists public.lir9_a1_final_assessments(user_id uuid primary key references auth.users(id) on delete cascade,score smallint not null check(score between 0 and 30),submitted_at timestamptz not null default now());
alter table public.lir9_a1_final_assessments enable row level security;
revoke all on public.lir9_a1_final_assessments from public,anon,authenticated;
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
create or replace function public.submit_my_a1_final_assessment(p_answers jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare current_user_id uuid:=auth.uid(); answer_count integer; invalid_count integer; computed_score integer; completed_count integer; submitted_time timestamptz:=now();
begin
if current_user_id is null then raise exception 'Authentication required'; end if;
select count(*) into completed_count from public.lir9_verified_lesson_progress where user_id=current_user_id;
if completed_count<>45 then raise exception 'Complete all 45 verified lessons before taking the final assessment'; end if;
if jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)<>30 then raise exception 'Exactly thirty answers are required'; end if;
select count(*),count(*) filter(where value !~ '^[0-2]$') into answer_count,invalid_count from jsonb_array_elements_text(p_answers);
if answer_count<>30 or invalid_count>0 then raise exception 'Invalid answer format'; end if;
select count(*) filter(where a.value::integer=k.correct_option) into computed_score from jsonb_array_elements_text(p_answers) with ordinality a(value,ordinality) join private.lir9_a1_final_answer_keys k on k.question_index=(a.ordinality-1)::smallint;
insert into public.lir9_a1_final_assessments(user_id,score,submitted_at) values(current_user_id,computed_score,submitted_time) on conflict(user_id) do update set score=excluded.score,submitted_at=excluded.submitted_at;
return jsonb_build_object('score',computed_score,'submitted_at',submitted_time,'passed',computed_score>=24);
end; $$;
create or replace function public.get_my_a1_certificate_status() returns jsonb language plpgsql security definer set search_path='' as $$
declare current_user_id uuid:=auth.uid(); completed_count integer; completed_lessons jsonb; final_score integer; final_submitted_at timestamptz;
begin
if current_user_id is null then raise exception 'Authentication required'; end if;
select count(*),coalesce(jsonb_agg(lesson_id::text order by lesson_id),'[]'::jsonb) into completed_count,completed_lessons from public.lir9_verified_lesson_progress where user_id=current_user_id;
select score,submitted_at into final_score,final_submitted_at from public.lir9_a1_final_assessments where user_id=current_user_id;
return jsonb_build_object('completed_count',completed_count,'completed_lessons',completed_lessons,'final_score',final_score,'final_submitted_at',final_submitted_at,'eligible',completed_count=45 and coalesce(final_score,0)>=24);
end; $$;
create or replace function public.issue_my_a1_certificate() returns jsonb language plpgsql security definer set search_path='' as $$
declare current_user_id uuid:=auth.uid(); completed_count integer; final_score integer; student_display_name text; certificate_row public.lir9_certificates%rowtype;
begin
if current_user_id is null then raise exception 'Authentication required'; end if;
select count(*) into completed_count from public.lir9_verified_lesson_progress where user_id=current_user_id;
if completed_count<>45 then raise exception 'Complete all 45 verified A1 lessons before requesting a certificate'; end if;
select score into final_score from public.lir9_a1_final_assessments where user_id=current_user_id;
if final_score is null or final_score<24 then raise exception 'A passing server-verified final assessment score is required'; end if;
select coalesce(nullif(btrim(raw_user_meta_data->>'display_name'),''),nullif(btrim(raw_user_meta_data->>'full_name'),'')) into student_display_name from auth.users where id=current_user_id;
if student_display_name is null then raise exception 'Add a display name to your account before issuing a certificate'; end if;
insert into public.lir9_certificates(user_id,student_name,level,score,verification_code) values(current_user_id,left(student_display_name,100),'A1',final_score,'LIR9-A1-'||upper(replace(gen_random_uuid()::text,'-',''))) on conflict(user_id,level) do nothing;
select * into certificate_row from public.lir9_certificates where user_id=current_user_id and level='A1';
if certificate_row.revoked_at is not null then raise exception 'This certificate has been revoked; contact LIR9 support'; end if;
return jsonb_build_object('student_name',certificate_row.student_name,'level',certificate_row.level,'score',certificate_row.score,'verification_code',certificate_row.verification_code,'issued_at',certificate_row.issued_at);
end; $$;
revoke all on function public.submit_my_a1_lesson_assessment(integer,jsonb) from public,anon;
revoke all on function public.submit_my_a1_final_assessment(jsonb) from public,anon;
revoke all on function public.get_my_a1_certificate_status() from public,anon;
revoke all on function public.issue_my_a1_certificate() from public,anon;
grant execute on function public.submit_my_a1_lesson_assessment(integer,jsonb) to authenticated;
grant execute on function public.submit_my_a1_final_assessment(jsonb) to authenticated;
grant execute on function public.get_my_a1_certificate_status() to authenticated;
grant execute on function public.issue_my_a1_certificate() to authenticated;
