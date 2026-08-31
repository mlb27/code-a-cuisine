begin;

create or replace function public.set_recipe_like(
  p_recipe_id uuid,
  p_should_like boolean
)
returns table (
  recipe_id uuid,
  likes_count integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_recipe_id is null or p_should_like is null then
    return;
  end if;

  return query
    update public.recipes as recipe
    set likes_count = greatest(
      0,
      recipe.likes_count + case when p_should_like then 1 else -1 end
    )
    where recipe.id = p_recipe_id
      and recipe.is_public = true
    returning recipe.id, recipe.likes_count;
end;
$$;

comment on function public.set_recipe_like(uuid, boolean) is
  'Atomically adds or removes one heart from a public recipe.';

revoke all on function public.set_recipe_like(uuid, boolean)
  from public, anon, authenticated;

grant execute on function public.set_recipe_like(uuid, boolean)
  to service_role;

commit;
