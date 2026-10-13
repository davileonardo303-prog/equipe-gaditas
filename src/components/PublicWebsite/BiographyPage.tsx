import React from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltBadge } from '../Common/BeltBadge';
import { TiltCard3D } from '../ThreeD/TiltCard3D';
import { 
  Shield, 
  Crown, 
  Award, 
  Flame, 
  CheckCircle2, 
  Star, 
  ArrowLeft,
  Calendar,
  Sparkles,
  BookOpen,
  MapPin,
  Swords,
  Trophy,
  Users,
  Target
} from 'lucide-react';

interface BiographyPageProps {
  onBackToHome: () => void;
  onOpenLogin: (tab?: 'aluno' | 'staff') => void;
}

export const BiographyPage: React.FC<BiographyPageProps> = ({ onBackToHome, onOpenLogin }) => {
  const { siteConfig, professors, athletes } = useGaditas();

  // Especialidades marciais do Mestre Daniel Braga
  const especialidades = [
    { nome: 'Muay Thai', nivel: 'Grau Preta e Branca', icon: '🥊', destaque: true },
    { nome: 'Luta Livre Esportiva', nivel: 'Faixa Preta (2017)', icon: '🥋', destaque: true },
    { nome: 'Boxe', nivel: 'Domínio Técnico', icon: '🥊', destaque: false },
    { nome: 'Kickboxing', nivel: 'Domínio Técnico', icon: '⚡', destaque: false },
    { nome: 'MMA', nivel: 'Artes Marciais Mistas', icon: '🏆', destaque: false },
    { nome: 'Sambo', nivel: 'Combate e Quedas', icon: '🤼', destaque: false },
    { nome: 'Jiu-Jitsu', nivel: 'Arte Suave', icon: '🥋', destaque: false },
  ];

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-200">
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

          <div className="inline-block bg-white text-black px-4 py-1 rounded-md text-xs font-mono font-black uppercase tracking-widest shadow-md">
            EQUIPE GADITAS FIGHT TEAM — RIO DE JANEIRO
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-cinzel tracking-tight uppercase">
            <span className="text-white">BIOGRAFIA & </span>
            <span className="text-red-600">HISTÓRIA MARCIAL</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
            A trajetória inspiradora de Daniel Braga: da paixão pelas artes marciais aos 15 anos à liderança de uma das maiores famílias marciais do Rio de Janeiro.
          </p>
        </div>

        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
      </div>

      {/* Main Focus: Mestre Daniel Braga (com a foto oficial e o cinturão no Mirante do Arvrão) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <TiltCard3D maxTilt={7}>
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 border-2 border-red-600 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
            {/* Foto Oficial do Mestre com Cinturão */}
            <div className="space-y-4 text-center shrink-0 mx-auto md:mx-0">
              <div className="w-56 h-72 sm:w-64 sm:h-84 rounded-2xl overflow-hidden border-4 border-red-600 shadow-2xl bg-black relative group">
                <img 
                  src={siteConfig.masterPhotoUrl} 
                  alt="Mestre Daniel Braga com Cinturão no Mirante do Arvrão" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center">
                  <span className="text-[11px] font-black text-white font-mono block">
                    Mirante do Arvrão · RJ
                  </span>
                  <span className="text-[10px] text-red-500 font-bold font-mono">
                    Líder e Fundador
                  </span>
                </div>
              </div>

              {/* Badges de Graduação */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-mono font-black border border-white/30 shadow-md">
                  <span>Grau Preta e Branca</span>
                  <span className="text-white/70">·</span>
                  <span>Muay Thai</span>
                </div>
                <div className="block">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-black text-white text-[11px] font-mono font-bold border border-neutral-700">
                    Faixa Preta · Luta Livre (2017)
                  </span>
                </div>
              </div>
            </div>

            {/* Informações Biográficas Oficiais */}
            <div className="space-y-5 flex-1 text-center md:text-left">
              <div>
                <span className="text-xs text-red-500 font-mono font-black uppercase tracking-widest block">
                  Líder e Fundador da Equipe Gaditas F Team
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white font-cinzel tracking-tight mt-1">
                  Daniel Braga
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 rounded-md bg-white text-black font-black text-xs uppercase font-mono shadow-sm">
                    Grau Preta e Branca — Muay Thai
                  </span>
                  <span className="px-3 py-1 rounded-md bg-red-600 text-white font-black text-xs uppercase font-mono shadow-sm border border-white/20">
                    Faixa Preta — Luta Livre (2017)
                  </span>
                </div>

                {/* Lema da Equipe em Destaque */}
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-600/70 text-center md:text-left flex items-center gap-3 shadow-lg mt-3">
                  <Shield className="w-5 h-5 text-red-500 shrink-0 fill-red-500/20" />
                  <div>
                    <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block">
                      Lema da Equipe Gaditas Fight Team
                    </span>
                    <span className="text-xs sm:text-sm font-black font-cinzel text-white tracking-wider block">
                      "A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"
                    </span>
                  </div>
                </div>
              </div>

              {/* Trajetória Marcial */}
              <div className="p-5 rounded-2xl bg-black border-2 border-neutral-800 space-y-3">
                <h3 className="text-sm font-black text-white font-cinzel uppercase flex items-center justify-center md:justify-start gap-2">
                  <Swords className="w-4 h-4 text-red-600" />
                  <span>Trajetória Marcial</span>
                </h3>

                <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                    <span><strong>Início:</strong> Ingresso nas artes marciais aos 15 anos de idade.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                    <span><strong>Formação Luta Livre:</strong> Faixa Preta diplomado em 2017 pelo Mestre Leandro Vilela (Equipe Gladiador).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                    <span><strong>Base e Mentorias:</strong> Formação inicial na tradicional <strong>Equipe Nael Pedra</strong> e mentoria fundamental do <strong>Mestre Leandro Vilela</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* Especialidades Técnicas */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                  Especialidades & Domínio Técnico:
                </span>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {especialidades.map((esp, idx) => (
                    <div 
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 shadow-sm ${
                        esp.destaque 
                          ? 'bg-red-600 text-white font-black border-white/40 shadow-red-950/40' 
                          : 'bg-black text-neutral-200 border-neutral-800'
                      }`}
                    >
                      <span>{esp.icon}</span>
                      <span className="font-bold">{esp.nome}</span>
                      <span className="text-[10px] opacity-80">({esp.nivel})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TiltCard3D>

        {/* A Instituição Gaditas: 2017, +12 Faixas Pretas, RJ */}
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 border-2 border-neutral-800 space-y-8 shadow-2xl">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-block bg-red-600 text-white px-3 py-0.5 rounded text-xs font-mono font-black uppercase tracking-wider">
              História Institucional
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white font-cinzel uppercase">
              A Instituição Gaditas Fight Team
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed font-serif">
              Fundada em <strong>2017 em Nova Iguaçu</strong> pelo Mestre Daniel Braga, a equipe evoluiu de um projeto residencial pioneiro para uma das maiores e mais respeitadas famílias marciais do Estado do Rio de Janeiro.
            </p>
          </div>

          {/* Cards de Métricas Reais Oficiais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <TiltCard3D maxTilt={10}>
              <div className="p-6 rounded-2xl bg-black border-2 border-red-600 text-center space-y-2 shadow-xl h-full flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono block">
                  2017
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-red-500 font-mono">
                  Ano de Fundação
                </span>
                <p className="text-[11px] text-neutral-400 font-serif">
                  Nascimento em Nova Iguaçu - RJ
                </p>
              </div>
            </TiltCard3D>

            <TiltCard3D maxTilt={10}>
              <div className="p-6 rounded-2xl bg-black border-2 border-white text-center space-y-2 shadow-xl h-full flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono block">
                  +12
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-white font-mono">
                  Faixas Pretas Formados
                </span>
                <p className="text-[11px] text-neutral-400 font-serif">
                  Linhagem e técnica certificada
                </p>
              </div>
            </TiltCard3D>

            <TiltCard3D maxTilt={10}>
              <div className="p-6 rounded-2xl bg-black border-2 border-red-600 text-center space-y-2 shadow-xl h-full flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono block">
                  RJ
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-red-500 font-mono">
                  Diversos Polos Ativos
                </span>
                <p className="text-[11px] text-neutral-400 font-serif">
                  Nova Iguaçu, Baixada & Rio Capital
                </p>
              </div>
            </TiltCard3D>
          </div>

          {/* Base e Mentorias Detalhadas */}
          <div className="pt-6 border-t-2 border-neutral-900 space-y-4">
            <h4 className="text-lg font-black text-white font-cinzel uppercase flex items-center gap-2">
              <Award className="w-5 h-5 text-red-600" />
              <span>Base Técnica & Mentorias de Honra</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black border border-neutral-800 space-y-2">
                <span className="text-xs text-red-500 font-mono font-bold uppercase block">
                  Formação de Base
                </span>
                <h5 className="text-base font-black text-white font-cinzel">
                  Equipe Nael Pedra
                </h5>
                <p className="text-xs text-neutral-300 font-serif leading-relaxed">
                  Escola tradicional de formação inicial onde foram forjados os fundamentos da disciplina marcial, pegada e espírito guerreiro.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black border border-neutral-800 space-y-2">
                <span className="text-xs text-red-500 font-mono font-bold uppercase block">
                  Mentoria & Graduação Faixa Preta
                </span>
                <h5 className="text-base font-black text-white font-cinzel">
                  Mestre Leandro Vilela (Equipe Gladiador)
                </h5>
                <p className="text-xs text-neutral-300 font-serif leading-relaxed">
                  Mentoria fundamental na consagração como Faixa Preta de Luta Livre Esportiva em 2017, consolidando a linhagem técnica da equipe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professores Oficiais e Coordenadores dos Polos */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
              Polos Gaditas Fight Team
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-cinzel uppercase">
              Professores Oficiais dos CTs no Rio de Janeiro
            </h3>
            <p className="text-xs text-neutral-400">
              Corpo docente diplomado sob a liderança do Mestre Daniel Braga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professors.map((prof) => (
              <TiltCard3D key={prof.id} maxTilt={10}>
                <div className="p-6 rounded-3xl bg-neutral-950 border-2 border-neutral-800 hover:border-red-600 transition-all flex flex-col justify-between space-y-4 shadow-xl group h-full">
                  <div className="space-y-4">
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-black border border-neutral-800">
                      <img 
                        src={prof.photoUrl} 
                        alt={prof.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute bottom-2 left-2">
                        <BeltBadge belt={prof.belt} stripes={prof.degrees} size="sm" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white font-cinzel">
                        {prof.name}
                      </h4>
                      <p className="text-xs text-red-500 font-bold font-mono">
                        {prof.role}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {prof.trainingCenterName}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-serif leading-relaxed line-clamp-4">
                      {prof.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span>Alunos: <strong className="text-white">{prof.studentsCount}</strong></span>
                    <span className="text-white font-black bg-red-600 px-2.5 py-1 rounded-md border border-white/20">
                      Faixa {prof.belt}
                    </span>
                  </div>
                </div>
              </TiltCard3D>
            ))}
          </div>
        </div>

        {/* Banner de Fechamento com o lema oficial */}
        <div className="p-8 sm:p-10 rounded-3xl bg-black border-2 border-red-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-block bg-red-600 text-white px-3 py-0.5 rounded text-xs font-mono font-black uppercase tracking-wider">
              Lema Oficial da Equipe
            </div>
            <h3 className="text-xl sm:text-3xl font-black font-cinzel uppercase text-white">
              "A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl font-serif">
              Equipe Gaditas F Team — Fazendo a Diferença · Rio de Janeiro. Agende sua aula experimental nos polos de Nova Iguaçu e Baixada Fluminense.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenLogin('aluno')}
              className="px-6 py-3.5 rounded-xl bg-white text-black font-black text-xs hover:bg-neutral-100 shadow-xl transition-all uppercase tracking-wider"
            >
              Área do Aluno (Login)
            </button>
            <button
              type="button"
              onClick={() => onOpenLogin('staff')}
              className="px-6 py-3.5 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 border-2 border-white/30 shadow-xl transition-all uppercase tracking-wider"
            >
              Área do Mestre Daniel Braga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
