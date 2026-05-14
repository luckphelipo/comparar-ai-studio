import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function JobsStatus() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const allJobs = await base44.entities.Job.list('-updated_date', 10);
      setJobs(allJobs);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'processando':
        return <Clock className="w-4 h-4 text-primary animate-spin" />;
      case 'erro':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Zap className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-500/10 text-green-400';
      case 'processando':
        return 'bg-primary/10 text-primary';
      case 'erro':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-5 animate-pulse h-60"
      />
    );
  }

  const activeJobs = jobs.filter(j => j.status !== 'concluido' && j.status !== 'erro');
  const recentJobs = jobs.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Status de Processamento</h3>
        {activeJobs.length > 0 && (
          <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-xs font-bold text-primary">
            {activeJobs.length}
          </span>
        )}
      </div>

      {recentJobs.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Nenhum job registrado</p>
      ) : (
        <div className="space-y-2">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getStatusIcon(job.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {job.tipo === 'thumbnail' ? '🎨 Thumbnail' : '📄 Roteiro'}
                  </p>
                  {job.progresso && job.status === 'processando' && (
                    <div className="w-full h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${job.progresso}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}