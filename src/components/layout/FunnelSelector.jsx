import { motion, AnimatePresence } from 'framer-motion';
import { Target, Rocket } from 'lucide-react';
import { useFunnel } from '@/lib/FunnelContext';

export default function FunnelSelector() {
  const { funnel, setFunnel } = useFunnel();

  return (
    <div className="flex items-center gap-1 bg-secondary/60 border border-border rounded-xl p-1">
      <button
        onClick={() => setFunnel('top')}
        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          funnel === 'top'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Rocket className="w-3 h-3" />
        <span className="hidden sm:inline">TOPO DE FUNIL</span>
        <span className="sm:hidden">TOPO</span>
      </button>
      <button
        onClick={() => setFunnel('bottom')}
        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          funnel === 'bottom'
            ? 'bg-highlight text-highlight-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Target className="w-3 h-3" />
        <span className="hidden sm:inline">FUNDO DE FUNIL</span>
        <span className="sm:hidden">FUNDO</span>
      </button>
    </div>
  );
}