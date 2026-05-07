import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, FileText, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoteiroCard from '../components/roteiro/RoteiroCard';
import NovoRoteiroModal from '../components/roteiro/NovoRoteiroModal';

const statusFilters = [
  { value: 'todos', label: 'Todos' },
  { value: 'em_revisao', label: 'Em Revisão' },
  { value: 'pronto_producao', label: 'Pronto para Produção' },
  { value: 'finalizado', label: 'Finalizado' },
];

export default function Roteiro() {
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const queryClient = useQueryClient();

  const { data: roteiros = [], isLoading } = useQuery({
    queryKey: ['roteiros'],
    queryFn: () => base44.entities.Roteiro.list('-created_date', 50),
  });

  const roteirosFiltrados = filtroStatus === 'todos'
    ? roteiros
    : roteiros.filter((r) => r.status === filtroStatus);

  const contadores = {
    em_revisao: roteiros.filter((r) => r.status === 'em_revisao').length,
    pronto_producao: roteiros.filter((r) => r.status === 'pronto_producao').length,
    finalizado: roteiros.filter((r) => r.status === 'finalizado').length,
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['roteiros'] });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Stat chips */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-highlight/15 text-highlight border border-highlight/30">
              {contadores.em_revisao} em revisão
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
              {contadores.pronto_producao} prontos
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
              {contadores.finalizado} finalizados
            </span>
          </div>
        </div>
        <Button onClick={() => setModalAberto(true)} className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          Novo Roteiro
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltroStatus(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filtroStatus === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : roteirosFiltrados.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Nenhum roteiro encontrado</p>
          <p className="text-xs text-muted-foreground mt-1">
            {filtroStatus === 'todos' ? 'Crie seu primeiro roteiro clicando em "Novo Roteiro".' : 'Nenhum roteiro com este status.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {roteirosFiltrados.map((roteiro, i) => (
            <RoteiroCard key={roteiro.id} roteiro={roteiro} index={i} onUpdate={refresh} />
          ))}
        </div>
      )}

      <NovoRoteiroModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSaved={refresh}
      />
    </div>
  );
}