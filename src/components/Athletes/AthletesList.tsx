import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { Athlete, BeltType, ModalityType, WeightCategory } from '../../types';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  Flame, 
  Trophy, 
  Search, 
  Plus, 
  Filter, 
  Swords, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  Star,
  Award
} from 'lucide-react';

export const AthletesList: React.FC = () => {
  const { 
    athletes, 
    addAthlete, 
    updateAthlete, 
    deleteAthlete, 
    trainingCenters, 
    professors 
  } = useGaditas();

  const [search, setSearch] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedCT, setSelectedCT] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [cpf, setCpf] = useState('');
  const [age, setAge] = useState(24);
  const [weight, setWeight] = useState(77);
  const [height, setHeight] = useState(175);
  const [belt, setBelt] = useState<BeltType>('Azul');
  const [category, setCategory] = useState<WeightCategory>('Médio (-82kg)');
  const [modality, setModality] = useState<ModalityType>('Jiu-Jitsu');
  const [tcId, setTcId] = useState(trainingCenters[0]?.id || 'ct-matriz');
  const [professorName, setProfessorName] = useState(professors[0]?.name || 'Roberto Silva');
  const [photoUrl, setPhotoUrl] = useState('');
  const [victories, setVictories] = useState(0);
  const [defeats, setDefeats] = useState(0);
  const [draws, setDraws] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [knockouts, setKnockouts] = useState(0);
  const [titles, setTitles] = useState(0);
  const [isHighlight, setIsHighlight] = useState(false);
  const [biography, setBiography] = useState('');

  const openNewAthleteModal = () => {
    setEditingAthlete(null);
    setName('');
    setNickname('');
    setCpf('');
    setAge(24);
    setWeight(77);
    setHeight(175);
    setBelt('Azul');
    setCategory('Médio (-82kg)');
    setModality('Jiu-Jitsu');
    setTcId(trainingCenters[0]?.id || 'ct-matriz');
    setProfessorName(professors[0]?.name || 'Roberto Silva');
    setPhotoUrl('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400');
    setVictories(5);
    setDefeats(1);
    setDraws(0);
    setSubmissions(3);
    setKnockouts(0);
    setTitles(1);
    setIsHighlight(true);
    setBiography('Guerreiro de alto rendimento da equipe Gaditas.');
    setShowModal(true);
  };

  const openEditAthleteModal = (ath: Athlete) => {
    setEditingAthlete(ath);
    setName(ath.name);
    setNickname(ath.nickname || '');
    setCpf(ath.cpf);
    setAge(ath.age);
    setWeight(ath.weight);
    setHeight(ath.height);
    setBelt(ath.belt);
    setCategory(ath.category);
    setModality(ath.modality);
    setTcId(ath.trainingCenterId);
    setProfessorName(ath.professorName);
    setPhotoUrl(ath.photoUrl);
    setVictories(ath.victories);
    setDefeats(ath.defeats);
    setDraws(ath.draws);
    setSubmissions(ath.submissions);
    setKnockouts(ath.knockouts);
    setTitles(ath.titles);
    setIsHighlight(ath.isHighlight);
    setBiography(ath.biography || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenTc = trainingCenters.find(t => t.id === tcId);

    if (editingAthlete) {
      updateAthlete({
        ...editingAthlete,
        name,
        nickname,
        cpf,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        belt,
        category,
        modality,
        trainingCenterId: tcId,
        trainingCenterName: chosenTc?.name || 'CT Central',
        professorName,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        victories: Number(victories),
        defeats: Number(defeats),
        draws: Number(draws),
        submissions: Number(submissions),
        knockouts: Number(knockouts),
        titles: Number(titles),
        isHighlight,
        biography
      });
    } else {
      addAthlete({
        name,
        nickname,
        cpf,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        belt,
        category,
        modality,
        trainingCenterId: tcId,
        trainingCenterName: chosenTc?.name || 'CT Central',
        professorName,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        victories: Number(victories),
        defeats: Number(defeats),
        draws: Number(draws),
        submissions: Number(submissions),
        knockouts: Number(knockouts),
        titles: Number(titles),
        isHighlight,
        biography
      });
    }
    setShowModal(false);
  };

  const filteredAthletes = athletes.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
      (a.nickname && a.nickname.toLowerCase().includes(search.toLowerCase()));
    const matchModality = selectedModality === 'all' || a.modality === selectedModality;
    const matchCT = selectedCT === 'all' || a.trainingCenterId === selectedCT;
    return matchSearch && matchModality && matchCT;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Módulo Esportivo · Atletas & Cartel
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cadastro de cartel de lutas (Vitórias, Derrotas, Finalizações, Nocautes e Títulos).
          </p>
        </div>

        <button
          type="button"
          onClick={openNewAthleteModal}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Atleta</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou apelido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500/50"
          />
        </div>

        <div>
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Todas as Modalidades</option>
            <option value="Jiu-Jitsu">Jiu-Jitsu Brasileiro</option>
            <option value="Muay Thai">Muay Thai</option>
            <option value="MMA">MMA</option>
            <option value="Judô">Judô</option>
            <option value="No-Gi Submission">No-Gi Submission</option>
          </select>
        </div>

        <div>
          <select
            value={selectedCT}
            onChange={(e) => setSelectedCT(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Todos os CTs</option>
            {trainingCenters.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Athletes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAthletes.map(ath => {
          const totalFights = ath.victories + ath.defeats + ath.draws;
          const winRate = totalFights > 0 ? Math.round((ath.victories / totalFights) * 100) : 0;

          return (
            <div 
              key={ath.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top: Athlete Avatar, Belt & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={ath.photoUrl} 
                      alt={ath.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-700 bg-neutral-950" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-neutral-100">{ath.name}</span>
                        {ath.isHighlight && (
                          <span title="Destaque no Site Institucional">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <BeltBadge belt={ath.belt} size="sm" />
                        <span className="text-[11px] text-neutral-400">{ath.modality}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-400 font-mono">
                      {ath.points} pts
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                      Pontos Ranking
                    </span>
                  </div>
                </div>

                {/* Physical details & CT */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Categoria</span>
                    <span className="font-semibold text-neutral-200 truncate block">{ath.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Peso / Altura</span>
                    <span className="font-semibold text-neutral-200">{ath.weight}kg · {ath.height}cm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Aproveitamento</span>
                    <span className="font-semibold text-emerald-400">{winRate}% Win</span>
                  </div>
                </div>

                {/* Cartel Display (V/D/E + Subs + KOs + Titles) */}
                <div className="mt-3 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80 text-xs">
                    <span className="font-bold text-neutral-300 uppercase tracking-wider text-[10px]">
                      Cartel Oficial
                    </span>
                    <span className="font-mono font-bold text-neutral-100">
                      <span className="text-emerald-400">{ath.victories}V</span> - <span className="text-red-400">{ath.defeats}D</span> - <span className="text-neutral-400">{ath.draws}E</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500">Finalizações</span>
                      <p className="font-bold text-purple-400 font-mono">{ath.submissions}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500">Nocautes (KO)</span>
                      <p className="font-bold text-amber-500 font-mono">{ath.knockouts}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500">Títulos Conquistados</span>
                      <p className="font-bold text-amber-400 font-mono">{ath.titles}</p>
                    </div>
                  </div>
                </div>

                {ath.biography && (
                  <p className="text-[11px] text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                    {ath.biography}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                <span className="truncate">Treinador: {ath.professorName}</span>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditAthleteModal(ath)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Editar Cartel"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir atleta ${ath.name}?`)) {
                        deleteAthlete(ath.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/50 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Remover Atleta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Cadastro / Edição de Atleta */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h2 className="text-base font-bold text-neutral-100 font-cinzel">
                {editingAthlete ? 'Editar Cartel & Dados do Atleta' : 'Novo Cadastro de Atleta'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Apelido de Guerra</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex: Pitbull, Samurai"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Idade</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Graduação</label>
                  <select
                    value={belt}
                    onChange={(e) => setBelt(e.target.value as BeltType)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Branca">Branca</option>
                    <option value="Azul">Azul</option>
                    <option value="Roxa">Roxa</option>
                    <option value="Marrom">Marrom</option>
                    <option value="Preta">Preta</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Categoria de Peso</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WeightCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Galo (-57kg)">Galo (-57kg)</option>
                    <option value="Pluma (-64kg)">Pluma (-64kg)</option>
                    <option value="Pena (-70kg)">Pena (-70kg)</option>
                    <option value="Leve (-76kg)">Leve (-76kg)</option>
                    <option value="Médio (-82kg)">Médio (-82kg)</option>
                    <option value="Meio-Pesado (-88kg)">Meio-Pesado (-88kg)</option>
                    <option value="Pesado (-94kg)">Pesado (-94kg)</option>
                    <option value="Super-Pesado (-100kg)">Super-Pesado (-100kg)</option>
                    <option value="Absoluto">Absoluto</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Modalidade</label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as ModalityType)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                    <option value="Muay Thai">Muay Thai</option>
                    <option value="MMA">MMA</option>
                    <option value="Judô">Judô</option>
                    <option value="No-Gi Submission">No-Gi Submission</option>
                  </select>
                </div>
              </div>

              {/* Cartel inputs */}
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">
                  Cartel & Estatísticas
                </span>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div>
                    <label className="text-neutral-400 block mb-1">Vitórias</label>
                    <input
                      type="number"
                      min={0}
                      value={victories}
                      onChange={(e) => setVictories(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Derrotas</label>
                    <input
                      type="number"
                      min={0}
                      value={defeats}
                      onChange={(e) => setDefeats(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Empates</label>
                    <input
                      type="number"
                      min={0}
                      value={draws}
                      onChange={(e) => setDraws(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Finalizações</label>
                    <input
                      type="number"
                      min={0}
                      value={submissions}
                      onChange={(e) => setSubmissions(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Nocautes</label>
                    <input
                      type="number"
                      min={0}
                      value={knockouts}
                      onChange={(e) => setKnockouts(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Títulos</label>
                    <input
                      type="number"
                      min={0}
                      value={titles}
                      onChange={(e) => setTitles(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">URL da Foto</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Biografia Esportiva</label>
                <textarea
                  rows={2}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Principais conquistas, estilo de luta..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlight"
                  checked={isHighlight}
                  onChange={(e) => setIsHighlight(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-500"
                />
                <label htmlFor="highlight" className="text-neutral-300 cursor-pointer">
                  Exibir como Atleta Destaque (Top 10) no Site Institucional
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  {editingAthlete ? 'Salvar Alterações' : 'Cadastrar Atleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
