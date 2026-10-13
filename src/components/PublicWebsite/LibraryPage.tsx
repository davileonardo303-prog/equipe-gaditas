import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { MediaFile } from '../../types';
import { TiltCard3D } from '../ThreeD/TiltCard3D';
import { 
  Folder, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Download, 
  Search, 
  ArrowLeft, 
  Eye, 
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle2,
  Play,
  X,
  Shield
} from 'lucide-react';

interface LibraryPageProps {
  onBackToHome: () => void;
  onOpenLogin: (tab?: 'aluno' | 'staff') => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onBackToHome, onOpenLogin }) => {
  const { mediaFiles, certificates, news } = useGaditas();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [previewMedia, setPreviewMedia] = useState<any | null>(null);

  // Curated official library documents
  const libraryDocs = [
    {
      id: 'doc-1',
      title: 'Manual Oficial de Regras de Graduação & Requisitos de Faixa Gaditas',
      category: 'manuais',
      type: 'pdf',
      size: '2.4 MB',
      date: 'Setembro 2026',
      description: 'Critérios oficiais de frequência mínima, técnicas obrigatórias e tempo de tatame para exames de faixa do Mestre Davi.',
      url: '#'
    },
    {
      id: 'doc-2',
      title: 'Livro de Regras Oficiais de Competição IBJJF / CBJJ 2026',
      category: 'manuais',
      type: 'pdf',
      size: '4.8 MB',
      date: 'Janeiro 2026',
      description: 'Guia completo de pontuação, raspagens, passagens, punições e golpes proibidos por faixa e categoria etária.',
      url: '#'
    },
    {
      id: 'doc-3',
      title: 'Termo de Responsabilidade & Ficha Médica Oficial Gaditas',
      category: 'documentos',
      type: 'pdf',
      size: '850 KB',
      date: 'Agosto 2026',
      description: 'Documento padrão obrigatório para todos os novos alunos matriculados e participantes de seminários.',
      url: '#'
    },
    {
      id: 'doc-4',
      title: 'Apostila Técnica: Princípios Fundamentais de Guarda Fechada',
      category: 'manuais',
      type: 'pdf',
      size: '3.1 MB',
      date: 'Julho 2026',
      description: 'Material pedagógico ilustrado com posturas defensivas, quebras de postura e finalizações clássicas da guarda.',
      url: '#'
    }
  ];

  // Curated video lessons
  const videoLessons = [
    {
      id: 'vid-1',
      title: 'Seminário de Passagem de Guarda Emborcando com Mestre Davi',
      duration: '42 min',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=600',
      description: 'Detalhes fundamentais de pegadas na calça e pressão na coluna para neutralizar guardeiros flexíveis.',
      instructor: 'Mestre Davi Gaditas'
    },
    {
      id: 'vid-2',
      title: 'Masterclass: Sequência de Finalizações no Armlock da Guarda',
      duration: '28 min',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600',
      description: 'Ajustes finos no quadril para evitar a saída giratória do adversário e transição para triângulo.',
      instructor: 'Prof. Roberto Trator'
    },
    {
      id: 'vid-3',
      title: 'Defesa Pessoal Gaditas: Saída de Gravata e Agarrões',
      duration: '19 min',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
      description: 'Técnicas de alavanca e equilíbrio para desarme de situações de agressão em pé.',
      instructor: 'Profa. Camila Castro'
    }
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="relative py-14 px-4 sm:px-6 rounded-3xl bg-neutral-950 border-2 border-red-600/40 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-white font-bold mb-2 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à Página Principal</span>
          </button>

          <div className="inline-block bg-white text-black px-3.5 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider shadow-md">
            Acervo Técnico Oficial · Gaditas Team
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-cinzel tracking-tight uppercase">
            <span className="text-white">BIBLIOTECA </span>
            <span className="text-red-600">DIGITAL GADITAS</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Acesse o acervo público de manuais técnicos de faixa, videoaulas oficiais dos professores, regulamentos de arbitragem e apostilas históricas da equipe.
          </p>
        </div>

        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Search & Category Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-950 border-2 border-neutral-800 shadow-xl">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Todo o Acervo' },
              { id: 'manuais', label: 'Manuais & Apostilas' },
              { id: 'videos', label: 'Videoaulas' },
              { id: 'documentos', label: 'Documentos Oficiais' },
              { id: 'fotos', label: 'Galeria de Fotos' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wider ${
                  activeCategory === tab.id
                    ? 'bg-red-600 text-white shadow-lg border border-white/30'
                    : 'bg-black text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar apostila, vídeo ou regra..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black border-2 border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-600"
            />
          </div>
        </div>

        {/* SECTION 1: Manuais e Documentos Oficiais com 3D Tilt */}
        {(activeCategory === 'all' || activeCategory === 'manuais' || activeCategory === 'documentos') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-black text-white font-cinzel uppercase">
                Manuais de Graduação & Documentos Oficiais
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {libraryDocs
                .filter(doc => search === '' || doc.title.toLowerCase().includes(search.toLowerCase()) || doc.description.toLowerCase().includes(search.toLowerCase()))
                .map((doc) => (
                  <TiltCard3D key={doc.id} maxTilt={8}>
                    <div
                      className="p-6 rounded-2xl bg-neutral-950 border-2 border-neutral-800 hover:border-red-600 transition-all flex flex-col justify-between space-y-4 shadow-xl group h-full"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-red-600 text-white uppercase shadow-sm">
                            PDF Oficial
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {doc.size} · {doc.date}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-white group-hover:text-red-500 transition-colors font-cinzel">
                          {doc.title}
                        </h4>

                        <p className="text-xs text-neutral-300 font-serif leading-relaxed">
                          {doc.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setPreviewMedia({ title: doc.title, type: 'pdf', description: doc.description })}
                          className="text-xs text-neutral-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-red-500" />
                          <span>Visualizar Documento</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            alert(`Download iniciado: ${doc.title}`);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md uppercase tracking-wider"
                        >
                          <Download className="w-3.5 h-3.5 text-red-600" />
                          <span>Baixar PDF</span>
                        </button>
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
            </div>
          </div>
        )}

        {/* SECTION 2: Videoaulas com 3D Tilt */}
        {(activeCategory === 'all' || activeCategory === 'videos') && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-black text-white font-cinzel uppercase">
                Videoaulas Técnicas & Posições Oficiais
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoLessons
                .filter(vid => search === '' || vid.title.toLowerCase().includes(search.toLowerCase()) || vid.instructor.toLowerCase().includes(search.toLowerCase()))
                .map((vid) => (
                  <TiltCard3D key={vid.id} maxTilt={10}>
                    <div
                      className="rounded-2xl bg-neutral-950 border-2 border-neutral-800 hover:border-red-600 overflow-hidden shadow-xl flex flex-col justify-between group transition-all h-full"
                    >
                      <div>
                        <div className="relative w-full h-44 bg-black overflow-hidden cursor-pointer" onClick={() => setPreviewMedia({ title: vid.title, type: 'video', instructor: vid.instructor, description: vid.description })}>
                          <img 
                            src={vid.thumbnail} 
                            alt={vid.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                            <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-2 border-white/40">
                              <Play className="w-6 h-6 fill-white ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black text-[10px] font-mono text-white font-black">
                            {vid.duration}
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <span className="text-[10px] font-mono font-black text-red-500 uppercase bg-red-600/10 px-2 py-0.5 rounded border border-red-500/20">
                            {vid.instructor}
                          </span>
                          <h4 className="text-sm font-black text-white line-clamp-2 group-hover:text-red-500 transition-colors font-cinzel">
                            {vid.title}
                          </h4>
                          <p className="text-xs text-neutral-300 font-serif line-clamp-2">
                            {vid.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          type="button"
                          onClick={() => setPreviewMedia({ title: vid.title, type: 'video', instructor: vid.instructor, description: vid.description })}
                          className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white text-xs font-black border-2 border-neutral-800 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                        >
                          <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                          <span>Assistir Aula Completa</span>
                        </button>
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Galeria de Fotos e Conquistas */}
        {(activeCategory === 'all' || activeCategory === 'fotos') && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-black text-white font-cinzel uppercase">
                Galeria Oficial de Fotos & Tatames
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mediaFiles
                .filter(m => m.fileType === 'image')
                .map((m) => (
                  <TiltCard3D key={m.id} maxTilt={10}>
                    <div
                      onClick={() => setPreviewMedia({ title: m.name, type: 'image', url: m.url })}
                      className="relative group rounded-2xl overflow-hidden aspect-4/3 bg-black border-2 border-neutral-800 cursor-pointer hover:border-red-600 transition-all shadow-xl"
                    >
                      <img 
                        src={m.url} 
                        alt={m.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-xs font-black text-white truncate">
                          {m.name}
                        </span>
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-8 rounded-3xl bg-neutral-950 border-2 border-red-600 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-black text-white font-cinzel uppercase">
              Quer sugerir um material técnico ou registrar uma luta?
            </h4>
            <p className="text-xs text-neutral-300">
              Professores e mestres têm acesso à Central de Mídia para upload e curadoria pedagógica.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenLogin('staff')}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-xl shrink-0 border border-white/30 uppercase tracking-wider"
          >
            Acesso Docente / Gestão
          </button>
        </div>
      </div>

      {/* Interactive Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-950 border-2 border-red-600 p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase font-mono">
              <Shield className="w-4 h-4 fill-red-500" />
              <span>Acervo Oficial Gaditas Team</span>
            </div>

            <h3 className="text-xl font-black text-white font-cinzel">
              {previewMedia.title}
            </h3>

            {previewMedia.type === 'video' ? (
              <div className="aspect-video w-full rounded-2xl bg-black flex flex-col items-center justify-center border-2 border-neutral-800 p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl border-2 border-white/40">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{previewMedia.title}</p>
                  <p className="text-xs text-red-500 font-mono font-bold mt-1">Instrutor: {previewMedia.instructor}</p>
                </div>
                <p className="text-xs text-neutral-300 max-w-md">{previewMedia.description}</p>
                <span className="text-[11px] text-white bg-neutral-900 px-3 py-1 rounded font-mono">Transmissão 1080p HD liberada para a equipe</span>
              </div>
            ) : previewMedia.type === 'pdf' ? (
              <div className="p-8 rounded-2xl bg-black border-2 border-neutral-800 text-center space-y-4">
                <FileText className="w-16 h-16 text-red-500 mx-auto" />
                <div>
                  <p className="text-base font-black text-white">{previewMedia.title}</p>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto mt-1">{previewMedia.description}</p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => alert(`Baixando ${previewMedia.title}...`)}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xl uppercase tracking-wider border border-white/30"
                  >
                    Baixar Documento Completo (PDF)
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-h-96 overflow-hidden rounded-2xl border-2 border-neutral-800">
                <img src={previewMedia.url} alt={previewMedia.title} className="w-full h-full object-contain bg-black" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
