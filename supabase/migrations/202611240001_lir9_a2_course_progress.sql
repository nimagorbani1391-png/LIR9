-- LIR9 A2: private answer keys and server-authoritative lesson progression.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.lir9_a2_lesson_answer_keys (
  lesson_id smallint not null check (lesson_id between 1 and 24),
  question_index smallint not null check (question_index between 0 and 4),
  correct_option smallint not null check (correct_option between 0 and 2),
  primary key (lesson_id, question_index)
);
insert into private.lir9_a2_lesson_answer_keys(lesson_id,question_index,correct_option) values
(1,0,0),\n(1,1,1),\n(1,2,1),\n(1,3,2),\n(1,4,2),\n(2,0,1),\n(2,1,0),\n(2,2,1),\n(2,3,0),\n(2,4,1),\n(3,0,1),\n(3,1,2),\n(3,2,0),\n(3,3,0),\n(3,4,2),\n(4,0,0),\n(4,1,2),\n(4,2,1),\n(4,3,0),\n(4,4,2),\n(5,0,1),\n(5,1,1),\n(5,2,0),\n(5,3,2),\n(5,4,1),\n(6,0,1),\n(6,1,0),\n(6,2,0),\n(6,3,1),\n(6,4,0),\n(7,0,0),\n(7,1,1),\n(7,2,1),\n(7,3,2),\n(7,4,0),\n(8,0,0),\n(8,1,1),\n(8,2,1),\n(8,3,2),\n(8,4,0),\n(9,0,1),\n(9,1,0),\n(9,2,0),\n(9,3,0),\n(9,4,0),\n(10,0,0),\n(10,1,1),\n(10,2,1),\n(10,3,0),\n(10,4,2),\n(11,0,1),\n(11,1,0),\n(11,2,1),\n(11,3,1),\n(11,4,0),\n(12,0,0),\n(12,1,1),\n(12,2,1),\n(12,3,1),\n(12,4,0),\n(13,0,1),\n(13,1,2),\n(13,2,1),\n(13,3,1),\n(13,4,2),\n(14,0,0),\n(14,1,1),\n(14,2,1),\n(14,3,0),\n(14,4,1),\n(15,0,0),\n(15,1,1),\n(15,2,2),\n(15,3,2),\n(15,4,1),\n(16,0,1),\n(16,1,1),\n(16,2,1),\n(16,3,1),\n(16,4,1),\n(17,0,2),\n(17,1,0),\n(17,2,1),\n(17,3,0),\n(17,4,0),\n(18,0,0),\n(18,1,1),\n(18,2,1),\n(18,3,1),\n(18,4,0),\n(19,0,1),\n(19,1,1),\n(19,2,1),\n(19,3,2),\n(19,4,0),\n(20,0,1),\n(20,1,0),\n(20,2,0),\n(20,3,1),\n(20,4,1),\n(21,0,0),\n(21,1,1),\n(21,2,0),\n(21,3,1),\n(21,4,0),\n(22,0,0),\n(22,1,1),\n(22,2,0),\n(22,3,1),\n(22,4,1),\n(23,0,0),\n(23,1,0),\n(23,2,1),\n(23,3,0),\n(23,4,0),\n(24,0,0),\n(24,1,0),\n(24,2,0),\n(24,3,0),\n(24,4,1)
on conflict (lesson_id,question_index) do update set correct_option=excluded.correct_option;
create table if not exists public.lir9_verified_a2_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id smallint not null check (lesson_id between 1 and 24),
  score smallint not null check (score between 4 and 5),
  completed_at timestamptz not null default now(),
  primary key(user_id,lesson_id)
);
alter table public.lir9_verified_a2_lesson_progress enable row level security;
revoke all on public.lir9_verified_a2_lesson_progress from anon, authenticated;
create or replace function public.get_my_a2_progress() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n integer; ids jsonb;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 select count(*),coalesce(jsonb_agg(lesson_id::text order by lesson_id),'[]'::jsonb) into n,ids
 from public.lir9_verified_a2_lesson_progress where user_id=uid;
 return jsonb_build_object('completed_count',n,'completed_lessons',ids,'complete',n=24);
end; $$;
create or replace function public.submit_my_a2_lesson_assessment(p_lesson_id integer,p_answers jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n integer; answer_count integer; invalid_count integer; score integer;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 if p_lesson_id is null or p_lesson_id<1 or p_lesson_id>24 then raise exception 'Invalid A2 lesson'; end if;
 select count(*) into n from public.lir9_verified_a2_lesson_progress where user_id=uid;
 if p_lesson_id>n+1 then raise exception 'Complete the previous A2 lesson first'; end if;
 if jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)<>5 then raise exception 'Exactly five answers are required'; end if;
 select count(*),count(*) filter(where value !~ '^[0-2]$') into answer_count,invalid_count from jsonb_array_elements_text(p_answers);
 if answer_count<>5 or invalid_count>0 then raise exception 'Invalid answer format'; end if;
 select count(*) filter(where a.value::integer=k.correct_option) into score
 from jsonb_array_elements_text(p_answers) with ordinality a(value,ord)
 join private.lir9_a2_lesson_answer_keys k on k.lesson_id=p_lesson_id and k.question_index=(a.ord-1)::smallint;
 if score>=4 then
  insert into public.lir9_verified_a2_lesson_progress(user_id,lesson_id,score) values(uid,p_lesson_id,score)
  on conflict(user_id,lesson_id) do update set score=greatest(public.lir9_verified_a2_lesson_progress.score,excluded.score);
 end if;
 select count(*) into n from public.lir9_verified_a2_lesson_progress where user_id=uid;
 return jsonb_build_object('passed',score>=4,'score',score,'completed_count',n);
end; $$;
revoke all on function public.get_my_a2_progress() from public;
revoke all on function public.submit_my_a2_lesson_assessment(integer,jsonb) from public;
grant execute on function public.get_my_a2_progress() to authenticated;
grant execute on function public.submit_my_a2_lesson_assessment(integer,jsonb) to authenticated;
