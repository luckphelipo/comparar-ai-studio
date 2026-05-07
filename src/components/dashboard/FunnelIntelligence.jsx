import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, TrendingUp, Zap, Heart, Eye, MousePointerClick, Brain } from 'lucide-react';
import { useFunnel } from '@/lib/FunnelContext';

const metrics = {
  top: [
    { label: 'Potencial Viral', value: '94%', icon: Rocket, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Potencial de Retenção', value: '89%', icon: Eye, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Emoção Principal', value: 'Curiosidade', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Objetivo Estratégico', value: 'Atrair Audiência', icon: TrendingUp, color: 'text-highlight', bg: 'bg-highlight/10' },
  ],
  bottom: [
    { label: 'Potencial de Conversão', value: '87%', icon: MousePointerClick, color: 'text-highlight', bg: 'bg-highlight/10' },
    { label: 'Autoridade Percebida', value: '91%', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Emoção Principal', value: 'Confiança', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Objetivo Estratégico', value: 'Gerar Leads', icon: Target, color: 'text-green-400', bg: 'bg-green-500/10' },
  ],
};

export default function FunnelIntelligence() {
  const { funnel, config } = useFunnel();
  const items = metrics[funnel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={`border rounded-xl p-5 ${config.bgClass} ${config.borderClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <div>
            <p className={`text-xs font-bold font-mono uppercase tracking-widest ${config.colorClass}`}>
              Inteligência Estratégica
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{config.description}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${config.badgeClass}`}>
          {config.label}
        </div>
      </div>

      {/* Metrics Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={funnel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card/60 border border-border rounded-lg p-3"
              >
                <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Focus Tags */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Focos da IA</p>
        <div className="flex flex-wrap gap-1.5">
          {config.foco.map((f) => (
            <span
              key={f}
              className={`text-[10px] font-medium px-2 py-1 rounded-md border ${config.badgeClass}`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Objetivo */}
      <div className={`mt-3 p-2.5 rounded-lg border ${config.bgClass} ${config.borderClass} flex items-center gap-2`}>
        <Zap className={`w-3.5 h-3.5 flex-shrink-0 ${config.colorClass}`} />
        <p className={`text-xs font-semibold ${config.colorClass}`}>Objetivo: {config.objetivo}</p>
      </div>
    </motion.div>
  );
}