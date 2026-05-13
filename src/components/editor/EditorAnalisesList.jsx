import { motion, AnimatePresence } from 'framer-motion';
import { History, Rocket, Target, ArrowRight } from 'lucide-react';

const scoreColor = (s) => s >= 85 ? 'text-green-500' : s >= 65 ? 'text-highlight' : 'text-destructive';
const funnelIcon = (f) => f === 'topo' ? Rocket : Target;
const funnelLabel = (f) => f === 'topo' ? 'Topo' : 'Fundo';

export default function EditorAnalisesList({ analises, loading, onSelect }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xs text-muted-foreground">Carregando análises...</div>
      </div>
    );
  }

  if (analises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
        <History className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">Nenhuma análise realizada ainda</p>
        <p className="text-xs text-muted-foreground mt-1">Cole um roteiro ou faça uma análise primeiro</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <History className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Selecione um Roteiro</h3>
      </div>

      <AnimatePresence mode="popLayout">
        {analises.map((analise, idx) => {
          const FunnelIcon = funnelIcon(analise.funil);
          return (
            <motion.button
              key={analise.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelect(analise)}
              className="w-full group bg-card border border-border rounded-lg p-4 hover:border-primary/30 hover:bg-secondary/50 transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{analise.titulo}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FunnelIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground font-semibold">
                        {funnelLabel(analise.funil)} de Funil
                      </span>
                    </div>
                    <span className={`text-xs font-bold font-mono ${scoreColor(analise.score_geral)}`}>
                      Score: {analise.score_geral}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}