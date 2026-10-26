// Edge Function: gestor-equipe
// Permite que um(a) Gestor(a) crie e gerencie logins de Treinador(a)/Consultor(a)
// SEM expor a service_role key no navegador.
//
// A service_role key só existe aqui, do lado do servidor (Supabase Edge Runtime).
// Toda ação é validada contra a academia_id REAL do gestor logado — nunca confia
// em academia_id vindo do navegador.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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

    // Cliente "anon" só pra validar o token do usuário chamador
    const sbUser = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userErr } = await sbUser.auth.getUser(jwt)
    if (userErr || !user) return jsonResponse({ error: 'Sessão inválida' }, 401)

    // Cliente com a service_role key — só usado aqui dentro, nunca sai do servidor
    const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // 2. Confirmar que quem está chamando é DE FATO um gestor, e pegar a academia_id real dele
    const { data: gestor, error: gestorErr } = await sbAdmin
      .from('gestores')
      .select('id, academia_id, nome')
      .eq('user_id', user.id)
      .single()

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
      const { data: treinador } = await sbAdmin.from('treinadores').select('user_id, academia_id').eq('email', email).single()
      const { data: consultor } = await sbAdmin.from('consultores').select('user_id, academia_id').eq('email', email).single()
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
