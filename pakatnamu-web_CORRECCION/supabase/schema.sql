-- =========================================================
-- Pakatnamú · Esquema de base de datos para Supabase (PostgreSQL)
-- =========================================================
-- Cómo usarlo:
-- 1. Crea un proyecto en https://supabase.com
-- 2. Ve a "SQL Editor" → "New query"
-- 3. Pega y ejecuta este archivo completo
-- ---------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- TABLA: stores (sedes / tiendas)
-- ---------------------------------------------------------
create table if not exists public.stores (
  id text primary key,
  nombre text not null,
  direccion text not null,
  horario text not null,
  telefono text not null,
  principal boolean not null default false,
  latitud double precision,
  longitud double precision,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- TABLA: products (variedades de helados y postres)
-- ---------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  nombre text not null,
  categoria text not null check (categoria in ('Helado', 'Postre')),
  descripcion text not null,
  color text not null default 'mora',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- TABLA: promo_codes (códigos promocionales, sin pago en línea)
-- ---------------------------------------------------------
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  descripcion text not null,
  descuento_porcentaje integer not null check (descuento_porcentaje between 1 and 100),
  vigente boolean not null default true,
  fecha_inicio date not null default current_date,
  fecha_fin date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- TABLA: contact_messages (formulario de contacto)
-- ---------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  mensaje text not null,
  atendido boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- TABLA: profiles (datos adicionales del usuario registrado)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre_completo text,
  usuario text unique,
  telefono text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre_completo, usuario, telefono)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nombre_completo',
    new.raw_user_meta_data ->> 'usuario',
    new.raw_user_meta_data ->> 'telefono'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- SEGURIDAD: Row Level Security (RLS)
-- ---------------------------------------------------------
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.promo_codes enable row level security;
alter table public.contact_messages enable row level security;
alter table public.profiles enable row level security;

create policy "stores_public_read" on public.stores
  for select using (true);

create policy "products_public_read" on public.products
  for select using (activo = true);

create policy "promo_codes_public_read" on public.promo_codes
  for select using (vigente = true);

create policy "contact_messages_insert" on public.contact_messages
  for insert with check (true);

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ---------------------------------------------------------
-- DATOS DE EJEMPLO (igual a src/data/mockData.js)
-- ---------------------------------------------------------
insert into public.stores (id, nombre, direccion, horario, telefono, principal) values
  ('san-borja', 'San Borja (Sede principal)', 'Av. Primavera #909, local SS01, San Borja', 'Lunes a domingo, 8:00 a.m. – 11:00 p.m.', '700 1042 / 791 3550', true),
  ('san-isidro', 'San Isidro', 'Av. Las Camelias 9966, urb. Las Golondrinas', 'Lun – Vie 8:00 a.m. – 11:00 p.m. · Sáb, Dom y feriados 8:00 a.m. – 9:00 p.m.', '+51 987 654 321', false),
  ('miraflores', 'Miraflores', 'Ca. Los Eruditos de la Astronomía 2124, urb. Los Astronautas', 'Lun – Vie 8:00 a.m. – 11:00 p.m. · Sáb, Dom y feriados 8:00 a.m. – 9:00 p.m.', '+51 987 654 321', false),
  ('centro-historico', 'Centro Histórico', 'Av. Los Pensamientos Racionales 1660, urb. Alameda Púrpura', 'Lun – Vie 8:00 a.m. – 11:00 p.m. · Sáb, Dom y feriados 8:00 a.m. – 9:00 p.m.', '+51 987 654 321', false)
on conflict (id) do nothing;

insert into public.products (id, nombre, categoria, descripcion, color) values
  ('mora-andina', 'Mora andina', 'Helado', 'Moras silvestres del norte peruano en una base cremosa y poco dulce.', 'mora'),
  ('lucuma', 'Lúcuma', 'Helado', 'El sabor más peruano: lúcuma orgánica de productores locales.', 'lucuma'),
  ('maracuya-amazonico', 'Maracuyá amazónico', 'Helado', 'Fruta de la pasión de la selva, ácida y refrescante.', 'adobe'),
  ('tres-leches', 'Tres leches de chirimoya', 'Postre', 'Bizcocho húmedo bañado en tres leches con pulpa de chirimoya.', 'lucuma'),
  ('suspiro-norteno', 'Suspiro norteño', 'Postre', 'Nuestra versión del suspiro a la limeña con un toque de algarrobina.', 'mora'),
  ('aguaymanto', 'Aguaymanto', 'Helado', 'Dulce y ligeramente ácido, hecho con aguaymanto andino.', 'adobe')
on conflict (id) do nothing;

insert into public.promo_codes (codigo, descripcion, descuento_porcentaje) values
  ('PAKAT10', '10% de descuento en tu próxima visita a cualquiera de nuestras sedes.', 10)
on conflict (codigo) do nothing;
