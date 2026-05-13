import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const scoreColor = (s) => s >= 85 ? 'text-green-500' : s >= 65 ? 'text-highlight' : 'text-destructive';

export default function HistoricoRoteiros({ onSelectAnalise }) {
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAnalises();
  }, []);

  const carregarAnalises = async () => {
    try {
      const dados = await base44.entities.AnalisesRoteiro.list('-updated_date', 50);
      setAnalises(dados);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
      setAnalises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.AnalisesRoteiro.delete(id);
      setAnalises(analises.filter(a => a.id !== id));
      toast.success('Análise removida');
    } catch (error) {
      toast.error('Erro ao remover análise');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xs text-muted-foreground">Carregando histórico...</div>
      </div>
    );
  }

  if (analises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
        <History className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">Nenhuma análise realizada ainda</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <History className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Histórico de Análises</h3>
      </div>

      <AnimatePresence mode="popLayout">
        {analises.map((analise, idx) => (
          <motion.div
            key={analise.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-card border border-border rounded-lg p-3.5 hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => onSelectAnalise(analise)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{analise.titulo}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-semibold font-mono ${scoreColor(analise.score_geral)}`}>
                    {analise.score_geral}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground capitalize">{analise.funil} de funil</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(analise.updated_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-primary" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(analise.id);
                  }}
                  className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                  title="Deletar análise"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}