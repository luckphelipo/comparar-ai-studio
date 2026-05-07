import { Bell, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar({ title, subtitle }) {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-secondary/60 border border-border rounded-lg px-3 py-1.5 w-48 hover:border-primary/30 transition-colors cursor-text">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Buscar...</span>
          <kbd className="ml-auto text-[10px] text-muted-foreground bg-muted px-1 rounded font-mono">⌘K</kbd>
        </div>

        {/* AI Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
          <Sparkles className="w-3 h-3 text-primary animate-pulse-glow" />
          <span className="text-[11px] text-primary font-medium">AI Online</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg border border-border bg-secondary/40 flex items-center justify-center hover:border-primary/30 hover:bg-secondary transition-all">
          <Bell className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-highlight" />
        </button>
      </div>
    </header>
  );
}