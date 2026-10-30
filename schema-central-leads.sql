-- ============================================================
-- GEFIT · CENTRAL DE LEADS (módulo M3)
-- Rodar UMA vez no SQL Editor do Supabase. Seguro rodar de novo (não apaga dados).
-- Tabelas: lead_campanhas (links de captação) e leads (todos os leads).
-- ============================================================

create table if not exists lead_campanhas (
  id uuid primary key default gen_random_uuid(),
  academia_id text references academias(id),
  slug text unique not null,              -- vai no link: captura.html?c=slug
  nome text not null,                     -- nome interno da campanha
  origem text default 'evento',           -- trafego_pago | whatsapp_organico | instagram_organico | evento | parceria | indicacao | site | outro
  titulo text,                            -- título da página de captura
  subtitulo text,
  info text,                              -- linha de data/local/horário
  capa_url text,                          -- imagem de capa (arquivo no repositório ou URL)
  cor text,                               -- cor de destaque da página (hex)
  sorteio boolean default false,          -- mostra o texto do sorteio e libera a lista para imprimir
  perguntas jsonb default '{"idade":true,"treina":true,"parado":true}'::jsonb,
  ativo boolean default true,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  academia_id text references academias(id),
  campanha_id uuid references lead_campanhas(id) on delete set null,
  campanha_slug text,
  nome text not null,
  whatsapp text,
  whatsapp_norm text,                     -- só dígitos, para achar duplicados
  idade int,
  treina text,                            -- academia | aluno | por_conta | nao_treina
  tempo_parado text,                      -- menos_6m | 6_12m | mais_1a | nunca
  respostas jsonb default '{}'::jsonb,    -- perguntas extras de cada campanha
  origem text default 'outro',
  utm_source text, utm_medium text, utm_campaign text, utm_content text,
  pagina text,
  consultora_id text,
  status text default 'novo',             -- novo | contatado | agendado | experiencia | convertido | perdido
  observacoes text,
  consentimento boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists leads_acad_idx on leads (academia_id, created_at desc);
create index if not exists leads_camp_idx on leads (campanha_id);
create index if not exists leads_wpp_idx on leads (whatsapp_norm);

-- Mesmo padrão das demais tabelas da plataforma (segurança por usuário ainda pendente: ver ROADMAP).

-- ---------- Indicação digital (v2, 30/10/2026) ----------
alter table leads add column if not exists codigo text;               -- código do lead para convidar amigos: NOME[SIGLA]1234
alter table leads add column if not exists indicado_por_codigo text;  -- código de quem indicou
alter table leads add column if not exists indicado_por_lead uuid;    -- lead de quem indicou
alter table leads add column if not exists indicado_por_nome text;
create unique index if not exists leads_codigo_uidx on leads (codigo) where codigo is not null;
create index if not exists leads_indicador_idx on leads (indicado_por_codigo);

alter table lead_campanhas add column if not exists indicacao boolean default false;      -- liga o "convide até 5 amigos"
alter table lead_campanhas add column if not exists codigo_sigla text;                    -- vai entre colchetes no código
alter table lead_campanhas add column if not exists indicacao_limite timestamptz;         -- até quando a indicação vale chance extra no sorteio
alter table lead_campanhas add column if not exists presentes jsonb;                      -- lista de presentes para o convidado
alter table lead_campanhas add column if not exists convite_img text;                     -- arte usada no compartilhar
alter table lead_campanhas add column if not exists evento_titulo text;
alter table lead_campanhas add column if not exists evento_texto text;
alter table lead_campanhas add column if not exists evento_mapa text;
alter table lead_campanhas add column if not exists evento_fim timestamptz;               -- depois disso some a faixa "acontecendo agora"
alter table lead_campanhas add column if not exists oferta_ativa boolean default false;
alter table lead_campanhas add column if not exists oferta_titulo text;
alter table lead_campanhas add column if not exists oferta_texto text;
alter table lead_campanhas add column if not exists oferta_mensagem text;                 -- mensagem pronta do WhatsApp ({evento} vira o nome)
alter table lead_campanhas add column if not exists whatsapp_academia text;

alter table lead_campanhas disable row level security;
alter table leads disable row level security;

