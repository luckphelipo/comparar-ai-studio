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
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-bold text-primary font-mono">{creditos}</p>
              <p className="text-[10px] text-muted-foreground">créditos</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Saldo de Créditos</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {creditos <= 0 
              ? '⚠️ Você está sem créditos'
              : creditos <= 10
              ? '⚠️ Saldo baixo'
              : '✓ Saldo disponível para gerar'
            }
          </p>
          <div className="mt-3 w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}