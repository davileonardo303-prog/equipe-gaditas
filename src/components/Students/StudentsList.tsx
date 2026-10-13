import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { Student, BeltType, ModalityType, WeightCategory } from '../../types';
import { BeltBadge } from '../Common/BeltBadge';
import { StudentCardModal } from '../DigitalCard/StudentCardModal';
import { storageService } from '../../services/storageService';
import { 
  Users, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  Edit3, 
  Trash2, 
  FileText, 
  HeartPulse, 
  DollarSign,
  X,
  Upload
} from 'lucide-react';

export const StudentsList: React.FC = () => {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    approveStudent, 
    trainingCenters, 
    professors,
    setCurrentStudent,
    setCurrentRole
  } = useGaditas();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ativo' | 'Inativo' | 'Pendente'>('all');
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [selectedStudentForMedical, setSelectedStudentForMedical] = useState<Student | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [belt, setBelt] = useState<BeltType>('Branca');
  const [stripes, setStripes] = useState(0);
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [weightCategory, setWeightCategory] = useState<WeightCategory>('Leve (-76kg)');
  const [modality, setModality] = useState<ModalityType>('Jiu-Jitsu');
  const [tcId, setTcId] = useState(trainingCenters[0]?.id || 'ct-matriz');
  const [profId, setProfId] = useState(professors[0]?.id || 'prof-roberto');
  const [monthlyFee, setMonthlyFee] = useState(150);
  const [photoUrl, setPhotoUrl] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Família');
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('Nenhuma');
  const [healthNotes, setHealthNotes] = useState('Apto para prática marcial.');
  const [hasSignedWaiver, setHasSignedWaiver] = useState(true);
  const studentFileRef = React.useRef<HTMLInputElement>(null);

  const handleStudentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processed = await storageService.processUploadedFile(file);
      setPhotoUrl(processed.dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const openNewModal = () => {
    setEditingStudent(null);
    setName('');
    setCpf('123.456.789-99');
    setEmail('novo.aluno@gaditas.com');
    setPhone('(11) 98888-7777');
    setBirthDate('2002-05-10');
    setBelt('Branca');
    setStripes(0);
    setWeight(75);
    setHeight(175);
    setWeightCategory('Leve (-76kg)');
    setModality('Jiu-Jitsu');
    setTcId(trainingCenters[0]?.id || 'ct-matriz');
    setProfId(professors[0]?.id || 'prof-roberto');
    setMonthlyFee(150);
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    setEmergencyName('Contato Familiar');
    setEmergencyPhone('(11) 99999-8888');
    setEmergencyRel('Pai/Mãe');
    setBloodType('A+');
    setAllergies('Nenhuma');
    setHealthNotes('Apto para treinos de Jiu-Jitsu.');
    setHasSignedWaiver(true);
    setShowNewModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setCpf(student.cpf);
    setEmail(student.email);
    setPhone(student.phone);
    setBirthDate(student.birthDate);
    setBelt(student.belt);
    setStripes(student.stripes);
    setWeight(student.weight);
    setHeight(student.height);
    setWeightCategory(student.weightCategory);
    setModality(student.modality);
    setTcId(student.trainingCenterId);
    setProfId(student.professorId);
    setMonthlyFee(student.monthlyFee);
    setPhotoUrl(student.photoUrl);
    setEmergencyName(student.emergencyContact.name);
    setEmergencyPhone(student.emergencyContact.phone);
    setEmergencyRel(student.emergencyContact.relationship);
    setBloodType(student.medicalRecord.bloodType);
    setAllergies(student.medicalRecord.allergies);
    setHealthNotes(student.medicalRecord.healthNotes);
    setHasSignedWaiver(student.medicalRecord.hasSignedWaiver);
    setShowNewModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenTc = trainingCenters.find(t => t.id === tcId);
    const chosenProf = professors.find(p => p.id === profId);

    const studentData = {
      name,
      cpf,
      email,
      phone,
      birthDate,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      status: 'Ativo' as const,
      trainingCenterId: tcId,
      trainingCenterName: chosenTc?.name || 'CT Matriz',
      professorId: profId,
      professorName: chosenProf?.name || 'Professor',
      modality,
      belt,
      stripes: Number(stripes),
      weight: Number(weight),
      height: Number(height),
      weightCategory,
      joinDate: new Date().toLocaleDateString('pt-BR'),
      lastGraduationDate: new Date().toLocaleDateString('pt-BR'),
      attendanceCount: 15,
      totalAttendance: 15,
      points: 50,
      monthlyFee: Number(monthlyFee),
      paymentStatus: 'Pago' as const,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relationship: emergencyRel
      },
      medicalRecord: {
        bloodType,
        allergies,
        medications: 'Nenhum',
        healthNotes,
        hasSignedWaiver
      }
    };

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...studentData,
        id: editingStudent.id,
        registrationNumber: editingStudent.registrationNumber,
        status: editingStudent.status
      });
    } else {
      addStudent(studentData);
    }

    setShowNewModal(false);
  };


  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.cpf.includes(search);
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Gestão Integral de Alunos
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cadastro, aprovações, controle de faixa e graus, ficha médica, termo assinado e login simulado no portal.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Matricular Novo Aluno</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por nome, matrícula ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          {(['all', 'Ativo', 'Inativo', 'Pendente'] as const).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status ? 'bg-neutral-800 text-amber-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {status === 'all' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table / Cards */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-medium border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Aluno</th>
                <th className="py-3 px-4">Matrícula</th>
                <th className="py-3 px-4">Graduação</th>
                <th className="py-3 px-4">CT / Professor</th>
                <th className="py-3 px-4">Presenças</th>
                <th className="py-3 px-4">Mensalidade</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.photoUrl} 
                        alt={student.name} 
                        className="w-9 h-9 rounded-lg object-cover border border-neutral-700 bg-neutral-950" 
                      />
                      <div>
                        <span className="font-bold text-neutral-100 block">{student.name}</span>
                        <span className="text-[11px] text-neutral-400">{student.modality} · {student.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-neutral-300 font-semibold">
                    {student.registrationNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <BeltBadge belt={student.belt} stripes={student.stripes} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-neutral-300">
                    <span className="block font-medium">{student.trainingCenterName}</span>
                    <span className="text-[11px] text-neutral-500">Prof. {student.professorName}</span>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-300 font-mono">
                    <span className="text-emerald-400 font-bold">{student.attendanceCount}</span>
                    <span className="text-[10px] text-neutral-500"> ({student.totalAttendance} tot)</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      student.paymentStatus === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' :
                      student.paymentStatus === 'Atrasado' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      R$ {student.monthlyFee} · {student.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      student.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' :
                      student.status === 'Pendente' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {student.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {student.status === 'Pendente' && (
                        <button
                          type="button"
                          onClick={() => approveStudent(student.id)}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs"
                          title="Aprovar Matrícula"
                        >
                          Aprovar
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedStudentForCard(student)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400"
                        title="Ver Carteirinha Digital"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedStudentForMedical(student)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-red-400"
                        title="Ficha Médica & Emergência"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                      </button>


                      <button
                        type="button"
                        onClick={() => openEditModal(student)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        title="Editar Aluno"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remover aluno ${student.name}?`)) {
                            deleteStudent(student.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/50 text-neutral-400 hover:text-red-400"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ficha Médica */}
      {selectedStudentForMedical && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <HeartPulse className="w-4 h-4" />
                <span>Ficha Médica & Termo · {selectedStudentForMedical.name}</span>
              </div>
              <button type="button" onClick={() => setSelectedStudentForMedical(null)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Contato de Emergência</span>
                <p>Nome: <strong className="text-neutral-200">{selectedStudentForMedical.emergencyContact.name}</strong></p>
                <p>Telefone: <strong className="text-neutral-200">{selectedStudentForMedical.emergencyContact.phone}</strong></p>
                <p>Parentesco: <strong className="text-neutral-200">{selectedStudentForMedical.emergencyContact.relationship}</strong></p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Dados Clínicos</span>
                <p>Tipo Sanguíneo: <strong className="text-neutral-200">{selectedStudentForMedical.medicalRecord.bloodType}</strong></p>
                <p>Alergias: <strong className="text-neutral-200">{selectedStudentForMedical.medicalRecord.allergies}</strong></p>
                <p>Medicamentos de Uso Contínuo: <strong className="text-neutral-200">{selectedStudentForMedical.medicalRecord.medications}</strong></p>
                <p>Histórico / Restrições: <strong className="text-neutral-200">{selectedStudentForMedical.medicalRecord.healthNotes}</strong></p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <span>Termo de Responsabilidade:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Assinado & Válido</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStudentForMedical(null)}
              className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs"
            >
              Fechar Ficha
            </button>
          </div>
        </div>
      )}

      {/* Modal Carteirinha Digital */}
      {selectedStudentForCard && (
        <StudentCardModal
          student={selectedStudentForCard}
          onClose={() => setSelectedStudentForCard(null)}
        />
      )}

      {/* Modal Novo / Editar Aluno */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">
                {editingStudent ? 'Editar Dados da Matrícula' : 'Matricular Novo Aluno'}
              </h2>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="text-neutral-300 block mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Graduação / Faixa</label>
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
                  <label className="text-neutral-300 block mb-1">Graus (0 a 4)</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={stripes}
                    onChange={(e) => setStripes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Valor da Mensalidade (R$)</label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="text-neutral-300 block mb-1">Professor Responsável</label>
                  <select
                    value={profId}
                    onChange={(e) => setProfId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    {professors.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ficha Médica e Emergência */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="font-bold text-red-400 block uppercase tracking-wider text-[11px]">
                  Ficha Médica & Contato de Emergência
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-neutral-400 block mb-1">Nome de Contato</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Telefone Emergência</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Tipo Sanguíneo</label>
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Alergias ou Observações Médicas</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Ex: Alergia a iodo, dipirona..."
                    className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-300 block">Foto do Aluno</label>
                  <button
                    type="button"
                    onClick={() => studentFileRef.current?.click()}
                    className="text-xs text-red-400 hover:text-white font-bold flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Escolher Foto do Dispositivo</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={studentFileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleStudentPhotoUpload}
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
                      <img src={photoUrl} alt="Preview Aluno" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
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
                  {editingStudent ? 'Salvar Alterações' : 'Concluir Matrícula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
