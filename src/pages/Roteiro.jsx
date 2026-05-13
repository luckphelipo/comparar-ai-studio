import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useFunnel } from '@/lib/FunnelContext';
import { useRoteiro } from '@/lib/RoteiroContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import RoteiroInput from '../components/roteiro/RoteiroInput';
import RoteiroResultado from '../components/roteiro/RoteiroResultado';
import RoteiroOtimizado from '../components/roteiro/RoteiroOtimizado';

export default function Roteiro() {
  const { funnel, config } = useFunnel();
  const {
    resultado, setResultado,
    roteiroOriginal, setRoteiroOriginal,
    roteiroOtimizado, setRoteiroOtimizado,
    sugestoesTitulo, setSugestoesTitulo,
  } = useRoteiro();

  const [loading, setLoading] = useState(false);
  const [otimizando, setOtimizando] = useState(false);
  const [gerandoSugestoes, setGerandoSugestoes] = useState(false);
  const [analisesMes, setAnalisesMes] = useState(null);
  const FunnelIcon = funnel === 'top' ? Rocket : Target;

  const carregarAnalisesMes = async () => {
    try {
      const user = await base44.auth.me();
      setAnalisesMes(user?.analises_restantes_mes || 0);
    } catch (error) {
      setAnalisesMes(0);
    }
  };

  useState(() => {
    carregarAnalisesMes();
  }, []);

  const handleAnalyze = async ({ title, text }) => {
    setLoading(true);
    setResultado(null);

    // Verificar análises disponíveis
    const user = await base44.auth.me();
    if (!user) {
      toast.error('Usuário não autenticado');
      setLoading(false);
      return;
    }

    if ((user.analises_restantes_mes || 0) <= 0) {
      toast.error('Você atingiu o limite de 20 análises por mês. Tente novamente no próximo mês.');
      setLoading(false);
      return;
    }

    // Descontar uma análise
    await base44.auth.updateMe({
      analises_restantes_mes: Math.max(0, (user.analises_restantes_mes || 20) - 1)
    });

    const funnelContext = funnel === 'top'
      ? 'Topo de Funil (ToFu) — viralização, alcance, emoção, curiosidade'
      : 'Fundo de Funil (BoFu) — conversão, autoridade, confiança, leads';

    const palavras = text.split(/\s+/).filter(Boolean).length;
    const duracaoEstimadaMin = Math.round(palavras / 140);

    const conversation = await base44.agents.createConversation({
      agent_name: 'auditor_roteiros',
      metadata: { name: `Análise: ${title || 'Sem título'}` }
    });

    await base44.agents.addMessage(conversation, {
      role: 'user',
      content: `Analisa este roteiro de ${funnelContext}.

TÍTULO: ${title || 'Não informado'}
PALAVRAS: ${palavras} (~${duracaoEstimadaMin} min a 140 WPM)
ROTEIRO:
${text}

Responde APENAS com um JSON válido, sem markdown, sem explicações fora do JSON, seguindo EXATAMENTE este schema:
{
  "score_geral": <número 0-100>,
  "scores": [
    {"label": "Gancho", "value": <0-100>},
    {"label": "Ritmo", "value": <0-100>},
    {"label": "Retenção", "value": <0-100>},
    {"label": "CTA", "value": <0-100>},
    {"label": "SEO", "value": <0-100>},
    {"label": "Potencial Viral", "value": <0-100>}
  ],
  "resumo": "<resumo analítico em 2-3 frases>",
  "gancho": "<trecho do gancho detectado>",
  "cta": "<trecho do CTA detectado>",
  "pontos_fortes": ["<ponto 1>", "<ponto 2>", "<ponto 3>"],
  "pontos_fracos": ["<ponto 1>", "<ponto 2>", "<ponto 3>"],
  "sugestoes": ["<sugestão 1>", "<sugestão 2>", "<sugestão 3>", "<sugestão 4>"],
  "tempo_estimado_minutos": ${duracaoEstimadaMin},
  "tempo_status": "<ideal|curto|longo>",
  "tempo_feedback": "<feedback sobre o tempo e como ajustar>",
  "shorts_sugeridos": [
    {
      "trecho": "<trecho EXATO do roteiro que viraria um short — copie palavra por palavra do roteiro>",
      "motivo": "<por que este trecho é ideal para short>"
    }
  ],
  "analise_titulo": {
    "score_alinhamento": <número 0-100 baseado no alinhamento com o funil ${funnelContext}>,
    "feedback": "<feedback específico sobre o título, mencionando o que está bom e o que deve melhorar para o funil>",
    "erro_alinhamento": "<null se não há erro, ou descreva o erro de alinhamento detectado>",
    "sugestao_correcao": "<null se o título está ok, ou um título sugerido corrigido>"
  }
}`
    });

    let resposta = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const conv = await base44.agents.getConversation(conversation.id);
      const lastMsg = conv.messages?.[conv.messages.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg?.content) {
        resposta = lastMsg.content;
        break;
      }
    }

    if (!resposta) throw new Error('O agente não respondeu a tempo.');

    const jsonMatch = resposta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta do agente não contém JSON válido.');
    const result = JSON.parse(jsonMatch[0]);

    setResultado({ ...result, title });
    setRoteiroOriginal({ title, text });
    setRoteiroOtimizado(null);
    setSugestoesTitulo(null);
    setLoading(false);
  };

  const handleGerarSugestoes = async () => {
    if (!roteiroOriginal) return;
    setGerandoSugestoes(true);

    const funnelContext = funnel === 'top'
      ? 'Topo de Funil (ToFu) — viralização, alcance, emoção, curiosidade'
      : 'Fundo de Funil (BoFu) — conversão, autoridade, confiança, leads';

    const conversation = await base44.agents.createConversation({
      agent_name: 'auditor_roteiros',
      metadata: { name: `Sugestões de Título: ${roteiroOriginal.title || 'Sem título'}` }
    });

    await base44.agents.addMessage(conversation, {
      role: 'user',
      content: `Gera exatamente 5 sugestões de títulos para o seguinte roteiro de ${funnelContext}.

TÍTULO ATUAL: ${roteiroOriginal.title || 'Não informado'}
ROTEIRO (trecho inicial para contexto):
${roteiroOriginal.text.slice(0, 800)}

Responde APENAS com um JSON válido, sem markdown, seguindo EXATAMENTE este schema:
{
  "sugestoes": ["<título 1>", "<título 2>", "<título 3>", "<título 4>", "<título 5>"]
}`
    });

    let resposta = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const conv = await base44.agents.getConversation(conversation.id);
      const lastMsg = conv.messages?.[conv.messages.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg?.content) {
        resposta = lastMsg.content;
        break;
      }
    }

    if (resposta) {
      const jsonMatch = resposta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSugestoesTitulo(parsed.sugestoes || []);
      }
    }
    setGerandoSugestoes(false);
  };

  const handleOtimizar = async () => {
    if (!resultado || !roteiroOriginal) return;
    setOtimizando(true);

    const funnelContext = funnel === 'top'
      ? 'Topo de Funil (ToFu) — viralização, alcance, emoção, curiosidade'
      : 'Fundo de Funil (BoFu) — conversão, autoridade, confiança, leads';

    const conversation = await base44.agents.createConversation({
      agent_name: 'auditor_roteiros',
      metadata: { name: `Otimização: ${roteiroOriginal.title || 'Sem título'}` }
    });

    await base44.agents.addMessage(conversation, {
      role: 'user',
      content: `Reescreve este roteiro corrigindo TODOS os pontos fracos identificados abaixo. Mantém o estilo e a essência do autor, mas aplica todas as melhorias necessárias para ${funnelContext}.

PONTOS FRACOS IDENTIFICADOS:
${resultado.pontos_fracos.map((p, i) => `${i + 1}. ${p}`).join('\n')}

SUGESTÕES DE MELHORIA:
${resultado.sugestoes.map((s, i) => `${i + 1}. ${s}`).join('\n')}

ROTEIRO ORIGINAL:
${roteiroOriginal.text}

Responde APENAS com o roteiro reescrito, sem introduções, sem explicações, sem markdown extra. Apenas o texto do roteiro otimizado.`
    });

    let resposta = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const conv = await base44.agents.getConversation(conversation.id);
      const lastMsg = conv.messages?.[conv.messages.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg?.content) {
        resposta = lastMsg.content;
        break;
      }
    }

    if (!resposta) throw new Error('O agente não respondeu a tempo.');
    setRoteiroOtimizado(resposta);
    setOtimizando(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <AnimatePresence mode="wait">
        <motion.div
          key={funnel}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`border rounded-xl px-5 py-3 flex items-center gap-3 ${config.bgClass} ${config.borderClass}`}
        >
          <FunnelIcon className={`w-4 h-4 ${config.colorClass}`} />
          <p className={`text-xs font-bold font-mono uppercase tracking-widest ${config.colorClass}`}>{config.label}</p>
          <span className="text-xs text-muted-foreground">·</span>
          <p className="text-xs text-muted-foreground">
            Análise otimizada para {funnel === 'top' ? 'viralização, emoção e alcance' : 'conversão, autoridade e geração de leads'}
          </p>
        </motion.div>
      </AnimatePresence>

      {analisesMes !== null && (
        <div className={`border rounded-xl px-5 py-3 flex items-center gap-3 ${
          analisesMes <= 0 ? 'bg-destructive/10 border-destructive/30' :
          analisesMes <= 5 ? 'bg-highlight/10 border-highlight/30' :
          'bg-primary/10 border-primary/30'
        }`}>
          <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
            analisesMes <= 0 ? 'text-destructive' :
            analisesMes <= 5 ? 'text-highlight' :
            'text-primary'
          }`} />
          <p className={`text-xs font-semibold ${
            analisesMes <= 0 ? 'text-destructive' :
            analisesMes <= 5 ? 'text-highlight' :
            'text-primary'
          }`}>
            {analisesMes <= 0 
              ? '⚠️ Sem análises disponíveis este mês'
              : `${analisesMes} análise${analisesMes !== 1 ? 's' : ''} disponível${analisesMes !== 1 ? 's' : ''} este mês`
            }
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <RoteiroInput onAnalyze={handleAnalyze} loading={loading} />

        <div>
          {!resultado && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-xl">
              <div className="text-center px-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Pronto para analisar</p>
                <p className="text-xs text-muted-foreground">Cole seu roteiro ao lado e clique em "Analisar Roteiro"</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] border border-border rounded-xl bg-card">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Analisando roteiro...</p>
                  <p className="text-xs text-muted-foreground mt-1">A IA está processando seu conteúdo</p>
                </div>
              </div>
            </div>
          )}

          {resultado && (
            <>
              <RoteiroResultado
                resultado={resultado}
                roteiroOriginal={roteiroOriginal}
                onOtimizar={handleOtimizar}
                otimizando={otimizando}
                onGerarSugestoes={handleGerarSugestoes}
                gerandoSugestoes={gerandoSugestoes}
                sugestoesTitulo={sugestoesTitulo}
              />
              {(otimizando || roteiroOtimizado) && (
                <div className="mt-5">
                  <RoteiroOtimizado texto={roteiroOtimizado} loading={otimizando} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}