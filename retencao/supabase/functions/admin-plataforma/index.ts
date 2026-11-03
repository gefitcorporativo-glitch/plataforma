// Edge Function: admin-plataforma
// Ações privilegiadas do Painel Admin (admin_painel.html), que antes rodavam no
// navegador com a service_role key exposta no código.
//
// Quem pode chamar: apenas usuários logados no Supabase Auth cujo user_id está
// na tabela public.admins_plataforma (ver supabase/sql/01_admins_plataforma.sql).
// A chave secreta só existe aqui, no servidor.
//
// Ações:
//   quem_sou          → { ok, admin:{nome,email} }  (o painel usa para liberar o acesso)
//   criar_usuario     → cria login + cadastro de gestor/treinador/consultor numa academia
//   resetar_senha     → define nova senha para um gestor/treinador/consultor
//   excluir_academia  → apaga a academia e os dados vinculados

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!

// Mesma ordem de preferência da função gestor-equipe:
//   1. secret próprio "SB_SECRET_KEY" (sb_secret_...)
//   2. SUPABASE_SECRET_KEYS (JSON injetado pela plataforma, chave "default")
//   3. SUPABASE_SERVICE_ROLE_KEY (legado)
function chaveSecreta(): string {
  const propria = Deno.env.get('SB_SECRET_KEY')
  if (propria) return propria
  const json = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (json) {
    try {
      const obj = JSON.parse(json)
      const k = obj.default ?? Object.values(obj)[0]
      if (typeof k === 'string' && k) return k
    } catch (_) { /* ignora e cai no legado */ }
  }
  const legado = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legado) return legado
  throw new Error('Chave secreta não configurada (defina o secret SB_SECRET_KEY).')
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

const PERFIS: Record<string, string> = {
  gestor: 'gestores',
  treinador: 'treinadores',
  consultor: 'consultores',
}

// Tabelas com academia_id apagadas antes da academia (ordem importa por causa das FKs)
const TABELAS_FILHAS = [
  'follow_ups', 'tarefas_treinador', 'compromissos', 'diario_treinador', 'experiencias', 'planners',
  'alunos', 'consultores', 'gestores', 'treinadores',
]

