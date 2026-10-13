import React, { useState, useRef } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { Professor, BeltType } from '../../types';
import { BeltBadge } from '../Common/BeltBadge';
import { storageService } from '../../services/storageService';
import { 
  GraduationCap, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Percent, 
  DollarSign, 
  Users, 
  Phone,
  X,
  Upload,
  Search
} from 'lucide-react';

export const ProfessorsList: React.FC = () => {
  const { 
    professors, 
    addProfessor, 
    updateProfessor, 
    approveProfessor, 
    trainingCenters,
    setCurrentProfessor,
    setCurrentRole 
  } = useGaditas();

  const [showModal, setShowModal] = useState(false);
  const [editingProf, setEditingProf] = useState<Professor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [belt, setBelt] = useState<BeltType>('Preta');
  const [degrees, setDegrees] = useState(2);
  const [role, setRole] = useState('Head Coach Jiu-Jitsu');
  const [tcId, setTcId] = useState(trainingCenters[0]?.id || 'ct-matriz');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [commissionRate, setCommissionRate] = useState(20);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processed = await storageService.processUploadedFile(file);
      setPhotoUrl(processed.dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const openNew = () => {
    setEditingProf(null);
    setName('');
    setPhone('(11) 9');
    setCpf('111.222.333-44');
    setBelt('Preta');
    setDegrees(1);
    setRole('Instrutor Oficial');
    setTcId(trainingCenters[0]?.id || 'ct-matriz');
    setBio('Faixa preta com vasta experiência competitiva e didática.');
    setPhotoUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400');
    setCommissionRate(20);
    setShowModal(true);
  };

  const openEdit = (prof: Professor) => {
    setEditingProf(prof);
    setName(prof.name);
    setPhone(prof.phone);
    setCpf(prof.cpf);
    setBelt(prof.belt);
    setDegrees(prof.degrees);
    setRole(prof.role);
    setTcId(prof.trainingCenterId);
    setBio(prof.bio);
    setPhotoUrl(prof.photoUrl);
    setCommissionRate(prof.commissionRate);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenTc = trainingCenters.find(t => t.id === tcId);

    if (editingProf) {
      updateProfessor({
        ...editingProf,
        name,
        phone,
        cpf,
        belt,
        degrees: Number(degrees),
        role,
        trainingCenterId: tcId,
        trainingCenterName: chosenTc?.name || 'CT Matriz',
        bio,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
        commissionRate: Number(commissionRate)
      });
    } else {
      addProfessor({
        name,
        phone,
        cpf,
        belt,
        degrees: Number(degrees),
        role,
        trainingCenterId: tcId,
        trainingCenterName: chosenTc?.name || 'CT Matriz',
        bio,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
        studentsCount: 20,
        commissionRate: Number(commissionRate),
        baseSalary: 1200,
        status: 'Aprovado'
      });
    }
    setShowModal(false);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Gestão de Professores & Treinadores
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cadastro completo, biografia, aprovação do Mestre, comissões de alunos e controle de turmas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar professor ou polo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 w-52 sm:w-64"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          </div>

          <button
            type="button"
            onClick={openNew}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Professor</span>
          </button>
        </div>
      </div>

      {/* Info Badge */}
      <div className="flex items-center justify-between text-xs text-neutral-400 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
        <span className="font-mono text-neutral-300">
          Total de <strong className="text-white">{professors.length} Professores</strong> e <strong className="text-white">{trainingCenters.length} Polos/CTs</strong> Cadastrados
        </span>
        <span className="text-[11px] text-amber-400 font-mono">
          MT-01 ao MT-13
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors
          .filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.trainingCenterName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.role.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(prof => (
          <div key={prof.id} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <img 
                  src={prof.photoUrl} 
                  alt={prof.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/30 bg-neutral-950 shadow-md" 
                />
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(prof)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    title="Editar Cadastro"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-neutral-100">{prof.name}</h3>
                  <BeltBadge belt={prof.belt} stripes={prof.degrees} size="sm" />
                </div>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">{prof.role}</p>
                <p className="text-xs text-neutral-400 mt-1">{prof.trainingCenterName}</p>
                <p className="text-[11px] text-neutral-500 mt-1 font-mono">CPF: {prof.cpf} · {prof.phone}</p>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed italic bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
                "{prof.bio}"
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Alunos Vinculados:</span>
                <span className="font-bold text-neutral-200">{prof.studentsCount} alunos</span>
              </div>

              <div className="flex items-center justify-between text-neutral-400">
                <span>Comissão por Aluno:</span>
                <span className="font-mono font-bold text-emerald-400">{prof.commissionRate}%</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                {prof.status === 'Aprovado' ? (
                  <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Homologado</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => approveProfessor(prof.id)}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Aprovar
                  </button>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">
                {editingProf ? 'Editar Professor' : 'Cadastrar Professor'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Telefone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">CPF</label>
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Faixa</label>
                  <select
                    value={belt}
                    onChange={(e) => setBelt(e.target.value as BeltType)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Preta">Preta</option>
                    <option value="Coral">Coral</option>
                    <option value="Marrom">Marrom</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Graus</label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={degrees}
                    onChange={(e) => setDegrees(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Comissão (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Cargo / Função</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Centro de Treinamento (CT)</label>
                <select
                  value={tcId}
                  onChange={(e) => setTcId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                >
                  {trainingCenters.map(tc => (
                    <option key={tc.id} value={tc.id}>{tc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Biografia Resumida</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-300 block">Foto do Professor</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-red-400 hover:text-white font-bold flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Escolher Foto do Computador/Celular</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="URL ou arquivo carregado (Data URL)"
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-hidden"
                  />
                  {photoUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black border border-neutral-700 shrink-0">
                      <img src={photoUrl} alt="Preview Professor" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Salvar Professor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
