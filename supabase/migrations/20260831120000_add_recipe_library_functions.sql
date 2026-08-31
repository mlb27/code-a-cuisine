begin;

create or replace function public.list_public_recipes(
  p_cuisine_style text default null,
  p_page integer default 1,
  p_page_size integer default 20,
  p_sort text default 'latest'
)
returns table (
  recipes jsonb,
  total_items bigint
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  normalized_cuisine_style text := nullif(lower(btrim(p_cuisine_style)), '');
  normalized_sort text := lower(coalesce(nullif(btrim(p_sort), ''), 'latest'));
begin
  if p_page is null or p_page < 1 then
    raise exception 'Page must be greater than zero.' using errcode = '22023';
  end if;

  if p_page_size is null or p_page_size < 1 or p_page_size > 20 then
    raise exception 'Page size must be between 1 and 20.' using errcode = '22023';
  end if;

  if normalized_sort not in ('latest', 'likes') then
    raise exception 'Recipe sort order is invalid.' using errcode = '22023';
  end if;

  if normalized_cuisine_style is not null
    and normalized_cuisine_style not in (
      'german',
      'italian',
      'indian',
      'japanese',
      'gourmet',
      'fusion'
    ) then
    raise exception 'Cuisine style is invalid.' using errcode = '22023';
  end if;

  return query
    with filtered_recipes as materialized (
      select recipe.*
      from public.recipes as recipe
      where recipe.is_public = true
        and (
          normalized_cuisine_style is null
          or recipe.cuisine_style = normalized_cuisine_style
        )
    ),
    paged_recipes as (
      select recipe.*
      from filtered_recipes as recipe
      order by
        case when normalized_sort = 'likes' then recipe.likes_count end desc,
        recipe.created_at desc,
        recipe.id asc
      limit p_page_size
      offset (p_page - 1) * p_page_size
    )
    select
      coalesce(
        (
          select jsonb_agg(
            to_jsonb(recipe)
            order by
              case when normalized_sort = 'likes' then recipe.likes_count end desc,
              recipe.created_at desc,
              recipe.id asc
          )
          from paged_recipes as recipe
        ),
        '[]'::jsonb
      ),
      (select count(*) from filtered_recipes);
end;
$$;

comment on function public.list_public_recipes(text, integer, integer, text) is
  'Returns one validated page of public recipes and the matching total count.';

revoke all on function public.list_public_recipes(text, integer, integer, text)
  from public, anon, authenticated;

grant execute on function public.list_public_recipes(text, integer, integer, text)
  to service_role;

commit;
