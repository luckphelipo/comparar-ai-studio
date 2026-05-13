import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, AlertCircle } from 'lucide-react';

export default function CreditosBanner() {
  const [creditos, setCreditos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreditos();
  }, []);

  const loadCreditos = async () => {
    try {
      const user = await base44.auth.me();
      setCreditos(user?.creditos || 0);
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCreditos = (newValue) => {
    setCreditos(newValue);
  };

  if (loading) return null;

  const sem = creditos <= 0;
  const baixo = creditos <= 3;

  return (
    <div className={`rounded-xl px-4 py-3 flex items-center gap-3 border ${
      sem ? 'bg-destructive/10 border-destructive/30' :
      baixo ? 'bg-highlight/10 border-highlight/30' :
      'bg-primary/10 border-primary/30'
    }`}>
      {sem ? (
        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
      ) : (
        <Zap className="w-4 h-4 text-primary flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${
          sem ? 'text-destructive' :
          baixo ? 'text-highlight' :
          'text-primary'
        }`}>
          {sem ? 'Créditos esgotados' : `${creditos} crédito${creditos !== 1 ? 's' : ''}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {sem ? 'Você precisa de créditos para gerar thumbnails.' : 'Cada geração usa 1 crédito.'}
        </p>
      </div>
    </div>
  );
}