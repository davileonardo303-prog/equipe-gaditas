import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { TrainingCenter } from '../../types';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Phone, 
  User, 
  Users, 
  Edit3, 
  X, 
  Search,
  Navigation,
  ExternalLink,
  Calendar,
  Clock,
  Shield,
  Layers,
  Map,
  Filter,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const TrainingCentersList: React.FC = () => {
  const { 
    trainingCenters, 
    addTrainingCenter, 
    updateTrainingCenter, 
    students, 
    currentRole, 
    currentProfessor,
    addNotification,
    isGeneralAdmin
  } = useGaditas();

  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<TrainingCenter | null>(null);
  const [editingTC, setEditingTC] = useState<TrainingCenter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Nova Iguaçu');
  const [state, setState] = useState('RJ');
  const [phone, setPhone] = useState('(21) 9');
  const [responsibleName, setResponsibleName] = useState('Professor Responsável');
  const [coordinatorName, setCoordinatorName] = useState('Mestre Daniel Braga');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800');

  // Strict Role Filtering:
  // "O Professor só visualiza seu CT. O Mestre e Administrador Geral visualizam tudo."
  const userVisibleCTs = trainingCenters.filter(tc => {
    if (currentRole === 'professor' && currentProfessor) {
      return tc.id === currentProfessor.trainingCenterId || tc.responsibleName.toLowerCase().includes(currentProfessor.name.toLowerCase());
    }
    return true;
  });

  const cities = Array.from(new Set(userVisibleCTs.map(tc => tc.city)));

  const filteredCTs = userVisibleCTs.filter(tc => {
    const matchesSearch = 
      tc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tc.neighborhood && tc.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tc.responsibleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || tc.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const openNew = () => {
    setEditingTC(null);
    setName('');
    setAddress('');
    setNeighborhood('Centro');
    setCity('Nova Iguaçu');
    setState('RJ');
    setPhone('(21) 98765-4321');
    setResponsibleName('Professor Responsável (MT-XX)');
    setCoordinatorName('Mestre Daniel Braga');
    setPhotoUrl('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800');
    setShowModal(true);
  };

  const openEdit = (tc: TrainingCenter) => {
    setEditingTC(tc);
    setName(tc.name);
    setAddress(tc.address);
    setNeighborhood(tc.neighborhood || '');
    setCity(tc.city);
    setState(tc.state);
    setPhone(tc.phone);
    setResponsibleName(tc.responsibleName);
    setCoordinatorName(tc.coordinatorName || '');
    setPhotoUrl(tc.photoUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTC) {
      updateTrainingCenter({
        ...editingTC,
        name,
        address,
        neighborhood,
        city,
        state,
        phone,
        responsibleName,
        coordinatorName,
        photoUrl
      });
      addNotification('CT Atualizado', `Polo ${name} salvo com sucesso.`, 'success');
    } else {
      addTrainingCenter({
        name,
        address,
        neighborhood,
        city,
        state,
        phone,
        responsibleName,
        coordinatorName,
        photoUrl,
        activeStudentsCount: 0,
        coordinates: { lat: -22.756, lng: -43.450 },
        schedules: [
          { day: 'Seg / Qua / Sex', hours: '19:30 - 21:00', modality: 'Muay Thai Geral', instructor: responsibleName }
        ]
      });
      addNotification('CT Cadastrado', `Novo CT ${name} inserido no sistema.`, 'success');
    }
    setShowModal(false);
  };

  const handleOpenGoogleMapsRoute = (tc: TrainingCenter) => {
    const query = encodeURIComponent(`${tc.name}, ${tc.address}, ${tc.city} - RJ`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-cinzel">
              Centros de Treinamento (CTs & 13 Polos Oficiais)
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {currentRole === 'professor' 
              ? `Acesso exclusivo ao seu polo de atuação (${currentProfessor?.trainingCenterName || 'Seu CT'}).`
              : 'Visão completa dos 13 polos no Rio de Janeiro, com endereços, horários de treino, rotas no Google Maps e lista de alunos matriculados.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'cards' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards ({filteredCTs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'map' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </button>
          </div>

          {(currentRole === 'admin' || currentRole === 'mestre') && (
            <button
              type="button"
              onClick={openNew}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-red-950/40"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Cadastrar Novo Polo</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-neutral-400 ml-2" />
          <button
            type="button"
            onClick={() => setCityFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${cityFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            Todas Cidades ({userVisibleCTs.length})
          </button>
          {cities.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCityFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${cityFilter === c ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar polo, professor ou bairro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE GOOGLE MAPS */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Mapa de Localização dos Centros de Treinamento</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Cobertura em Nova Iguaçu, Nilópolis, Belford Roxo, São João de Meriti, Mesquita, Caxias, Rio de Janeiro e Região dos Lagos.
                </p>
              </div>
            </div>

            {/* Embedded Google Maps View centered in Rio de Janeiro region */}
            <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
              <iframe
                title="Google Maps Polos Gaditas"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }}
                src="https://maps.google.com/maps?q=Nova%20Igua%C3%A7u,%20Rio%20de%20Janeiro&t=&z=11&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
              />

              {/* Interactive Floating CT Quick Navigator */}
              <div className="absolute top-4 left-4 max-w-xs w-full bg-neutral-950/90 backdrop-blur-md border border-neutral-800 p-3 rounded-2xl shadow-2xl space-y-2 hidden md:block">
                <span className="text-[10px] font-mono text-red-500 uppercase font-black block">
                  Polos Selecionáveis ({filteredCTs.length}):
                </span>
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1 text-xs">
                  {filteredCTs.slice(0, 8).map(tc => (
                    <div
                      key={tc.id}
                      onClick={() => setShowDetailModal(tc)}
                      className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span className="font-bold text-neutral-200 truncate">{tc.name}</span>
                      <span className="text-[10px] text-red-400 font-mono ml-2 shrink-0">{tc.city}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCTs.map(tc => {
            const ctStudents = students.filter(s => s.trainingCenterId === tc.id || s.trainingCenterName === tc.name);
            return (
              <div
                key={tc.id}
                className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all shadow-xl group"
              >
                <div>
                  {/* CT Cover Photo */}
                  <div className="relative h-44 bg-neutral-950 overflow-hidden">
                    <img
                      src={tc.photoUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'}
                      alt={tc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-bold border border-white/10">
                        {tc.city} - {tc.state}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                        {tc.neighborhood || 'Polo Oficial'}
                      </span>
                      <h2 className="text-base font-black text-white font-cinzel line-clamp-1">
                        {tc.name}
                      </h2>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3.5 text-xs">
                    <div className="flex items-start gap-2.5 text-neutral-300">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-[11px]">{tc.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-neutral-300">
                      <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                      <a href={`https://wa.me/55${tc.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-[11px] hover:text-white font-mono">
                        {tc.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2.5 text-neutral-300">
                      <User className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-[11px]"><strong>Professor:</strong> {tc.responsibleName}</span>
                    </div>

                    {tc.coordinatorName && (
                      <div className="flex items-center gap-2.5 text-neutral-400 text-[10px]">
                        <Shield className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Coordenação: {tc.coordinatorName}</span>
                      </div>
                    )}

                    {/* Schedules Preview */}
                    {tc.schedules && tc.schedules.length > 0 && (
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block flex items-center gap-1">
                          <Clock className="w-3 h-3 text-red-500" />
                          <span>Horários de Treino:</span>
                        </span>
                        <div className="space-y-1 text-[11px]">
                          {tc.schedules.slice(0, 2).map((s, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between text-neutral-300">
                              <span className="font-semibold">{s.day} ({s.hours})</span>
                              <span className="text-neutral-500 text-[10px]">{s.modality}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Students Count Badge */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400 font-mono">
                      <span>Alunos no Polo:</span>
                      <span className="font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded-full">
                        {ctStudents.length || tc.activeStudentsCount} matriculados
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDetailModal(tc)}
                    className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Detalhes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenGoogleMapsRoute(tc)}
                    className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40"
                    title="Traçar Rota no Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Rotas</span>
                  </button>

                  {(currentRole === 'admin' || currentRole === 'mestre') && (
                    <button
                      type="button"
                      onClick={() => openEdit(tc)}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                      title="Editar CT"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CT Full Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider block">
                  Centro de Treinamento Oficial · Gaditas Team
                </span>
                <h2 className="text-xl font-black text-white font-cinzel mt-1">
                  {showDetailModal.name}
                </h2>
                <p className="text-xs text-neutral-400">{showDetailModal.address} - {showDetailModal.city}, {showDetailModal.state}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(null)}
                className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-video bg-neutral-950">
              <img
                src={showDetailModal.photoUrl}
                alt={showDetailModal.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Schedules and Responsibles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Responsáveis Técnicos:</span>
                <p className="font-bold text-white">Professor: {showDetailModal.responsibleName}</p>
                <p className="text-neutral-400">Coordenador: {showDetailModal.coordinatorName || 'Mestre Daniel Braga'}</p>
                <p className="text-red-400 font-mono mt-2">Contato: {showDetailModal.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Grade de Horários:</span>
                {showDetailModal.schedules?.map((s, idx) => (
                  <div key={idx} className="text-neutral-300">
                    <span className="font-bold text-white">{s.day}:</span> {s.hours} ({s.modality})
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleOpenGoogleMapsRoute(showDetailModal)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/40"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir Rota no Google Maps</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit CT Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base font-cinzel">
                {editingTC ? 'Editar Centro de Treinamento' : 'Cadastrar Novo Polo / CT'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Nome do Polo / CT</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: CT Gaditas - Polo Madureira (MT-14)"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Endereço Completo</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número e complemento"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Bairro</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Cidade</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Nova Iguaçu, Rio de Janeiro..."
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Professor Responsável</label>
                  <input
                    type="text"
                    required
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">URL da Foto do Polo</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Salvar Centro de Treinamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
