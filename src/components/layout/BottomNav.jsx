import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Scissors, ImageIcon, Settings } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Roteiro', path: '/roteiro' },
  { icon: Scissors, label: 'Shorts', path: '/shorts' },
  { icon: ImageIcon, label: 'Thumbs', path: '/thumbnails' },
  { icon: Settings, label: 'Config', path: '/configuracoes' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden sidebar-bg border-t border-border flex items-center justify-around px-2 py-2 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}