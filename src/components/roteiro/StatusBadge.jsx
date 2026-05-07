const statusConfig = {
  em_revisao: {
    label: 'Em Revisão',
    className: 'bg-highlight/15 text-highlight border-highlight/30',
    dot: 'bg-highlight',
  },
  pronto_producao: {
    label: 'Pronto para Produção',
    className: 'bg-primary/15 text-primary border-primary/30',
    dot: 'bg-primary',
  },
  finalizado: {
    label: 'Finalizado',
    className: 'bg-green-500/15 text-green-400 border-green-500/30',
    dot: 'bg-green-400',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.em_revisao;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export { statusConfig };