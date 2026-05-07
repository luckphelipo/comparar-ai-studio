import ComingSoon from '../components/ui/ComingSoon';
import { ImageIcon } from 'lucide-react';

export default function Thumbnails() {
  return (
    <ComingSoon
      title="Thumb Battle"
      description="Gere múltiplas variações de thumbnail com IA e compare qual tem maior potencial de CTR."
      icon={ImageIcon}
    />
  );
}