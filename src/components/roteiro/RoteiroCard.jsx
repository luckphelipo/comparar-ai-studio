import { motion } from 'framer-motion';
import { Clock, User, ChevronRight } from 'lucide-react';
import StatusBadge, { statusConfig } from './StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function RoteiroCard({ roteiro, index, onUpdate }) {
  const handleStatusChange = async (newStatus) => {
    await base44.entities.Roteiro.update(roteiro.id, { status: newStatus });
    onUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200 card-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={roteiro.status} />
            {roteiro.categoria && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-mono uppercase">
                {roteiro.categoria}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground truncate">{roteiro.titulo}</h3>
          {roteiro.descricao && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{roteiro.descricao}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            {roteiro.editor && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                {roteiro.editor}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(roteiro.created_date).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {roteiro.score && (
            <div className={`text-lg font-bold font-mono ${
              roteiro.score >= 90 ? 'score-high' : roteiro.score >= 70 ? 'score-mid' : 'score-low'
            }`}>
              {roteiro.score}
            </div>
          )}
          <Select value={roteiro.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-44 h-8 text-xs border-border bg-secondary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="em_revisao">Em Revisão</SelectItem>
              <SelectItem value="pronto_producao">Pronto para Produção</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}