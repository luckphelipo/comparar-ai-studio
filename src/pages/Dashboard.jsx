import { motion } from 'framer-motion';
import {
  FileText, Scissors, ImageIcon, Sparkles,
  Video, TrendingUp, Clock, Zap,
} from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import RecentProjects from '../components/dashboard/RecentProjects';
import ActivityChart from '../components/dashboard/ActivityChart';
import QuickActions from '../components/dashboard/QuickActions';
import ScoreRing from '../components/dashboard/ScoreRing';
import FunnelIntelligence from '../components/dashboard/FunnelIntelligence';
import { useFunnel } from '@/lib/FunnelContext';

const metrics = [
  { title: 'Roteiros Analisados', value: '148', change: '+12%', changeType: 'up', subtitle: 'este mês', icon: FileText, color: 'primary', delay: 0 },
  { title: 'Shorts Gerados', value: '374', change: '+28%', changeType: 'up', subtitle: 'este mês', icon: Scissors, color: 'highlight', delay: 0.08 },
  { title: 'Thumbnails Criadas', value: '92', change: '+5%', changeType: 'up', subtitle: 'este mês', icon: ImageIcon, color: 'purple', delay: 0.16 },
  { title: 'Score Médio IA', value: '89.4', change: '+3.2', changeType: 'up', subtitle: 'pontos de qualidade', icon: Sparkles, color: 'green', delay: 0.24 },
];

export default function Dashboard() {
  const { config, funnel } = useFunnel();
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl px-6 py-5 overflow-hidden glow-blue"
      >
        <div className="absolute right-0 top-0 w-64 h-full opacity-20">
          <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-2 right-20 w-20 h-20 rounded-full bg-highlight blur-2xl" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-highlight" />
              <span className="text-xs font-mono text-highlight uppercase tracking-widest">Studio Ativo</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">Bom dia, Comparar 👋</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Você tem <span className="text-primary font-semibold">3 roteiros</span> aguardando análise e <span className="text-highlight font-semibold">2 Shorts</span> prontos para revisão.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <ScoreRing score={94} label="Score Hoje" />
            <ScoreRing score={87} label="Média Semana" />
            <ScoreRing score={91} label="Melhor Vídeo" />
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Chart + Projects */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart />
          <RecentProjects />
        </div>

        {/* Right — Quick Actions + Funnel Intel + AI Insights */}
        <div className="space-y-6">
          <FunnelIntelligence />
          <QuickActions />

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Insights da IA</h3>
            </div>

            <div className="space-y-3">
              {[
                { text: 'Seu último roteiro tem potencial acima da média para viralizar.', score: 94, type: 'success' },
                { text: 'Recomendamos thumbnail com rosto para o vídeo do Tesla.', score: null, type: 'tip' },
                { text: 'Identificamos 5 cortes perfeitos para Shorts no último upload.', score: 5, type: 'info' },
              ].map((insight, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                  insight.type === 'success' ? 'bg-green-500/5 border-green-500/15' :
                  insight.type === 'tip' ? 'bg-highlight/5 border-highlight/15' :
                  'bg-primary/5 border-primary/15'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    insight.type === 'success' ? 'bg-green-400' :
                    insight.type === 'tip' ? 'bg-highlight' :
                    'bg-primary'
                  }`} />
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{insight.text}</p>
                  {insight.score && (
                    <span className={`text-xs font-bold font-mono flex-shrink-0 ${
                      insight.type === 'success' ? 'score-high' :
                      insight.type === 'tip' ? 'score-mid' :
                      'text-primary'
                    }`}>{insight.score}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Last Analyzed */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Último Roteiro</h3>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">iPhone 16 Pro vs Samsung S25 Ultra</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                  />
                </div>
                <span className="text-xs font-bold font-mono score-high">94</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: 'Gancho', val: 97 },
                  { label: 'Ritmo', val: 88 },
                  { label: 'CTA', val: 92 },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2 bg-secondary/40 rounded-lg">
                    <p className={`text-sm font-bold font-mono ${
                      s.val >= 90 ? 'score-high' : 'score-mid'
                    }`}>{s.val}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}