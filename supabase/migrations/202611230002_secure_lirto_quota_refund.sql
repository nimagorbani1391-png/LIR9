-- Refund a reserved daily message only from the trusted Edge Function service role.
drop function if exists public.release_lirto_daily_message();

create or replace function public.release_lirto_daily_message_for_user(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_today date := (now() at time zone 'Asia/Tehran')::date;
  v_used integer := 0;
begin
  if p_user_id is null then
    raise exception 'User id is required';
  end if;

  update public.lirto_daily_usage
     set message_count = greatest(message_count - 1, 0),
         updated_at = now()
   where user_id = p_user_id
     and usage_date = v_today
     and message_count > 0
   returning message_count into v_used;

  if not found then
    select coalesce(u.message_count, 0)
      into v_used
      from public.lirto_daily_usage u
     where u.user_id = p_user_id and u.usage_date = v_today;
  end if;

  return jsonb_build_object(
    'is_vip', false,
    'used', coalesce(v_used, 0),
    'limit', 3,
    'remaining', greatest(3 - coalesce(v_used, 0), 0),
    'allowed', coalesce(v_used, 0) < 3
  );
end;
$$;

revoke all on function public.release_lirto_daily_message_for_user(uuid) from public, anon, authenticated;
grant execute on function public.release_lirto_daily_message_for_user(uuid) to service_role;
