import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap } from 'lucide-react';

export default function CreditosChart() {
  const [creditos, setCreditos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreditos = async () => {
      try {
        const user = await base44.auth.me();
        setCreditos(user?.creditos || 0);
      } catch (error) {
        setCreditos(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCreditos();
  }, []);

  const maxCreditos = 100;
  const percentage = (creditos / maxCreditos) * 100;

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-foreground">-</span>
          </div>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-primary/40 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-xs font-semibold text-foreground">{creditos}</span>
        </div>
        <span className={`text-[10px] font-mono ${
          creditos <= 0 ? 'text-destructive' :
          creditos <= 10 ? 'text-highlight' :
          'text-primary'
        }`}>
          {creditos <= 0 ? 'Sem créditos' : creditos <= 10 ? 'Baixo' : 'Ok'}
        </span>
      </div>
      <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}