import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { NewsArticle, TeamEvent, Sponsor } from '../../types';
import { 
  Newspaper, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Share2, 
  ExternalLink,
  Handshake,
  CheckCircle2,
  X
} from 'lucide-react';

export const NewsManager: React.FC = () => {
  const { 
    news, 
    addNewsArticle, 
    deleteNewsArticle, 
    events, 
    addTeamEvent, 
    sponsors, 
    addSponsor, 
    deleteSponsor 
  } = useGaditas();

  const [activeTab, setActiveTab] = useState<'noticias' | 'eventos' | 'patrocinadores'>('noticias');
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  // News form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [author, setAuthor] = useState('Assessoria Gaditas');

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<TeamEvent['type']>('Campeonato');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [eventLocation, setEventLocation] = useState('CT Matriz Central');
  const [eventDescription, setEventDescription] = useState('');

  // Sponsor form state
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorLogo, setSponsorLogo] = useState('');
  const [sponsorTier, setSponsorTier] = useState<Sponsor['tier']>('Patrocinador Master');

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    addNewsArticle({
      title,
      summary,
      content,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=800',
      author,
      date: new Date().toLocaleDateString('pt-BR'),
      published: true
    });
    setShowNewsModal(false);
    setTitle('');
    setContent('');
    setSummary('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addTeamEvent({
      title: eventTitle,
      type: eventType,
      date: eventDate,
      location: eventLocation,
      description: eventDescription,
      posterUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
    });
    setShowEventModal(false);
  };

  const handleCreateSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    addSponsor({
      name: sponsorName,
      logoUrl: sponsorLogo || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=200',
      tier: sponsorTier
    });
    setShowSponsorModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Central de Conteúdo & Notícias
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Publicação de notícias de vitórias, agenda de seminários e gestão de parceiros e patrocinadores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'noticias' && (
            <button
              type="button"
              onClick={() => setShowNewsModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Notícia</span>
            </button>
          )}

          {activeTab === 'eventos' && (
            <button
              type="button"
              onClick={() => setShowEventModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Evento</span>
            </button>
          )}

          {activeTab === 'patrocinadores' && (
            <button
              type="button"
              onClick={() => setShowSponsorModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Patrocinador</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('noticias')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'noticias' ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Notícias Publicadas ({news.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('eventos')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'eventos' ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Eventos & Seminários ({events.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('patrocinadores')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'patrocinadores' ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Patrocinadores & Parceiros ({sponsors.length})
        </button>
      </div>

      {/* Tab 1: Notícias */}
      {activeTab === 'noticias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {news.map(art => (
            <div key={art.id} className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between">
              <div>
                <img src={art.photoUrl} alt={art.title} className="w-full h-44 object-cover" />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-semibold text-amber-400">{art.author}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="font-bold text-base text-neutral-100">{art.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{art.summary}</p>
                  <p className="text-xs text-neutral-300 pt-2 border-t border-neutral-800 leading-relaxed">
                    {art.content}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex justify-end">
                <button
                  type="button"
                  onClick={() => deleteNewsArticle(art.id)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Eventos */}
      {activeTab === 'eventos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(evt => (
            <div key={evt.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {evt.type}
              </span>
              <h3 className="font-bold text-base text-neutral-100">{evt.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{evt.description}</p>
              <div className="text-[11px] text-neutral-400 space-y-1 pt-2 border-t border-neutral-800">
                <p>📅 {evt.date}</p>
                <p>📍 {evt.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Patrocinadores */}
      {activeTab === 'patrocinadores' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sponsors.map(sp => (
            <div key={sp.id} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-2 relative group">
              <img src={sp.logoUrl} alt={sp.name} className="w-20 h-20 rounded-xl object-cover mx-auto border border-neutral-800" />
              <p className="font-bold text-xs text-neutral-100 truncate">{sp.name}</p>
              <span className="text-[10px] text-amber-400 font-mono block">{sp.tier}</span>
              <button
                type="button"
                onClick={() => deleteSponsor(sp.id)}
                className="absolute top-2 right-2 p-1 rounded bg-neutral-950/80 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Nova Notícia */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Publicar Nova Notícia</h2>
              <button type="button" onClick={() => setShowNewsModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Título da Matéria</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Equipe Gaditas conquista 10 medalhas..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Resumo Curto (Subtítulo)</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Texto Completo da Notícia</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">URL da Foto</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Publicar Notícia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Evento */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Novo Evento / Seminário</h2>
              <button type="button" onClick={() => setShowEventModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Nome do Evento</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ex: Seminário de Passagem com Mestre Davi"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Tipo</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Campeonato">Campeonato</option>
                    <option value="Exame de Faixa">Exame de Faixa</option>
                    <option value="Seminário">Seminário</option>
                    <option value="Aulão Geral">Aulão Geral</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Data</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Local</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Criar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Patrocinador */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Novo Patrocinador / Parceiro</h2>
              <button type="button" onClick={() => setShowSponsorModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSponsor} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Nome da Marca</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="Ex: Suplementos Pro"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Categoria de Parceria</label>
                <select
                  value={sponsorTier}
                  onChange={(e) => setSponsorTier(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                >
                  <option value="Patrocinador Master">Patrocinador Master</option>
                  <option value="Apoiador Oficial">Apoiador Oficial</option>
                  <option value="Parceiro Local">Parceiro Local</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">URL do Logo</label>
                <input
                  type="text"
                  value={sponsorLogo}
                  onChange={(e) => setSponsorLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Adicionar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
