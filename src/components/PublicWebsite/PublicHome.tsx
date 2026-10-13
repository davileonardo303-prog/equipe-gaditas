import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltBadge } from '../Common/BeltBadge';
import { TeamBadge } from '../Common/TeamBadge';
import { Navbar } from './Navbar';
import { BiographyPage } from './BiographyPage';
import { LibraryPage } from './LibraryPage';
import { RankingView } from '../Ranking/RankingView';
import { LoginModal } from '../Auth/LoginModal';
import { FightRing3D } from '../ThreeD/FightRing3D';
import { TiltCard3D } from '../ThreeD/TiltCard3D';
import { 
  Shield, 
  Flame, 
  Trophy, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Crown, 
  CheckCircle2, 
  Star, 
  Newspaper, 
  Instagram, 
  Youtube, 
  MessageCircle,
  BookOpen,
  Folder,
  User,
  Users,
  GraduationCap,
  Sparkles,
  Swords,
  Layers,
  Maximize2
} from 'lucide-react';

interface PublicHomeProps {
  onGoToPanel: () => void;
  onOpenAI: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onGoToPanel, onOpenAI }) => {
  const { 
    siteConfig, 
    athletes, 
    professors, 
    news, 
    events, 
    sponsors, 
    trainingCenters,
    publicPage,
    setPublicPage,
    openLoginModal,
    addNotification 
  } = useGaditas();

  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialCT, setTrialCT] = useState(trainingCenters[0]?.name || 'CT Matriz Central Gaditas');
  const [trialSent, setTrialSent] = useState(false);
  const [showFullRing, setShowFullRing] = useState(false);

  // Top highlight athletes (Top 10)
  const highlightAthletes = athletes
    .filter(a => a.isHighlight)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrialSent(true);
    addNotification('Aula Experimental Agendada', `${trialName} agendou treino no ${trialCT}.`, 'success');
    setTimeout(() => {
      setTrialName('');
      setTrialPhone('');
      setTrialSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenAI={onOpenAI} />

      {/* Main Content Area based on publicPage */}
      <main className="flex-1">
        {publicPage === 'biografia' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
            <BiographyPage 
              onBackToHome={() => setPublicPage('home')}
              onOpenLogin={openLoginModal}
            />
          </div>
        )}

        {publicPage === 'biblioteca' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
            <LibraryPage 
              onBackToHome={() => setPublicPage('home')}
              onOpenLogin={openLoginModal}
            />
          </div>
        )}

        {publicPage === 'ranking' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPublicPage('home')}
                className="text-xs text-red-500 hover:text-white font-bold transition-colors uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>← Voltar à Página Principal</span>
              </button>
            </div>
            <RankingView />
          </div>
        )}

        {/* HOME (Pasta Principal com Ring 3D e Animação) */}
        {publicPage === 'home' && (
          <>
            {/* HERO SECTION COM RING DE LUTA 3D REAL */}
            <section className="relative min-h-[640px] lg:min-h-[740px] flex items-center justify-center overflow-hidden border-b-2 border-red-600/30">
              {/* 3D Fight Ring Canvas Background */}
              <div className="absolute inset-0 z-0">
                <FightRing3D 
                  className="w-full h-full" 
                  interactive={true} 
                  intensity="full" 
                  showControls={true}
                />
              </div>

              {/* Gradient masks to blend 3D arena into black content sections */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none z-1" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-1" />

              {/* Hero Overlay Content */}
              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 py-16 pointer-events-none">
                {/* 3D Martial Ribbon */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/90 border-2 border-red-600 text-white text-xs font-mono font-black uppercase tracking-widest shadow-2xl backdrop-blur-md pointer-events-auto">
                  <Flame className="w-4 h-4 text-red-500 animate-bounce" />
                  <span className="text-white">ARENA OFICIAL</span>
                  <span className="text-red-500 font-bold">· GADITAS FIGHT TEAM</span>
                  <span className="hidden sm:inline text-neutral-400">· 1 CRÔNICAS 12:8</span>
                </div>

                {/* Destaque do Lema da Equipe */}
                <div className="pointer-events-auto pt-2">
                  <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-black/90 border-2 border-red-600 text-white shadow-2xl backdrop-blur-md hover:scale-105 transition-all">
                    <Shield className="w-4 h-4 text-red-500 fill-red-500/20 shrink-0" />
                    <div className="text-center sm:text-left">
                      <span className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest block">
                        LEMA OFICIAL DA EQUIPE
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-black font-cinzel text-white uppercase tracking-wider">
                        "A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Titles: Letras em Preto & Vermelho com fundo/destaque Branco */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-cinzel tracking-tight uppercase drop-shadow-2xl">
                    <span className="text-white">ONDE GUERREIROS SÃO </span>
                    <span className="text-red-600 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-white">
                      FORJADOS
                    </span>
                  </h1>

                  <div className="inline-block bg-white text-black px-4 py-1 rounded-md text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg">
                    JIU-JITSU BRASILEIRO · MUAY THAI · MMA · JUDÔ
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-md">
                  {siteConfig.heroSubtitle}
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4 pointer-events-auto">
                  <a
                    href="#experimental"
                    className="px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 border-2 border-white/40 flex items-center gap-2"
                  >
                    <Swords className="w-4 h-4" />
                    <span>Agendar Aula no Tatame</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setPublicPage('biografia')}
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xl hover:scale-105 border border-neutral-300"
                  >
                    <BookOpen className="w-4 h-4 text-red-600" />
                    <span>Biografia do Mestre</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublicPage('biblioteca')}
                    className="px-5 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-black text-white border-2 border-neutral-700 hover:border-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg backdrop-blur-md"
                  >
                    <Folder className="w-4 h-4 text-red-500" />
                    <span>Biblioteca Digital</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Quick 3D Stat Counters Bar: 2017, +12, RJ, Nova Iguaçu */}
            <section className="bg-neutral-950 border-b border-neutral-800 py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-black border-2 border-red-600/40 hover:border-red-600 transition-colors shadow-lg">
                  <span className="text-3xl sm:text-5xl font-black text-white font-mono block">2017</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-500 font-mono">Ano de Fundação</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Nova Iguaçu - RJ</p>
                </div>
                <div className="p-4 rounded-2xl bg-black border-2 border-neutral-800 hover:border-white transition-colors shadow-lg">
                  <span className="text-3xl sm:text-5xl font-black text-white font-mono block">+12</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-white font-mono">Faixas Pretas Formados</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Família Marcial de Elite</p>
                </div>
                <div className="p-4 rounded-2xl bg-black border-2 border-red-600/40 hover:border-red-600 transition-colors shadow-lg">
                  <span className="text-3xl sm:text-5xl font-black text-white font-mono block">RJ</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-500 font-mono">Diversos Polos Ativos</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Nova Iguaçu & Rio de Janeiro</p>
                </div>
                <div className="p-4 rounded-2xl bg-black border-2 border-red-600/60 hover:border-red-600 transition-colors shadow-lg flex flex-col justify-center">
                  <span className="text-xs sm:text-sm font-black text-red-500 font-cinzel block leading-tight">
                    "A DOR É PASSAGEIRA,
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white font-cinzel block leading-tight mt-0.5">
                    MAS O ORGULHO É ETERNO"
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white font-mono bg-red-600 px-2 py-0.5 rounded inline-block mt-2 self-center">
                    LEMA DA EQUIPE
                  </span>
                  <p className="text-[10px] text-neutral-400 mt-1">Gaditas F Team RJ</p>
                </div>
              </div>
            </section>

            {/* Quick Portal Cards with 3D Tilt: Área do Aluno & Área do Mestre */}
            <section className="py-12 bg-black border-b border-neutral-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center space-y-1 mb-8">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-500">
                    Acesso Exclusivo à Plataforma
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-cinzel">
                    Portais de Acesso · Aluno & Mestre
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tilt Card 1: Área do Aluno */}
                  <TiltCard3D maxTilt={10}>
                    <div 
                      onClick={() => openLoginModal('aluno')}
                      className="p-7 rounded-3xl bg-neutral-950 border-2 border-neutral-800 hover:border-white transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group shadow-2xl relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition-transform shadow-xl">
                          <User className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                            Aplicativo do Aluno
                          </span>
                          <h3 className="font-black text-xl text-white group-hover:text-red-500 transition-colors font-cinzel">
                            Área do Aluno (Fazer Login)
                          </h3>
                          <p className="text-xs text-neutral-400 max-w-sm">
                            Carteirinha Digital 3D com QR Code, presença, histórico de graus, mensalidade com PIX e torneios.
                          </p>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0 self-end sm:self-center">
                        <ArrowRight className="w-5 h-5 text-red-600" />
                      </div>

                      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                    </div>
                  </TiltCard3D>

                  {/* Tilt Card 2: Área do Mestre & Staff */}
                  <TiltCard3D maxTilt={10}>
                    <div 
                      onClick={() => openLoginModal('staff')}
                      className="p-7 rounded-3xl bg-neutral-950 border-2 border-red-600/40 hover:border-red-600 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group shadow-2xl relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition-transform shadow-xl border-2 border-white/30">
                          <Crown className="w-8 h-8 fill-white" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                            Liderança & Docência
                          </span>
                          <h3 className="font-black text-xl text-white group-hover:text-red-500 transition-colors font-cinzel">
                            Mestre / Professor / Admin
                          </h3>
                          <p className="text-xs text-neutral-400 max-w-sm">
                            Homologação oficial de faixas, chamada digital, ranking automático, fluxo de caixa e gestão do site.
                          </p>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0 self-end sm:self-center">
                        <ArrowRight className="w-5 h-5" />
                      </div>

                      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-red-600/10 blur-2xl pointer-events-none" />
                    </div>
                  </TiltCard3D>
                </div>
              </div>
            </section>

            {/* Section: História & Valores com Foco em Preto e Branco com Vermelho */}
            <section id="historia" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <div className="inline-block bg-white text-black px-3 py-1 rounded text-xs font-mono font-black uppercase tracking-wider">
                    Origem & Tradição Marcial
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white font-cinzel tracking-tight uppercase">
                    A História da <span className="text-red-600">Gaditas Team</span>
                  </h2>
                  <p className="text-sm text-neutral-300 leading-relaxed font-serif">
                    {siteConfig.historyText}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setPublicPage('biografia')}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all border border-white/20"
                    >
                      <span>Ler Biografia Completa do Mestre & Linhagem</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pillars Card */}
                <div className="p-7 rounded-3xl bg-neutral-950 border-2 border-red-600/40 space-y-5 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                      <Shield className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white font-cinzel uppercase">
                        Pilares Inegociáveis
                      </h3>
                      <p className="text-xs text-neutral-400 font-mono">1 Crônicas 12:8</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {siteConfig.valuesText.map((val, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-neutral-300 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section: O Mestre Davi em Destaque */}
            <section id="mestre" className="py-20 bg-neutral-950 border-y-2 border-red-600/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="p-8 sm:p-12 rounded-3xl bg-black border-2 border-neutral-800 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                  <div className="w-48 h-60 sm:w-60 sm:h-72 rounded-2xl overflow-hidden border-4 border-red-600 shadow-2xl bg-neutral-950 shrink-0">
                    <img 
                      src={siteConfig.masterPhotoUrl} 
                      alt={siteConfig.masterName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="space-y-4 text-center md:text-left flex-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-500 block">
                      Liderança Marcial Suprema
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white font-cinzel">
                      {siteConfig.masterName}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-xs text-white font-mono font-black uppercase bg-red-600 px-3 py-1 rounded-md border border-white/20">
                        Grau Preta e Branca (Muay Thai)
                      </span>
                      <span className="text-xs text-black font-mono font-black uppercase bg-white px-3 py-1 rounded-md">
                        Faixa Preta (Luta Livre 2017)
                      </span>
                      <span className="text-xs text-red-500 font-mono font-bold border border-red-600/40 px-2 py-1 rounded-md bg-black">
                        Fundador 2017
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-serif">
                      {siteConfig.masterBio}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        type="button"
                        onClick={() => setPublicPage('biografia')}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md"
                      >
                        <span>Conhecer Biografia Completa</span>
                        <ArrowRight className="w-3.5 h-3.5 text-red-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openLoginModal('staff')}
                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md border border-white/20"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Acessar Portal do Mestre</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Atletas Destaque com 3D Tilt Cards */}
            <section id="atletas" className="py-20 bg-black border-b border-neutral-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-500">
                      Alta Performance nos Tatames
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white font-cinzel flex items-center gap-2 uppercase">
                      <Trophy className="w-7 h-7 text-red-600" />
                      <span>Atletas Destaque · Cartel & Ranking</span>
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPublicPage('ranking')}
                    className="text-xs text-red-500 hover:text-white font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                  >
                    <span>Ver Tabela Oficial de Pontos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {highlightAthletes.slice(0, 4).map((ath, idx) => (
                    <TiltCard3D key={ath.id} maxTilt={14}>
                      <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-neutral-800 hover:border-red-600 space-y-3 relative group transition-all shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center font-mono shadow-md">
                            {idx + 1}º
                          </span>
                          <span className="text-xs font-mono font-bold text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                            {ath.points} pts
                          </span>
                        </div>

                        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black border border-neutral-800">
                          <img 
                            src={ath.photoUrl} 
                            alt={ath.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-white group-hover:text-red-500 transition-colors">
                            {ath.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <BeltBadge belt={ath.belt} size="sm" />
                            <span className="text-[11px] text-neutral-400 font-mono">{ath.category}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-black border border-neutral-800 text-[11px] flex justify-between text-neutral-300 font-mono">
                          <span className="text-white font-bold">{ath.victories}V - {ath.defeats}D</span>
                          <span className="text-red-400 font-bold">{ath.submissions} subs</span>
                          <span className="text-white font-bold">{ath.titles} títulos</span>
                        </div>
                      </div>
                    </TiltCard3D>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Centros de Treinamento (CTs) */}
            <section id="unidades" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-500">
                  Onde Treinar
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-cinzel uppercase">
                  Centros de Treinamento Gaditas (CTs)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trainingCenters.map(tc => (
                  <TiltCard3D key={tc.id} maxTilt={8}>
                    <div className="p-6 rounded-2xl bg-neutral-950 border-2 border-neutral-800 hover:border-red-600/60 space-y-4 shadow-xl transition-all h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold font-mono text-base shadow-md">
                          CT
                        </span>
                        <h3 className="font-black text-lg text-white font-cinzel">{tc.name}</h3>
                        <p className="text-xs text-neutral-300 leading-relaxed flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{tc.address}, {tc.city} - {tc.state}</span>
                        </p>
                        <p className="text-xs text-neutral-300 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{tc.phone}</span>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
                        <span>Coordenação Técnica: <strong className="text-white">{tc.responsibleName}</strong></span>
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
              </div>
            </section>

            {/* Section: Agendamento de Aula Experimental */}
            <section id="experimental" className="py-20 bg-neutral-950 border-t-2 border-red-600/30">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
                <div className="space-y-2">
                  <div className="inline-block bg-white text-black px-3 py-1 rounded text-xs font-mono font-black uppercase tracking-wider">
                    Faça seu primeiro treino
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white font-cinzel uppercase">
                    Agende sua Aula Experimental Gratuita
                  </h2>
                  <p className="text-xs text-neutral-300 max-w-lg mx-auto">
                    Empreste um kimono oficial e sinta a energia do tatame Gaditas Team.
                  </p>
                </div>

                {trialSent ? (
                  <div className="p-6 rounded-2xl bg-black border-2 border-white text-white text-sm font-semibold space-y-2 shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-red-500 mx-auto" />
                    <p className="text-lg font-black font-cinzel">Agendamento Confirmado!</p>
                    <p className="text-xs text-neutral-300">Nossa coordenação entrará em contato via WhatsApp para confirmar seu horário.</p>
                  </div>
                ) : (
                  <form onSubmit={handleTrialSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Seu Nome Completo"
                      value={trialName}
                      onChange={(e) => setTrialName(e.target.value)}
                      className="px-4 py-3.5 rounded-xl bg-black border-2 border-neutral-800 text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-600"
                    />

                    <input
                      type="text"
                      required
                      placeholder="WhatsApp (com DDD)"
                      value={trialPhone}
                      onChange={(e) => setTrialPhone(e.target.value)}
                      className="px-4 py-3.5 rounded-xl bg-black border-2 border-neutral-800 text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-600"
                    />

                    <select
                      value={trialCT}
                      onChange={(e) => setTrialCT(e.target.value)}
                      className="px-4 py-3.5 rounded-xl bg-black border-2 border-neutral-800 text-white focus:outline-hidden cursor-pointer"
                    >
                      {trainingCenters.map(tc => (
                        <option key={tc.id} value={tc.name}>{tc.name}</option>
                      ))}
                    </select>

                    <div className="sm:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-10 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-2xl border-2 border-white/40 hover:scale-105"
                      >
                        Confirmar Agendamento no Tatame
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Institutional Footer (Preto e Branco com Vermelho) */}
      <footer id="contato" className="bg-black border-t-2 border-neutral-900 py-12 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="space-y-3 md:col-span-2">
            <TeamBadge size="md" />
            <p className="text-[11px] text-neutral-400 max-w-sm leading-relaxed font-serif">
              {siteConfig.slogan} · Mais que uma equipe, uma linhagem de guerreiros forjados na disciplina, honra e técnica refinada.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-black text-white uppercase tracking-wider text-[11px] font-mono">Links Oficiais</span>
            <ul className="space-y-1.5 text-neutral-400">
              <li><button type="button" onClick={() => setPublicPage('biografia')} className="hover:text-red-500">Biografia do Mestre</button></li>
              <li><button type="button" onClick={() => setPublicPage('biblioteca')} className="hover:text-red-500">Biblioteca Digital</button></li>
              <li><button type="button" onClick={() => setPublicPage('ranking')} className="hover:text-red-500">Ranking Oficial</button></li>
              <li><button type="button" onClick={() => openLoginModal('aluno')} className="hover:text-white font-bold">Área do Aluno</button></li>
              <li><button type="button" onClick={() => openLoginModal('staff')} className="hover:text-red-500 font-bold">Área do Mestre & Staff</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-black text-white uppercase tracking-wider text-[11px] font-mono">Contato & Endereço</span>
            <p className="text-neutral-300">{siteConfig.contactAddress}</p>
            <p className="text-neutral-300">{siteConfig.contactPhone}</p>
            <p className="text-neutral-300">{siteConfig.contactEmail}</p>

            <div className="flex items-center gap-2 pt-2">
              <a href={siteConfig.socialInstagram} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-950 text-neutral-300 hover:text-red-500 border border-neutral-800">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={siteConfig.socialYoutube} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-950 text-neutral-300 hover:text-red-500 border border-neutral-800">
                <Youtube className="w-4 h-4" />
              </a>
              <a href={siteConfig.socialWhatsapp} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-950 text-neutral-300 hover:text-red-500 border border-neutral-800">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-900 text-center text-xs text-neutral-400 font-mono font-bold space-y-1">
          <p className="text-white text-sm font-cinzel tracking-wider">
            LEMA: <span className="text-red-500">"A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"</span>
          </p>
          <p className="text-neutral-500">
            © 2026 EQUIPE GADITAS FIGHT TEAM - RIO DE JANEIRO · FAZENDO A DIFERENÇA
          </p>
        </div>
      </footer>

      {/* Global Auth Modal */}
      <LoginModal />
    </div>
  );
};
