import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { Tournament, TournamentMatch, BeltType, WeightCategory, ModalityType } from '../../types';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  Trophy, 
  Plus, 
  Calendar, 
  MapPin, 
  Scale, 
  Users, 
  CheckCircle, 
  Swords, 
  Flame, 
  Crown,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';

export const TournamentsView: React.FC = () => {
  const { 
    tournaments, 
    addTournament, 
    updateTournamentBracket, 
    registerTournamentAthlete,
    athletes 
  } = useGaditas();

  const [selectedTournament, setSelectedTournament] = useState<Tournament>(tournaments[0] || null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedAthleteToRegister, setSelectedAthleteToRegister] = useState<string>(athletes[0]?.id || '');

  // Form states
  const [name, setName] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('Ginásio do Pacaembu');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [organizer, setOrganizer] = useState('Mestre Davi Gaditas');
  const [modality, setModality] = useState<ModalityType>('Jiu-Jitsu');

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    addTournament({
      name,
      date,
      time,
      location,
      city,
      state,
      organizer,
      modality,
      categories: ['Leve (-76kg)', 'Médio (-82kg)', 'Pesado (-94kg)', 'Absoluto'],
      status: 'Inscrições Abertas'
    });
    setShowNewModal(false);
  };

  const handleRegisterAthlete = () => {
    if (!selectedTournament || !selectedAthleteToRegister) return;
    registerTournamentAthlete(selectedTournament.id, selectedAthleteToRegister);
    setShowRegisterModal(false);
  };

  const activeTournament = tournaments.find(t => t.id === selectedTournament?.id) || tournaments[0];

  const quarters = activeTournament?.brackets?.filter(b => b.round === 'Quartas') || [];
  const semis = activeTournament?.brackets?.filter(b => b.round === 'Semifinal') || [];
  const finals = activeTournament?.brackets?.filter(b => b.round === 'Final') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Gestão de Torneios & Chaves de Luta
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Inscrições, controle de pesagem na balança, chaveamento interativo e premiação oficial.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Campeonato</span>
        </button>
      </div>

      {/* Tournaments Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tournaments.map(t => {
          const isSelected = activeTournament?.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTournament(t)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-neutral-800 text-amber-400 border-amber-500/40 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 font-mono">
                {t.date}
              </span>
            </button>
          );
        })}
      </div>

      {activeTournament && (
        <div className="space-y-6">
          {/* Tournament Overview Card */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {activeTournament.status}
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-400 font-medium">Modalidade: {activeTournament.modality}</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-100 font-cinzel">
                {activeTournament.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{activeTournament.date} às {activeTournament.time}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{activeTournament.location}, {activeTournament.city} - {activeTournament.state}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>Organizador: {activeTournament.organizer}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Inscrever Atleta</span>
              </button>

              {activeTournament.championName && (
                <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <div className="text-left text-xs">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Campeão</span>
                    <span className="font-bold">{activeTournament.championName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Chaves do Torneio (Quartas -> Semifinal -> Final) */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-neutral-100 font-cinzel">
                  Chaveamento Oficial do Torneio
                </h3>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Clique no botão de vitória do atleta para avançar na chave e computar pontos automáticos (+50 pts Campeão).
              </p>
            </div>

            {/* Visual Bracket Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Column 1: Quartas de Final */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <span>01. Quartas de Final</span>
                </div>

                {quarters.map((match, idx) => (
                  <div key={match.id} className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Luta #{match.matchNumber}</span>
                      {match.method && <span className="text-amber-400 font-mono">{match.method}</span>}
                    </div>

                    {/* Fighter 1 */}
                    <div className={`p-2 rounded-lg flex items-center justify-between gap-2 border transition-colors ${
                      match.athlete1?.isWinner 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-neutral-100' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}>
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" title="Corner Azul" />
                        <span className="font-semibold text-xs truncate">{match.athlete1?.name || 'Aguardando'}</span>
                      </div>
                      
                      {!match.winnerId && match.athlete1 && (
                        <button
                          type="button"
                          onClick={() => updateTournamentBracket(activeTournament.id, match.id, match.athlete1!.id, 'Finalização')}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold"
                        >
                          Vitória
                        </button>
                      )}
                    </div>

                    {/* Fighter 2 */}
                    <div className={`p-2 rounded-lg flex items-center justify-between gap-2 border transition-colors ${
                      match.athlete2?.isWinner 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-neutral-100' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}>
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" title="Corner Vermelho" />
                        <span className="font-semibold text-xs truncate">{match.athlete2?.name || 'Aguardando'}</span>
                      </div>

                      {!match.winnerId && match.athlete2 && (
                        <button
                          type="button"
                          onClick={() => updateTournamentBracket(activeTournament.id, match.id, match.athlete2!.id, 'Pontos')}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold"
                        >
                          Vitória
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 2: Semifinal */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <span>02. Semifinal</span>
                </div>

                {semis.map((match) => (
                  <div key={match.id} className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Luta #{match.matchNumber}</span>
                      {match.method && <span className="text-amber-400 font-mono">{match.method}</span>}
                    </div>

                    <div className={`p-2.5 rounded-lg flex items-center justify-between gap-2 border ${
                      match.athlete1?.isWinner 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-neutral-100' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}>
                      <span className="font-semibold text-xs truncate">{match.athlete1?.name || 'Vencedor Q1'}</span>
                      {!match.winnerId && match.athlete1 && (
                        <button
                          type="button"
                          onClick={() => updateTournamentBracket(activeTournament.id, match.id, match.athlete1!.id, 'Finalização (Mata-leão)')}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold"
                        >
                          Vitória
                        </button>
                      )}
                    </div>

                    <div className={`p-2.5 rounded-lg flex items-center justify-between gap-2 border ${
                      match.athlete2?.isWinner 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-neutral-100' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}>
                      <span className="font-semibold text-xs truncate">{match.athlete2?.name || 'Vencedor Q2'}</span>
                      {!match.winnerId && match.athlete2 && (
                        <button
                          type="button"
                          onClick={() => updateTournamentBracket(activeTournament.id, match.id, match.athlete2!.id, 'Pontos')}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold"
                        >
                          Vitória
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 3: Grande Final */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>03. Grande Final (Disputa de Ouro)</span>
                </div>

                {finals.map((match) => (
                  <div key={match.id} className="p-4 rounded-xl bg-gradient-to-b from-amber-950/30 to-neutral-950 border-2 border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                      <span>DISPUTA DO TÍTULO</span>
                      {match.winnerId && <span className="font-mono">{match.method}</span>}
                    </div>

                    <div className={`p-3 rounded-lg flex items-center justify-between gap-2 border ${
                      match.athlete1?.isWinner 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-xs">{match.athlete1?.name || 'Finalista 1'}</span>
                      </div>
                      {!match.winnerId && match.athlete1 && (
                        <button
                          type="button"
                          onClick={() => updateTournamentBracket(activeTournament.id, match.id, match.athlete1!.id, 'Finalização (Triângulo)')}
                          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black shadow-sm"
                        >
                          Declarar Campeão
                        </button>
                      )}
                    </div>

                    <div className={`p-3 rounded-lg flex items-center justify-between gap-2 border ${
                      match.athlete2?.isWinner 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="font-bold text-xs">{match.athlete2?.name || 'Finalista 2'}</span>
                      </div>
                      {!match.winnerId && match.athlete2 && (
                        <button
                          type="button"
                          onClick={() => updateTournamentBracket(activeTournament.id, match.id, match.athlete2!.id, 'Finalização')}
                          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black shadow-sm"
                        >
                          Declarar Campeão
                        </button>
                      )}
                    </div>

                    {activeTournament.championName && (
                      <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/50 text-center">
                        <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Consagrado Campeão</span>
                        <p className="font-black text-sm text-neutral-100 font-cinzel mt-0.5">
                          🏆 {activeTournament.championName}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          +50 Pontos no Ranking Geral Gaditas
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Pesagem e Atletas Inscritos */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-neutral-100 font-cinzel">
                  Controle de Pesagem Oficial
                </h3>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {activeTournament.registeredAthletes.length} atletas verificados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeTournament.registeredAthletes.map(ra => (
                <div key={ra.athleteId} className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-200 block">{ra.name}</span>
                    <span className="text-[11px] text-neutral-400">{ra.category} · Faixa {ra.belt}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-1 rounded">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Peso OK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Torneio */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Cadastrar Novo Torneio</h2>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Nome do Torneio</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Taça Gaditas Open SP 2026"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">Horário de Início</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Local / Ginásio</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">Organizador</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Criar Campeonato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inscrever Atleta */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Inscrever Atleta no Torneio</h2>
              <button type="button" onClick={() => setShowRegisterModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">Selecione o Atleta</label>
              <select
                value={selectedAthleteToRegister}
                onChange={(e) => setSelectedAthleteToRegister(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
              >
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.category} - Faixa {a.belt})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRegisterAthlete}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
              >
                Confirmar Inscrição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
