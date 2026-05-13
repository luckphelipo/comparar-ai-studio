import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, Plus, Minus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function GerenciadorCreditos() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const list = await base44.entities.User.list('-created_date', 100);
      setUsuarios(list);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (user) => {
    setEditingId(user.id);
    setEditValues({
      ...editValues,
      [user.id]: {
        creditos: user.creditos || 0,
        analises: user.analises_restantes_mes || 20
      }
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async (userId) => {
    const values = editValues[userId];
    try {
      await base44.asServiceRole.entities.User.update(userId, {
        creditos: parseInt(values.creditos || 0),
        analises_restantes_mes: parseInt(values.analises || 20)
      });
      setUsuarios(prev =>
        prev.map(u => u.id === userId ? {
          ...u,
          creditos: parseInt(values.creditos || 0),
          analises_restantes_mes: parseInt(values.analises || 20)
        } : u)
      );
      setEditingId(null);
      toast.success('Créditos e análises atualizados com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar');
    }
  };

  const handleAddValue = (userId, field, amount) => {
    const current = editValues[userId]?.[field] ?? (field === 'creditos' ? usuarios.find(u => u.id === userId)?.creditos || 0 : usuarios.find(u => u.id === userId)?.analises_restantes_mes || 20);
    setEditValues({
      ...editValues,
      [userId]: { ...editValues[userId], [field]: Math.max(0, current + amount) }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Gerenciador de Créditos</h2>
          <p className="text-xs text-muted-foreground">Visualize e adicione créditos para cada membro da equipe</p>
        </div>
      </div>

      {/* Tabela */}
      {usuarios.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Usuário</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Créditos</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Análises</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {user.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-foreground">{user.full_name || 'Sem nome'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                       {editingId === user.id ? (
                         <div className="flex items-center gap-2">
                           <button
                             onClick={() => handleAddValue(user.id, 'creditos', -1)}
                             disabled={(editValues[user.id]?.creditos || 0) <= 0}
                             className="w-7 h-7 rounded bg-secondary/60 hover:bg-secondary disabled:opacity-50 flex items-center justify-center transition-colors"
                           >
                             <Minus className="w-3 h-3" />
                           </button>
                           <input
                             type="number"
                             min="0"
                             value={editValues[user.id]?.creditos || 0}
                             onChange={(e) => setEditValues({ ...editValues, [user.id]: { ...editValues[user.id], creditos: Math.max(0, parseInt(e.target.value) || 0) } })}
                             className="w-12 bg-secondary/40 border border-primary/30 rounded px-2 py-1 text-center font-mono font-semibold text-foreground focus:outline-none"
                           />
                           <button
                             onClick={() => handleAddValue(user.id, 'creditos', 1)}
                             className="w-7 h-7 rounded bg-secondary/60 hover:bg-secondary flex items-center justify-center transition-colors"
                           >
                             <Plus className="w-3 h-3" />
                           </button>
                         </div>
                       ) : (
                         <span className="font-mono font-semibold text-primary">{user.creditos || 0}</span>
                       )}
                     </td>
                     <td className="px-4 py-3">
                       {editingId === user.id ? (
                         <div className="flex items-center gap-2">
                           <button
                             onClick={() => handleAddValue(user.id, 'analises', -1)}
                             disabled={(editValues[user.id]?.analises || 0) <= 0}
                             className="w-7 h-7 rounded bg-secondary/60 hover:bg-secondary disabled:opacity-50 flex items-center justify-center transition-colors"
                           >
                             <Minus className="w-3 h-3" />
                           </button>
                           <input
                             type="number"
                             min="0"
                             max="20"
                             value={editValues[user.id]?.analises || 20}
                             onChange={(e) => setEditValues({ ...editValues, [user.id]: { ...editValues[user.id], analises: Math.max(0, Math.min(20, parseInt(e.target.value) || 0)) } })}
                             className="w-12 bg-secondary/40 border border-highlight/30 rounded px-2 py-1 text-center font-mono font-semibold text-foreground focus:outline-none"
                           />
                           <button
                             onClick={() => handleAddValue(user.id, 'analises', 1)}
                             disabled={(editValues[user.id]?.analises || 0) >= 20}
                             className="w-7 h-7 rounded bg-secondary/60 hover:bg-secondary disabled:opacity-50 flex items-center justify-center transition-colors"
                           >
                             <Plus className="w-3 h-3" />
                           </button>
                         </div>
                       ) : (
                         <span className="font-mono font-semibold text-highlight">{user.analises_restantes_mes || 20}</span>
                       )}
                     </td>
                     <td className="px-4 py-3 text-right">
                       {editingId === user.id ? (
                         <div className="flex items-center justify-end gap-2">
                           <button
                             onClick={() => handleSave(user.id)}
                             className="w-8 h-8 rounded bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors"
                             title="Salvar"
                           >
                             <Save className="w-4 h-4" />
                           </button>
                           <button
                             onClick={handleEditCancel}
                             className="w-8 h-8 rounded bg-destructive/20 hover:bg-destructive/30 text-destructive flex items-center justify-center transition-colors"
                             title="Cancelar"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       ) : (
                         <button
                           onClick={() => handleEditStart(user)}
                           className="px-3 py-1.5 rounded bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors"
                         >
                           Editar
                         </button>
                       )}
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 space-y-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Total de usuários:</span> {usuarios.length}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Créditos em circulação:</span> {usuarios.reduce((sum, u) => sum + (u.creditos || 0), 0)}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-highlight">Análises em circulação:</span> {usuarios.reduce((sum, u) => sum + (u.analises_restantes_mes || 20), 0)}
        </p>
      </div>
    </div>
  );
}