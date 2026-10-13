import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  Medal, 
  Trophy, 
  Crown, 
  Sparkles, 
  Filter, 
  Flame, 
  ChevronRight, 
  Info,
  Building2,
  MapPin
} from 'lucide-react';

export const RankingView: React.FC = () => {
  const { athletes, recalculateRanking, trainingCenters } = useGaditas();

  const [rankingScope, setRankingScope] = useState<'geral' | 'ct' | 'estadual' | 'nacional'>('geral');
  const [selectedCT, setSelectedCT] = useState<string>(trainingCenters[0]?.id || 'ct-matriz');

  // Filter based on scope
  const getRankedAthletes = () => {
    let list = [...athletes];
    if (rankingScope === 'ct') {
      list = list.filter(a => a.trainingCenterId === selectedCT);
    }
    // Sort descending by points
    return list.sort((a, b) => b.points - a.points);
  };

  const ranked = getRankedAthletes();
  const top1 = ranked[0];
  const top2 = ranked[1];
  const top3 = ranked[2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Medal className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Ranking Oficial Gaditas Team
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Atualização automática de pontuação com base nos combates e títulos oficiais.
          </p>
        </div>

        <button
          type="button"
          onClick={recalculateRanking}
          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recalcular Pontos</span>
        </button>
      </div>

      {/* Point Rules Box */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold mb-2 uppercase tracking-wider text-[11px]">
          <Info className="w-4 h-4" />
          <span>Critérios de Pontuação do Ranking</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">Vitória</span>
            <span className="font-bold text-amber-400 font-mono text-sm">+10 pts</span>
          </div>
          <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">Finalização</span>
            <span className="font-bold text-purple-400 font-mono text-sm">+15 pts</span>
          </div>
          <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">Nocaute (KO)</span>
            <span className="font-bold text-red-400 font-mono text-sm">+20 pts</span>
          </div>
          <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">Campeão</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">+50 pts</span>
          </div>
          <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">Vice-Campeão</span>
            <span className="font-bold text-amber-300 font-mono text-sm">+25 pts</span>
          </div>
        </div>
      </div>

      {/* Scope Segmented Control (Geral, CT, Estadual, Nacional) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setRankingScope('geral')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              rankingScope === 'geral' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Ranking Geral
          </button>
          <button
            type="button"
            onClick={() => setRankingScope('ct')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              rankingScope === 'ct' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Ranking CT
          </button>
          <button
            type="button"
            onClick={() => setRankingScope('estadual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              rankingScope === 'estadual' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Ranking Estadual SP
          </button>
          <button
            type="button"
            onClick={() => setRankingScope('nacional')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              rankingScope === 'nacional' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Ranking Nacional
          </button>
        </div>

        {rankingScope === 'ct' && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-neutral-500" />
            <select
              value={selectedCT}
              onChange={(e) => setSelectedCT(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden cursor-pointer"
            >
              {trainingCenters.map(tc => (
                <option key={tc.id} value={tc.id}>{tc.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Podium for Top 3 */}
      {ranked.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* 2nd Place */}
          {top2 && (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-2 order-2 sm:order-1 sm:mt-6">
              <div className="w-6 h-6 rounded-full bg-neutral-300 text-neutral-950 font-bold text-xs flex items-center justify-center">
                2º
              </div>
              <img 
                src={top2.photoUrl} 
                alt={top2.name} 
                className="w-16 h-16 rounded-xl object-cover border-2 border-neutral-400 shadow-md" 
              />
              <div>
                <h3 className="font-bold text-sm text-neutral-100">{top2.name}</h3>
                <p className="text-[11px] text-neutral-400">{top2.category}</p>
              </div>
              <BeltBadge belt={top2.belt} size="sm" />
              <div className="pt-2 text-xs font-mono font-bold text-neutral-300">
                {top2.points} Pontos
              </div>
            </div>
          )}

          {/* 1st Place - Gold Champion */}
          {top1 && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-900 border-2 border-amber-500/50 flex flex-col items-center text-center space-y-2 order-1 sm:order-2 shadow-xl">
              <Crown className="w-8 h-8 text-amber-400 animate-bounce" />
              <div className="w-7 h-7 rounded-full bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center shadow-md">
                1º
              </div>
              <img 
                src={top1.photoUrl} 
                alt={top1.name} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg" 
              />
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Líder do Ranking</span>
                <h3 className="font-extrabold text-base text-neutral-100">{top1.name}</h3>
                <p className="text-[11px] text-neutral-400">{top1.category} · {top1.trainingCenterName}</p>
              </div>
              <BeltBadge belt={top1.belt} size="sm" />
              <div className="pt-2 text-base font-mono font-extrabold text-amber-400">
                {top1.points} Pontos
              </div>
              <div className="text-[10px] text-neutral-500">
                {top1.victories}V · {top1.submissions} subs · {top1.titles} títulos
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-2 order-3 sm:mt-8">
              <div className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center justify-center">
                3º
              </div>
              <img 
                src={top3.photoUrl} 
                alt={top3.name} 
                className="w-16 h-16 rounded-xl object-cover border-2 border-amber-700 shadow-md" 
              />
              <div>
                <h3 className="font-bold text-sm text-neutral-100">{top3.name}</h3>
                <p className="text-[11px] text-neutral-400">{top3.category}</p>
              </div>
              <BeltBadge belt={top3.belt} size="sm" />
              <div className="pt-2 text-xs font-mono font-bold text-amber-600">
                {top3.points} Pontos
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Table List */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Tabela Completa de Classificação
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {ranked.length} atletas ranqueados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-medium border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Pos</th>
                <th className="py-3 px-4">Atleta</th>
                <th className="py-3 px-4">Graduação</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">CT / Unidade</th>
                <th className="py-3 px-4 text-center">V-D-E</th>
                <th className="py-3 px-4 text-center">Subs</th>
                <th className="py-3 px-4 text-center">KOs</th>
                <th className="py-3 px-4 text-center">Títulos</th>
                <th className="py-3 px-4 text-right">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {ranked.map((ath, idx) => (
                <tr key={ath.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold font-mono text-neutral-300">
                    <span className={`inline-block w-6 text-center ${
                      idx === 0 ? 'text-amber-400 font-extrabold' :
                      idx === 1 ? 'text-neutral-300' :
                      idx === 2 ? 'text-amber-600' : 'text-neutral-500'
                    }`}>
                      {idx + 1}º
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={ath.photoUrl} 
                        alt={ath.name} 
                        className="w-7 h-7 rounded-md object-cover bg-neutral-950" 
                      />
                      <span>{ath.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <BeltBadge belt={ath.belt} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">{ath.category}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{ath.trainingCenterName}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-medium">
                    <span className="text-emerald-400">{ath.victories}</span>-
                    <span className="text-red-400">{ath.defeats}</span>-
                    <span className="text-neutral-500">{ath.draws}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-purple-400">{ath.submissions}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-amber-500">{ath.knockouts}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-amber-400 font-bold">{ath.titles}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-amber-400 text-sm">
                    {ath.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
