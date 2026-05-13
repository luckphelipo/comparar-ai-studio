import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useJobs } from '@/lib/JobContext';
import { useEffect } from 'react';

export const useJobProgress = (jobId) => {
  const { updateJob } = useJobs();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const result = await base44.entities.Job.filter({ job_id: jobId });
      return result[0];
    },
    refetchInterval: 2000, // Busca a cada 2 segundos
    refetchOnWindowFocus: true, // Re-busca quando a janela recebe foco
    enabled: !!jobId && jobId !== null,
    staleTime: 0 // Sempre considera dados como desatualizados
  });

  // Sincroniza o Job global com os dados do servidor
  useEffect(() => {
    if (job) {
      updateJob(jobId, {
        status: job.status,
        progresso: job.progresso,
        resultado: job.resultado,
        erro: job.erro
      });
    }
  }, [job, jobId, updateJob]);

  return { job, isLoading, error };
};