-- ============================================================
-- 02 · Auditoria de RLS (SOMENTE LEITURA — não altera nada)
-- Rodar no SQL Editor e colar o resultado na conversa com o Claude.
-- Com a chave publishable no site, o RLS passa a ser a proteção principal:
-- qualquer pessoa com a URL do site consegue fazer o que o papel "anon" pode.
-- ============================================================
select
  t.tablename                                   as tabela,
  t.rowsecurity                                 as rls_ligado,
  coalesce(p.qtd, 0)                            as qtd_politicas,
  coalesce(p.detalhe, '— nenhuma —')            as politicas,
  has_table_privilege('anon', format('public.%I', t.tablename), 'SELECT') as anon_le,
  has_table_privilege('anon', format('public.%I', t.tablename), 'INSERT,UPDATE,DELETE') as anon_escreve
from pg_tables t
left join (
  select tablename,
         count(*) as qtd,
         string_agg(
           format('[%s | %s | para:%s] USING(%s) CHECK(%s)',
                  policyname, cmd, array_to_string(roles, ','),
                  coalesce(qual, '-'), coalesce(with_check, '-')),
           E'\n' order by policyname) as detalhe
  from pg_policies
  where schemaname = 'public'
  group by tablename
) p using (tablename)
where t.schemaname = 'public'
order by t.rowsecurity, t.tablename;
