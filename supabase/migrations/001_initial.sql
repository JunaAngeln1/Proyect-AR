-- Migración inicial para 3D Inclusive Studio
-- Ejecutar en el editor SQL de Supabase (https://app.supabase.com/project/_/sql)

-- Habilitar extensiones
create extension if not exists "uuid-ossp";

-- Tabla de perfiles de usuario
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  accessibility_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla de proyectos
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  scene jsonb not null default '{}'::jsonb,
  thumbnail_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla de modelos 3D (metadata; archivos en Supabase Storage)
create table if not exists public.models (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects on delete set null,
  name text not null,
  size integer not null,
  url text not null,
  path text not null unique,
  created_at timestamptz not null default now()
);

-- Índices
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_updated_at on public.projects(updated_at desc);
create index if not exists idx_models_project_id on public.models(project_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.models enable row level security;

-- Políticas RLS: perfiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Políticas RLS: proyectos (privados por defecto)
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

create policy "Public projects are viewable by everyone"
  on public.projects for select
  using (is_public = true);

-- Políticas RLS: modelos
create policy "Users can view own models"
  on public.models for select
  using (
    auth.uid() = (
      select user_id from public.projects where id = models.project_id
    )
  );

create policy "Users can insert own models"
  on public.models for insert
  with check (
    auth.uid() = (
      select user_id from public.projects where id = models.project_id
    )
  );

create policy "Users can delete own models"
  on public.models for delete
  using (
    auth.uid() = (
      select user_id from public.projects where id = models.project_id
    )
  );

-- Trigger para actualizar updated_at en proyectos
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
  before update on public.projects
  for each row
  execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

-- Bucket de Storage para modelos 3D (crear desde la consola de Supabase Storage)
-- insert into storage.buckets (id, name, public) values ('models', 'models', true);
