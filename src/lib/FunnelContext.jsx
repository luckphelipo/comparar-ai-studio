import { createContext, useContext, useState } from 'react';

const FunnelContext = createContext(null);

export const funnelConfig = {
  top: {
    label: 'TOPO DE FUNIL',
    shortLabel: 'Topo',
    color: 'primary',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    borderClass: 'border-primary/30',
    badgeClass: 'bg-primary/15 text-primary border-primary/30',
    objetivo: 'Atrair novos espectadores',
    foco: ['Curiosidade', 'Storytelling', 'Emoção', 'Retenção Alta', 'Ritmo Dinâmico'],
    thumbFoco: ['Emoção', 'Tensão', 'Curiosidade', 'Impacto Visual'],
    shortsFoco: ['Cortes Emocionais', 'Curiosidade', 'Entretenimento', 'Viralização'],
    insightLabel: 'Potencial Viral',
    icon: '🚀',
    description: 'Inspiração · Entretenimento · Storytelling · Viagens · Lifestyle',
    aiPersona: 'Você é um estrategista de crescimento no YouTube especializado em conteúdo de topo de funil. Priorize curiosidade, storytelling, emoção, retenção alta, ritmo dinâmico, hooks fortes e potencial viral. O objetivo é atrair novos espectadores e maximizar alcance orgânico.',
  },
  bottom: {
    label: 'FUNDO DE FUNIL',
    shortLabel: 'Fundo',
    color: 'highlight',
    colorClass: 'text-highlight',
    bgClass: 'bg-highlight/10',
    borderClass: 'border-highlight/30',
    badgeClass: 'bg-highlight/15 text-highlight border-highlight/30',
    objetivo: 'Gerar leads e vendas',
    foco: ['Clareza', 'Autoridade', 'Confiança', 'CTAs Fortes', 'Conversão'],
    thumbFoco: ['Autoridade', 'Clareza', 'Confiança', 'Informação Forte'],
    shortsFoco: ['Cortes Educativos', 'Autoridade', 'Informação Forte', 'Conversão'],
    insightLabel: 'Potencial de Conversão',
    icon: '🎯',
    description: 'Seguros · Documentação · Comparações · Educação · CTA · Conversão',
    aiPersona: 'Você é um estrategista de conversão no YouTube especializado em conteúdo de fundo de funil. Priorize clareza, autoridade, confiança, CTAs objetivos, retenção educativa e potencial de conversão. O objetivo é gerar leads e vendas.',
  },
};

export function FunnelProvider({ children }) {
  const [funnel, setFunnel] = useState('top');
  return (
    <FunnelContext.Provider value={{ funnel, setFunnel, config: funnelConfig[funnel] }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  return useContext(FunnelContext);
}