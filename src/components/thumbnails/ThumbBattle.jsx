import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Trophy, TrendingUp, Eye, MousePointerClick, BarChart2, RefreshCw, Sparkles } from 'lucide-react';

const battles = [
  {
    id: 1,
    title: 'iPhone 16 Pro vs Samsung S25',
    a: { label: 'Variação A', color: 'from-blue-900 to-slate-900', votes: 68, ctr: '8.2%', score: 94 },
    b: { label: 'Variação B', color: 'from-purple-900 to-slate-900', votes: 32, ctr: '5.1%', score: 78 },
    status: 'completed',
  },
  {
    id: 2,
    title: 'Melhor Notebook 2025',
    a: { label: 'Minimalista', color: 'from-slate-800 to-slate-900', votes: 45, ctr: '6.8%', score: 88 },
    b: { label: 'Bold Colors', color: 'from-orange-900 to-red-950', votes: 55, ctr: '7.4%', score: 91 },
    status: 'completed',
  },
];

const activeBattle = {
  title: 'Tesla Model 3 — Vale a Pena?',
  a: { label: 'Variação A — Rosto', color: 'from-blue-900 via-blue-800 to-slate-900' },
  b: { label: 'Variação B — Carro', color: 'from-slate-900 via-slate-700 to-blue-950' },
};

export default function ThumbBattle() {
  const [voted, setVoted] = useState(null);
  const [activeVotes, setActiveVotes] = useState({ a: 51, b: 49 });

  const handleVote = (side) => {
    if (voted) return;
    setVoted(side);
    setActiveVotes((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));
  };

  const total = activeVotes.a + activeVotes.b;
  const pctA = Math.round((activeVotes.a / total) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="space-y-6">
      {/* Active Battle */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Swords className="w-4 h-4 text-highlight" />
          <span className="text-xs font-mono text-highlight uppercase tracking-widest">Battle Ativa</span>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-5">{activeBattle.title}</h3>

        <div className="grid grid-cols-2 gap-4 mb-5">
          {(['a', 'b']).map((side) => {
            const data = activeBattle[side];
            const pct = side === 'a' ? pctA : pctB;
            const isWinning = pct > 50;
            return (
              <motion.button
                key={side}
                onClick={() => handleVote(side)}
                disabled={!!voted}
                whileHover={!voted ? { scale: 1.02 } : {}}
                whileTap={!voted ? { scale: 0.98 } : {}}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  voted === side
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : voted && voted !== side
                    ? 'border-border opacity-60'
                    : 'border-border hover:border-primary/50 cursor-pointer'
                }`}
              >
                {/* Mock thumb */}
                <div className={`w-full aspect-video bg-gradient-to-br ${data.color} flex items-center justify-center relative`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full bg-white blur-3xl" />
                  </div>
                  <p className="relative z-10 text-white text-xs font-bold px-4 text-center">{data.label}</p>
                  {!voted && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end justify-center pb-3">
                      <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100">Votar</span>
                    </div>
                  )}
                  {voted && (
                    <div className="absolute top-2 right-2">
                      {voted === side && <Trophy className="w-5 h-5 text-highlight drop-shadow-lg" />}
                    </div>
                  )}
                </div>

                {/* Stats */}
                {voted && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-card"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-foreground">{pct}% dos votos</span>
                      {isWinning && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-highlight/20 text-highlight font-mono">VENCENDO</span>
                      )}
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${isWinning ? 'bg-primary' : 'bg-muted-foreground'}`}
                      />
                    </div>
                  </motion.div>
                )}

                {!voted && (
                  <div className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Clique para votar</p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {!voted ? (
          <p className="text-xs text-center text-muted-foreground">
            <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
            Vote para ver a análise da IA sobre qual tem mais CTR
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-center"
          >
            <p className="text-xs text-primary font-medium">
              A IA concorda com você! A Variação A tem <span className="font-bold">37% mais CTR estimado</span> com base em padrões de alto desempenho.
            </p>
          </motion.div>
        )}
      </div>

      {/* Past Battles */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Battles Anteriores</h3>
        <div className="space-y-3">
          {battles.map((battle) => {
            const winner = battle.a.votes > battle.b.votes ? battle.a : battle.b;
            const totalVotes = battle.a.votes + battle.b.votes;
            const pctA = Math.round((battle.a.votes / totalVotes) * 100);
            const pctB = 100 - pctA;

            return (
              <div key={battle.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">{battle.title}</p>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-highlight" />
                    <span className="text-xs text-highlight font-medium">{winner.label}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { ...battle.a, label: `A — ${battle.a.label}`, pct: pctA },
                    { ...battle.b, label: `B — ${battle.b.label}`, pct: pctB },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-28 truncate">{item.label}</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.votes === Math.max(battle.a.votes, battle.b.votes) ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 w-20 justify-end">
                        <span className="text-xs font-mono text-muted-foreground">{item.pct}%</span>
                        <span className="text-xs font-bold text-highlight">{item.ctr}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}