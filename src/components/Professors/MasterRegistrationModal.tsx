import React, { useState, useRef } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { Master, BeltType } from '../../types';
import { storageService } from '../../services/storageService';
import { Crown, Upload, X, Check, Shield } from 'lucide-react';

interface MasterRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterToEdit?: Master | null;
}

export const MasterRegistrationModal: React.FC<MasterRegistrationModalProps> = ({
  isOpen,
  onClose,
  masterToEdit
}) => {
  const { addMaster, updateMaster, trainingCenters, addNotification } = useGaditas();

  const [name, setName] = useState(masterToEdit?.name || '');
  const [photoUrl, setPhotoUrl] = useState(masterToEdit?.photoUrl || '');
  const [phone, setPhone] = useState(masterToEdit?.phone || '(21) 98765-4321');
  const [email, setEmail] = useState(masterToEdit?.email || '');
  const [cpf, setCpf] = useState(masterToEdit?.cpf || '000.000.000-00');
  const [belt, setBelt] = useState<BeltType>(masterToEdit?.belt || 'Preta');
  const [title, setTitle] = useState(masterToEdit?.title || 'Grau Preta e Branca (Muay Thai) · Faixa Preta (Luta Livre)');
  const [bio, setBio] = useState(masterToEdit?.bio || '');
  const [trainingCenterId, setTrainingCenterId] = useState(masterToEdit?.trainingCenterId || trainingCenters[0]?.id || 'ct-matriz');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPhotoUploading(true);
    try {
      const processed = await storageService.processUploadedFile(file);
      setPhotoUrl(processed.dataUrl);
    } catch {
      addNotification('Erro no Upload', 'Falha ao processar a foto do Mestre.', 'error');
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addNotification('Nome Obrigatório', 'Preencha o nome do Mestre.', 'error');
      return;
    }

    const tc = trainingCenters.find(t => t.id === trainingCenterId) || trainingCenters[0];
    const defaultPhoto = photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400';

    if (masterToEdit) {
      updateMaster({
        ...masterToEdit,
        name: name.trim(),
        photoUrl: defaultPhoto,
        phone,
        email,
        cpf,
        belt,
        title,
        bio,
        trainingCenterId: tc.id,
        trainingCenterName: tc.name
      });
      addNotification('Mestre Atualizado', `${name} foi atualizado com sucesso.`, 'success');
    } else {
      addMaster({
        name: name.trim(),
        photoUrl: defaultPhoto,
        phone,
        email,
        cpf,
        belt,
        title,
        bio,
        trainingCenterId: tc.id,
        trainingCenterName: tc.name,
        status: 'Aprovado',
        joinedDate: new Date().toISOString().split('T')[0],
        isFounder: false
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border-2 border-red-600/50 shadow-2xl p-6 sm:p-7 text-xs flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-950/40 border border-white/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-cinzel">
                {masterToEdit ? 'Editar Dados do Mestre' : 'Cadastrar Novo Mestre (Admin Geral)'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Hierarquia máxima: o Administrador Geral homologa Mestres na instituição
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Foto do Mestre */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-black border border-neutral-800">
            <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-red-600 bg-neutral-950 shrink-0">
              <img 
                src={photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <span className="font-bold text-white block">Foto do Mestre</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isPhotoUploading ? 'Carregando...' : 'Carregar Foto'}</span>
                </button>
              </div>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Ou cole o link da foto..."
                className="w-full px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">Nome Completo do Mestre *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mestre Daniel Braga"
              className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs outline-none focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-bold block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mestre@gaditasfteam.com.br"
                className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-bold block mb-1">WhatsApp / Telefone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(21) 98765-4321"
                className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">Título & Graduações *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Grau Preta e Branca (Muay Thai) · Faixa Preta (Luta Livre)"
              className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs outline-none focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-bold block mb-1">Faixa Principal</label>
              <select
                value={belt}
                onChange={(e) => setBelt(e.target.value as BeltType)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs outline-none focus:border-red-600"
              >
                <option value="Preta">Faixa Preta</option>
                <option value="Coral">Faixa Coral (Mestre)</option>
                <option value="Vermelha">Faixa Vermelha (Grão-Mestre)</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-300 font-bold block mb-1">Polo / CT Sede</label>
              <select
                value={trainingCenterId}
                onChange={(e) => setTrainingCenterId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs outline-none focus:border-red-600"
              >
                {trainingCenters.map(tc => (
                  <option key={tc.id} value={tc.id}>{tc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">Biografia e Trajetória Marcial</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Histórico, linhagem técnica, títulos e formação marcial..."
              className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs outline-none focus:border-red-600 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white font-bold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider transition-all shadow-md shadow-red-950/50 flex items-center gap-2 border border-white/20"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Mestre</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
