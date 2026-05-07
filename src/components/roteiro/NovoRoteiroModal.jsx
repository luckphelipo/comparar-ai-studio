import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function NovoRoteiroModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ titulo: '', descricao: '', editor: '', categoria: 'review', status: 'em_revisao' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.titulo) return;
    setLoading(true);
    await base44.entities.Roteiro.create(form);
    setLoading(false);
    onSaved();
    onClose();
    setForm({ titulo: '', descricao: '', editor: '', categoria: 'review', status: 'em_revisao' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Novo Roteiro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Título *</label>
            <Input
              placeholder="Ex: iPhone 16 Pro vs Samsung S25"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="bg-secondary/40 border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Descrição</label>
            <Textarea
              placeholder="Resumo do conteúdo..."
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="bg-secondary/40 border-border resize-none h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Editor</label>
              <Input
                placeholder="Nome do editor"
                value={form.editor}
                onChange={(e) => setForm({ ...form, editor: e.target.value })}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Categoria</label>
              <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                <SelectTrigger className="bg-secondary/40 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="comparativo">Comparativo</SelectItem>
                  <SelectItem value="vlog">Vlog</SelectItem>
                  <SelectItem value="shorts">Shorts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Status Inicial</label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger className="bg-secondary/40 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="em_revisao">Em Revisão</SelectItem>
                <SelectItem value="pronto_producao">Pronto para Produção</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="border-border">Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.titulo || loading} className="bg-primary text-primary-foreground">
              {loading ? 'Salvando...' : 'Criar Roteiro'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}