async function acharUserIdPorEmail(sb: SupabaseClient, email: string): Promise<string | null> {
  for (const tabela of Object.values(PERFIS)) {
    const { data } = await sb.from(tabela).select('user_id').eq('email', email).limit(1).maybeSingle()
    if (data?.user_id) return data.user_id as string
  }
  // Fallback: procura direto no Auth (paginado)
  const alvo = email.toLowerCase()
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data?.users?.length) break
    const u = data.users.find((x) => (x.email || '').toLowerCase() === alvo)
    if (u) return u.id
    if (data.users.length < 200) break
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return json({ error: 'Método não permitido' }, 405)

  try {
    const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
    if (!jwt) return json({ error: 'Não autenticado' }, 401)

    const sb = createClient(SUPABASE_URL, chaveSecreta(), {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 1. Quem está chamando?
    const { data: { user }, error: userErr } = await sb.auth.getUser(jwt)
    if (userErr || !user) return json({ error: 'Sessão inválida' }, 401)

    // 2. É admin da plataforma?
    const { data: admin } = await sb
      .from('admins_plataforma')
      .select('user_id, nome, email')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!admin) return json({ error: 'Acesso restrito ao administrador da plataforma.' }, 403)

    const body = await req.json().catch(() => ({}))
    const { action } = body

    // ── quem_sou ──
    if (action === 'quem_sou') {
      return json({ ok: true, admin: { nome: admin.nome, email: admin.email || user.email } })
    }

    // ── criar_usuario ──
    if (action === 'criar_usuario') {
      const { perfil, academia_id, nome, senha, tipo } = body
      const email = String(body.email || '').trim().toLowerCase()
      const tabela = PERFIS[perfil]
      if (!tabela) return json({ error: 'Perfil inválido.' }, 400)
      if (!academia_id || !nome || !email || !senha) {
        return json({ error: 'Preencha academia, nome, e-mail e senha.' }, 400)
      }
      if (String(senha).length < 8) return json({ error: 'Senha precisa ter no mínimo 8 caracteres.' }, 400)

      const { data: acad } = await sb.from('academias').select('id').eq('id', academia_id).maybeSingle()
      if (!acad) return json({ error: 'Academia não encontrada.' }, 404)

      const { data: authData, error: authErr } = await sb.auth.admin.createUser({
        email, password: senha, email_confirm: true,
        user_metadata: { nome, role: perfil, academia_id },
      })
      if (authErr) return json({ error: 'Erro ao criar login: ' + authErr.message }, 400)

      const payload: Record<string, unknown> = { user_id: authData.user.id, academia_id, nome, email }
      if (perfil === 'treinador') payload.tipo = tipo || 'interno'
      if (perfil === 'consultor') payload.ativo = true

      const { error: insErr } = await sb.from(tabela).insert([payload])
      if (insErr) {
        await sb.auth.admin.deleteUser(authData.user.id) // não deixa login órfão
        return json({ error: 'Erro ao salvar cadastro: ' + insErr.message }, 400)
      }
      return json({ ok: true, user_id: authData.user.id })
    }

    // ── resetar_senha ──
    if (action === 'resetar_senha') {
      const email = String(body.email || '').trim().toLowerCase()
      const { novaSenha } = body
      if (!email || !novaSenha) return json({ error: 'Faltou e-mail ou nova senha.' }, 400)
      if (String(novaSenha).length < 8) return json({ error: 'Senha precisa ter no mínimo 8 caracteres.' }, 400)

      const userId = await acharUserIdPorEmail(sb, email)
      if (!userId) return json({ error: 'Usuário não encontrado.' }, 404)

      const { error } = await sb.auth.admin.updateUserById(userId, { password: novaSenha })
      if (error) return json({ error: 'Erro ao redefinir: ' + error.message }, 400)
      return json({ ok: true })
    }

    // ── excluir_academia ──
    if (action === 'excluir_academia') {
      const { academia_id } = body
      if (!academia_id) return json({ error: 'Faltou academia_id.' }, 400)

      // Logins (auth) dos usuários da academia — apagados no fim
      const userIds: string[] = []
      for (const tabela of Object.values(PERFIS)) {
        const { data } = await sb.from(tabela).select('user_id').eq('academia_id', academia_id)
        for (const r of data || []) if (r.user_id) userIds.push(r.user_id)
      }

      const avisos: string[] = []
      for (const t of TABELAS_FILHAS) {
        const { error } = await sb.from(t).delete().eq('academia_id', academia_id)
        // tabela inexistente / sem coluna academia_id → só registra e segue
        if (error) avisos.push(`${t}: ${error.message}`)
      }
      const { error } = await sb.from('academias').delete().eq('id', academia_id)
      if (error) return json({ error: 'Erro ao excluir academia: ' + error.message, avisos }, 400)

      // Apaga o login só de quem ficou sem nenhum vínculo (não é admin e não
      // tem cadastro em outra academia)
      for (const id of new Set(userIds)) {
        const { data: ehAdmin } = await sb.from('admins_plataforma').select('user_id').eq('user_id', id).maybeSingle()
        if (ehAdmin) continue
        let temOutroVinculo = false
        for (const tabela of Object.values(PERFIS)) {
          const { data } = await sb.from(tabela).select('user_id').eq('user_id', id).limit(1)
          if (data?.length) { temOutroVinculo = true; break }
        }
        if (!temOutroVinculo) await sb.auth.admin.deleteUser(id)
      }
      return json({ ok: true, avisos })
    }

    return json({ error: 'Ação desconhecida.' }, 400)
  } catch (err) {
    return json({ error: 'Erro interno: ' + (err as Error).message }, 500)
  }
})
