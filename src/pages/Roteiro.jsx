import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useFunnel } from '@/lib/FunnelContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target } from 'lucide-react';
import RoteiroInput from '../components/roteiro/RoteiroInput';
import RoteiroResultado from '../components/roteiro/RoteiroResultado';

export default function Roteiro() {
  const { funnel, config } = useFunnel();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const FunnelIcon = funnel === 'top' ? Rocket : Target;

  const handleAnalyze = async ({ title, text }) => {
    setLoading(true);
    setResultado(null);

    const funnelContext = funnel === 'top'
      ? 'Topo de Funil (viralização, alcance, emoção, curiosidade)'
      : 'Fundo de Funil (conversão, autoridade, confiança, leads)';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em roteiros para YouTube com foco em ${funnelContext}.

Analise o seguinte roteiro e retorne uma análise detalhada:

TÍTULO: ${title || 'Não informado'}
ROTEIRO:
${text}

Analise considerando a estratégia de ${funnelContext}. Seja preciso e detalhado.`,
      response_json_schema: {
        type: 'object',
        properties: {
          score_geral: { type: 'number', description: 'Score geral de 0 a 100' },
          scores: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                value: { type: 'number' }
              }
            },
            description: 'Array com scores de: Gancho, Ritmo, Retenção, CTA, Clareza, Potencial Viral'
          },
          resumo: { type: 'string', description: 'Resumo analítico em 2-3 frases' },
          gancho: { type: 'string', description: 'Trecho do gancho principal detectado (primeiros segundos)' },
          cta: { type: 'string', description: 'Trecho do CTA principal detectado' },
          pontos_fortes: { type: 'array', items: { type: 'string' }, description: '3-4 pontos fortes do roteiro' },
          pontos_fracos: { type: 'array', items: { type: 'string' }, description: '3-4 pontos a melhorar' },
          sugestoes: { type: 'array', items: { type: 'string' }, description: '3-5 sugestões concretas de melhoria' }
        }
      }
    });

    setResultado({ ...result, title });
    setLoading(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Funnel Banner */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left — Input */}
        <RoteiroInput onAnalyze={handleAnalyze} loading={loading} />

        {/* Right — Resultado */}
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

          {resultado && <RoteiroResultado resultado={resultado} />}
        </div>
      </div>
    </div>
  );
}