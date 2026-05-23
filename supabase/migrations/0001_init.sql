-- =====================================================
-- 사주 사이트 초기 스키마
-- =====================================================

create extension if not exists "pgcrypto";

-- ─── profiles ────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── products ────────────────────────────────────────
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price integer not null check (price >= 0),
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index products_active_order_idx on public.products(is_active, display_order);

-- ─── orders ──────────────────────────────────────────
create type public.order_status as enum ('pending', 'paid', 'failed');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,                       -- 토스 orderId
  user_id uuid references auth.users(id) on delete set null,
  guest_email text,
  product_id uuid not null references public.products(id),
  amount integer not null check (amount >= 0),
  status public.order_status not null default 'pending',
  toss_payment_key text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  constraint orders_user_or_guest check (user_id is not null or guest_email is not null)
);

create index orders_user_idx on public.orders(user_id);
create index orders_guest_email_idx on public.orders(guest_email);
create index orders_status_idx on public.orders(status);
create index orders_created_idx on public.orders(created_at desc);

-- ─── saju_inputs ─────────────────────────────────────
create type public.calendar_kind as enum ('solar', 'lunar');
create type public.gender_kind as enum ('male', 'female');

create table public.saju_inputs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  name text,
  birth_date date not null,
  birth_time time,
  time_unknown boolean not null default false,
  gender public.gender_kind not null,
  calendar public.calendar_kind not null default 'solar',
  concerns text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── saju_results ────────────────────────────────────
create table public.saju_results (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  myeongsik jsonb not null,                            -- 4기둥 (년월일시 천간/지지)
  interpretation_md text not null,
  llm_provider text not null,
  llm_model text not null,
  created_at timestamptz not null default now()
);

create index saju_results_order_idx on public.saju_results(order_id);

-- ─── reviews ─────────────────────────────────────────
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid not null unique references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  rating smallint not null check (rating between 1 and 5),
  content text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create index reviews_product_idx on public.reviews(product_id, is_public);
