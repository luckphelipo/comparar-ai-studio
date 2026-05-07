import ComingSoon from '../components/ui/ComingSoon';
import { Settings } from 'lucide-react';

export default function Configuracoes() {
  return (
    <ComingSoon
      title="Configurações"
      description="Gerencie suas integrações com YouTube, preferências de IA, notificações e configurações do estúdio."
      icon={Settings}
    />
  );
}