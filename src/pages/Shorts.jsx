import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Rocket, Target, Sparkles, Zap } from 'lucide-react';
import { useFunnel } from '@/lib/FunnelContext';

const shortsFocusConfig = {
  top: {
    title: 'Auto Shorts — Topo de Funil',
    description: 'A IA detecta cortes emocionais, momentos de curiosidade e picos de entretenimento para maximizar viralização.',
    cuts: [
      { label: 'Gancho Emocional', time: '0:12 – 0:28', score: 96, tag: 'VIRAL' },
      { label: 'Momento de Surpresa', time: '1:45 – 2:03', score: 92, tag: 'VIRAL' },
      { label: 'Curiosidade Máxima', time: '3:18 – 3:41', score: 88, tag: 'TRENDING' },
    ],
    tipColor: 'text-primary',
    tip: 'Cortes selecionados para maximizar curiosidade, emoção e potencial de viralização.',
  },
  bottom: {
    title: 'Auto Shorts — Fundo de Funil',
    description: 'A IA detecta cortes educativos, momentos de autoridade e informações de alto impacto para conversão.',
    cuts: [
      { label: 'Explicação-Chave', time: '0:34 – 0:55', score: 94, tag: 'CONVERSÃO' },
      { label: 'Prova de Autoridade', time: '2:10 – 2:38', score: 90, tag: 'CONFIANÇA' },
      { label: 'CTA Principal', time: '4:02 – 4:22', score: 87, tag: 'LEAD' },
    ],
    tipColor: 'text-highlight',
    tip: 'Cortes selecionados para gerar autoridade, educar e converter espectadores em leads.',
  },
};

export default function Shorts() {
  const { funnel, config } = useFunnel();
  const data = shortsFocusConfig[funnel];
  const Icon = funnel === 'top' ? Rocket : Target;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Funnel Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={funnel}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`border rounded-xl px-5 py-4 flex items-center justify-between ${config.bgClass} ${config.borderClass}`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${config.colorClass}`} />
            <div>
              <p className={`text-xs font-bold font-mono uppercase tracking-widest ${config.colorClass}`}>{config.label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{data.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">{data.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 max-w-xs hidden md:flex">
            {config.shortsFoco.map((f) => (
              <span key={f} className={`text-[10px] font-medium px-2 py-1 rounded-md border ${config.badgeClass}`}>{f}</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cuts */}
      <AnimatePresence mode="wait">
        <motion.div
          key={funnel + '-cuts'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <Scissors className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Cortes Detectados pela IA</h3>
            <span className="text-xs text-muted-foreground ml-auto">iPhone 16 Pro vs Samsung S25 Ultra</span>
          </div>
          <div className="divide-y divide-border">
            {data.cuts.map((cut, i) => (
              <motion.div
                key={cut.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold font-mono text-primary">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{cut.label}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{cut.time}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded font-mono border ${config.badgeClass}`}>{cut.tag}</span>
                <div className={`text-sm font-bold font-mono ${cut.score >= 90 ? 'score-high' : 'score-mid'}`}>{cut.score}</div>
              </motion.div>
            ))}
          </div>
          <div className={`px-5 py-3 border-t border-border flex items-center gap-2 ${config.bgClass}`}>
            <Zap className={`w-3.5 h-3.5 flex-shrink-0 ${config.colorClass}`} />
            <p className={`text-xs font-medium ${config.colorClass}`}>{data.tip}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Coming Soon note */}
      <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-xl">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Upload de vídeo e processamento completo em breve</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse" />
            <span className="text-xs font-medium text-primary">Em desenvolvimento</span>
          </div>
        </div>
      </div>
    </div>
  );
}