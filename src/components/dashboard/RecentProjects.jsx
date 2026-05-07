import { motion } from 'framer-motion';
import { FileText, Scissors, ImageIcon, Clock, ChevronRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'iPhone 16 Pro vs Samsung S25 Ultra',
    type: 'roteiro',
    status: 'analisado',
    score: 94,
    time: '2h atrás',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Melhor Notebook Custo-Benefício 2025',
    type: 'shorts',
    status: '3 shorts gerados',
    score: 87,
    time: '5h atrás',
    icon: Scissors,
  },
  {
    id: 3,
    title: 'Tesla Model 3 — Vale a Pena?',
    type: 'thumbnail',
    status: '6 variações',
    score: 91,
    time: '1d atrás',
    icon: ImageIcon,
  },
  {
    id: 4,
    title: 'AirPods Pro 2 vs Sony WH-1000XM5',
    type: 'roteiro',
    status: 'em análise',
    score: null,
    time: '1d atrás',
    icon: FileText,
  },
];

const typeColors = {
  roteiro: 'text-primary bg-primary/15',
  shorts: 'text-highlight bg-highlight/15',
  thumbnail: 'text-purple-400 bg-purple-500/15',
};

const typeLabels = {
  roteiro: 'Roteiro',
  shorts: 'Shorts',
  thumbnail: 'Thumbnail',
};

export default function RecentProjects() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Projetos Recentes</h3>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          Ver todos <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="divide-y divide-border">
        {projects.map((project, i) => {
          const Icon = project.icon;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors cursor-pointer group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[project.type]}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {project.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${typeColors[project.type]}`}>
                    {typeLabels[project.type]}
                  </span>
                  <span className="text-xs text-muted-foreground">{project.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {project.score && (
                  <div className={`text-sm font-bold font-mono ${
                    project.score >= 90 ? 'score-high' : project.score >= 70 ? 'score-mid' : 'score-low'
                  }`}>
                    {project.score}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {project.time}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}