import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Swords, Wand2, Rocket, Target } from 'lucide-react';
import ThumbGenerator from '../components/thumbnails/ThumbGenerator';
import ThumbBattle from '../components/thumbnails/ThumbBattle';
import { useFunnel } from '@/lib/FunnelContext';

const tabs = [
  { id: 'generator', label: 'Gerador de Thumbs', icon: Wand2 },
  { id: 'battle', label: 'Thumb Battle', icon: Swords, badge: 'NOVO' },
];

export default function Thumbnails() {
  const [activeTab, setActiveTab] = useState('generator');
  const { funnel, config } = useFunnel();
  const FunnelIcon = funnel === 'top' ? Rocket : Target;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Funnel Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={funnel}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`border rounded-xl px-5 py-3 flex items-center justify-between ${config.bgClass} ${config.borderClass}`}
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className={`w-4 h-4 ${config.colorClass}`} />
            <p className={`text-xs font-bold font-mono uppercase tracking-widest ${config.colorClass}`}>{config.label}</p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs text-muted-foreground">Thumbnails adaptadas para {funnel === 'top' ? 'emoção e curiosidade' : 'autoridade e confiança'}</p>
          </div>
          <div className="hidden md:flex gap-1.5">
            {config.thumbFoco.map((f) => (
              <span key={f} className={`text-[10px] font-medium px-2 py-1 rounded-md border ${config.badgeClass}`}>{f}</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-highlight/20 text-highlight font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'generator' ? <ThumbGenerator funnel={funnel} config={config} /> : <ThumbBattle funnel={funnel} config={config} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}