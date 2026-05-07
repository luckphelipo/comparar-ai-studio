import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ComingSoon({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-blue">
          {Icon && <Icon className="w-9 h-9 text-primary" />}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-highlight/20 border border-highlight/30 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-highlight" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">{description}</p>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse-glow" />
          <span className="text-xs font-medium text-primary">Em desenvolvimento</span>
        </div>
      </motion.div>
    </div>
  );
}