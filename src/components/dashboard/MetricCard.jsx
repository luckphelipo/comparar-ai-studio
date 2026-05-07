import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, changeType = 'up', subtitle, icon: Icon, color = 'primary', delay = 0 }) {
  const isPositive = changeType === 'up';

  const colorMap = {
    primary: 'from-primary/10 to-primary/5 border-primary/20',
    highlight: 'from-highlight/10 to-highlight/5 border-highlight/20',
    green: 'from-green-500/10 to-green-500/5 border-green-500/20',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
  };

  const iconColorMap = {
    primary: 'text-primary bg-primary/15',
    highlight: 'text-highlight bg-highlight/15',
    green: 'text-green-400 bg-green-500/15',
    purple: 'text-purple-400 bg-purple-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5 card-hover cursor-default overflow-hidden`}
    >
      {/* Background glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl" />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'text-green-400 bg-green-500/10' : 'text-destructive bg-destructive/10'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-sm font-medium text-foreground/80 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}