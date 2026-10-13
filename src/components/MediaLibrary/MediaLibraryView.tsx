import React, { useState, useRef } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { MediaFile } from '../../types';
import { 
  Folder, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Plus, 
  X,
  ExternalLink,
  Download,
  Share2,
  Edit2,
  Eye,
  FolderPlus,
  Play
} from 'lucide-react';

const DEFAULT_FOLDERS = [
  'Atletas',
  'Eventos',
  'Banners',
  'Professores',
  'Galeria',
  'Certificados',
  'Patrocinadores',
  'Documentos'
];

export const MediaLibraryView: React.FC = () => {
  const { mediaFiles, addMediaFile, deleteMediaFile, renameMediaFile, addNotification } = useGaditas();

  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'image' | 'video' | 'pdf'>('all');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState('');

  // Modals for Actions
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Form state
  const [name, setName] = useState('');
  const [folder, setFolder] = useState<any>('Galeria');
  const [fileType, setFileType] = useState<'image' | 'video' | 'pdf'>('image');
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const allFolders = [...DEFAULT_FOLDERS, ...customFolders];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setName(file.name);
    if (file.type.startsWith('image/')) setFileType('image');
    else if (file.type.startsWith('video/')) setFileType('video');
    else setFileType('pdf');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUrl(result);
      setIsProcessing(false);
      addNotification('Arquivo Carregado', `${file.name} pronto para ser salvo.`, 'info');
    };
    reader.onerror = () => {
      setIsProcessing(false);
      addNotification('Erro', 'Falha ao processar arquivo local.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const clean = newFolderName.trim();
    if (allFolders.includes(clean)) {
      addNotification('Aviso', 'Esta pasta já existe.', 'warning');
      return;
    }
    setCustomFolders(prev => [...prev, clean]);
    setActiveFolder(clean);
    setShowNewFolderModal(false);
    setNewFolderName('');
    addNotification('Pasta Criada', `Pasta "${clean}" criada na biblioteca.`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      addNotification('Erro no Upload', 'Por favor insira uma URL ou escolha um arquivo.', 'error');
      return;
    }

    addMediaFile({
      name: name.trim() || 'arquivo_gaditas.jpg',
      folder: folder as any,
      fileType,
      url,
      sizeKb: 450
    });

    setShowUploadModal(false);
    setUrl('');
    setName('');
    addNotification('Arquivo Salvo', 'Mídia inserida com sucesso na biblioteca.', 'success');
  };

  const handleDownloadFile = (file: MediaFile) => {
    try {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addNotification('Download Iniciado', `Baixando ${file.name}...`, 'success');
    } catch {
      window.open(file.url, '_blank');
    }
  };

  const handleCopyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    addNotification('Link Copiado', `URL de ${file.name} copiada para a área de transferência.`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (file: MediaFile) => {
    const text = `Confira este arquivo da Equipe Gaditas Fight Team: ${file.name}\n${file.url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleConfirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFile && renameInput.trim()) {
      renameMediaFile(editingFile.id, renameInput.trim());
      setEditingFile(null);
      setRenameInput('');
    }
  };

  const filtered = mediaFiles.filter(m => {
    const matchFolder = activeFolder === 'all' || m.folder === activeFolder;
    const matchType = fileTypeFilter === 'all' || m.fileType === fileTypeFilter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Folder className="w-6 h-6 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-cinzel">
              Sistema de Mídia & Arquivos
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Biblioteca centralizada de fotos, vídeos, PDFs e documentos da equipe. Upload ilimitado, organização por pastas, compartilhamento e downloads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewFolderModal(true)}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
            <span>Criar Pasta</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-red-950/40"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Fazer Upload</span>
          </button>
        </div>
      </div>

      {/* Folders Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveFolder('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeFolder === 'all'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Todas as Pastas ({mediaFiles.length})
        </button>

        {allFolders.map(f => {
          const count = mediaFiles.filter(m => m.folder === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFolder(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                activeFolder === f
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-amber-500" />
              <span>{f}</span>
              <span className="text-[10px] opacity-70 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-neutral-400 uppercase font-bold pl-2">Tipo:</span>
          <button
            type="button"
            onClick={() => setFileTypeFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${fileTypeFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFileTypeFilter('image')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${fileTypeFilter === 'image' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            <ImageIcon className="w-3 h-3 text-red-500" />
            <span>Fotos</span>
          </button>
          <button
            type="button"
            onClick={() => setFileTypeFilter('video')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${fileTypeFilter === 'video' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            <Video className="w-3 h-3 text-blue-400" />
            <span>Vídeos</span>
          </button>
          <button
            type="button"
            onClick={() => setFileTypeFilter('pdf')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${fileTypeFilter === 'pdf' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            <FileText className="w-3 h-3 text-emerald-400" />
            <span>PDFs / Docs</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar arquivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400 space-y-2">
            <Folder className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs">Nenhum arquivo encontrado nesta pasta.</p>
          </div>
        ) : (
          filtered.map(file => (
            <div
              key={file.id}
              className="group relative rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all shadow-md"
            >
              {/* Media Preview Box */}
              <div 
                className="relative aspect-square bg-neutral-950 cursor-pointer overflow-hidden flex items-center justify-center"
                onClick={() => setPreviewFile(file)}
              >
                {file.fileType === 'image' && (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {file.fileType === 'video' && (
                  <div className="flex flex-col items-center justify-center gap-2 text-neutral-400 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                      <Play className="w-6 h-6 ml-0.5" />
                    </div>
                    <span className="text-[10px] font-mono">Vídeo MP4</span>
                  </div>
                )}

                {file.fileType === 'pdf' && (
                  <div className="flex flex-col items-center justify-center gap-2 text-neutral-400 p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono">PDF / Documento</span>
                  </div>
                )}

                {/* Hover overlay quick view */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewFile(file);
                    }}
                    className="p-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors"
                    title="Visualizar em Tela Cheia"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile(file);
                    }}
                    className="p-2 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                    title="Baixar Arquivo"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareWhatsApp(file);
                    }}
                    className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                    title="Compartilhar no WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Media Info Footer */}
              <div className="p-3 text-xs space-y-1.5 bg-neutral-900 border-t border-neutral-800">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-white truncate block text-[11px]" title={file.name}>
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFile(file);
                      setRenameInput(file.name);
                    }}
                    className="text-neutral-500 hover:text-white"
                    title="Renomear"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>{file.folder}</span>
                  <span>{file.sizeKb} KB</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(file)}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    {copiedId === file.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir "${file.name}"?`)) {
                        deleteMediaFile(file.id);
                        addNotification('Arquivo Excluído', 'O arquivo foi removido da biblioteca.', 'info');
                      }
                    }}
                    className="text-neutral-500 hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-white text-sm">{previewFile.name}</h3>
                <span className="text-[11px] font-mono text-neutral-400">Pasta: {previewFile.folder} · {previewFile.sizeKb} KB</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadFile(previewFile)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(previewFile)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center max-h-[70vh] overflow-hidden rounded-2xl bg-black p-2">
              {previewFile.fileType === 'image' && (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              )}
              {previewFile.fileType === 'video' && (
                <video
                  src={previewFile.url}
                  controls
                  autoPlay
                  className="max-h-[65vh] w-full rounded-lg"
                />
              )}
              {previewFile.fileType === 'pdf' && (
                <div className="p-8 text-center space-y-4">
                  <FileText className="w-16 h-16 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">Visualização de Documento / PDF</p>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(previewFile)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Baixar PDF Completo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rename File Modal */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-sm">Renomear Arquivo</h3>
              <button type="button" onClick={() => setEditingFile(null)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRename} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Novo Nome do Arquivo</label>
                <input
                  type="text"
                  required
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Salvar Nome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-sm">Criar Nova Pasta</h3>
              <button type="button" onClick={() => setShowNewFolderModal(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Nome da Pasta</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ex: Treinos de Sábado"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Criar Pasta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-sm">Upload de Mídia / Arquivo</h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Escolher Arquivo do Computador / Celular</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
                {isProcessing && <p className="text-[10px] text-amber-400 mt-1 animate-pulse">Processando arquivo...</p>}
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Nome do Arquivo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: aula_muaythai_sabado.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Pasta</label>
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    {allFolders.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Tipo de Mídia</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="image">Foto / Imagem</option>
                    <option value="video">Vídeo</option>
                    <option value="pdf">PDF / Documento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">URL Direta (ou gerada pelo arquivo acima)</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!url || isProcessing}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold"
                >
                  Salvar na Biblioteca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
