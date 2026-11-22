-- Daily LIRTO quota: three successful chat requests per Tehran calendar day for free users.
create table if not exists public.lir9_user_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'vip')),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.lirto_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  message_count integer not null default 0 check (message_count between 0 and 3),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

alter table public.lir9_user_plans enable row level security;
alter table public.lirto_daily_usage enable row level security;
revoke all on table public.lir9_user_plans from anon, authenticated;
revoke all on table public.lirto_daily_usage from anon, authenticated;
grant all on table public.lir9_user_plans to service_role;
grant all on table public.lirto_daily_usage to service_role;

create or replace function public.get_lirto_daily_usage()
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Tehran')::date;
  v_used integer := 0;
  v_is_vip boolean := false;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select exists (select 1 from public.lir9_user_plans p where p.user_id=v_user_id and p.plan='vip' and (p.expires_at is null or p.expires_at>now())) into v_is_vip;
  if v_is_vip then return jsonb_build_object('is_vip',true,'used',0,'limit',null,'remaining',null,'allowed',true); end if;
  select coalesce(u.message_count,0) into v_used from public.lirto_daily_usage u where u.user_id=v_user_id and u.usage_date=v_today;
  return jsonb_build_object('is_vip',false,'used',coalesce(v_used,0),'limit',3,'remaining',greatest(3-coalesce(v_used,0),0),'allowed',coalesce(v_used,0)<3);
end; $$;

create or replace function public.reserve_lirto_daily_message()
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Tehran')::date;
  v_used integer;
  v_is_vip boolean := false;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select exists (select 1 from public.lir9_user_plans p where p.user_id=v_user_id and p.plan='vip' and (p.expires_at is null or p.expires_at>now())) into v_is_vip;
  if v_is_vip then return jsonb_build_object('is_vip',true,'used',0,'limit',null,'remaining',null,'allowed',true); end if;
  insert into public.lirto_daily_usage(user_id,usage_date,message_count) values(v_user_id,v_today,1)
  on conflict(user_id,usage_date) do update set message_count=public.lirto_daily_usage.message_count+1,updated_at=now()
  where public.lirto_daily_usage.message_count<3
  returning message_count into v_used;
  if v_used is null then
    select u.message_count into v_used from public.lirto_daily_usage u where u.user_id=v_user_id and u.usage_date=v_today;
    return jsonb_build_object('is_vip',false,'used',coalesce(v_used,3),'limit',3,'remaining',0,'allowed',false);
  end if;
  return jsonb_build_object('is_vip',false,'used',v_used,'limit',3,'remaining',greatest(3-v_used,0),'allowed',true);
end; $$;

create or replace function public.release_lirto_daily_message()
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Tehran')::date;
  v_used integer := 0;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  update public.lirto_daily_usage set message_count=greatest(message_count-1,0),updated_at=now()
   where user_id=v_user_id and usage_date=v_today and message_count>0 returning message_count into v_used;
  if not found then select coalesce(u.message_count,0) into v_used from public.lirto_daily_usage u where u.user_id=v_user_id and u.usage_date=v_today; end if;
  return jsonb_build_object('is_vip',false,'used',coalesce(v_used,0),'limit',3,'remaining',greatest(3-coalesce(v_used,0),0),'allowed',coalesce(v_used,0)<3);
end; $$;

revoke all on function public.get_lirto_daily_usage() from public, anon;
revoke all on function public.reserve_lirto_daily_message() from public, anon;
revoke all on function public.release_lirto_daily_message() from public, anon;
grant execute on function public.get_lirto_daily_usage() to authenticated;
grant execute on function public.reserve_lirto_daily_message() to authenticated;
grant execute on function public.release_lirto_daily_message() to authenticated;
