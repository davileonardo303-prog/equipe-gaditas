import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { ModalityType } from '../../types';
import { Swords, Plus, Play, Calendar, Trophy, X } from 'lucide-react';

export const FightsHistory: React.FC = () => {
  const { fights, athletes, tournaments, addFight } = useGaditas();
  const [showModal, setShowModal] = useState(false);

  const [tournamentName, setTournamentName] = useState(tournaments[0]?.name || 'Copa Gaditas Grand Prix 2026');
  const [blueId, setBlueId] = useState(athletes[0]?.id || '');
  const [redId, setRedId] = useState(athletes[1]?.id || '');
  const [winnerId, setWinnerId] = useState(athletes[0]?.id || '');
  const [category, setCategory] = useState('Leve (-76kg)');
  const [modality, setModality] = useState<ModalityType>('Jiu-Jitsu');
  const [method, setMethod] = useState<'Pontos' | 'Finalização' | 'Nocaute / TKO' | 'Decisão Unânime' | 'Desqualificação'>('Finalização');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blueAthlete = athletes.find(a => a.id === blueId);
    const redAthlete = athletes.find(a => a.id === redId);
    const winnerAthlete = athletes.find(a => a.id === winnerId);

    if (!blueAthlete || !redAthlete || !winnerAthlete) return;

    addFight({
      tournamentName,
      date: new Date().toISOString().split('T')[0],
      blueAthleteId: blueId,
      blueAthleteName: blueAthlete.name,
      redAthleteId: redId,
      redAthleteName: redAthlete.name,
      category,
      modality,
      winnerId,
      winnerName: winnerAthlete.name,
      method,
      videoUrl,
      notes
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Gestão de Lutas & Combates
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Histórico permanente de confrontos com vídeo, método da vitória e pontuação no cartel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Novo Combate</span>
        </button>
      </div>

      {/* Fights List */}
      <div className="space-y-3">
        {fights.map(fight => (
          <div 
            key={fight.id} 
            className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="font-semibold text-amber-400">{fight.tournamentName}</span>
                <span>·</span>
                <span>{fight.date}</span>
                <span>·</span>
                <span>{fight.category}</span>
                <span>·</span>
                <span>{fight.modality}</span>
              </div>

              {/* Blue vs Red */}
              <div className="flex items-center gap-3 text-sm">
                <div className={`flex items-center gap-2 font-bold ${fight.winnerId === fight.blueAthleteId ? 'text-amber-400' : 'text-neutral-400'}`}>
                  <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                  <span>{fight.blueAthleteName}</span>
                  {fight.winnerId === fight.blueAthleteId && (
                    <Trophy className="w-4 h-4 text-amber-400" />
                  )}
                </div>

                <span className="text-xs text-neutral-600 font-black">VS</span>

                <div className={`flex items-center gap-2 font-bold ${fight.winnerId === fight.redAthleteId ? 'text-amber-400' : 'text-neutral-400'}`}>
                  <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                  <span>{fight.redAthleteName}</span>
                  {fight.winnerId === fight.redAthleteId && (
                    <Trophy className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </div>

              {fight.notes && (
                <p className="text-xs text-neutral-400 italic">
                  "{fight.notes}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-950 text-neutral-200 border border-neutral-800 text-xs font-mono font-semibold">
                  {fight.method}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">
                  Vencedor: {fight.winnerName}
                </span>
              </div>

              {fight.videoUrl && (
                <a
                  href={fight.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 transition-colors"
                  title="Assistir Vídeo da Luta"
                >
                  <Play className="w-4 h-4 fill-red-400" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Novo Combate */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Registrar Combate / Luta</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Evento / Campeonato</label>
                <input
                  type="text"
                  required
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-blue-400 font-bold block mb-1">Corner Azul</label>
                  <select
                    value={blueId}
                    onChange={(e) => setBlueId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    {athletes.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-red-400 font-bold block mb-1">Corner Vermelho</label>
                  <select
                    value={redId}
                    onChange={(e) => setRedId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    {athletes.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amber-400 font-bold block mb-1">Vencedor</label>
                  <select
                    value={winnerId}
                    onChange={(e) => setWinnerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden font-bold"
                  >
                    <option value={blueId}>Corner Azul ({athletes.find(a => a.id === blueId)?.name})</option>
                    <option value={redId}>Corner Vermelho ({athletes.find(a => a.id === redId)?.name})</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Método da Vitória</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Finalização">Finalização (+15 pts)</option>
                    <option value="Nocaute / TKO">Nocaute / TKO (+20 pts)</option>
                    <option value="Pontos">Pontos (+10 pts)</option>
                    <option value="Decisão Unânime">Decisão Unânime (+10 pts)</option>
                    <option value="Desqualificação">Desqualificação</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Link do Vídeo da Luta (YouTube/Drive)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Observações da Luta</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Chave de braço ajustada aos 3 minutos do 1º round..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Registrar Resultado & Atualizar Ranking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
