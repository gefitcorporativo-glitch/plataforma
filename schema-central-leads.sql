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

-- ---------- Artes da campanha (v3, 30/10/2026) ----------
alter table lead_campanhas add column if not exists capa_convidado text;   -- capa da página de quem chega por indicação

-- Pasta pública de imagens das campanhas (Supabase Storage), até 2 MB por imagem
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('campanhas', 'campanhas', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='campanhas_envio') then
    create policy campanhas_envio on storage.objects for insert to anon, authenticated with check (bucket_id = 'campanhas');
  end if;
end $$;

-- ---------- Formulários, enriquecimento e envio para campanha (v4, 31/10/2026) ----------
alter table leads add column if not exists cargo text;                       -- formulário de gestor
alter table leads add column if not exists academia_nome text;
alter table leads add column if not exists cidade text;
alter table leads add column if not exists origem_primeira text;             -- canal do primeiro contato
alter table leads add column if not exists historico jsonb default '[]'::jsonb; -- pontos de contato (cada formulário preenchido)
alter table leads add column if not exists card_id uuid;                      -- card criado no Kanban de Campanhas
alter table leads add column if not exists demo boolean default false;        -- lead fictício de demonstração
alter table lead_campanhas add column if not exists publico text default 'aluno';      -- aluno | gestor
alter table lead_campanhas add column if not exists campos_extra jsonb default '[]'::jsonb; -- perguntas extras do formulário

alter table lead_campanhas disable row level security;
alter table leads disable row level security;

-- ============ Áreas da matriz GeFit ============
-- 1) GeFit · Comercial: leads reais da GeFit (donos e gestores de academia)
insert into academias (id, nome, cidade) values ('9a6c2f10-1b4e-4c7a-8d2e-0f5b3c7e1a90', 'GeFit · Comercial', 'Uruguaiana')
on conflict (id) do nothing;
insert into gestores (id, nome, email, senha_hash, academia_id, role, ativo, modulos_ativos)
values ('gest_gefit_comercial', 'Nelson Rabelo (GeFit Comercial)', 'comercial@gefit.com.br', 'GeFit@Comercial2026', '9a6c2f10-1b4e-4c7a-8d2e-0f5b3c7e1a90', 'gestor', true, array['roi21','campanhas','scripts','experiencias'])
on conflict (id) do nothing;
insert into lead_campanhas (academia_id, slug, nome, origem, publico, titulo, subtitulo, cor, ativo, campos_extra)
values ('9a6c2f10-1b4e-4c7a-8d2e-0f5b3c7e1a90', 'gefit-contato', 'Contato GeFit (modelo)', 'site', 'gestor',
  'Fale com a GeFit', 'Deixe seus dados e um especialista da GeFit fala com você pelo WhatsApp.', '#002E82', true,
  '[{"k":"academia_nome","label":"Nome da academia","tipo":"texto","opcoes":null,"obrig":true},
    {"k":"cidade","label":"Cidade / UF","tipo":"texto","opcoes":null,"obrig":false},
    {"k":"alunos_ativos","label":"Alunos ativos","tipo":"opcoes","opcoes":["Até 150","150 a 300","300 a 600","Mais de 600"],"obrig":false},
    {"k":"maior_desafio","label":"Maior desafio hoje","tipo":"opcoes","opcoes":["Vendas","Retenção","Equipe","Financeiro"],"obrig":false}]'::jsonb)
on conflict (slug) do nothing;

-- 2) Academia Modelo GeFit: vitrine para mostrar a clientes (campanha + leads fictícios)
insert into lead_campanhas (academia_id, slug, nome, origem, publico, titulo, subtitulo, info, cor, sorteio, ativo,
  indicacao, codigo_sigla, presentes, evento_titulo, evento_texto, oferta_ativa, oferta_titulo, oferta_texto, oferta_mensagem)
values ('1e4293f8-78f8-488d-bd9e-dc5658b3909e', 'aulao-modelo', 'Aulão Modelo (demonstração)', 'evento', 'aluno',
  'Aulão Saúde em Movimento', 'Leva menos de 1 minuto e você já concorre aos prêmios.', 'Sábado · Praça Central · 17h às 19h', '#002E82', true, true,
  true, 'MODELO',
  '["Mapeamento completo de 15 áreas da sua saúde, feito pelo celular em menos de 3 minutos","Consultoria com treinador especialista","Uma Experiência na academia para treinar e alcançar resultados em poucos dias"]'::jsonb,
  'O Aulão está acontecendo agora', 'Praça Central · até as 19h. Venha participar!',
  true, 'Você desbloqueou uma condição super exclusiva',
  'Até 50% de desconto no Desafio de 21 dias, com avaliação tecnológica, consultoria com especialista e mapeamento completo da saúde. Vagas super limitadas.',
  'Olá! Vim do cadastro do {evento} e quero garantir minha vaga com até 50% de desconto no Desafio de 21 dias.')
on conflict (slug) do nothing;

insert into leads (academia_id, campanha_id, campanha_slug, nome, whatsapp, whatsapp_norm, idade, treina, tempo_parado, origem, origem_primeira, status, codigo, indicado_por_codigo, indicado_por_nome, consentimento, demo, historico, created_at)
select '1e4293f8-78f8-488d-bd9e-dc5658b3909e', c.id, 'aulao-modelo', v.nome, v.wpp, '55'||regexp_replace(v.wpp,'\D','','g'), v.idade, v.treina, v.parado, v.origem, v.origem, v.status, v.codigo, v.ind, v.indnome, true, true,
       jsonb_build_array(jsonb_build_object('data', now() - v.h * interval '1 minute', 'campanha', 'aulao-modelo', 'origem', v.origem)), now() - v.h * interval '1 minute'
from lead_campanhas c,
(values
 ('Ana Beatriz Souza (exemplo)','(55) 90000-1101',34,'nao_treina','mais_1a','evento','novo','ANA[MODELO]1101',null,null,180),
 ('Carlos Mendes (exemplo)','(55) 90000-1102',41,'academia',null,'evento','contatado','CARLOS[MODELO]1102',null,null,170),
 ('Juliana Prado (exemplo)','(55) 90000-1103',29,'por_conta',null,'evento','agendado','JULIANA[MODELO]1103',null,null,160),
 ('Marcos Lima (exemplo)','(55) 90000-1104',52,'nao_treina','6_12m','indicacao_digital','novo','MARCOS[MODELO]1104','ANA[MODELO]1101','Ana Beatriz Souza (exemplo)',150),
 ('Fernanda Rocha (exemplo)','(55) 90000-1105',38,'nao_treina','nunca','indicacao_digital','experiencia','FERNANDA[MODELO]1105','ANA[MODELO]1101','Ana Beatriz Souza (exemplo)',140),
 ('Paulo Henrique (exemplo)','(55) 90000-1106',45,'aluno',null,'evento','convertido','PAULO[MODELO]1106',null,null,130),
 ('Renata Alves (exemplo)','(55) 90000-1107',31,'academia',null,'indicacao_digital','convertido','RENATA[MODELO]1107','CARLOS[MODELO]1102','Carlos Mendes (exemplo)',120),
 ('Diego Martins (exemplo)','(55) 90000-1108',27,'nao_treina','menos_6m','evento','perdido','DIEGO[MODELO]1108',null,null,110)
) as v(nome,wpp,idade,treina,parado,origem,status,codigo,ind,indnome,h)
where c.slug = 'aulao-modelo'
  and not exists (select 1 from leads l where l.codigo = v.codigo);

