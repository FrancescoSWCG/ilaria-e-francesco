create or replace function public.search_rsvp_guests(
  p_first_name text,
  p_last_name text default null
)
returns table (
  group_id uuid,
  group_label text,
  guest_id uuid,
  first_name text,
  last_name text,
  display_name text,
  rsvp public.rsvp_status,
  dietary_notes text
)
language sql
security definer
set search_path = public
as $$
  with normalized_search as (
    select
      lower(trim(coalesce(p_first_name, ''))) as first_name,
      lower(trim(coalesce(p_last_name, ''))) as last_name
  ),
  matching_groups as (
    select distinct g.group_id
    from guests g
    cross join normalized_search s
    where s.first_name <> ''
      and lower(trim(g.first_name)) like '%' || s.first_name || '%'
      and (
        s.last_name = ''
        or lower(trim(coalesce(g.last_name, ''))) like '%' || s.last_name || '%'
      )
  )
  select
    gg.id as group_id,
    gg.label as group_label,
    g.id as guest_id,
    g.first_name,
    g.last_name,
    g.display_name,
    g.rsvp,
    g.dietary_notes
  from matching_groups mg
  join guest_groups gg on gg.id = mg.group_id
  join guests g on g.group_id = gg.id
  order by gg.label, g.display_name;
$$;

create or replace function public.submit_rsvp_preferences(
  p_responses jsonb,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_responses is null or jsonb_typeof(p_responses) <> 'array' then
    raise exception 'p_responses must be a JSON array';
  end if;

  update guests g
  set
    rsvp = response.rsvp,
    dietary_notes = nullif(trim(coalesce(p_notes, '')), ''),
    updated_at = now()
  from jsonb_to_recordset(p_responses) as response(
    guest_id uuid,
    rsvp public.rsvp_status
  )
  where g.id = response.guest_id
    and response.rsvp in ('yes'::public.rsvp_status, 'no'::public.rsvp_status);
end;
$$;

revoke all on function public.search_rsvp_guests(text, text) from public;
revoke all on function public.submit_rsvp_preferences(jsonb, text) from public;

grant execute on function public.search_rsvp_guests(text, text) to anon;
grant execute on function public.submit_rsvp_preferences(jsonb, text) to anon;
