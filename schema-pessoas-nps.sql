-- ============================================================
-- Hub de Pessoas (teste do candidato) e NPS do aluno · matriz GeFit
-- Rodar UMA vez no SQL Editor do Supabase GeFit (irwvagffrguiljaxrzmd).
-- Pode rodar de novo sem problema: só cria o que ainda não existe.
-- ============================================================

-- Respostas do teste de perfil do candidato (pessoas.html / teste-candidato.html)
create table if not exists pessoas_testes (
  id          uuid primary key default gen_random_uuid(),
  academia_id uuid,
  nome        text not null,
  cargo       text,
  sc          jsonb,     -- pontuação por perfil {D,I,S,C}
  cons        numeric,   -- consistência das respostas (0 a 1)
  respostas   jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists pessoas_testes_academia_idx on pessoas_testes (academia_id, created_at desc);

-- Respostas do NPS (nps.html). O painel do Hub já lê esta tabela;
-- o "if not exists" só cria se ela ainda não existir.
create table if not exists nps_respostas (
  id          uuid primary key default gen_random_uuid(),
  academia_id uuid,
  tipo        text,      -- 'geral' ou 'pontual'
  contexto    text,      -- consultoria, avaliacao_fisica, revisao_treino, time_tecnico
  nota        int,
  aluno_nome  text,
  created_at  timestamptz not null default now()
);

-- Mesmo padrão das demais tabelas da plataforma (o login atual não usa Supabase Auth).
alter table pessoas_testes disable row level security;
alter table nps_respostas  disable row level security;
