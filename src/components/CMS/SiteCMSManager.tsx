import React, { useState, useRef } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { storageService } from '../../services/storageService';
import { CustomPage, PageBlock } from '../../types';
import { 
  Globe, 
  Palette, 
  Image as ImageIcon, 
  FileText, 
  Save, 
  CheckCircle2, 
  Sparkles,
  Eye,
  Upload,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Edit3,
  Video,
  Layers,
  HelpCircle,
  AlertCircle,
  LayoutTemplate,
  Smartphone,
  Monitor,
  X,
  ExternalLink,
  Link as LinkIcon,
  Menu,
  Sliders,
  Check,
  Calendar,
  Building2
} from 'lucide-react';

export const SiteCMSManager: React.FC = () => {
  const { 
    siteConfig, 
    updateSiteConfig, 
    customPages, 
    addCustomPage, 
    updateCustomPage, 
    deleteCustomPage, 
    setViewMode, 
    setPublicPage,
    addNotification,
    trainingCenters
  } = useGaditas();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'paginas' | 'identidade' | 'menus' | 'rodape' | 'avisos'>('paginas');

  // Site Configuration State
  const [teamName, setTeamName] = useState(siteConfig.teamName);
  const [slogan, setSlogan] = useState(siteConfig.slogan);
  const [logoUrl, setLogoUrl] = useState(siteConfig.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState(siteConfig.faviconUrl || siteConfig.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(siteConfig.primaryColor || '#dc2626');
  const [accentColor, setAccentColor] = useState(siteConfig.accentColor || '#f59e0b');
  const [heroTitle, setHeroTitle] = useState(siteConfig.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(siteConfig.heroSubtitle);
  const [heroBannerUrl, setHeroBannerUrl] = useState(siteConfig.heroBannerUrl);
  const [heroVideoUrl, setHeroVideoUrl] = useState(siteConfig.heroVideoUrl || '');
  const [historyText, setHistoryText] = useState(siteConfig.historyText);
  const [missionText, setMissionText] = useState(siteConfig.missionText);
  const [visionText, setVisionText] = useState(siteConfig.visionText);
  const [valuesInput, setValuesInput] = useState(siteConfig.valuesText.join('\n'));
  const [contactEmail, setContactEmail] = useState(siteConfig.contactEmail);
  const [contactPhone, setContactPhone] = useState(siteConfig.contactPhone);
  const [contactAddress, setContactAddress] = useState(siteConfig.contactAddress);
  const [socialInstagram, setSocialInstagram] = useState(siteConfig.socialInstagram);
  const [socialYoutube, setSocialYoutube] = useState(siteConfig.socialYoutube);
  const [socialWhatsapp, setSocialWhatsapp] = useState(siteConfig.socialWhatsapp);
  const [footerText, setFooterText] = useState(siteConfig.footerText || '© 2026 EQUIPE GADITAS FIGHT TEAM - RIO DE JANEIRO · FAZENDO A DIFERENÇA');
  
  // Announcement Bar State
  const [announcementEnabled, setAnnouncementEnabled] = useState(siteConfig.announcementBar?.enabled ?? true);
  const [announcementText, setAnnouncementText] = useState(siteConfig.announcementBar?.text || 'LEMA OFICIAL: "A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO" · 13 POLOS ATIVOS NO RJ');
  const [announcementLink, setAnnouncementLink] = useState(siteConfig.announcementBar?.link || '#cts');

  // Page Builder States
  const [selectedPage, setSelectedPage] = useState<CustomPage | null>(customPages[0] || null);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageDesc, setNewPageDesc] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);

  // Block editing state
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const blockImageFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const processed = await storageService.processUploadedFile(file);
      setter(processed.dataUrl);
      addNotification('Foto Carregada', `${file.name} foi salva com sucesso.`, 'success');
    } catch {
      addNotification('Erro no Upload', 'Falha ao processar arquivo.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({
      teamName,
      slogan,
      logoUrl,
      faviconUrl,
      primaryColor,
      accentColor,
      heroTitle,
      heroSubtitle,
      heroBannerUrl,
      heroVideoUrl,
      historyText,
      missionText,
      visionText,
      valuesText: valuesInput.split('\n').filter(Boolean),
      contactEmail,
      contactPhone,
      contactAddress,
      socialInstagram,
      socialYoutube,
      socialWhatsapp,
      footerText,
      announcementBar: {
        enabled: announcementEnabled,
        text: announcementText,
        link: announcementLink
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Page Handlers
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      addNotification('Erro', 'Título e URL da página são obrigatórios.', 'error');
      return;
    }

    const cleanSlug = newPageSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    addCustomPage({
      title: newPageTitle.trim(),
      slug: cleanSlug,
      description: newPageDesc.trim(),
      published: true,
      showInMenu: true,
      menuOrder: customPages.length + 1,
      blocks: [
        {
          id: `block-${Date.now()}-1`,
          type: 'hero',
          title: newPageTitle.trim(),
          subtitle: 'Equipe Gaditas Fight Team',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: `block-${Date.now()}-2`,
          type: 'text',
          title: 'Sobre Esta Seção',
          content: 'Conteúdo inicial da página gerenciável pelo painel do Administrador Geral e Mestre sem necessidade de código.'
        }
      ]
    });

    setShowNewPageModal(false);
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageDesc('');
  };

  const handleAddBlock = (type: PageBlock['type']) => {
    if (!selectedPage) return;

    let newBlock: PageBlock;
    const baseId = `block-${Date.now()}`;

    switch (type) {
      case 'hero':
        newBlock = {
          id: baseId,
          type: 'hero',
          title: 'Novo Destaque Visual',
          subtitle: 'Subtítulo atraente da seção',
          imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200',
          ctaText: 'Saiba Mais',
          ctaUrl: '#detalhes'
        };
        break;
      case 'text':
        newBlock = {
          id: baseId,
          type: 'text',
          title: 'Título do Parágrafo',
          content: 'Escreva aqui o texto explicativo, informações sobre treinos, filosofia de combate ou orientações da equipe.'
        };
        break;
      case 'gallery':
        newBlock = {
          id: baseId,
          type: 'gallery',
          title: 'Galeria de Fotos do Tatame',
          galleryImages: [
            'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=600'
          ]
        };
        break;
      case 'video':
        newBlock = {
          id: baseId,
          type: 'video',
          title: 'Vídeo Oficial da Equipe',
          subtitle: 'Melhores momentos das graduações e combates',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        };
        break;
      case 'pdf':
        newBlock = {
          id: baseId,
          type: 'pdf',
          title: 'Documento Oficial em PDF',
          subtitle: 'Clique para visualizar ou baixar o documento homologado',
          pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          ctaText: 'Baixar Documento (PDF)'
        };
        break;
      case 'form':
        newBlock = {
          id: baseId,
          type: 'form',
          title: 'Formulário Personalizado de Contato',
          subtitle: 'Preencha os campos abaixo para envio direto à coordenação',
          formFields: [
            { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
            { name: 'telefone', label: 'Telefone / WhatsApp', type: 'tel', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'mensagem', label: 'Mensagem / Dúvidas', type: 'textarea', required: false }
          ]
        };
        break;
      case 'cts_grid':
        newBlock = {
          id: baseId,
          type: 'cts_grid',
          title: 'Nossos 13 Centros de Treinamento no RJ',
          subtitle: 'Encontre o polo mais próximo da sua residência'
        };
        break;
      case 'faq':
        newBlock = {
          id: baseId,
          type: 'faq',
          title: 'Perguntas e Respostas Frequentes',
          faqItems: [
            { question: 'Qual a idade mínima para treinar?', answer: 'Recebemos alunos a partir de 6 anos na turma infantil e turmas adultas sem limite de idade.' },
            { question: 'Quais equipamentos preciso para a primeira aula?', answer: 'Para a aula experimental, basta bermuda e camisa adequadas para treino esportivo.' }
          ]
        };
        break;
      case 'notice':
        newBlock = {
          id: baseId,
          type: 'notice',
          title: 'Aviso Importante aos Alunos & Professores',
          content: 'Fiquem atentos às datas de inscrição para a próxima Copa Gaditas e exame geral de faixas.'
        };
        break;
      default:
        return;
    }

    const updatedBlocks = [...selectedPage.blocks, newBlock];
    updateCustomPage(selectedPage.id, { blocks: updatedBlocks });
    setSelectedPage({ ...selectedPage, blocks: updatedBlocks });
    setShowAddBlockMenu(false);
    addNotification('Bloco Adicionado', `Bloco do tipo "${type}" inserido na página.`, 'info');
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!selectedPage) return;
    const blocks = [...selectedPage.blocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;

    const temp = blocks[index];
    blocks[index] = blocks[targetIdx];
    blocks[targetIdx] = temp;

    updateCustomPage(selectedPage.id, { blocks });
    setSelectedPage({ ...selectedPage, blocks });
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!selectedPage) return;
    const blocks = selectedPage.blocks.filter(b => b.id !== blockId);
    updateCustomPage(selectedPage.id, { blocks });
    setSelectedPage({ ...selectedPage, blocks });
    addNotification('Bloco Excluído', 'O elemento foi removido.', 'info');
  };

  const handleUpdateBlockContent = (blockId: string, updates: Partial<PageBlock>) => {
    if (!selectedPage) return;
    const blocks = selectedPage.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b);
    updateCustomPage(selectedPage.id, { blocks });
    setSelectedPage({ ...selectedPage, blocks });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-cinzel">
              Sistema de Gerenciamento Total (CMS & Construtor de Páginas)
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Painel independente tipo WordPress. O Mestre e Administrador Geral alteram textos, banners, fotos, cores, menus, rodapé e criam páginas dinâmicas com blocos arrastáveis sem encostar em código.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('public_site')}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>Ver Site Ao Vivo</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('paginas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'paginas' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Construtor de Páginas ({customPages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identidade')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'identidade' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Identidade Visual, Banners & Cores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('menus')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'menus' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Navegação & Menus</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rodape')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rodape' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Rodapé, Contatos & Redes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('avisos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'avisos' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Barra de Avisos & Lema Superior</span>
        </button>
      </div>

      {/* TAB 1: CONSTRUTOR DE PÁGINAS (WORDPRESS STYLE) */}
      {activeTab === 'paginas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pages List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Páginas do Portal</h3>
                <p className="text-[11px] text-neutral-400">Total: {customPages.length} páginas ativas</p>
              </div>

              <button
                type="button"
                onClick={() => setShowNewPageModal(true)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Página</span>
              </button>
            </div>

            <div className="space-y-2">
              {customPages.map(page => (
                <div
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedPage?.id === page.id 
                      ? 'bg-neutral-800/90 border-red-500 shadow-lg' 
                      : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate block">{page.title}</span>
                      {page.published ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold shrink-0">
                          Publicada
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-bold shrink-0">
                          Rascunho
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-1">
                      <span className="text-red-400">/{page.slug}</span>
                      <span>·</span>
                      <span>{page.blocks.length} blocos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Deseja realmente excluir a página "${page.title}"?`)) {
                          deleteCustomPage(page.id);
                          if (selectedPage?.id === page.id) {
                            setSelectedPage(customPages[0] || null);
                          }
                        }
                      }}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Excluir Página"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Block Builder & Live Editor (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedPage ? (
              <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
                {/* Page Info & Controls Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white font-cinzel">{selectedPage.title}</h2>
                      <span className="text-xs font-mono text-red-500 font-bold">/{selectedPage.slug}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{selectedPage.description || 'Página gerenciável sem programação'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                        previewMode 
                          ? 'bg-amber-500 text-neutral-950 border-amber-400' 
                          : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{previewMode ? 'Modo Edição' : 'Pré-visualizar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAddBlockMenu(!showAddBlockMenu)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-red-950/40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Bloco</span>
                    </button>
                  </div>
                </div>

                {/* Add Block Menu Popover */}
                {showAddBlockMenu && (
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 animate-in fade-in space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Selecione o tipo de bloco para inserir:
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddBlockMenu(false)}
                        className="text-neutral-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddBlock('hero')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <ImageIcon className="w-5 h-5 text-red-500 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Banner Hero</span>
                        <span className="text-[10px] text-neutral-400">Título & imagem topo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('text')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <FileText className="w-5 h-5 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Texto & Conteúdo</span>
                        <span className="text-[10px] text-neutral-400">Parágrafos & títulos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('gallery')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <Layers className="w-5 h-5 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Galeria de Fotos</span>
                        <span className="text-[10px] text-neutral-400">Grade de imagens</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('video')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <Video className="w-5 h-5 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Vídeo YouTube</span>
                        <span className="text-[10px] text-neutral-400">Player de vídeo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('pdf')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <FileText className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Download PDF</span>
                        <span className="text-[10px] text-neutral-400">Regulamentos & termos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('form')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <Sliders className="w-5 h-5 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Formulário</span>
                        <span className="text-[10px] text-neutral-400">Captura de contatos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('cts_grid')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <Building2 className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">Grid de CTs</span>
                        <span className="text-[10px] text-neutral-400">Lista dos 13 polos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('faq')}
                        className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
                      >
                        <HelpCircle className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block">FAQ Perguntas</span>
                        <span className="text-[10px] text-neutral-400">Dúvidas frequentes</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Blocks List */}
                <div className="space-y-4">
                  {selectedPage.blocks.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-neutral-800 rounded-3xl space-y-3">
                      <LayoutTemplate className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-400">Esta página ainda não possui blocos.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddBlockMenu(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Inserir Primeiro Bloco
                      </button>
                    </div>
                  ) : (
                    selectedPage.blocks.map((block, idx) => (
                      <div
                        key={block.id}
                        className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 hover:border-neutral-700 transition-all shadow-sm"
                      >
                        {/* Block Header & Reorder toolbar */}
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-900 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-neutral-900 text-neutral-400 flex items-center justify-center font-mono font-bold text-[10px]">
                              #{idx + 1}
                            </span>
                            <span className="font-mono text-red-400 uppercase font-bold text-[11px]">
                              {block.type === 'hero' ? 'Banner Hero' :
                               block.type === 'text' ? 'Texto & Conteúdo' :
                               block.type === 'gallery' ? 'Galeria de Fotos' :
                               block.type === 'video' ? 'Vídeo Embed' :
                               block.type === 'pdf' ? 'Download de PDF' :
                               block.type === 'form' ? 'Formulário Personalizado' :
                               block.type === 'cts_grid' ? 'Grid dos 13 CTs' :
                               block.type === 'faq' ? 'FAQ Sanfona' : 'Aviso em Destaque'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveBlock(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30"
                              title="Mover para cima"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveBlock(idx, 'down')}
                              disabled={idx === selectedPage.blocks.length - 1}
                              className="p-1 rounded bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30"
                              title="Mover para baixo"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlock(block.id)}
                              className="p-1 rounded bg-neutral-900 text-neutral-400 hover:text-red-400 ml-2"
                              title="Excluir Bloco"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Block Inline Controls based on Type */}
                        <div className="space-y-3 pt-1">
                          {/* Common Title & Subtitle */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Título do Bloco</label>
                              <input
                                type="text"
                                value={block.title || ''}
                                onChange={(e) => handleUpdateBlockContent(block.id, { title: e.target.value })}
                                placeholder="Título da seção..."
                                className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-red-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Subtítulo / Descrição Curta</label>
                              <input
                                type="text"
                                value={block.subtitle || ''}
                                onChange={(e) => handleUpdateBlockContent(block.id, { subtitle: e.target.value })}
                                placeholder="Subtítulo..."
                                className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-red-500"
                              />
                            </div>
                          </div>

                          {/* Specific Block Fields */}
                          {block.type === 'hero' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-neutral-400 font-mono block mb-1">URL da Foto de Fundo</label>
                                <input
                                  type="text"
                                  value={block.imageUrl || ''}
                                  onChange={(e) => handleUpdateBlockContent(block.id, { imageUrl: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Botão CTA</label>
                                  <input
                                    type="text"
                                    value={block.ctaText || ''}
                                    onChange={(e) => handleUpdateBlockContent(block.id, { ctaText: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Link do Botão</label>
                                  <input
                                    type="text"
                                    value={block.ctaUrl || ''}
                                    onChange={(e) => handleUpdateBlockContent(block.id, { ctaUrl: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {block.type === 'text' && (
                            <div>
                              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Conteúdo do Texto</label>
                              <textarea
                                rows={3}
                                value={block.content || ''}
                                onChange={(e) => handleUpdateBlockContent(block.id, { content: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white leading-relaxed"
                              />
                            </div>
                          )}

                          {block.type === 'video' && (
                            <div>
                              <label className="text-[10px] text-neutral-400 font-mono block mb-1">URL do Vídeo (YouTube embed ou MP4)</label>
                              <input
                                type="text"
                                value={block.videoUrl || ''}
                                onChange={(e) => handleUpdateBlockContent(block.id, { videoUrl: e.target.value })}
                                placeholder="https://www.youtube.com/embed/..."
                                className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                              />
                            </div>
                          )}

                          {block.type === 'pdf' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-neutral-400 font-mono block mb-1">URL do Arquivo PDF</label>
                                <input
                                  type="text"
                                  value={block.pdfUrl || ''}
                                  onChange={(e) => handleUpdateBlockContent(block.id, { pdfUrl: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Texto do Botão de Download</label>
                                <input
                                  type="text"
                                  value={block.ctaText || ''}
                                  onChange={(e) => handleUpdateBlockContent(block.id, { ctaText: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                                />
                              </div>
                            </div>
                          )}

                          {block.type === 'form' && (
                            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-2">
                              <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                                Campos configurados neste formulário ({block.formFields?.length || 0}):
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {block.formFields?.map((f, fIdx) => (
                                  <span key={fIdx} className="px-2.5 py-1 rounded bg-neutral-950 text-neutral-300 border border-neutral-800 font-mono text-[11px]">
                                    {f.label} ({f.type})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400">
                Selecione uma página à esquerda ou crie uma nova para começar a editar blocos.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: IDENTIDADE VISUAL, CORES E BANNERS */}
      {activeTab === 'identidade' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-white font-cinzel flex items-center gap-2">
              <Palette className="w-5 h-5 text-red-500" />
              <span>Logotipo, Favicon e Cores Oficiais do Sistema</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logotipo */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-white block">Logotipo Principal da Equipe</span>
                <div className="flex items-center gap-4">
                  <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-black p-2 border border-neutral-800" />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="URL da logo..."
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                    <input
                      type="file"
                      ref={logoFileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setLogoUrl)}
                    />
                    <button
                      type="button"
                      onClick={() => logoFileRef.current?.click()}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fazer Upload do Arquivo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-white block">Favicon (Ícone do Navegador)</span>
                <div className="flex items-center gap-4">
                  <img src={faviconUrl} alt="Favicon" className="w-12 h-12 rounded-lg object-contain bg-black p-1 border border-neutral-800" />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="URL do favicon..."
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                    <input
                      type="file"
                      ref={faviconFileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFaviconUrl)}
                    />
                    <button
                      type="button"
                      onClick={() => faviconFileRef.current?.click()}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fazer Upload do Favicon</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Palette Switcher */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Cores Globais do Sistema</span>
                  <p className="text-[11px] text-neutral-400">Defina as cores primárias de botões, destaques e gradientes.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">{primaryColor}</span>
                    <span className="text-[10px] text-neutral-400">Cor Primária (Vermelho Oficial)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">{accentColor}</span>
                    <span className="text-[10px] text-neutral-400">Cor de Destaque (Dourado / Âmbar)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Principal do Site */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-white block">Banner Principal da Página Inicial</span>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Título do Banner</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Subtítulo do Banner</label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">URL da Imagem de Fundo</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={heroBannerUrl}
                      onChange={(e) => setHeroBannerUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                    <input
                      type="file"
                      ref={heroFileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setHeroBannerUrl)}
                    />
                    <button
                      type="button"
                      onClick={() => heroFileRef.current?.click()}
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-red-950/40"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações de Identidade</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: MENUS DE NAVEGAÇÃO */}
      {activeTab === 'menus' && (
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">Navegação & Links do Menu</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Gerencie os links exibidos na barra superior do site institucional.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Início</span>
                <span className="text-[10px] text-neutral-500 font-mono">(Página Principal)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Padrão</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">13 Polos (CTs)</span>
                <span className="text-[10px] text-neutral-500 font-mono">(Mapa e Endereços)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Padrão</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Ranking Oficial</span>
                <span className="text-[10px] text-neutral-500 font-mono">(Tabela de Pontos)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Padrão</span>
            </div>

            {/* Custom pages links */}
            {customPages.map(page => (
              <div key={page.id} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{page.title}</span>
                  <span className="text-[10px] text-red-400 font-mono">/{page.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${page.showInMenu ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {page.showInMenu ? 'Exibido no Menu' : 'Oculto'}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCustomPage(page.id, { showInMenu: !page.showInMenu })}
                    className="text-xs text-neutral-400 hover:text-white underline"
                  >
                    Alternar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RODAPÉ & CONTATOS */}
      {activeTab === 'rodape' && (
        <form onSubmit={handleSaveBranding} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
          <h2 className="text-base font-bold text-white font-cinzel">Configurações de Rodapé e Contatos Oficiais</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">WhatsApp Oficial</label>
              <input
                type="text"
                value={socialWhatsapp}
                onChange={(e) => setSocialWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Instagram da Equipe</label>
              <input
                type="text"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Canal do YouTube</label>
              <input
                type="text"
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">E-mail de Contato</label>
              <input
                type="text"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-neutral-400 font-mono block mb-1">Endereço da Sede Fundacional</label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[10px] text-neutral-400 font-mono block mb-1">Texto de Copyright & Assinatura do Rodapé</label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-red-950/40"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados de Rodapé</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: BARRA DE AVISOS & LEMA */}
      {activeTab === 'avisos' && (
        <form onSubmit={handleSaveBranding} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
          <h2 className="text-base font-bold text-white font-cinzel">Barra de Avisos Superior & Lema Oficial</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="annEnable"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="annEnable" className="text-xs text-white font-bold cursor-pointer">
                Exibir Barra Superior em todas as páginas públicas
              </label>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Texto da Barra de Aviso</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Link de Ação Rápida (Opcional)</label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="#cts ou /aula-experimental"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-red-950/40"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Barra de Avisos</span>
            </button>
          </div>
        </form>
      )}

      {/* New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-sm font-cinzel">Criar Nova Página</h3>
              <button type="button" onClick={() => setShowNewPageModal(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Título da Página</label>
                <input
                  type="text"
                  required
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  placeholder="Ex: Treinos de Sábado & Aulões"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Slug da URL (sem espaços)</label>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="Ex: treinos-sabado"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-red-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Descrição Curta (SEO)</label>
                <textarea
                  rows={2}
                  value={newPageDesc}
                  onChange={(e) => setNewPageDesc(e.target.value)}
                  placeholder="Descrição da página para os motores de busca..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Criar Página
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
