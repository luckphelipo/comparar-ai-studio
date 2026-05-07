import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Scissors, ImageIcon, Wand2, ArrowRight } from 'lucide-react';

const actions = [
  {
    icon: FileText,
    label: 'Analisar Roteiro',
    description: 'Upload e análise com IA',
    path: '/roteiro',
    color: 'primary',
  },
  {
    icon: Scissors,
    label: 'Gerar Shorts',
    description: 'Detectar momentos virais',
    path: '/shorts',
    color: 'highlight',
  },
  {
    icon: ImageIcon,
    label: 'Criar Thumbnail',
    description: 'Gerar e comparar opções',
    path: '/thumbnails',
    color: 'purple',
  },
  {
    icon: Wand2,
    label: 'Assistente IA',
    description: 'Sugestões de edição',
    path: '/editor',
    color: 'green',
  },
];

const colorMap = {
  primary: { bg: 'bg-primary/10 group-hover:bg-primary/20', icon: 'text-primary', border: 'group-hover:border-primary/40' },
  highlight: { bg: 'bg-highlight/10 group-hover:bg-highlight/20', icon: 'text-highlight', border: 'group-hover:border-highlight/40' },
  purple: { bg: 'bg-purple-500/10 group-hover:bg-purple-500/20', icon: 'text-purple-400', border: 'group-hover:border-purple-500/40' },
  green: { bg: 'bg-green-500/10 group-hover:bg-green-500/20', icon: 'text-green-400', border: 'group-hover:border-green-500/40' },
};

export default function QuickActions() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          const colors = colorMap[action.color];
          return (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
            >
              <Link
                to={action.path}
                className={`group flex items-center gap-3 p-3.5 bg-card border border-border ${colors.border} rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${colors.bg}`}>
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{action.description}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}