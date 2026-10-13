import React from 'react';
import { Student } from '../../types';
import { BeltBadge } from '../Common/BeltBadge';
import { useGaditas } from '../../context/GaditasContext';
import { Shield, QrCode, Printer, X, Phone, HeartPulse } from 'lucide-react';

interface StudentCardModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({ student, onClose }) => {
  const { siteConfig } = useGaditas();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl bg-neutral-900 border-2 border-red-600/40 p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Top actions */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 fill-red-500" />
            Carteirinha Digital Oficial
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Imprimir / Salvar Carteirinha"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Digital Card itself (credit-card aspect ratio with authentic red & white martial design) */}
        <div 
          id="carteirinha-impressao"
          className="relative overflow-hidden rounded-2xl p-5 border-2 border-red-600 shadow-2xl text-neutral-100 select-none"
          style={{
            background: 'linear-gradient(145deg, #180505 0%, #0c0202 100%)',
          }}
        >
          {/* Top Card Header */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 border border-white/40 flex items-center justify-center font-serif font-black text-white text-sm shadow-md">
                G
              </div>
              <div>
                <h3 className="font-extrabold text-xs tracking-tight uppercase font-cinzel text-white">
                  {siteConfig.teamName}
                </h3>
                <p className="text-[9px] text-red-400 font-mono">
                  {student.trainingCenterName}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-white bg-red-600 px-2 py-0.5 rounded border border-white/20">
              {student.registrationNumber}
            </span>
          </div>

          {/* Middle Card: Photo & Info */}
          <div className="flex items-center gap-4 mt-5 relative z-10">
            <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-red-600 bg-neutral-950 shrink-0 shadow-md">
              <img 
                src={student.photoUrl} 
                alt={student.name} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="space-y-1 overflow-hidden">
              <h4 className="font-bold text-sm sm:text-base text-white truncate">
                {student.name}
              </h4>
              <div className="flex items-center gap-1.5">
                <BeltBadge belt={student.belt} stripes={student.stripes} size="sm" />
              </div>
              <p className="text-[11px] text-neutral-300">
                Modalidade: <span className="text-white font-semibold">{student.modality}</span>
              </p>
              <p className="text-[10px] text-neutral-400 font-mono">
                CPF: {student.cpf}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono">
                Treinador: {student.professorName}
              </p>
            </div>
          </div>

          {/* Bottom Card: Status, Validity & Official QR Code */}
          <div className="mt-5 pt-3 border-t border-red-900/60 flex items-center justify-between relative z-10 text-[10px] font-mono">
            <div>
              <span className="text-neutral-400 block">SITUAÇÃO / VALIDADE</span>
              <span className="text-white font-bold">ATIVO · 2026/2027</span>
            </div>

            <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm">
              <QrCode className="w-9 h-9 text-neutral-950" />
            </div>
          </div>

          {/* Motto strip on card */}
          <div className="mt-3 pt-2 border-t border-red-900/40 text-center relative z-10">
            <span className="text-[9px] font-black uppercase tracking-wider text-red-400 font-cinzel block">
              "A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"
            </span>
          </div>

          {/* Decorative watermark shield in background */}
          <Shield className="absolute -bottom-10 -right-10 w-44 h-44 text-red-600/10 pointer-events-none" />
        </div>

        {/* Quick Emergency / Medical info on reverse */}
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="flex items-center gap-1.5 text-red-500 font-bold">
              <Phone className="w-3.5 h-3.5" />
              <span>Contato de Emergência</span>
            </span>
            <span className="font-medium text-neutral-200">
              {student.emergencyContact.name} ({student.emergencyContact.relationship}): {student.emergencyContact.phone}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-400 pt-1 border-t border-neutral-900">
            <span className="flex items-center gap-1.5 text-red-500 font-bold">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Tipo Sanguíneo</span>
            </span>
            <span className="font-bold text-white font-mono">
              {student.medicalRecord.bloodType || 'A+'}
            </span>
          </div>
        </div>

        {/* Button to close or print */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-md border border-white/20"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Carteirinha</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
