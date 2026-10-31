/* ============================================================
   FERRAMENTAS & SCRIPTS · GeFit | Painel Gestão
   Scripts do Oliver (SDR) e da equipe comercial da GeFit falando com
   donos, gestores e gerentes de academia. Aparece só no espaço da GeFit.
   Estrutura: funil → etapa → toque (canal, objetivo, texto, AQÚI, orientação).
   Variações por modelo de negócio: campo `var` (se faltar, vale a versão geral).
   ============================================================ */
(function(){
const GF_GESTAO='9a6c2f10-1b4e-4c7a-8d2e-0f5b3c7e1a90';

const MODELOS={
  geral:{nome:'Todos os modelos',dor:'Use a versão geral quando ainda não souber o modelo da academia.'},
  convencional:{nome:'Academia convencional (pequena ou média)',dor:'Muito lead pedindo preço, conversão baixa e pressão de preço das redes low cost.'},
  cidade_pequena:{nome:'Academia em cidade pequena',dor:'Todo mundo se conhece: indicação é o principal canal e a base é pequena, então reter e reativar vale mais que lead novo.'},
  studio:{nome:'Estúdio high ticket / personal',dor:'Ticket alto e poucas vagas: venda consultiva. Perde venda quando atende como academia e manda tabela de preço.'},
  box:{nome:'Box (CrossFit, funcional, Hyrox)',dor:'Comunidade forte e aula experimental: o desafio é converter a experimental em plano e segurar o aluno depois do 3º mês.'},
  lutas:{nome:'Escola de lutas',dor:'Muitos alunos crianças e adolescentes: quem decide são os pais. Evasão ligada a turma, horário e graduação.'},
  familiar:{nome:'Academia familiar com natação infantil',dor:'A família decide junto: a matrícula da criança puxa os pais. Forte sazonalidade (verão e inverno).'}
};

const CANAIS={wpp:'💬 Texto de WhatsApp',audio:'🎙 Áudio',lig:'📞 Ligação',dm:'📷 DM Instagram',video:'🎬 Vídeo + texto',reuniao:'🖥 Reunião'};

const FUNIS=[
 {id:'entrada',nome:'Leads de entrada',desc:'Quem se cadastrou numa isca (bio, landing, Central de Leads). 8 toques em 21 dias.',
  etapas:[{id:'contato',nome:'1º contato'},{id:'qualif',nome:'Qualificação'},{id:'nutricao',nome:'Nutrição'},{id:'convite',nome:'Convite'},{id:'fim',nome:'Encerramento'}]},
 {id:'social',nome:'Social Selling',desc:'Novos seguidores no Instagram: DM → WhatsApp → qualificação. Mínimo de 6 dias, segunda a sábado.',
  etapas:[{id:'dm',nome:'Abordagem na DM'},{id:'resposta',nome:'Quando responde'},{id:'whats',nome:'Passagem para o WhatsApp'}]},
 {id:'diag',nome:'Diagnóstico (caminho A)',desc:'Dono ou gestor acima do corte: academia a partir de R$35 mil/mês, estúdio e box a partir de R$20 mil/mês.',
  etapas:[{id:'convite',nome:'Convite'},{id:'confirma',nome:'Confirmação'},{id:'reuniao',nome:'Diagnóstico de 30 min'},{id:'pos',nome:'Pós-diagnóstico'}]},
 {id:'presente',nome:'Presente (caminho B)',desc:'Abaixo do corte, ou quem não é dono: ferramenta de presente e segue na cadência.',
  etapas:[{id:'entrega',nome:'Entrega do presente'},{id:'retorno',nome:'Retorno'}]}
];

// ---------- SCRIPTS ----------
// {f:funil, e:etapa, dia, canal, obj, texto, var:{modelo:texto}, aqui:{a,q,u,i}, op}
const S=[
// ===== LEADS DE ENTRADA =====
{f:'entrada',e:'contato',dia:'D0',canal:'wpp',obj:'Boas-vindas e primeira resposta',
 texto:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo. Parabéns pela decisão de querer melhorar a recepção da sua academia, isso já te coloca à frente da maioria das academias do Brasil.\nTenho um segundo presente pra te ajudar ainda mais na parte comercial. Antes de te enviar, me conta uma coisa: hoje quem responde as pessoas que chamam no WhatsApp da academia? É você mesmo, a sua recepção, ou você já tem uma consultora ou vendedora treinada pra isso?',
 var:{
  studio:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo. Parabéns pela decisão de olhar pro atendimento do seu estúdio. Num modelo de ticket alto, cada conversa no WhatsApp vale muito, e pouca gente cuida disso como você está fazendo.\nTenho um segundo presente pra te ajudar na parte comercial. Antes de te enviar, me conta: hoje quem responde quem chama no WhatsApp do estúdio? É você mesmo, alguém da equipe ou um personal?',
  box:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo. Parabéns pela decisão de melhorar a recepção do seu box. Comunidade forte começa no primeiro contato, e você já está olhando pra isso.\nTenho um segundo presente pra te ajudar na parte comercial. Antes de te enviar, me conta: hoje quem responde quem chama no WhatsApp do box? É você mesmo, um coach ou alguém da recepção?',
  lutas:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo. Parabéns pela decisão de melhorar o atendimento da sua escola. Quando quem pergunta é pai ou mãe, a primeira resposta decide muita coisa.\nTenho um segundo presente pra te ajudar na parte comercial. Antes de te enviar, me conta: hoje quem responde quem chama no WhatsApp da escola? É você mesmo, um professor ou a recepção?',
  familiar:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo. Parabéns pela decisão de melhorar a recepção da sua academia. Numa academia de família, quem chama no WhatsApp muitas vezes está decidindo pela casa inteira.\nTenho um segundo presente pra te ajudar na parte comercial. Antes de te enviar, me conta: hoje quem responde quem chama no WhatsApp da academia? É você mesmo, a recepção ou uma consultora?',
  cidade_pequena:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo. Parabéns pela decisão de querer melhorar a recepção da sua academia. Em cidade menor, onde todo mundo se conhece, um bom atendimento vira indicação na hora.\nTenho um segundo presente pra te ajudar na parte comercial. Antes de te enviar, me conta: hoje quem responde quem chama no WhatsApp da academia? É você mesmo, a recepção ou uma consultora?'
 },
 aqui:{a:'Parabéns pela decisão de melhorar a recepção.',q:'Quem responde os leads hoje.',u:'Responder para receber o segundo presente.',i:'Estar à frente da maioria das academias.'},
 op:'Mandar no mesmo dia do cadastro. Se o papel no formulário for recepção ou professor, usar a variação "recepção" da etapa Qualificação.'},

{f:'entrada',e:'contato',dia:'D0 atrasado',canal:'wpp',obj:'Boas-vindas para quem baixou há alguns dias (relembra quem fala)',
 texto:'Oi, [Nome]! Tudo bem? Aqui é o Oliver, do time do Nelson Rabelo, mentor de donos de academia. Há alguns dias você baixou o nosso material *Recepção que Vende*, com os scripts para a recepção da academia. Parabéns pela iniciativa, isso já te coloca à frente da maioria das academias do Brasil.\nA gente separou um segundo presente pra te ajudar ainda mais na parte comercial. Antes de te enviar, me conta uma coisa: hoje quem responde as pessoas que chamam no WhatsApp da academia? É você mesmo, a sua recepção, ou você já tem uma consultora ou vendedora treinada pra isso?',
 aqui:{a:'Relembrar quem fala e o material que ele baixou.',q:'Quem responde os leads hoje.',u:'Responder para receber o segundo presente.',i:'Estar à frente da maioria das academias.'},
 op:'Use quando o lead esperou mais de 1 dia pelo primeiro contato. *Recepção que Vende* entre asteriscos aparece em negrito no WhatsApp.'},
{f:'entrada',e:'contato',dia:'D0',canal:'wpp',obj:'Não é o dono (recepção, comercial ou professor): boas-vindas e pedir o contato do proprietário',
 texto:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo, mentor de donos de academia. Parabéns por baixar o nosso material *Recepção que Vende*! Quem está no atendimento e corre atrás de se desenvolver faz toda a diferença no resultado da academia.\nO material tem uma segunda parte, a versão completa: uma ferramenta online com as 18 objeções mais comuns já respondidas e os scripts de WhatsApp, áudio e ligação. Ela é liberada para o dono da academia, porque mexe no processo comercial inteiro. Você me passa o WhatsApp do proprietário? Eu mando o link pra ele e já conto que foi você quem foi atrás do material.',
 aqui:{a:'Parabenizar e valorizar quem está no atendimento.',q:'O WhatsApp do proprietário.',u:'Passar o contato do dono.',i:'Versão completa e reconhecimento dela para o dono.'},
 op:'Use quando o formulário diz que a pessoa é da recepção, do comercial ou professor. Se ela passar o contato: "Passou o contato do dono". Se não passar: "Não passou o contato".'},
{f:'entrada',e:'contato',dia:'D0 atrasado',canal:'wpp',obj:'Não é o dono e baixou há alguns dias: boas-vindas e pedir o contato do proprietário',
 texto:'Oi, [Nome]! Tudo bem? Aqui é o Oliver, do time do Nelson Rabelo, mentor de donos de academia. Há alguns dias você baixou o nosso material *Recepção que Vende*, com os scripts para a recepção. Parabéns pela iniciativa! Quem está no atendimento e corre atrás de se desenvolver faz toda a diferença no resultado da academia.\nO material tem uma segunda parte, a versão completa: uma ferramenta online com as 18 objeções mais comuns já respondidas e os scripts de WhatsApp, áudio e ligação. Ela é liberada para o dono da academia, porque mexe no processo comercial inteiro. Você me passa o WhatsApp do proprietário? Eu mando o link pra ele e já conto que foi você quem foi atrás do material.',
 aqui:{a:'Relembrar quem fala, parabenizar e valorizar quem atende.',q:'O WhatsApp do proprietário.',u:'Passar o contato do dono.',i:'Versão completa e reconhecimento dela para o dono.'},
 op:'Use quando a pessoa da equipe esperou mais de 1 dia pelo primeiro contato.'},
{f:'entrada',e:'contato',dia:'Resposta',canal:'wpp',obj:'Não é o dono · passou o contato do dono: agradecer',
 texto:'Muito obrigado, [Nome]! Já vou falar com ele e contar que foi você quem buscou o material. Enquanto isso, continua usando os scripts aí no dia a dia. Se travar em alguma objeção, é só me chamar aqui.',
 aqui:{a:'Gratidão pela confiança.',q:'(nenhuma)',u:'Continuar usando os scripts.',i:'O dono vai saber que foi ela.'},
 op:'Crie um card novo para o dono (Leads Novos) com o nome e o WhatsApp dele e mande a mensagem "Mensagem para o dono". Registre no card dela o nome do dono.'},
{f:'entrada',e:'contato',dia:'Resposta',canal:'wpp',obj:'Mensagem para o dono (contato que a equipe passou)',
 texto:'Oi, [Nome do dono]! Tudo bem? Aqui é o Oliver, do time do Nelson Rabelo, mentor de donos de academia. Peguei seu contato com a [Nome da pessoa da equipe], da sua equipe. Ela baixou o nosso material *Recepção que Vende* pra melhorar o atendimento da academia. Parabéns por ter alguém tão dedicada no time, isso é raro!\nO material tem uma versão completa, liberada para o dono: uma ferramenta online com as 18 objeções mais comuns já respondidas, scripts de WhatsApp, áudio e ligação e o passo a passo do primeiro oi até a matrícula. São 4 perguntas rápidas sobre a academia e abre na hora: https://gefitcorporativo-glitch.github.io/recepcao-que-vende/completo.html?utm_source=indicacao_equipe\nDepois me conta o que achou?',
 aqui:{a:'Elogiar a pessoa da equipe que buscou o material.',q:'O que achou da ferramenta.',u:'Responder as 4 perguntas e abrir.',i:'Versão completa para usar com a equipe.'},
 op:'Quando ele preencher, a faixa de faturamento aparece na Central de Leads. Academia a partir de R$35 mil, estúdio e box a partir de R$20 mil: convidar para o diagnóstico.'},
{f:'entrada',e:'contato',dia:'Resposta',canal:'wpp',obj:'Não é o dono · não passou o contato: mensagem pronta para ela encaminhar',
 texto:'Sem problema, [Nome]! Então faz assim: logo abaixo te mando uma mensagem pronta, é só encaminhar pro dono. Ele responde 4 perguntas rápidas e a versão completa abre na hora, pra vocês usarem juntos.\n\n(Mande em seguida, numa mensagem separada:)\nOi! A [Nome], da recepção, baixou o material *Recepção que Vende*, do Nelson Rabelo, mentor de donos de academia, pra melhorar o atendimento aqui. Ele tem uma versão completa, liberada para o dono: uma ferramenta online com as 18 objeções mais comuns já respondidas e os scripts de WhatsApp, áudio e ligação. São 4 perguntas rápidas sobre a academia e abre na hora: https://gefitcorporativo-glitch.github.io/recepcao-que-vende/completo.html?utm_source=indicacao_equipe',
 aqui:{a:'Respeitar que ela não quis passar o contato.',q:'(nenhuma)',u:'Encaminhar a mensagem para o dono.',i:'Versão completa para usar junto com o dono.'},
 op:'Copie e mande em duas mensagens: a primeira para ela e a segunda separada, pronta para encaminhar. Troque "recepção" pelo cargo dela se for outro.'},
{f:'entrada',e:'contato',dia:'D0',canal:'audio',obj:'Reforço em áudio se não responder em 2 horas',
 texto:'Fala, [Nome], tudo bem? Aqui é o Oliver, do time do Nelson Rabelo. Te mandei uma mensagem agora há pouco: você pegou o Recepção que Vende e eu separei um segundo presente pra você, focado na parte comercial da academia. Pra eu te mandar o certo, só preciso saber quem responde o WhatsApp aí hoje. Me responde quando puder, tá? Um abraço!',
 aqui:{a:'Tom pessoal, voz de gente.',q:'Quem responde o WhatsApp.',u:'Responder a mensagem.',i:'Presente já separado.'},
 op:'Áudio curto, até 30 segundos. Gravar falando, não lendo.'},

{f:'entrada',e:'qualif',dia:'Conversa 1',canal:'wpp',obj:'Respondeu que é ele mesmo quem atende: acolher e perguntar o desafio',
 texto:'Imagino, [Nome]! A gente sabe bem como é: dono de academia faz mil coisas ao mesmo tempo, e responder o WhatsApp no meio disso tudo fica bem puxado.\nMe conta uma coisa: hoje, qual é o maior desafio da academia? Trazer mais gente, fazer quem chega virar matrícula ou segurar os alunos por mais tempo?',
 aqui:{a:'Reconhecer a rotina puxada do dono.',q:'Qual o maior desafio hoje.',u:'Contar o desafio.',i:'Mostrar que entendemos a realidade dele.'},
 op:'Espelhe o que ele contar antes da próxima pergunta. Marque a tag Desafio principal no card.'},
{f:'entrada',e:'qualif',dia:'Conversa 1',canal:'wpp',obj:'Respondeu que tem recepção ou consultora: valorizar e perguntar o desafio',
 texto:'Que bom, [Nome], ter alguém dedicado ao atendimento já é meio caminho andado. E como ela costuma conduzir quando alguém pergunta o valor dos planos?\nAproveitando: hoje, qual é o maior desafio da academia? Trazer mais gente, fazer quem chega virar matrícula ou segurar os alunos por mais tempo?',
 aqui:{a:'Valorizar a estrutura que ele já tem.',q:'Como a equipe conduz e qual o desafio.',u:'Contar como funciona hoje.',i:'Meio caminho andado.'},
 op:'Se ele contar que a equipe manda tabela de preço logo de cara, anote: é um ótimo gancho para o diagnóstico.'},
{f:'entrada',e:'qualif',dia:'Conversa 1',canal:'wpp',obj:'Quem respondeu é recepção, consultora ou professor',
 texto:'Que legal, [Nome]! Então você está bem na linha de frente. Separei uma ferramenta pensada justamente pra quem atende: o que responder quando perguntam preço, como chamar pra experimental e o que fazer quando o lead some.\nAntes de te mandar, me ajuda com uma coisa: quem é o dono ou gestor aí? Tenho um material específico pra ele também.',
 aqui:{a:'Valorizar quem está no atendimento.',q:'Quem é o dono ou gestor.',u:'Passar o contato do dono.',i:'Ferramenta feita para quem atende.'},
 op:'Entregar o presente mesmo se não passar o contato do dono. Registrar o nome do dono no card.'},

{f:'entrada',e:'qualif',dia:'Conversa 2',canal:'wpp',obj:'Desafio = trazer mais gente: acolher e qualificar',
 texto:'Faz todo sentido, [Nome]. Trazer mais gente é a primeira coisa que quase todo dono de academia quer resolver. E tem um detalhe que muita gente não vê: boa parte das pessoas que a academia precisa já está chamando no WhatsApp, só que se perde entre a primeira mensagem e a aula experimental. Por isso, antes de pensar em gastar mais com anúncio, vale olhar quantos chegam e quantos viram aluno.\nPra eu conseguir te indicar o que faz mais sentido pro momento da academia, me conta: hoje o faturamento mensal fica mais ou menos em qual faixa? Até uns 20 mil, entre 20 e 35, entre 35 e 50, ou já passa disso?',
 aqui:{a:'Validar o desafio e mostrar que ele é comum.',q:'Faixa de faturamento.',u:'Responder a faixa.',i:'Crescer aproveitando quem já chega, antes de gastar mais.'},
 op:'Marque a tag Desafio principal = Atrair. Se ele perguntar mais, pergunte quantas pessoas chamam no WhatsApp por semana e quantas viram aluno. Depois da faixa: Conversa 3 (A ou B).'},
{f:'entrada',e:'qualif',dia:'Conversa 2',canal:'wpp',obj:'Desafio = converter quem chega: acolher e qualificar',
 texto:'Entendi, [Nome], e essa é justamente a parte que o *Recepção que Vende* ataca. Quando o lead chega e não vira matrícula, quase sempre o problema está na condução: o preço vai cedo demais, ninguém convida pra experimental ou ninguém volta a falar com quem sumiu.\nPra eu conseguir te indicar o que faz mais sentido pro momento da academia, me conta: hoje o faturamento mensal fica mais ou menos em qual faixa? Até uns 20 mil, entre 20 e 35, entre 35 e 50, ou já passa disso?',
 aqui:{a:'Conectar o desafio ao material que ele já baixou.',q:'Faixa de faturamento.',u:'Responder a faixa.',i:'O problema tem solução de processo.'},
 op:'Marque a tag Desafio principal = Converter. Depois da faixa: Conversa 3 (A ou B).'},
{f:'entrada',e:'qualif',dia:'Conversa 2',canal:'wpp',obj:'Desafio = reter alunos: acolher e qualificar',
 texto:'Faz sentido, [Nome]. Segurar o aluno é o que deixa a academia de pé, porque cada aluno que sai precisa de outro só pra empatar. E a retenção começa antes do que parece, lá no jeito que ele foi recebido e nos primeiros dias de treino.\nPra eu conseguir te indicar o que faz mais sentido pro momento da academia, me conta: hoje o faturamento mensal fica mais ou menos em qual faixa? Até uns 20 mil, entre 20 e 35, entre 35 e 50, ou já passa disso?',
 aqui:{a:'Validar o peso da retenção.',q:'Faixa de faturamento.',u:'Responder a faixa.',i:'Retenção começa no atendimento.'},
 op:'Marque a tag Desafio principal = Reter. Depois da faixa: Conversa 3 (A ou B).'},
{f:'entrada',e:'qualif',dia:'Conversa 2',canal:'wpp',obj:'Outro desafio: faixa de faturamento, de forma natural',
 texto:'Perfeito, [Nome], obrigado por me contar. Faz muito sentido. Pra eu conseguir te indicar o que faz mais sentido pro momento da academia, me conta mais uma coisa: hoje o faturamento mensal fica mais ou menos em qual faixa? Até uns 20 mil, entre 20 e 35, entre 35 e 50, ou já passa disso?',
 aqui:{a:'Espelhar a resposta anterior.',q:'Faixa de faturamento.',u:'Responder a faixa.',i:'Material escolhido para o momento dele.'},
 op:'Sempre por faixa, nunca número exato. Academia a partir de R$35 mil e estúdio/box a partir de R$20 mil vão para o Diagnóstico (caminho A). Abaixo disso, Presente (caminho B).'},

{f:'entrada',e:'qualif',dia:'Conversa 3',canal:'wpp',obj:'Acima do corte (caminho A): convite para o diagnóstico',
 texto:'Obrigado pela confiança em me contar, [Nome]. Pelo que você me falou, faz sentido uma conversa com o Nelson.\nEle abre poucos horários por semana pra um diagnóstico de 30 minutos da parte comercial: olha como o lead chega, como é respondido e onde a matrícula se perde. Você sai com um plano de ação.\nTenho [dia, hora] ou [dia, hora]. Qual fica melhor pra você?',
 aqui:{a:'Gratidão pela confiança.',q:'(implícita) qual horário.',u:'Escolher um dos dois horários.',i:'Sair com plano de ação.'},
 op:'Academia a partir de R$35 mil/mês, estúdio e box a partir de R$20 mil/mês. Antes de fechar, perguntar se tem sócio (funil Diagnóstico).'},
{f:'entrada',e:'qualif',dia:'Conversa 3',canal:'wpp',obj:'Abaixo do corte (caminho B): entregar o segundo presente',
 texto:'Obrigado pela confiança em me contar, [Nome]. Como prometido, liberei pra você a versão completa do *Recepção que Vende*: uma ferramenta online com as 18 objeções mais comuns já respondidas, scripts de WhatsApp, áudio e ligação e o passo a passo do primeiro oi até a matrícula. São 4 perguntas rápidas e abre na hora: https://gefitcorporativo-glitch.github.io/recepcao-que-vende/completo.html\nDepois me conta o que achou?',
 aqui:{a:'Gratidão pela confiança.',q:'O que achou do presente.',u:'Abrir o presente.',i:'Material escolhido para o momento dela.'},
 op:'Use o presente do caminho B (funil Presente). Se depois ele mostrar perfil A, ofereça o diagnóstico.'},
{f:'entrada',e:'qualif',dia:'Conversa 3',canal:'wpp',obj:'Abaixo do corte, dono interessado (caminho B + sondar o diagnóstico)',
 texto:'Obrigado pela confiança em me contar, [Nome].\n\nComo prometido, liberei pra você a versão completa do *Recepção que Vende*: as 18 objeções mais comuns já respondidas e os scripts de WhatsApp, áudio e ligação.\n\nÉ só abrir:\nhttps://gefitcorporativo-glitch.github.io/recepcao-que-vende/ferramenta.html?acesso=1\n\n(Segunda mensagem, separada:)\nE uma coisa a mais: o Nelson está selecionando alguns negócios pra uma conversa de 30 minutos, um diagnóstico da parte comercial.\n\nNão tenho vaga garantida, mas se você tiver interesse de verdade, vejo a agenda dele e tento um horário pra você.\n\nFaz sentido pra você?',
 aqui:{a:'Gratidão pela confiança e entrega do presente.',q:'Se tem interesse real no diagnóstico.',u:'Abrir o presente e dizer se quer a conversa.',i:'Chance de conversar com o Nelson mesmo fora do corte.'},
 op:'Mande em duas mensagens. O link abre direto, sem as perguntas, porque ela já respondeu no WhatsApp. Use com dono abaixo do corte que mostrou dor clara e abertura na conversa. Não prometa horário: o diagnóstico tem 3 vagas por semana e a prioridade é de quem está no corte.'},
{f:'entrada',e:'qualif',dia:'Conversa 4',canal:'wpp',obj:'Abaixo do corte com interesse · segurar e retornar com horário (opção 1)',
 texto:'Que bom, [Nome]! Vou ver a agenda do Nelson e te retorno até [segunda-feira] com um horário pra vocês conversarem. Enquanto isso, dá uma olhada na ferramenta e anota as dúvidas que aparecerem, assim a conversa rende ainda mais.\nAh, só pra eu já passar pra ele: você já fez algum trabalho de consultoria ou mentoria pra academia antes?',
 aqui:{a:'Valorizar o interesse.',q:'Se já fez consultoria ou mentoria.',u:'Usar a ferramenta e anotar as dúvidas.',i:'Conversa mais produtiva com o Nelson.'},
 op:'Combine com o Nelson antes de oferecer o horário. Quando tiver, use o convite do funil Diagnóstico (dois horários) e mova o card para Diagnóstico agendado.'},
{f:'entrada',e:'qualif',dia:'Conversa 4',canal:'wpp',obj:'Abaixo do corte com interesse · pedir um áudio contando da academia (opção 2)',
 texto:'Que bom, [Nome]! Pra eu conseguir um horário com o Nelson, preciso te apresentar bem pra ele. Ele tem quase 25 anos de mercado fitness e só no ano passado os materiais e ferramentas dele ajudaram quase 2.000 academias, então a agenda dele pra essas conversas é bem disputada.\nMe faz um favor: me manda um áudio rapidinho, de 1 ou 2 minutos, contando um pouco da sua academia. Como ela é hoje, o que você acha que faz ela diferente das outras, qual o maior desafio pra trazer mais gente e se você já fez algum treinamento ou mentoria com algum especialista. Com isso eu levo pro Nelson e te retorno com um horário.',
 aqui:{a:'Valorizar o interesse dela.',q:'Áudio contando da academia, do desafio e se já fez mentoria.',u:'Mandar o áudio.',i:'Conseguir um horário com quem já ajudou quase 2.000 academias.'},
 op:'Use quando o lead responde curto, com poucas palavras. O áudio mostra o interesse real e já traz o material do diagnóstico. Se ela mandar, agradeça e retorne com dois horários do funil Diagnóstico.'},
{f:'entrada',e:'qualif',dia:'Conversa 4',canal:'audio',obj:'Abaixo do corte com interesse · Oliver manda áudio primeiro para puxar o áudio dela (opção 3)',
 texto:'(Áudio de até 40 segundos, falando, não lendo)\n"Oi, [Nome], aqui é o Oliver, do time do Nelson. Que bom que você topou! Deixa eu te explicar: o Nelson tem quase 25 anos de academia, e só no ano passado os materiais dele ajudaram quase 2.000 academias. Por isso a agenda dele pra essas conversas é bem disputada, e eu preciso te apresentar direitinho pra ele. Me manda um áudio rapidinho contando como é a sua academia hoje, o que faz ela diferente, o seu maior desafio pra trazer mais gente e se você já fez alguma mentoria antes. Aí eu levo pra ele e te retorno com um horário, combinado?"',
 aqui:{a:'Voz de gente, tom próximo.',q:'Áudio contando da academia.',u:'Mandar o áudio.',i:'Horário com o Nelson.'},
 op:'Quem manda áudio costuma receber áudio. Use quando a pessoa está respondendo como se falasse com um robô.'},
{f:'entrada',e:'qualif',dia:'Follow-up',canal:'audio',obj:'Não respondeu depois do presente · áudio: conseguiu abrir? + autoridade + pedir áudio dela',
 texto:'(Áudio de cerca de 1 minuto, falando, não lendo)\n"Oi, [Nome]! Aqui é o Oliver, do time do Nelson.\nPassando pra saber se você conseguiu abrir a versão completa direitinho. Abriu certinho aí?\nQue bom! Espero de verdade que você e a sua equipe aproveitem. Tem muita coisa ali que já dá pra usar amanhã mesmo no WhatsApp da academia.\nE olha, sobre a conversa com o Nelson que eu te falei. Ele tem quase 25 anos de academia, e só no ano passado os materiais dele ajudaram quase 2.000 academias pelo Brasil. Essa semana ele separou pouquíssimos horários pra esses diagnósticos, e ainda dá pra eu tentar encaixar você.\n[GANCHO LOCAL, só se você conferiu a cidade]\nSe você quiser mesmo, me manda um áudio rapidinho contando como é a academia hoje, o seu maior desafio pra trazer mais gente e se já fez alguma mentoria antes. Aí eu levo pra ele e te retorno com um horário. Fechado?\nUm abraço!"',
 var:{cidade_pequena:'(Áudio de cerca de 1 minuto, falando, não lendo)\n"Oi, [Nome]! Aqui é o Oliver, do time do Nelson.\nPassando pra saber se você conseguiu abrir a versão completa direitinho. Abriu certinho aí?\nQue bom! Espero de verdade que você e a sua equipe aproveitem. Tem muita coisa ali que já dá pra usar amanhã mesmo no WhatsApp da academia.\nE olha, sobre a conversa com o Nelson que eu te falei. Ele tem quase 25 anos de academia, e só no ano passado os materiais dele ajudaram quase 2.000 academias pelo Brasil. Essa semana ele separou pouquíssimos horários pra esses diagnósticos, e ainda dá pra eu tentar encaixar você.\nEu vi que a [Academia] é de [Cidade]. Em cidade menor, onde todo mundo se conhece, cada atendimento vira indicação ou vira comentário, né? Acho que vale muito a pena ele olhar a sua academia.\nSe você quiser mesmo, me manda um áudio rapidinho contando como é a academia hoje, o seu maior desafio pra trazer mais gente e se já fez alguma mentoria antes. Aí eu levo pra ele e te retorno com um horário. Fechado?\nUm abraço!"'},
 aqui:{a:'Cuidado: conferir se conseguiu abrir o presente.',q:'Áudio contando da academia.',u:'Mandar o áudio.',i:'Horário com o Nelson, poucas vagas na semana.'},
 op:'Mande no dia seguinte ou na segunda de manhã, nunca em cima da mensagem anterior. Antes do gancho local, confira a cidade no Instagram e no DDD do lead. Errar a cidade quebra a confiança.'},
{f:'entrada',e:'qualif',dia:'Conversa 5',canal:'wpp',obj:'Ela mandou o áudio: agradecer e segurar o retorno',
 texto:'Muito obrigado, [Nome]! Deu pra entender bem o momento da academia. Vou levar pro Nelson e te retorno até [segunda-feira] com um horário pra vocês conversarem.',
 aqui:{a:'Gratidão pelo áudio.',q:'(nenhuma)',u:'Aguardar o horário.',i:'Conversa com o Nelson a caminho.'},
 op:'Anote no card um resumo do áudio (modelo, diferencial, desafio, mentoria anterior). É o briefing do Nelson para o diagnóstico.'},
{f:'entrada',e:'qualif',dia:'Quando houver abertura',canal:'lig',obj:'Ligação de pré-qualificação (5 a 10 min)',
 texto:'ABERTURA\n"Oi, [Nome], aqui é o Oliver, do time do Nelson Rabelo. A gente conversou pelo WhatsApp sobre o material da recepção. Tem uns 5 minutinhos? Quero entender o momento da academia pra te indicar o caminho certo."\n\nCONFIRMAR A DOR\n"Você comentou que hoje quem responde os leads é [quem]. Isso funciona bem ou é onde você sente que perde matrícula?"\n\nPONTE DE CONFIANÇA (uma vez só)\n"Só pra você saber com quem está falando: o Nelson tem quase 25 anos de academia, já foi dono, e hoje ajuda donos a organizar a parte comercial. Por isso vou te fazer umas perguntas mais a fundo, tudo bem?"\n\nAS 6 PERGUNTAS (nesta ordem)\n1. "Você decide sozinho ou tem sócio?"\n2. "Há quanto tempo a academia funciona e quantos alunos ativos tem hoje, mais ou menos?"\n3. "O faturamento mensal fica em qual faixa?"\n4. "Quem atende os leads hoje?"\n5. "Quando chega um lead pelo WhatsApp, o que acontece do primeiro oi até a matrícula?"\n6. "Já tentou consultoria ou mentoria antes? O que funcionou e o que não funcionou?"\n\nDIRECIONAR (a única coisa)\nPerfil A: "Pelo que você me contou, faz sentido uma conversa de 30 minutos com o Nelson. Tenho [dia/hora] ou [dia/hora], qual fica melhor?"\nPerfil B: "Pelo seu momento, o melhor agora é esta ferramenta. Te mando agora pelo WhatsApp e daqui uns dias te conto uma novidade."',
 var:{
  studio:'ABERTURA\n"Oi, [Nome], aqui é o Oliver, do time do Nelson Rabelo. A gente conversou pelo WhatsApp sobre o atendimento do estúdio. Tem uns 5 minutinhos?"\n\nCONFIRMAR A DOR\n"Num estúdio, cada aluno vale muito. Hoje, quando alguém pergunta valor, como vocês conduzem até a aula experimental?"\n\nPONTE DE CONFIANÇA (uma vez só)\n"O Nelson tem quase 25 anos de academia e trabalha com estúdios de ticket alto. Por isso vou te fazer algumas perguntas mais a fundo, tudo bem?"\n\nAS 6 PERGUNTAS\n1. "Você decide sozinho ou tem sócio?"\n2. "Quantos alunos ativos e quantas vagas por horário vocês têm?"\n3. "O faturamento mensal fica em qual faixa?"\n4. "Quem atende os leads hoje: você ou um personal?"\n5. "Do primeiro contato até a matrícula, quais são os passos hoje?"\n6. "Já tentou consultoria ou mentoria antes? O que funcionou?"\n\nDIRECIONAR\nPerfil A (a partir de R$20 mil): convite para o diagnóstico com dois horários.\nPerfil B: ferramenta de presente.'
 },
 aqui:{a:'Abertura leve e confirmação da dor que ele já contou.',q:'As 6 perguntas, decisor primeiro.',u:'Agendar o diagnóstico ou receber o presente.',i:'Autoridade do Nelson, citada uma vez só.'},
 op:'Nunca perguntar faturamento antes de criar conexão. Toda ligação termina com o próximo passo registrado no card. Se não atender, mandar o áudio de ligação não atendida.'},

{f:'entrada',e:'qualif',dia:'Se não atender',canal:'audio',obj:'Áudio após ligação não atendida',
 texto:'Oi, [Nome], aqui é o Oliver, do time do Nelson Rabelo. Tentei te ligar agora há pouco por causa da nossa conversa sobre a recepção da academia. Pelo que você me contou de [ponto que ele citou], já dá pra adiantar que tem coisa boa pra fazer aí. Me responde quando puder que eu te explico, combinado?',
 aqui:{a:'Retomar a conversa com naturalidade.',q:'(implícita) quando ele pode falar.',u:'Responder o áudio.',i:'Citar um ponto que ele mesmo contou.'},
 op:'Sempre citar algo que o lead falou. Não usar escassez inventada.'},

{f:'entrada',e:'nutricao',dia:'D1',canal:'video',obj:'Valor: checklist do primeiro dia do aluno',
 texto:'[Nome], separei um trecho de uma aula do Nelson com donos de academia sobre o primeiro dia do aluno: o que precisa acontecer da recepção até a conversa final pra ele não ir embora sem vínculo. São 7 pontos, vale assistir junto com quem cuida da recepção.\nDepois me conta: desses 7, quantos já acontecem aí na sua academia hoje? [vídeo]',
 aqui:{a:'Conteúdo separado pensando nele.',q:'Quantos dos 7 pontos já acontecem.',u:'Assistir o vídeo.',i:'Assistir junto com a equipe.'}},

{f:'entrada',e:'nutricao',dia:'D3',canal:'audio',obj:'Recado do Nelson (gravado uma vez, serve para todos)',
 texto:'Mensagem do Oliver antes do áudio:\n"[Nome], o Nelson gravou um recado rapidinho pra você. Dá uma ouvida quando tiver um minutinho:"\n\nRoteiro do áudio do Nelson (~40 s):\n"Fala, tudo bem? Aqui é o Nelson. Vi que você pegou o material da recepção. A maioria das academias que eu acompanho não perde aluno por preço, perde no atendimento: no WhatsApp que demora, na experiência que ninguém acompanha. Me conta: qual a sua maior dúvida pra aplicar isso aí? Me responde aqui mesmo que eu ou o meu time te ajuda. Um abraço!"',
 aqui:{a:'Recado pessoal do Nelson.',q:'Qual a maior dúvida para aplicar.',u:'Responder o áudio.',i:'Autoridade do Nelson, uma vez só.'}},

{f:'entrada',e:'nutricao',dia:'D5',canal:'wpp',obj:'Presente + faixa de faturamento (quem ainda não respondeu)',
 texto:'[Nome], liberei pra você a versão completa do *Recepção que Vende*: uma ferramenta online com as 18 objeções mais comuns já respondidas e os scripts por situação. Abre no celular, são 4 perguntas rápidas e libera na hora: https://gefitcorporativo-glitch.github.io/recepcao-que-vende/completo.html\nDepois me conta qual objeção mais aparece aí na academia?',
 aqui:{a:'Presente entregue antes de pedir algo.',q:'Faixa de faturamento.',u:'Abrir a ferramenta.',i:'Material escolhido para o momento dele.'}},

{f:'entrada',e:'nutricao',dia:'D7',canal:'video',obj:'Prova: caso real',
 texto:'[Nome], numa rede de 4 unidades que o Nelson ajudou a estruturar, todo dia às 5h30 a primeira pessoa a chegar mandava no grupo o print dos agendamentos do dia. Se o dia começava com um agendamento só, todo mundo já sabia que alguma coisa não tinha rodado. Ele conta aqui: [vídeo]\nAí na sua academia, vocês já começam o dia sabendo quantos agendamentos têm?',
 aqui:{a:'História real.',q:'Se começam o dia sabendo os agendamentos.',u:'Assistir o caso.',i:'Rotina simples que funciona.'}},

{f:'entrada',e:'nutricao',dia:'D10',canal:'video',obj:'Valor: indicação',
 texto:'[Nome], esse aqui é sobre indicação: o momento certo de pedir, que fica entre o 3º e o 7º dia do aluno, e por que ela tem que chegar como presente, não como pedido. [Reels "Indicação não é esmola"]\nHoje vocês pedem indicação em algum momento combinado ou acaba ficando no improviso?',
 var:{cidade_pequena:'[Nome], em cidade menor indicação é ouro, então esse aqui é pra você: o momento certo de pedir, entre o 3º e o 7º dia do aluno, e por que ela tem que chegar como presente, não como pedido. [Reels "Indicação não é esmola"]\nHoje vocês pedem indicação em algum momento combinado ou acaba ficando no boca a boca natural?'},
 aqui:{a:'Tema que todo dono quer resolver.',q:'Se existe momento combinado para pedir indicação.',u:'Assistir o vídeo.',i:'Indicação como presente.'}},

{f:'entrada',e:'convite',dia:'D14',canal:'wpp',obj:'Convite para o diagnóstico (perfil A ou faturamento desconhecido)',
 texto:'[Nome], o Nelson abre poucos horários por semana pra um diagnóstico de 30 minutos da parte comercial. Ele olha como o lead chega, como é respondido e onde a matrícula se perde, e você sai com um plano de ação pra aplicar já na semana seguinte.\nFaz sentido pra você agora? Se fizer, te passo os horários que ele tem livres.',
 aqui:{a:'Convite pessoal, vagas reais.',q:'Se faz sentido agora.',u:'Ver os horários livres.',i:'Sair com um plano de ação.'},
 op:'Se o faturamento ainda não é conhecido, perguntar a faixa antes de oferecer horário. São 3 vagas por semana: só oferecer horário que existe.'},

{f:'entrada',e:'fim',dia:'D21',canal:'wpp',obj:'Encerramento com gratidão',
 texto:'[Nome], obrigado pela confiança de ter baixado o material e acompanhado as mensagens até aqui. Vou parar de te mandar coisas pra não encher teu WhatsApp.\nSe em algum momento quiser ajuda com a recepção ou com as vendas da academia, é só me chamar nesse número. Sucesso aí!',
 aqui:{a:'Gratidão pela confiança.',q:'(sem pergunta)',u:'Saber que pode chamar a qualquer momento.',i:'Porta aberta, votos de sucesso.'},
 op:'Depois do D21, mover o card para Cadência futura: um conteúdo por mês, sem cobrar resposta.'},

// ===== SOCIAL SELLING =====
{f:'social',e:'dm',dia:'D1',canal:'dm',obj:'Primeiro contato com novo seguidor',
 texto:'[Nome], tudo certo? Oliver aqui, do time do Nelson Rabelo.\nVi que você chegou por aqui recentemente, seja muito bem-vindo! Queremos te dar um presente de boas-vindas e, pra eu escolher o certo, preciso só confirmar uma coisa: você é dono, gestor ou trabalha na recepção ou no comercial de academia, estúdio ou box?',
 aqui:{a:'Boas-vindas ao novo seguidor.',q:'Papel na academia.',u:'Responder na DM.',i:'Presente escolhido para ele.'},
 op:'Antes de mandar, olhar o perfil: se for academia ou dono, personalizar a primeira linha com algo do perfil.'},
{f:'social',e:'dm',dia:'D3',canal:'dm',obj:'Retorno sem resposta',
 texto:'[Nome], tudo certo? Oliver aqui, do time do Nelson Rabelo.\nAinda não nos conectamos, mas separei um presente de boas-vindas pra quem é do mercado fitness. Me diz só: você é dono ou gestor de academia, estúdio ou box?',
 aqui:{a:'Retomar sem cobrar.',q:'Se é dono ou gestor.',u:'Responder.',i:'Presente para o mercado fitness.'}},
{f:'social',e:'dm',dia:'D5',canal:'dm',obj:'Seleção (presente personalizado)',
 texto:'[Nome], estou selecionando alguns seguidores pra receber um presente personalizado: uma ferramenta online pra recepção e o comercial da academia.\nSe você é dono ou gestor, me responde aqui, pode ser em áudio, que eu te explico.',
 aqui:{a:'Ser selecionado.',q:'(implícita) se é dono ou gestor.',u:'Responder, inclusive por áudio.',i:'Presente personalizado.'}},
{f:'social',e:'dm',dia:'D6',canal:'dm',obj:'Encerramento leve',
 texto:'[Nome], não vou insistir por aqui. Se um dia quiser o presente ou trocar uma ideia sobre as vendas da sua academia, é só me chamar nessa DM.',
 aqui:{a:'Respeito ao tempo dele.',q:'(sem pergunta)',u:'Saber que pode chamar.',i:'Porta aberta.'}},
{f:'social',e:'resposta',dia:'Na hora',canal:'dm',obj:'Confirmou que é dono ou gestor',
 texto:'Perfeito, [Nome]! Tenho certeza de que você vai gostar do presente. Me passa seu WhatsApp que eu te chamo por lá e já te envio?',
 aqui:{a:'Comemorar a resposta.',q:'(implícita) WhatsApp.',u:'Passar o número.',i:'Presente garantido.'}},
{f:'social',e:'resposta',dia:'Na hora',canal:'dm',obj:'É recepção, consultora ou professor',
 texto:'Show, [Nome]! Tenho uma ferramenta pensada pra quem está no atendimento. Me passa seu WhatsApp que eu te mando por lá?',
 aqui:{a:'Valorizar quem atende.',q:'(implícita) WhatsApp.',u:'Passar o número.',i:'Ferramenta para o dia a dia dele.'}},
{f:'social',e:'whats',dia:'D0 no WhatsApp',canal:'wpp',obj:'Veio da DM e a resposta demorou: desculpas e reconexão',
 texto:'Oi, [Nome]! Tudo bem? Aqui é o Oliver, do time do Nelson Rabelo. A gente se falou lá no Instagram.\n\nAntes de tudo, desculpa a demora pra te responder. Nas últimas semanas a gente esteve em mudança de escritório e algumas mensagens acabaram ficando pra trás. Mas a sua eu não ia deixar passar.\n\nMe conta: você é dono ou gestor de academia, estúdio ou box? Quero entender o que te fez chamar a gente pra te ajudar do jeito certo.',
 aqui:{a:'Desculpas sinceras pela demora, com o motivo real.',q:'Se é dono ou gestor e o que buscava.',u:'Responder contando o momento dele.',i:'Atenção de quem não deixou a mensagem dele passar.'},
 op:'Use só quando o atraso for real e o motivo for verdadeiro. Crie o card em Leads Novos com a tag de origem Direct do Instagram. Se ele for dono: siga a Qualificação (Conversa 1). Se for da equipe: peça o contato do dono.'},
{f:'social',e:'whats',dia:'Resposta',canal:'wpp',obj:'Veio da DM · confirmou que é dono: acolher e entregar o presente',
 texto:'Que bom, [Nome]! Obrigado por me contar.\n\nComo presente pela demora, separei pra você o *Recepção que Vende*: os scripts que a gente usa pra recepção responder o WhatsApp e transformar mais conversa em matrícula. É só abrir:\nhttps://gefitcorporativo-glitch.github.io/recepcao-que-vende/?utm_source=nelson\n\nE me conta uma coisa: hoje, qual é o maior desafio da academia? Trazer mais gente, fazer quem chega virar aluno ou segurar quem já treina?',
 aqui:{a:'Agradecer e compensar a demora com um presente.',q:'Maior desafio da academia.',u:'Abrir o material e contar o desafio.',i:'Material pronto pra usar no WhatsApp da academia.'},
 op:'Depois do desafio, siga a Conversa 2 por desafio (atrair, converter ou reter), que leva à faixa de faturamento.'},
{f:'social',e:'whats',dia:'D0 no WhatsApp',canal:'wpp',obj:'Primeira mensagem no WhatsApp, vindo da DM',
 texto:'Oi, [Nome]! Aqui é o Oliver, do time do Nelson Rabelo, a gente se falou no Instagram. Como prometido, aqui está o seu presente, a versão completa do *Recepção que Vende*, com scripts e as 18 objeções respondidas: https://gefitcorporativo-glitch.github.io/recepcao-que-vende/completo.html\nE pra eu te mandar os próximos materiais certos: hoje quem responde quem chama no WhatsApp da academia? É você mesmo, a recepção ou uma consultora?',
 aqui:{a:'Lembrar da conversa no Instagram.',q:'Quem atende os leads.',u:'Abrir o presente.',i:'Promessa cumprida.'},
 op:'Cadastrar o lead na Central de Leads com a origem do perfil (Instagram Nelson ou Instagram GeFit) e seguir a cadência de Leads de entrada a partir daqui.'},

// ===== DIAGNÓSTICO (CAMINHO A) =====
{f:'diag',e:'convite',dia:'Logo após qualificar',canal:'wpp',obj:'Convite com dois horários reais',
 texto:'Valeu, [Nome]! Pelo que você me contou, faz sentido uma conversa com o Nelson.\nEle abre poucos horários por semana pra um diagnóstico de 30 minutos da parte comercial: olha como o lead chega, como é respondido e onde a matrícula se perde. Você sai com um plano de ação.\nTenho [dia, hora] ou [dia, hora]. Qual fica melhor pra você?',
 aqui:{a:'Reconhecer o que ele contou.',q:'(implícita) qual horário.',u:'Escolher um dos dois horários.',i:'Sair com plano de ação.'},
 op:'Sempre dois horários nos próximos 3 dias. Nunca "não custa nada".'},
{f:'diag',e:'convite',dia:'Antes de confirmar',canal:'wpp',obj:'Confirmar se há sócio',
 texto:'Perfeito! Só uma coisa: você toca a academia sozinho ou tem sócio? Se tiver, vale ele participar também, porque o plano de ação mexe na operação.',
 aqui:{a:'Cuidado com o resultado.',q:'Se tem sócio.',u:'Trazer o sócio.',i:'Plano que funciona porque todos decidem juntos.'}},
{f:'diag',e:'confirma',dia:'Ao marcar',canal:'wpp',obj:'Confirmação do horário',
 texto:'Fechado, [Nome]: [dia], às [hora], 30 minutos com o Nelson pelo Google Meet. Antes disso ele vai dar uma olhada no Instagram e no atendimento da academia pra já chegar com pontos concretos. Te mando o link no dia.',
 aqui:{a:'Confirmação clara.',q:'(sem pergunta)',u:'Guardar o horário.',i:'Nelson chega preparado.'},
 op:'Criar o evento "[Academia] · Diagnóstico comercial GeFit" com Instagram, cidade, modelo, faixa de faturamento, quem atende e maior desafio. Fazer o cliente oculto e mover o card para Diagnóstico agendado.'},
{f:'diag',e:'confirma',dia:'2 dias antes',canal:'wpp',obj:'Lembrete com valor',
 texto:'[Nome], o Nelson já começou a olhar o atendimento e o Instagram da academia pra nossa conversa de [dia] às [hora]. Vai ser bem prático.',
 aqui:{a:'Mostrar que já estão trabalhando para ele.',q:'(sem pergunta)',u:'Manter o compromisso.',i:'Conversa prática.'}},
{f:'diag',e:'confirma',dia:'1 dia antes',canal:'wpp',obj:'Preparação',
 texto:'Oi, [Nome]! Amanhã às [hora] é o seu diagnóstico com o Nelson. Se quiser aproveitar ainda mais, separa os números do último mês: quantos leads chegaram e quantas matrículas fecharam.',
 aqui:{a:'Lembrete gentil.',q:'(implícita) os números do mês.',u:'Separar os números.',i:'Aproveitar mais a conversa.'}},
{f:'diag',e:'confirma',dia:'No dia, de manhã',canal:'lig',obj:'Ligação de lembrete (sem abrir brecha para cancelar)',
 texto:'"Oi, [Nome]! Te liguei rapidinho porque sei que rotina de dono é corrida. É só pra lembrar que hoje às [hora] é o diagnóstico com o Nelson. Ele já preparou o retorno sobre o atendimento e o Instagram da academia. Combinado?"\n\nSe não atender, mandar no WhatsApp:\n"[Nome], te liguei só pra lembrar: hoje às [hora] é o diagnóstico com o Nelson. Ele já preparou o retorno sobre o atendimento e o Instagram da academia. Papel e caneta, bora!"',
 aqui:{a:'Respeito pela rotina dele.',q:'(sem pergunta aberta)',u:'Comparecer.',i:'Retorno já preparado.'},
 op:'Nunca perguntar "ainda está de pé?" ou "vai conseguir?". Link do Meet 10 minutos antes.'},
{f:'diag',e:'reuniao',dia:'Na reunião',canal:'reuniao',obj:'Roteiro do diagnóstico de 30 minutos (Nelson)',
 texto:'0 a 3 min · ABERTURA\nAgradecer e combinar o objetivo: sair com 3 ações para o comercial.\n\n3 a 10 min · NÚMEROS\nLeads por semana, quem atende, quantos vão à experimental, quantos matriculam.\n\n10 a 18 min · RETORNO DO CLIENTE OCULTO E DO INSTAGRAM\nO que o lead vê hoje, com o print.\n\n18 a 25 min · PLANO DE AÇÃO\n3 ações priorizadas, com responsável e prazo.\n\n25 a 30 min · PRÓXIMO PASSO\nComo a GeFit pode ajudar a implantar: módulo Comercial do SaaS ou pacote com acompanhamento.',
 aqui:{a:'Agradecer e alinhar o objetivo.',q:'Números e retorno do cliente oculto.',u:'Escolher o próximo passo com a GeFit.',i:'Plano de ação nas mãos.'},
 op:'O plano de ação vai por escrito no WhatsApp no mesmo dia.'},
{f:'diag',e:'pos',dia:'Mesmo dia',canal:'wpp',obj:'Envio do plano de ação',
 texto:'[Nome], obrigado pelo tempo e pela confiança hoje. Como combinado, aqui está o plano de ação da academia:\n1. [ação 1, responsável, prazo]\n2. [ação 2, responsável, prazo]\n3. [ação 3, responsável, prazo]\nQual dessas você quer colocar em prática primeiro?',
 aqui:{a:'Gratidão pelo tempo e pela confiança.',q:'Qual ação vem primeiro.',u:'Começar pela primeira ação.',i:'Plano pronto para executar.'}},

// ===== PRESENTE (CAMINHO B) =====
{f:'presente',e:'entrega',dia:'Na hora',canal:'wpp',obj:'Entrega da campanha modelo (B1)',
 texto:'[Nome], separei pra você uma campanha de captação que a gente montou como modelo: página de cadastro, indicação de amigos com ranking e sorteio, tudo pelo celular. Dá uma olhada como se fosse um aluno: [LINK]\nFunciona muito bem pra evento, aulão e campanha de fim de ano. Quer que eu te conte como adaptar pra sua academia?',
 aqui:{a:'Presente concreto, funcionando.',q:'Se quer adaptar para a academia dele.',u:'Abrir a campanha.',i:'Ideia pronta para o fim de ano.'}},
{f:'presente',e:'entrega',dia:'Na hora',canal:'wpp',obj:'Entrega para quem é da recepção (B2)',
 texto:'[Nome], liberei pra você uma ferramenta com os scripts de WhatsApp pra recepção: o que responder quando perguntam preço, como chamar pra experimental e o que fazer quando o lead some. É só copiar: [LINK]\nUma pergunta: quem é o dono ou gestor aí? Tenho um material específico pra ele também.',
 aqui:{a:'Ferramenta para o dia a dia dela.',q:'Quem é o dono ou gestor.',u:'Usar os scripts.',i:'Atender melhor desde hoje.'}},
{f:'presente',e:'retorno',dia:'2 dias depois',canal:'wpp',obj:'Saber se usou o presente',
 texto:'[Nome], conseguiu dar uma olhada no que te mandei? Me conta o que mais chamou atenção, quero entender se faz sentido pra realidade da academia.',
 aqui:{a:'Interesse genuíno no que ele achou.',q:'O que chamou atenção.',u:'Responder.',i:'Ajustar à realidade dele.'},
 op:'Se a resposta mostrar perfil A (faturamento acima do corte), oferecer o diagnóstico.'}
];

const OBJECOES=[
 {t:'"Quanto custa?"',a:'Faz sentido querer saber.',q:'—',u:'Escolher um horário.',i:'Bônus reservado para poucos donos.',r:'O diagnóstico é um bônus que o Nelson reserva pra poucos donos por semana, sem cobrança. Se depois fizer sentido seguir com a GeFit, ele te mostra as opções lá. Te encaixo em [dia] ou [dia]?'},
 {t:'"Não tenho tempo agora"',a:'Rotina de dono é corrida.',q:'Melhor período do dia.',u:'Escolher manhã ou fim de tarde.',i:'Sair com 3 ações.',r:'Imagino, rotina de dono é corrida. São 30 minutos e você já sai com 3 ações pra aplicar. Fica melhor no começo da manhã ou no fim da tarde?'},
 {t:'"Já fiz consultoria e não deu certo"',a:'Faz sentido ficar com o pé atrás.',q:'O que não funcionou.',u:'Ouvir e só depois convidar.',i:'Olhar para a operação dele, não receita pronta.',r:'Faz sentido ficar com o pé atrás. O que não funcionou daquela vez? (ouvir) O diagnóstico é justamente pra olhar a sua operação, não uma receita pronta.'},
 {t:'"Meu problema é falta de lead"',a:'Pode ser.',q:'Quantos leads viram matrícula.',u:'Topar olhar onde o lead se perde.',i:'Lead que já existe e pode virar aluno.',r:'Pode ser. Uma pergunta: dos leads que chegam hoje, quantos você acha que viram matrícula? Muitas vezes o lead existe e se perde no atendimento. É isso que o Nelson olha no diagnóstico.'},
 {t:'"Me manda por escrito"',a:'Mando sim.',q:'—',u:'Fazer a conversa primeiro.',i:'Tudo por escrito depois.',r:'Mando sim! Só que o plano de ação depende dos números da academia, por isso é uma conversa. Depois dela, tudo vai por escrito pra você.'},
 {t:'"Vou ver com meu sócio"',a:'Ótimo.',q:'Horário que serve para os dois.',u:'Agendar com o sócio.',i:'Decisão a dois, plano que anda.',r:'Ótimo, inclusive o ideal é ele participar. Qual horário funciona pros dois: [dia] ou [dia]?'},
 {t:'"Já uso um sistema"',a:'Que bom que já tem sistema.',q:'O que o sistema não resolve hoje.',u:'Olhar o processo, não trocar sistema.',i:'A GeFit trabalha junto com o que já existe.',r:'Que bom que vocês já têm sistema, isso ajuda muito. O diagnóstico não é pra trocar nada: é pra olhar o processo, o que acontece entre o primeiro oi e a matrícula. Hoje, o que você sente que o sistema não resolve?'},
 {t:'"Agora não, fim de ano é corrido"',a:'Fim de ano é corrido mesmo.',q:'Como está a captação para janeiro.',u:'Agendar agora para chegar pronto em janeiro.',i:'Janeiro é o melhor mês para quem chega preparado.',r:'Fim de ano é corrido mesmo. Justamente por isso: janeiro é o mês que mais entra aluno, e quem chega com o atendimento organizado aproveita muito mais. Fazer o diagnóstico agora te deixa pronto. Te encaixo em [dia] ou [dia]?'}
];

const ROTINA=[
 ['Quem fala','Oliver, "do time do Nelson Rabelo", pelo WhatsApp da GeFit. Nunca falar em nome de outra marca.'],
 ['Regras de conversa','Uma pergunta por mensagem. Espelhar a resposta antes da próxima pergunta. Tom de conversa, sem cara de automação. Nada de opções numeradas.'],
 ['Horários','Dias úteis, das 9h às 11h ou das 14h às 17h.'],
 ['Corte para o diagnóstico (A)','Dono ou gestor. Academia a partir de R$35 mil/mês. Estúdio e box a partir de R$20 mil/mês. Abaixo disso: presente (B).'],
 ['Vagas de diagnóstico','3 por semana, todas reais. Só oferecer horário que existe na agenda do Nelson.'],
 ['Registro','Todo toque termina com o próximo contato marcado no card do Kanban.'],
 ['Nunca dizer','"Não custa nada", "é rapidinho, prometo", "ainda tem interesse?", escassez que não existe.'],
 ['Gratidão','Agradecer pela confiança em momentos certos: depois da qualificação, no pós-diagnóstico e no encerramento. Na abertura, parabenizar a decisão.'],
 ['Indicadores do dia','Leads novos, primeiras respostas, qualificados A, presentes B entregues, diagnósticos agendados e realizados.']
];

// ---------- RENDER ----------
let st={tab:'mesa',funil:'entrada',etapa:null,modelo:'geral',canal:'todos',busca:'',aberto:null};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const textoDe=s=>(s.var&&s.var[st.modelo])||s.texto;
function chip(on,label,onclick){return `<button class="${on?'btn-or':'btn-gh'}" style="font-size:11.5px;padding:6px 12px" onclick="${onclick}">${label}</button>`;}
function aquiBox(a){if(!a)return '';const l=(k,v)=>`<div style="margin-top:3px"><b style="color:var(--tx)">${k}</b> ${esc(v)}</div>`;
  return `<div style="font-size:12px;color:var(--td);padding:9px 11px;border:1px dashed var(--bd);border-radius:8px;margin-top:10px"><div style="font-weight:700;color:var(--tm)">Como aplica o AQÚI (não vai na mensagem)</div>${l('A · Acolher:',a.a)}${l('Q · Qualificar:',a.q)}${l('Ú · Única coisa:',a.u)}${l('I · Incentivar:',a.i)}</div>`;}

function render(){
  const el=document.getElementById('ft-gefit');if(!el)return;
  const tabs=[['mesa','🗂 Scripts por funil'],['obj','🧠 Objeções de dono'],['rotina','📋 Rotina do SDR'],['modelos','🏋️ Modelos de negócio']];
  let h=`<div style="display:flex;gap:5px;margin-bottom:16px;flex-wrap:wrap">${tabs.map(([k,l])=>chip(st.tab===k,l,`ftGefit.tab('${k}')`)).join('')}</div>`;
  if(st.tab==='mesa')h+=mesa();
  if(st.tab==='obj')h+=objecoes();
  if(st.tab==='rotina')h+=rotina();
  if(st.tab==='modelos')h+=modelos();
  el.innerHTML=h;
}

function mesa(){
  const f=FUNIS.find(x=>x.id===st.funil);
  const lista=S.filter(s=>s.f===st.funil&&(!st.etapa||s.e===st.etapa)&&(st.canal==='todos'||s.canal===st.canal)&&(!st.busca||(s.obj+' '+textoDe(s)).toLowerCase().includes(st.busca.toLowerCase())));
  const sel=`width:100%;padding:8px 10px;border:1px solid var(--bd);border-radius:8px;background:var(--s1);color:var(--tx);font-size:13px`;
  let h=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:12px">
    <label style="font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:.5px">Funil<select style="${sel};margin-top:4px" onchange="ftGefit.funil(this.value)">${FUNIS.map(x=>`<option value="${x.id}" ${x.id===st.funil?'selected':''}>${x.nome}</option>`).join('')}</select></label>
    <label style="font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:.5px">Modelo de negócio<select style="${sel};margin-top:4px" onchange="ftGefit.modelo(this.value)">${Object.entries(MODELOS).map(([k,m])=>`<option value="${k}" ${k===st.modelo?'selected':''}>${m.nome}</option>`).join('')}</select></label>
    <label style="font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:.5px">Canal<select style="${sel};margin-top:4px" onchange="ftGefit.canal(this.value)"><option value="todos">Todos</option>${Object.entries(CANAIS).map(([k,v])=>`<option value="${k}" ${k===st.canal?'selected':''}>${v}</option>`).join('')}</select></label>
    <label style="font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:.5px">Buscar<input style="${sel};margin-top:4px" placeholder="palavra do script" value="${esc(st.busca)}" oninput="ftGefit.busca(this.value)"></label>
  </div>
  <div style="font-size:12.5px;color:var(--td);margin-bottom:10px">${esc(f.desc)}${st.modelo!=='geral'?` <b style="color:var(--tm)">· ${esc(MODELOS[st.modelo].nome)}:</b> ${esc(MODELOS[st.modelo].dor)}`:''}</div>
  <div style="display:flex;gap:5px;margin-bottom:12px;flex-wrap:wrap">${chip(!st.etapa,'Todas as etapas','ftGefit.etapa(null)')}${f.etapas.map(e=>chip(st.etapa===e.id,e.nome,`ftGefit.etapa('${e.id}')`)).join('')}</div>`;
  if(!lista.length)return h+`<div style="padding:24px;text-align:center;color:var(--td);border:1px dashed var(--bd);border-radius:10px">Nenhum script com esses filtros.</div>`;
  h+=`<div style="border:1px solid var(--bd);border-radius:10px;overflow:hidden;background:var(--s1)">
   <div style="display:grid;grid-template-columns:110px 150px 1fr 90px;gap:10px;padding:9px 12px;font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--td);border-bottom:1px solid var(--bd);background:var(--s2)"><div>Quando</div><div>Canal</div><div>Objetivo</div><div></div></div>`;
  lista.forEach(s=>{
    const idx=S.indexOf(s),open=st.aberto===idx,etapa=f.etapas.find(e=>e.id===s.e);
    const temVar=s.var&&s.var[st.modelo];
    h+=`<div style="border-bottom:1px solid var(--bd)">
      <div style="display:grid;grid-template-columns:110px 150px 1fr 90px;gap:10px;padding:11px 12px;cursor:pointer;align-items:center" onclick="ftGefit.abrir(${idx})">
        <div style="font-weight:700;color:var(--tx);font-size:13px">${esc(s.dia)}<div style="font-weight:400;font-size:11px;color:var(--td)">${esc(etapa?etapa.nome:'')}</div></div>
        <div style="font-size:12.5px;color:var(--tm)">${CANAIS[s.canal]||s.canal}</div>
        <div style="font-size:13px;color:var(--tx)">${esc(s.obj)}${st.modelo!=='geral'?`<span style="margin-left:6px;font-size:10.5px;padding:2px 7px;border-radius:999px;border:1px solid var(--bd);color:var(--td)">${temVar?'versão do modelo':'versão geral'}</span>`:''}</div>
        <div style="text-align:right;font-size:12px;color:var(--or)">${open?'fechar ▴':'abrir ▾'}</div>
      </div>
      ${open?`<div style="padding:0 12px 14px">
        <div style="position:relative;background:var(--s2);border:1px solid var(--bd);border-radius:8px;padding:12px 14px">
          <button class="btn-or" style="position:absolute;top:8px;right:8px;font-size:11px;padding:5px 11px" onclick="ftGefit.copiar(${idx},event)">Copiar</button>
          <div id="ftg-txt-${idx}" style="white-space:pre-line;font-size:13.5px;line-height:1.55;color:var(--tx);padding-right:70px">${esc(textoDe(s))}</div>
        </div>
        ${aquiBox(s.aqui)}
        ${s.op?`<div style="font-size:12px;color:var(--tm);margin-top:8px"><b>Orientação:</b> ${esc(s.op)}</div>`:''}
      </div>`:''}
    </div>`;
  });
  return h+`</div><div style="font-size:11.5px;color:var(--td);margin-top:8px">Troque [Nome], [dia], [hora] e [LINK] antes de enviar. O botão Copiar pega só a mensagem.</div>`;
}

function objecoes(){
  return `<div style="font-size:12.5px;color:var(--td);margin-bottom:10px">Objeções mais comuns de donos antes do diagnóstico. Sempre AQÚI: acolher, uma pergunta e um próximo passo.</div>`+OBJECOES.map((o,i)=>`
   <div style="border:1px solid var(--bd);border-radius:10px;background:var(--s1);padding:12px 14px;margin-bottom:10px">
     <div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><b style="color:var(--tx);font-size:14px">${esc(o.t)}</b><button class="btn-or" style="font-size:11px;padding:5px 11px" onclick="ftGefit.copiarObj(${i},event)">Copiar</button></div>
     <div id="ftg-obj-${i}" style="font-size:13.5px;color:var(--tx);margin-top:8px;line-height:1.5">${esc(o.r)}</div>
     ${aquiBox({a:o.a,q:o.q,u:o.u,i:o.i})}
   </div>`).join('');
}
function rotina(){
  return `<div style="border:1px solid var(--bd);border-radius:10px;background:var(--s1);overflow:hidden">`+ROTINA.map(([k,v])=>`<div style="display:grid;grid-template-columns:200px 1fr;gap:12px;padding:11px 14px;border-bottom:1px solid var(--bd)"><b style="color:var(--tx);font-size:13px">${esc(k)}</b><div style="font-size:13px;color:var(--tm)">${esc(v)}</div></div>`).join('')+`</div>`;
}
function modelos(){
  const n=k=>S.filter(s=>s.var&&s.var[k]).length;
  return `<div style="font-size:12.5px;color:var(--td);margin-bottom:10px">Cada modelo pode ter sua própria versão de qualquer script. Onde não houver, vale a versão geral. Este espaço é para irmos completando.</div>
   <div style="border:1px solid var(--bd);border-radius:10px;background:var(--s1);overflow:hidden">`+Object.entries(MODELOS).filter(([k])=>k!=='geral').map(([k,m])=>`<div style="display:grid;grid-template-columns:240px 1fr 120px;gap:12px;padding:11px 14px;border-bottom:1px solid var(--bd);align-items:center"><b style="color:var(--tx);font-size:13px">${esc(m.nome)}</b><div style="font-size:12.5px;color:var(--tm)">${esc(m.dor)}</div><button class="btn-gh" style="font-size:11px;padding:5px 10px" onclick="ftGefit.verModelo('${k}')">${n(k)} script(s) próprio(s)</button></div>`).join('')+`</div>`;
}

function copiarEl(id,ev){ev&&ev.stopPropagation();const t=document.getElementById(id);if(!t)return;navigator.clipboard.writeText(t.innerText).then(()=>{try{toast('Mensagem copiada!')}catch(e){}});}

window.ftGefit={
  tab:k=>{st.tab=k;render()},
  funil:v=>{st.funil=v;st.etapa=null;st.aberto=null;render()},
  etapa:v=>{st.etapa=v;st.aberto=null;render()},
  modelo:v=>{st.modelo=v;render()},
  canal:v=>{st.canal=v;st.aberto=null;render()},
  busca:v=>{st.busca=v;clearTimeout(window.__ftgB);window.__ftgB=setTimeout(()=>{render();const i=document.querySelector('#ft-gefit input');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},250)},
  abrir:i=>{st.aberto=st.aberto===i?null:i;render()},
  copiar:(i,ev)=>copiarEl('ftg-txt-'+i,ev),
  copiarObj:(i,ev)=>copiarEl('ftg-obj-'+i,ev),
  verModelo:k=>{st.modelo=k;st.tab='mesa';render()}
};

// Liga/desliga conforme o espaço ativo do hub
window.ftGefitAplicar=function(emp){
  const g=document.getElementById('ft-gefit');if(!g)return;
  const ids=['ft-nav','ft-bv','ft-cad','ft-obj','ft-play','ft-anc'];
  const sub=document.getElementById('ft-academia-nome');
  if(emp){
    ids.forEach(i=>{const e=document.getElementById(i);if(e)e.style.display='none'});
    g.style.display='block';if(sub)sub.textContent='a equipe comercial da GeFit (donos e gestores de academia)';
    render();
  }else{
    if(g.style.display!=='none'){g.style.display='none';const n=document.getElementById('ft-nav');if(n)n.style.display='flex';try{ftTab(typeof ftAtivo!=='undefined'&&ftAtivo?ftAtivo:'bv')}catch(e){}}
  }
};
window.FT_GEFIT_DATA={MODELOS,FUNIS,S,OBJECOES,ROTINA,GF_GESTAO};
})();
