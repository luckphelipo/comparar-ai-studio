import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Swords, Sparkles, Upload, Wand2, RefreshCw, Download, Star, TrendingUp, Eye, MousePointerClick } from 'lucide-react';
import ThumbGenerator from '../components/thumbnails/ThumbGenerator';
import ThumbBattle from '../components/thumbnails/ThumbBattle';

const tabs = [
  { id: 'generator', label: 'Gerador de Thumbs', icon: Wand2 },
  { id: 'battle', label: 'Thumb Battle', icon: Swords, badge: 'NOVO' },
];

export default function Thumbnails() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="space-y-6 animate-fade-in">
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
          {activeTab === 'generator' ? <ThumbGenerator /> : <ThumbBattle />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}