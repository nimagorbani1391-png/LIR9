-- Temporary safety gate: do not issue certificates from client-editable progress JSON.
-- Re-enable only after server-authoritative lesson completion and exam scoring are implemented.
create or replace function public.issue_my_a1_certificate()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  raise exception 'Certificate issuance is temporarily paused until server-side progress verification is enabled';
end;
$$;
