import { useAuth } from '@/lib/AuthContext';
import GerenciadorCreditos from '../components/configuracoes/GerenciadorCreditos';

export default function Configuracoes() {
  const { user } = useAuth();

  // Apenas admins podem acessar
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center py-16 border border-border rounded-xl bg-card">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <GerenciadorCreditos />
    </div>
  );
}