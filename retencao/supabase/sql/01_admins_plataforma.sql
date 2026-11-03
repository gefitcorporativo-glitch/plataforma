-- ============================================================
-- 01 · Administradores da plataforma
-- Rodar UMA vez no Supabase → SQL Editor (projeto xpvedihpejivnkssryhc).
-- Substitui o login fixo "nelson / senha no código" do admin_painel.html
-- por um login de verdade do Supabase Auth.
-- ============================================================

create table if not exists public.admins_plataforma (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  nome       text,
  email      text,
  criado_em  timestamptz not null default now()
);

-- RLS ligado e SEM políticas: só o servidor (Edge Functions) lê esta tabela.
alter table public.admins_plataforma enable row level security;

-- Função usada pelas políticas de RLS (próxima etapa) para liberar o admin.
create or replace function public.is_admin_plataforma()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins_plataforma where user_id = auth.uid());
$$;
revoke all on function public.is_admin_plataforma() from public;
grant execute on function public.is_admin_plataforma() to authenticated;

-- Cadastra o admin. O usuário precisa existir em Authentication → Users
-- (se não existir: "Add user" → "Create new user", marque "Auto Confirm User").
insert into public.admins_plataforma (user_id, nome, email)
select id, 'Nelson', email
from auth.users
where lower(email) = lower('gefit.corporativo@gmail.com')
on conflict (user_id) do nothing;

-- Conferência: deve retornar 1 linha.
select * from public.admins_plataforma;
