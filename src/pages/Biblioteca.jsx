import ReferenciaGaleria from '../components/thumbdesigner/ReferenciaGaleria';
import { BookImage } from 'lucide-react';

export default function Biblioteca() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <BookImage className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">Galeria de Referências</h1>
          <p className="text-xs text-muted-foreground">Imagens usadas como base visual obrigatória pelo agente de thumbnails</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <ReferenciaGaleria alwaysExpanded />
      </div>
    </div>
  );
}