import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function UltimasAnalises() {
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalises = async () => {
      const todasAnalises = await base44.entities.AnalisesRoteiro.list('-updated_date', 5);
      setAnalises(todasAnalises);
      setLoading(false);
    };
    fetchAnalises();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-5 animate-pulse h-56"
      />
    );
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'score-high';
    if (score >= 70) return 'score-mid';
    return 'score-low';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Últimas Análises de Roteiro</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {analises.length > 0 ? `${analises.length} análise${analises.length > 1 ? 's' : ''}` : 'Nenhuma'}
        </span>
      </div>

      {analises.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">Nenhuma análise realizada ainda</p>
      ) : (
        <div className="space-y-2">
          {analises.map((analise) => (
            <div
              key={analise.id}
              className="flex items-start justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {analise.titulo}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Funil: <span className="capitalize">{analise.funil}</span>
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className={`text-xs font-bold font-mono ${getScoreColor(analise.score_geral)}`}>
                  {analise.score_geral.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}