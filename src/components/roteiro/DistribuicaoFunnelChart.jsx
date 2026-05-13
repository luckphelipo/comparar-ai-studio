import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function DistribuicaoFunnelChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analises = await base44.entities.AnalisesRoteiro.list();
        const topoCount = analises.filter(a => a.funil === 'topo').length;
        const fundoCount = analises.filter(a => a.funil === 'fundo').length;
        const total = topoCount + fundoCount;

        setData([
          { name: 'Topo de Funil', value: total > 0 ? topoCount : 0, color: '#3b82f6' },
          { name: 'Fundo de Funil', value: total > 0 ? fundoCount : 0, color: '#f59e0b' }
        ]);
      } catch (error) {
        setData([
          { name: 'Topo de Funil', value: 0, color: '#3b82f6' },
          { name: 'Fundo de Funil', value: 0, color: '#f59e0b' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Distribuição de Análises</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-xs text-muted-foreground">Carregando dados...</div>
        </div>
      ) : total === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Nenhuma análise realizada ainda</p>
            <p className="text-[10px] text-muted-foreground/70">Suas análises aparecerão aqui</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value} análise${value !== 1 ? 's' : ''}`}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: `1px solid hsl(var(--border))`, borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {data.map((item, idx) => (
              <div key={idx} className="bg-secondary/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold text-foreground">{item.name}</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {item.value}
                  <span className="text-xs text-muted-foreground font-normal ml-1">
                    ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}