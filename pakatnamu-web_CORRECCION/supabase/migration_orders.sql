-- =========================================================
-- Pakatnamú · Migración: pedidos (carrito)
-- =========================================================
-- Ejecuta este archivo en el SQL Editor de Supabase DESPUÉS de
-- schema.sql. Es seguro de ejecutar aunque ya tengas datos: usa
-- "if not exists" en todo, no borra ni modifica nada existente.
-- ---------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- TABLA: orders (cabecera del pedido)
-- ---------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pendiente' check (status in ('pendiente', 'confirmado', 'entregado', 'cancelado')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- TABLA: order_items (variedades y cantidades del pedido)
-- ---------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  nombre text not null,
  qty integer not null check (qty > 0),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- SEGURIDAD: Row Level Security (RLS)
-- ---------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Cada usuario solo puede crear y ver SUS PROPIOS pedidos
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

-- Los items de pedido se pueden insertar/ver si el pedido (orders)
-- al que pertenecen es del usuario autenticado
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
