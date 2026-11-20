-- LIR9 learning data: one compact, per-user state row.
-- Run this migration in the Supabase SQL Editor before deploying the frontend.

create table if not exists public.user_learning_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint user_learning_state_object check (jsonb_typeof(state) = 'object')
);

alter table public.user_learning_state enable row level security;

drop policy if exists "Users can read their own learning state" on public.user_learning_state;
create policy "Users can read their own learning state"
  on public.user_learning_state for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own learning state" on public.user_learning_state;
create policy "Users can insert their own learning state"
  on public.user_learning_state for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own learning state" on public.user_learning_state;
create policy "Users can update their own learning state"
  on public.user_learning_state for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.user_learning_state to authenticated;

create or replace function public.save_my_learning_state(p_patch jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_patch is null or jsonb_typeof(p_patch) <> 'object' then
    raise exception 'Learning state patch must be a JSON object';
  end if;

  if octet_length(p_patch::text) > 32768 then
    raise exception 'Learning state patch is too large';
  end if;

  insert into public.user_learning_state (user_id, state, updated_at)
  values (current_user_id, p_patch, now())
  on conflict (user_id) do update
    set state = public.user_learning_state.state || excluded.state,
        updated_at = now();
end;
$$;

revoke all on function public.save_my_learning_state(jsonb) from public;
grant execute on function public.save_my_learning_state(jsonb) to authenticated;
