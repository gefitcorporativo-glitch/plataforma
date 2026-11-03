# Supabase: o que configurar (projeto `xpvedihpejivnkssryhc`)

Desde 03/11/2026 as chaves JWT legadas (anon/service_role) estão desativadas.
Nenhuma chave secreta fica no navegador: tudo que é privilegiado roda nas Edge Functions.

## 1. Chave pública do site
`config.js` → `SUPABASE_ANON` = **Publishable key** (`sb_publishable_...`), em Settings → API Keys.

## 2. Chave secreta das Edge Functions
1. Settings → API Keys → **Secret keys** → crie uma (`sb_secret_...`).
2. Edge Functions → **Secrets** → adicione `SB_SECRET_KEY` com esse valor.
   (O nome não pode começar com `SUPABASE_`.)

## 3. Publicar as funções
Edge Functions → Deploy a new function → Via Editor, colando o `index.ts` de cada pasta:
- `gestor-equipe` (painel do gestor: criar treinador/consultor, trocar senha)
- `admin-plataforma` (painel admin)

Em cada uma, **desligue "Verify JWT"** (Details). As funções validam o login sozinhas.
Pela CLI: `supabase functions deploy gestor-equipe admin-plataforma` (o `config.toml` já desliga o Verify JWT).

## 4. Administrador
SQL Editor → rode `sql/01_admins_plataforma.sql`.
O e-mail precisa existir em Authentication → Users.

## 5. "Esqueci minha senha"
Authentication → URL Configuration:
- Site URL: `https://gefitcorporativo-glitch.github.io/retencao/`
- Redirect URLs: `https://gefitcorporativo-glitch.github.io/retencao/**` e `https://gefitcorporativo-glitch.github.io/plataforma/retencao/**`

## 6. RLS (próxima etapa)
Rode `sql/02_auditoria_rls.sql` (só leitura) e envie o resultado para revisar as políticas.
