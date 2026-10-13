import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltBadge } from '../Common/BeltBadge';
import { StudentCardModal } from '../DigitalCard/StudentCardModal';
import { 
  User, 
  QrCode, 
  DollarSign, 
  Award, 
  ClipboardCheck, 
  Trophy, 
  Calendar, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Shield,
  FileSignature
} from 'lucide-react';
import { DigitalSignatureModal } from '../Students/DigitalSignatureModal';

interface StudentPortalProps {
  onOpenAI: () => void;
  onOpenCertificates: () => void;
  onOpenRanking: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ 
  onOpenAI, 
  onOpenCertificates, 
  onOpenRanking 
}) => {
  const { 
    currentStudent, 
    payStudentMonthlyFee, 
    tournaments, 
    registerTournamentAthlete,
    athletes,
    certificates,
    siteConfig 
  } = useGaditas();

  const [showCardModal, setShowCardModal] = useState(false);
  const [showPixConfirm, setShowPixConfirm] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // Matching athlete for ranking points
  const athleteProfile = athletes.find(a => a.studentId === currentStudent.id || a.cpf === currentStudent.cpf);
  const athletePoints = athleteProfile?.points || currentStudent.points || 0;

  // Student issued certificates
  const studentCerts = certificates.filter(c => 
    c.studentName.toLowerCase().includes(currentStudent.name.toLowerCase().split(' ')[0])
  );

  const nextTournament = tournaments[0];
  const isRegisteredInTourn = nextTournament?.registeredAthletes?.some(
    ra => ra.name.toLowerCase().includes(currentStudent.name.toLowerCase().split(' ')[0])
  );

  const handlePayPix = () => {
    payStudentMonthlyFee(currentStudent.id);
    setShowPixConfirm(true);
    setTimeout(() => setShowPixConfirm(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="rounded-2xl bg-neutral-900 border-2 border-red-600/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={currentStudent.photoUrl} 
              alt={currentStudent.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-red-600 bg-neutral-950 shadow-md" 
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-neutral-900" title="Ativo" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-500">
                {currentStudent.registrationNumber}
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400">{currentStudent.trainingCenterName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-cinzel">
              {currentStudent.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <BeltBadge belt={currentStudent.belt} stripes={currentStudent.stripes} size="sm" />
              <span className="text-xs text-neutral-400">· Professor: {currentStudent.professorName}</span>
            </div>
            <p className="text-[11px] font-cinzel text-red-400 font-bold tracking-wider mt-1.5">
              "A dor é passageira, mas o orgulho é eterno"
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCardModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-black text-xs transition-colors flex items-center gap-2 shadow-md border border-neutral-300"
          >
            <QrCode className="w-4 h-4 text-red-600" />
            <span>Minha Carteirinha Digital</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSignatureModal(true)}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors flex items-center gap-2 border border-neutral-700 shadow-md"
          >
            <FileSignature className="w-4 h-4 text-emerald-400" />
            <span>Assinar Documentos</span>
          </button>

          <button
            type="button"
            onClick={onOpenAI}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors flex items-center gap-2 shadow-md border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Assistente Gaditas IA</span>
          </button>
        </div>
      </div>

      {/* Grid: Graduação & Frequência + Mensalidade & PIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Frequência & Tempo de Tatame */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-red-500" />
              <span>Frequência nos Treinos</span>
            </span>
            <span className="text-xs text-emerald-400 font-bold font-mono">92% Constância</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white font-mono">
                  {currentStudent.attendanceCount}
                </span>
                <span className="text-xs text-neutral-400 ml-1.5">presenças no mês</span>
              </div>
              <span className="text-xs text-neutral-400">
                {currentStudent.totalAttendance} totais acumuladas
              </span>
            </div>

            {/* Progress bar towards next stripe/belt */}
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Meta para próxima graduação (60 treinos)</span>
                <span className="font-semibold text-white">
                  {Math.min(100, Math.round((currentStudent.totalAttendance % 60) / 0.6))}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((currentStudent.totalAttendance % 60) / 0.6))}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
              Último exame registrado em: <strong>{currentStudent.lastGraduationDate}</strong>. Mantenha no mínimo 3 treinos semanais para cumprir os requisitos de faixa do Mestre Davi.
            </p>
          </div>
        </div>

        {/* Card 2: Mensalidade & Pagamento PIX */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Minha Mensalidade</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              currentStudent.paymentStatus === 'Pago' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-600/15 text-red-400 border border-red-500/30'
            }`}>
              {currentStudent.paymentStatus}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white font-mono">
                  R$ {currentStudent.monthlyFee.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-400 ml-1.5">/ mês</span>
              </div>
              <span className="text-xs text-neutral-400">Vencimento dia 10</span>
            </div>

            {currentStudent.paymentStatus === 'Pago' ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mensalidade do mês quitada via PIX. Obrigado pela pontualidade!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                  <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">Chave PIX Oficial</span>
                  <p className="font-mono text-red-400 font-semibold select-all">financeiro@gaditasteam.com.br</p>
                </div>

                <button
                  type="button"
                  onClick={handlePayPix}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md border border-white/20"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Confirmar Pagamento PIX</span>
                </button>
              </div>
            )}

            {showPixConfirm && (
              <p className="text-xs text-emerald-400 font-semibold animate-pulse text-center">
                ✓ Comprovante processado e mensalidade baixada com sucesso!
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Ranking & Cartel */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-red-500" />
              <span>Meu Ranking Oficial</span>
            </span>
            <button
              type="button"
              onClick={onOpenRanking}
              className="text-xs text-red-400 hover:text-white font-medium transition-colors"
            >
              Ver Tabela
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white font-mono">
                  {athletePoints}
                </span>
                <span className="text-xs text-neutral-400 ml-1.5">pontos acumulados</span>
              </div>
              <span className="text-xs text-neutral-400 font-semibold">
                {athleteProfile ? `${athleteProfile.victories} Vitórias` : 'Em ascensão'}
              </span>
            </div>

            {athleteProfile && (
              <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400">Finalizações</span>
                  <p className="font-bold text-red-400 font-mono">{athleteProfile.submissions}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Títulos</span>
                  <p className="font-bold text-white font-mono">{athleteProfile.titles}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Derrotas</span>
                  <p className="font-bold text-neutral-400 font-mono">{athleteProfile.defeats}</p>
                </div>
              </div>
            )}

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Cada vitória em torneios homologados soma <strong>+10 pts</strong> e títulos <strong>+50 pts</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Tournaments & Certificates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inscrição em Torneios */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>Próximas Competições da Equipe</span>
            </span>
          </div>

          {nextTournament && (
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider font-mono">
                    {nextTournament.status}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-0.5">
                    {nextTournament.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    📍 {nextTournament.location} · 📅 {nextTournament.date} às {nextTournament.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                <span className="text-neutral-400">
                  {nextTournament.registeredAthletesCount} atletas inscritos
                </span>

                {isRegisteredInTourn ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inscrito na Chave</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (athleteProfile) {
                        registerTournamentAthlete(nextTournament.id, athleteProfile.id);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black transition-colors border border-white/20 shadow-md"
                  >
                    Confirmar Minha Inscrição
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Meus Certificados */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" />
              <span>Meus Certificados & Diplomas</span>
            </span>
            <button
              type="button"
              onClick={onOpenCertificates}
              className="text-xs text-red-400 hover:text-white font-medium transition-colors"
            >
              Ver Todos
            </button>
          </div>

          <div className="space-y-3">
            {studentCerts.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">
                Seus diplomas de graduação homologados pelo Mestre aparecerão aqui.
              </p>
            ) : (
              studentCerts.map(cert => (
                <div key={cert.id} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white block">{cert.certificateType}</span>
                    <span className="text-[11px] text-neutral-400">{cert.description}</span>
                    <span className="text-[10px] text-red-400 font-mono block mt-1">Código: {cert.code}</span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenCertificates}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-black shrink-0 transition-colors shadow-xs"
                  >
                    Visualizar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Digital Card Modal */}
      {showCardModal && (
        <StudentCardModal
          student={currentStudent}
          onClose={() => setShowCardModal(false)}
        />
      )}

      {/* Digital Signature Modal */}
      {showSignatureModal && (
        <DigitalSignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          student={currentStudent}
        />
      )}
    </div>
  );
};
