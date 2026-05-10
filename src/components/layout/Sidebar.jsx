import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Scissors,
  ImageIcon,
  Library,
  Wand2,
  Settings,
  Zap,
  ChevronRight,
  Palette,
  Users,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Análise de Roteiro', path: '/roteiro', badge: 'AI' },
  { icon: Scissors, label: 'Auto Shorts', path: '/shorts', badge: 'NEW' },
  { icon: ImageIcon, label: 'Thumb Battle', path: '/thumbnails' },
  { icon: Palette, label: 'Thumb Designer IA', path: '/thumb-designer', badge: 'AI' },
  { icon: Library, label: 'Biblioteca', path: '/biblioteca' },
  { icon: Users, label: 'Biblioteca de Pessoas', path: '/biblioteca-pessoas' },
  { icon: Wand2, label: 'Assistente de Editor', path: '/editor', badge: 'AI' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export default function Sidebar({ collapsed = false }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen sidebar-bg border-r border-border flex flex-col z-40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-blue">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-highlight animate-pulse-glow" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden"
          >
            <span className="text-sm font-bold tracking-tight text-foreground">Comparar</span>
            <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              AI Studio
            </span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative ${
                isActive
                  ? 'nav-item-active text-primary'
                  : 'text-muted-foreground nav-item-hover hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        item.badge === 'NEW'
                          ? 'bg-highlight/20 text-highlight'
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isActive && !collapsed && (
                <ChevronRight className="w-3 h-3 text-primary opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user section */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Comparar</p>
              <p className="text-[10px] text-muted-foreground truncate">Studio Pro</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          </div>
        </div>
      )}
    </aside>
  );
}