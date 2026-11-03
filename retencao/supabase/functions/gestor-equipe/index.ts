// Edge Function: gestor-equipe
// Permite que um(a) Gestor(a) crie e gerencie logins de Treinador(a)/Consultor(a)
// SEM expor a service_role key no navegador.
//
// A service_role key só existe aqui, do lado do servidor (Supabase Edge Runtime).
// Toda ação é validada contra a academia_id REAL do gestor logado — nunca confia
// em academia_id vindo do navegador.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!

// Chave secreta do servidor. As chaves JWT legadas (anon/service_role) foram
// desativadas em 03/11/2026, então a ordem de preferência é:
//   1. secret próprio "SB_SECRET_KEY" (sb_secret_...), definido em Edge Functions → Secrets
//   2. SUPABASE_SECRET_KEYS (JSON injetado pela plataforma, chave "default")
//   3. SUPABASE_SERVICE_ROLE_KEY (legado; só funciona se as chaves legadas forem reativadas)
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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // 1. Identificar quem está chamando, pelo token de sessão do próprio gestor
    const authHeader = req.headers.get('Authorization') || ''
    const jwt = authHeader.replace('Bearer ', '')
    if (!jwt) return jsonResponse({ error: 'Não autenticado' }, 401)

    // Cliente com a chave secreta — só usado aqui dentro, nunca sai do servidor
    const sbAdmin = createClient(SUPABASE_URL, chaveSecreta(), {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Valida o token de sessão do chamador direto no Auth (funciona com as
    // novas chaves de assinatura; não depende do "Verify JWT" do gateway)
    const { data: { user }, error: userErr } = await sbAdmin.auth.getUser(jwt)
    if (userErr || !user) return jsonResponse({ error: 'Sessão inválida' }, 401)

    // 2. Confirmar que quem está chamando é DE FATO um gestor, e pegar a academia_id real dele
    const { data: gestor, error: gestorErr } = await sbAdmin
      .from('gestores')
      .select('id, academia_id, nome')
      .eq('user_id', user.id)
      .maybeSingle()

    if (gestorErr || !gestor) {
      return jsonResponse({ error: 'Só gestores podem gerenciar a equipe.' }, 403)
    }
    const academiaId = gestor.academia_id // <- fonte da verdade, nunca vem do body

    const body = await req.json()
    const { action } = body

    // ── AÇÃO: criar novo usuário (treinador ou consultor) ──
    if (action === 'criar_usuario') {
      const { nome, email, senha, tipo, tipoTreinador } = body
      if (!nome || !email || !senha || !tipo) {
        return jsonResponse({ error: 'Preencha nome, e-mail, senha e tipo.' }, 400)
      }
      if (!['treinador', 'consultor'].includes(tipo)) {
        return jsonResponse({ error: 'Tipo inválido.' }, 400)
      }
      if (senha.length < 8) {
        return jsonResponse({ error: 'Senha precisa ter no mínimo 8 caracteres.' }, 400)
      }

      const { data: authData, error: authErr } = await sbAdmin.auth.admin.createUser({
        email, password: senha, email_confirm: true,
      })
      if (authErr) return jsonResponse({ error: 'Erro ao criar login: ' + authErr.message }, 400)

      const tabela = tipo === 'treinador' ? 'treinadores' : 'consultores'
      const payload: Record<string, unknown> = {
        user_id: authData.user.id,
        academia_id: academiaId, // sempre a do gestor logado, nunca a que veio do body
        nome, email,
      }
      if (tipo === 'treinador') payload.tipo = tipoTreinador || 'interno'

      const { error: insertErr } = await sbAdmin.from(tabela).insert([payload])
      if (insertErr) {
        // Reverte o usuário de auth se o insert falhar, pra não ficar login órfão
        await sbAdmin.auth.admin.deleteUser(authData.user.id)
        return jsonResponse({ error: 'Erro ao salvar cadastro: ' + insertErr.message }, 400)
      }

      return jsonResponse({ ok: true, message: `${nome} cadastrado(a) com sucesso.` })
    }

    // ── AÇÃO: redefinir senha de alguém da própria academia ──
    if (action === 'resetar_senha') {
      const { email, novaSenha } = body
      if (!email || !novaSenha) return jsonResponse({ error: 'Faltou e-mail ou nova senha.' }, 400)
      if (novaSenha.length < 8) return jsonResponse({ error: 'Senha precisa ter no mínimo 8 caracteres.' }, 400)

      // Confirma que esse e-mail pertence a alguém DA MESMA academia do gestor
      const { data: treinador } = await sbAdmin.from('treinadores').select('user_id, academia_id').eq('email', email).maybeSingle()
      const { data: consultor } = await sbAdmin.from('consultores').select('user_id, academia_id').eq('email', email).maybeSingle()
      const pessoa = treinador || consultor

      if (!pessoa || pessoa.academia_id !== academiaId) {
        return jsonResponse({ error: 'Essa pessoa não pertence à sua academia.' }, 403)
      }

      const { error: updErr } = await sbAdmin.auth.admin.updateUserById(pessoa.user_id, { password: novaSenha })
      if (updErr) return jsonResponse({ error: 'Erro ao redefinir: ' + updErr.message }, 400)

      return jsonResponse({ ok: true, message: 'Senha redefinida com sucesso.' })
    }

    return jsonResponse({ error: 'Ação desconhecida.' }, 400)

  } catch (err) {
    return jsonResponse({ error: 'Erro interno: ' + (err as Error).message }, 500)
  }
})
