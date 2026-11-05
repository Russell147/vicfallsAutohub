create table if not exists public.car_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  make text not null check (char_length(make) between 1 and 60),
  model text not null check (char_length(model) between 1 and 80),
  year integer not null check (year between 1900 and 2100),
  price numeric(12, 2) not null check (price > 0),
  mileage integer not null check (mileage >= 0),
  transmission text not null,
  fuel text not null,
  engine text not null default '',
  colour text not null default '',
  location text not null check (char_length(location) between 1 and 120),
  description text not null default '' check (char_length(description) <= 3000),
  seller_name text not null check (char_length(seller_name) between 1 and 120),
  phone text not null check (char_length(phone) between 6 and 40),
  image_paths text[] not null default '{}' check (cardinality(image_paths) <= 5),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.car_listings enable row level security;

grant select on public.car_listings to anon, authenticated;
grant insert, update, delete on public.car_listings to authenticated;

drop policy if exists "Anyone can view published car listings" on public.car_listings;
create policy "Anyone can view published car listings"
  on public.car_listings for select
  using (published = true);

drop policy if exists "Sellers can create their own car listings" on public.car_listings;
create policy "Sellers can create their own car listings"
  on public.car_listings for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Sellers can update their own car listings" on public.car_listings;
create policy "Sellers can update their own car listings"
  on public.car_listings for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Sellers can delete their own car listings" on public.car_listings;
create policy "Sellers can delete their own car listings"
  on public.car_listings for delete to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'car-listing-photos',
  'car-listing-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view car listing photos" on storage.objects;
create policy "Anyone can view car listing photos"
  on storage.objects for select
  using (bucket_id = 'car-listing-photos');

drop policy if exists "Sellers can upload their own car listing photos" on storage.objects;
create policy "Sellers can upload their own car listing photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'car-listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Sellers can delete their own car listing photos" on storage.objects;
create policy "Sellers can delete their own car listing photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'car-listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

notify pgrst, 'reload schema';
