import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { CertificateItem, BeltType } from '../../types';
import { 
  FileText, 
  Printer, 
  Plus, 
  Award, 
  Shield, 
  CheckCircle, 
  Download,
  X,
  Sparkles
} from 'lucide-react';

export const CertificateGenerator: React.FC = () => {
  const { certificates, students, siteConfig } = useGaditas();

  const [selectedCert, setSelectedCert] = useState<CertificateItem>(certificates[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Certificate state
  const [studentName, setStudentName] = useState(students[0]?.name || '');
  const [certificateType, setCertificateType] = useState<CertificateItem['certificateType']>('Graduação');
  const [beltAwarded, setBeltAwarded] = useState<BeltType>('Azul');
  const [description, setDescription] = useState('');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Emissor de Certificados Oficiais
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Diplomas de Graduação, Participação em Seminários, Cursos Técnicos, Arbitragem e Campeonatos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Certificate Selection + Big Printable Certificate Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Certificate Archive List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Certificados Registrados ({certificates.length})
          </span>

          <div className="space-y-2">
            {certificates.map(cert => {
              const isSelected = selectedCert?.id === cert.id;
              return (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                    isSelected 
                      ? 'bg-neutral-800 text-neutral-100 border-amber-500/50 shadow-sm' 
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{cert.certificateType}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{cert.issueDate}</span>
                  </div>
                  <p className="font-semibold text-neutral-100 mt-1">{cert.studentName}</p>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{cert.description}</p>
                  <span className="text-[10px] text-neutral-500 font-mono block mt-2">
                    Cód: {cert.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Printable Certificate Canvas (Solemn Martial Diploma) */}
        <div className="lg:col-span-2">
          {selectedCert ? (
            <div 
              id="certificado-impressao"
              className="relative rounded-2xl border-8 border-double border-amber-500/50 p-8 sm:p-12 text-center text-neutral-900 shadow-2xl select-none"
              style={{
                background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fef9c3 100%)',
              }}
            >
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-800" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-800" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-800" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-800" />

              {/* Certificate Header */}
              <div className="space-y-1 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-700/40 flex items-center justify-center mx-auto mb-2 text-amber-900 font-black text-xl font-cinzel">
                  G
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-amber-950 font-cinzel">
                  {siteConfig.teamName}
                </h2>
                <p className="text-xs font-serif italic text-amber-900">
                  Federação & Linhagem Tradicional de Artes Marciais
                </p>
                <div className="w-32 h-0.5 bg-amber-700/40 mx-auto mt-2" />
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-neutral-900 font-cinzel my-4">
                CERTIFICADO OFICIAL DE {selectedCert.certificateType}
              </h3>

              {/* Solemn Body Text */}
              <div className="space-y-3 max-w-xl mx-auto my-6 text-neutral-800 font-serif text-sm sm:text-base leading-relaxed">
                <p>
                  Certificamos formalmente perante os mestres, instrutores e a comunidade marcial que
                </p>
                <p className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-amber-950 font-cinzel underline decoration-amber-600 underline-offset-4">
                  {selectedCert.studentName}
                </p>
                <p className="text-xs sm:text-sm text-neutral-700 italic">
                  {selectedCert.description}
                </p>
              </div>

              {/* Authentic Gold Seal */}
              <div className="my-8 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-500 to-amber-600 p-1 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-950/40 flex flex-col items-center justify-center text-neutral-950 font-serif">
                    <Shield className="w-5 h-5 text-amber-950 mb-0.5" />
                    <span className="text-[7px] font-bold tracking-widest uppercase">GADITAS</span>
                    <span className="text-[6px] uppercase font-mono">SELO OFICIAL</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto pt-6 border-t border-amber-800/20 text-xs font-serif">
                <div className="text-center">
                  <p className="font-bold text-neutral-950">{selectedCert.masterSignatory}</p>
                  <p className="text-[10px] text-amber-900">Grão-Mestre & Fundador</p>
                </div>

                <div className="text-center">
                  <p className="font-bold text-neutral-950">{selectedCert.presidentSignatory}</p>
                  <p className="text-[10px] text-amber-900">Coordenação Técnica Oficial</p>
                </div>
              </div>

              {/* Certificate code */}
              <div className="mt-8 text-[9px] text-neutral-500 font-mono">
                Registro Oficial de Autenticidade: <strong>{selectedCert.code}</strong> · Emitido em {selectedCert.issueDate}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-neutral-500 text-xs">
              Selecione um certificado na lista lateral para visualizar e imprimir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
