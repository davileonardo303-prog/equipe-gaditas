import React, { useState, useRef } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { storageService } from '../../services/storageService';
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  FileText,
  Sparkles,
  Camera,
  FolderOpen
} from 'lucide-react';

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl: string;
  title: string;
  subtitle?: string;
  onSave: (newUrl: string) => void;
  allowPdf?: boolean;
}

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  title,
  subtitle,
  onSave,
  allowPdf = false
}) => {
  const { mediaFiles, addMediaFile, addNotification } = useGaditas();

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [selectedUrl, setSelectedUrl] = useState<string>(currentPhotoUrl);
  const [urlInput, setUrlInput] = useState<string>(currentPhotoUrl.startsWith('http') ? currentPhotoUrl : '');
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeKb, setFileSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setIsProcessing(true);

    try {
      const processed = await storageService.processUploadedFile(file);
      setSelectedUrl(processed.dataUrl);
      setFileName(processed.name);
      setFileSizeKb(processed.sizeKb);

      // Also auto-register in media library so it can be reused
      addMediaFile({
        name: processed.name,
        folder: file.type === 'application/pdf' ? 'Documentos' : 'Galeria',
        fileType: file.type === 'application/pdf' ? 'pdf' : 'image',
        url: processed.dataUrl,
        sizeKb: processed.sizeKb
      });
    } catch {
      setErrorMsg('Falha ao processar o arquivo. Tente outra imagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMsg('Insira uma URL de imagem válida.');
      return;
    }
    setErrorMsg('');
    setSelectedUrl(urlInput.trim());
  };

  const handleSave = () => {
    if (!selectedUrl) {
      setErrorMsg('Por favor selecione ou carregue uma imagem.');
      return;
    }
    onSave(selectedUrl);
    addNotification('Foto Atualizada', 'A imagem foi aplicada e salva com sucesso!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border-2 border-red-600/50 shadow-2xl p-6 sm:p-7 text-xs flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-950/40 border border-white/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-cinzel">
                {title}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {subtitle || 'Altere ou carregue fotos do seu celular/computador ou insira uma URL'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 p-1 bg-black rounded-xl border border-neutral-800 my-4 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Do Aparelho</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'url' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link / URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'library' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Galeria</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: UPLOAD DO APARELHO */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept={allowPdf ? 'image/*,application/pdf' : 'image/*'} 
                className="hidden" 
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-red-600/50 hover:border-red-500 bg-black/60 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-black/90 group"
              >
                <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-500 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center mx-auto mb-2 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="font-bold text-white text-sm">
                  {isProcessing ? 'Processando arquivo...' : 'Clique para selecionar foto ou arraste aqui'}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Suporta JPG, PNG, WEBP {allowPdf && 'e PDF'} do seu celular ou computador
                </p>
                {fileName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 text-white text-[11px] font-mono">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{fileName} ({fileSizeKb} KB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LINK DA WEB */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-neutral-300 font-bold">Cole o link direto da imagem:</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/minha-foto.jpg"
                  className="flex-1 bg-black border border-neutral-800 focus:border-red-600 rounded-xl px-3 py-2 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                >
                  Carregar
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GALERIA EXISTENTE */}
          {activeTab === 'library' && (
            <div className="space-y-2">
              <p className="text-neutral-400 text-[11px]">Selecione uma imagem já enviada para a instituição:</p>
              <div className="grid grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 bg-black rounded-xl border border-neutral-800">
                {mediaFiles.filter(m => m.fileType === 'image').map((media) => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => setSelectedUrl(media.url)}
                    className={`relative rounded-lg overflow-hidden border-2 aspect-square group transition-all ${
                      selectedUrl === media.url 
                        ? 'border-red-600 scale-95 shadow-md shadow-red-950/50' 
                        : 'border-transparent hover:border-neutral-600'
                    }`}
                  >
                    <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                    {selectedUrl === media.url && (
                      <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview Area */}
          <div className="p-3.5 rounded-2xl bg-black border border-neutral-800 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Pré-visualização da Foto
            </span>
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-red-600 bg-neutral-950 shrink-0 shadow-md">
                {selectedUrl.endsWith('.pdf') ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-red-950/40 text-red-400">
                    <FileText className="w-8 h-8 mb-1" />
                    <span className="text-[9px] font-bold">Arquivo PDF</span>
                  </div>
                ) : (
                  <img 
                    src={selectedUrl || currentPhotoUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-white font-bold text-xs block">
                  Status: Imagem Pronta para Aplicação
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Ao salvar, esta foto substituirá a anterior imediatamente em todas as áreas públicas e privadas do site.
                </p>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <Sparkles className="w-3 h-3" />
                  <span>Salvo localmente com persistência</span>
                </div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 flex items-center gap-2 border border-white/20"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Nova Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
