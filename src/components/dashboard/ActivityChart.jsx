import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { day: 'Seg', roteiros: 3, shorts: 5, thumbs: 2 },
  { day: 'Ter', roteiros: 5, shorts: 8, thumbs: 4 },
  { day: 'Qua', roteiros: 2, shorts: 6, thumbs: 3 },
  { day: 'Qui', roteiros: 7, shorts: 12, thumbs: 6 },
  { day: 'Sex', roteiros: 4, shorts: 9, thumbs: 5 },
  { day: 'Sáb', roteiros: 6, shorts: 14, thumbs: 7 },
  { day: 'Dom', roteiros: 8, shorts: 11, thumbs: 4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize">{p.name}:</span>
            <span className="text-foreground font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Atividade Semanal</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Análises realizadas por dia</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { color: '#3b82f6', label: 'Roteiros' },
            { color: '#f59e0b', label: 'Shorts' },
            { color: '#a855f7', label: 'Thumbs' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              <span className="text-[11px] text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="roteiros" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="shorts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="thumbs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 14%)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215 20% 45%)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(215 20% 45%)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="roteiros" stroke="#3b82f6" strokeWidth={2} fill="url(#roteiros)" />
          <Area type="monotone" dataKey="shorts" stroke="#f59e0b" strokeWidth={2} fill="url(#shorts)" />
          <Area type="monotone" dataKey="thumbs" stroke="#a855f7" strokeWidth={2} fill="url(#thumbs)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}