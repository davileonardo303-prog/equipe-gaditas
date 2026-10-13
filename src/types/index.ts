export type UserRole = 
  | 'admin'           // Administrador Geral (Controle Máximo e Irrestrito)
  | 'subadmin'        // Administrador Secundário
  | 'coordenador'     // Coordenador de Polo/Regional
  | 'mestre'          // Portal do Mestre
  | 'professor'       // Professor do CT
  | 'financeiro'      // Responsável Financeiro
  | 'aluno'           // Aluno / Atleta
  | 'visitante';      // Visitante (Acesso Restrito)

export type UserStatus = 'Aprovado' | 'Pendente' | 'Suspenso' | 'Rejeitado';

export interface ModulePermissions {
  usuarios: boolean;
  financeiro: boolean;
  professores: boolean;
  alunos: boolean;
  presencas: boolean;
  graduacoes: boolean;
  eventos: boolean;
  competicoes: boolean;
  relatorios: boolean;
  configuracoes: boolean;
  auditoria: boolean;
  site_cms: boolean;
}

export interface JwtSession {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  issuedAt: number;
  expiresAt: number;
}

export type BeltType = 
  | 'Branca' 
  | 'Cinza' 
  | 'Amarela' 
  | 'Laranja' 
  | 'Verde' 
  | 'Azul' 
  | 'Roxa' 
  | 'Marrom' 
  | 'Preta' 
  | 'Coral' 
  | 'Vermelha';

export type ModalityType = 'Jiu-Jitsu' | 'Muay Thai' | 'MMA' | 'Judô' | 'No-Gi Submission';

export type WeightCategory = 
  | 'Galo (-57kg)' 
  | 'Pluma (-64kg)' 
  | 'Pena (-70kg)' 
  | 'Leve (-76kg)' 
  | 'Médio (-82kg)' 
  | 'Meio-Pesado (-88kg)' 
  | 'Pesado (-94kg)' 
  | 'Super-Pesado (-100kg)' 
  | 'Pesadíssimo (+100kg)' 
  | 'Absoluto';

export interface TrainingCenterSchedule {
  day: string;
  hours: string;
  modality: string;
  instructor?: string;
}

export interface TrainingCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  neighborhood?: string;
  phone: string;
  responsibleName: string;
  coordinatorName?: string;
  activeStudentsCount: number;
  photoUrl?: string;
  schedules?: TrainingCenterSchedule[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Student {
  id: string;
  registrationNumber: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  photoUrl: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  trainingCenterId: string;
  trainingCenterName: string;
  professorId: string;
  professorName: string;
  modality: ModalityType;
  belt: BeltType;
  stripes: number; // 0 a 4 graus
  weight: number; // kg
  height: number; // cm
  weightCategory: WeightCategory;
  joinDate: string;
  lastGraduationDate: string;
  attendanceCount: number; // presenças no mês
  totalAttendance: number; // presenças acumuladas
  points: number; // pontos de ranking
  rankPosition?: number;
  monthlyFee: number;
  paymentStatus: 'Pago' | 'Pendente' | 'Atrasado';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalRecord: {
    bloodType: string;
    allergies: string;
    medications: string;
    healthNotes: string;
    hasSignedWaiver: boolean;
  };
}

export interface Athlete {
  id: string;
  studentId?: string;
  name: string;
  nickname?: string;
  photoUrl: string;
  cpf: string;
  age: number;
  weight: number;
  height: number;
  belt: BeltType;
  category: WeightCategory;
  modality: ModalityType;
  trainingCenterId: string;
  trainingCenterName: string;
  professorName: string;
  victories: number;
  defeats: number;
  draws: number;
  submissions: number;
  knockouts: number;
  titles: number;
  points: number;
  isHighlight: boolean; // Atleta Destaque no Site Institucional
  biography?: string;
}

export interface Professor {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  email?: string;
  cpf: string;
  belt: BeltType;
  degrees: number;
  role: string; // Ex: Coordenador Técnico / Head Coach
  trainingCenterId: string;
  trainingCenterName: string;
  bio: string;
  studentsCount: number;
  commissionRate: number; // Ex: 20 para 20%
  baseSalary?: number;
  status: 'Aprovado' | 'Pendente';
  registeredBy?: string;
}

export interface Master {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  email: string;
  cpf: string;
  belt: BeltType;
  title: string; // Ex: Grau Preta e Branca (Muay Thai), Faixa Preta (Luta Livre)
  bio: string;
  trainingCenterId?: string;
  trainingCenterName?: string;
  status: 'Aprovado' | 'Pendente';
  joinedDate: string;
  isFounder?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  passwordSalt?: string;
  failedAttempts?: number;
  lockedUntil?: number;
  role: UserRole;
  status: UserStatus;
  permissions?: ModulePermissions;
  referenceId?: string; // ID do aluno, professor ou mestre
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  lastLoginAt?: string;
  photoUrl?: string;
  trainingCenterId?: string;
  trainingCenterName?: string;
  phone?: string;
  provider?: 'local' | 'google';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 
    | 'LOGIN' 
    | 'LOGOUT' 
    | 'LOGIN_FAILED' 
    | 'USER_CREATED' 
    | 'USER_APPROVED' 
    | 'USER_REJECTED' 
    | 'USER_SUSPENDED' 
    | 'USER_REACTIVATED' 
    | 'USER_DELETED' 
    | 'PERMISSIONS_UPDATED' 
    | 'PASSWORD_RESET_REQUEST' 
    | 'PASSWORD_RESET_SUCCESS' 
    | 'UNAUTHORIZED_ACCESS' 
    | 'BACKUP_CREATED' 
    | 'DATA_RESTORED' 
    | 'PROFILE_UPDATED';
  module: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED' | 'SECURITY_ALERT';
}

export interface DatabaseBackup {
  id: string;
  filename: string;
  timestamp: string;
  createdByName: string;
  sizeKb: number;
  recordsCount: {
    users: number;
    students: number;
    professors: number;
    trainingCenters: number;
    auditLogs: number;
  };
}

export interface Fight {
  id: string;
  tournamentId?: string;
  tournamentName: string;
  date: string;
  blueAthleteId: string;
  blueAthleteName: string;
  redAthleteId: string;
  redAthleteName: string;
  category: string;
  modality: ModalityType;
  winnerId: string;
  winnerName: string;
  method: 'Pontos' | 'Finalização' | 'Nocaute / TKO' | 'Decisão Unânime' | 'Desqualificação';
  videoUrl?: string;
  notes?: string;
}

export interface TournamentMatch {
  id: string;
  round: 'Quartas' | 'Semifinal' | 'Final';
  matchNumber: number;
  athlete1?: { id: string; name: string; belt: BeltType; points: number; isWinner?: boolean };
  athlete2?: { id: string; name: string; belt: BeltType; points: number; isWinner?: boolean };
  winnerId?: string;
  method?: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  city: string;
  state: string;
  organizer: string;
  modality: ModalityType;
  categories: WeightCategory[];
  status: 'Inscrições Abertas' | 'Pesagem' | 'Em Andamento' | 'Homologado / Finalizado';
  registeredAthletesCount: number;
  registeredAthletes: {
    athleteId: string;
    name: string;
    belt: BeltType;
    category: WeightCategory;
    weightChecked: boolean;
    registeredAt: string;
  }[];
  brackets: TournamentMatch[];
  championName?: string;
  runnerUpName?: string;
}

export interface GraduationExam {
  id: string;
  studentId: string;
  studentName: string;
  currentBelt: BeltType;
  currentStripes: number;
  targetBelt: BeltType;
  targetStripes: number;
  examDate: string;
  professorRecommendation: string;
  status: 'Aguardando Aprovação' | 'Aprovado pelo Mestre' | 'Reprovado';
  masterNotes?: string;
  approvedDate?: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'Receita' | 'Despesa';
  category: 
    | 'Mensalidade' 
    | 'Patrocínio' 
    | 'Inscrição Campeonato' 
    | 'Loja Gaditas' 
    | 'Aluguel CT' 
    | 'Comissão Professor' 
    | 'Equipamentos' 
    | 'Marketing' 
    | 'Outros';
  description: string;
  amount: number;
  paymentMethod: 'PIX' | 'Dinheiro' | 'Cartão' | 'Transferência';
  status: 'Concluído' | 'Pendente';
  referenceStudentId?: string;
  referenceProfessorId?: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  category: 'Kimonos' | 'Camisas' | 'Shorts & Bermudas' | 'Luvas' | 'Caneleiras' | 'Faixas & Acessórios';
  price: number;
  costPrice: number;
  stock: number;
  sizes: string[];
  photoUrl: string;
  minStockAlert: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  trainingCenterId: string;
  classTime: string; // Ex: 19:30 - Adulto Avançado
  modality: ModalityType;
  professorId: string;
  professorName: string;
  presentStudentIds: string[];
}

export interface CertificateItem {
  id: string;
  code: string;
  studentName: string;
  certificateType: 'Graduação' | 'Participação' | 'Curso Técnico' | 'Arbitragem' | 'Campeão de Torneio';
  description: string;
  issueDate: string;
  masterSignatory: string;
  presidentSignatory: string;
  beltAwarded?: BeltType;
  degreesAwarded?: number;
}

export interface MediaFile {
  id: string;
  name: string;
  folder: 'Atletas' | 'Eventos' | 'Banners' | 'Professores' | 'Galeria' | 'Certificados' | 'Patrocinadores' | 'Documentos';
  fileType: 'image' | 'video' | 'pdf';
  url: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  photoUrl: string;
  author: string;
  date: string;
  published: boolean;
}

export interface TeamEvent {
  id: string;
  title: string;
  type: 'Campeonato' | 'Exame de Faixa' | 'Seminário' | 'Aulão Geral';
  date: string;
  location: string;
  description: string;
  posterUrl: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: 'Patrocinador Master' | 'Apoiador Oficial' | 'Parceiro Local';
  websiteUrl?: string;
}

export interface SiteConfiguration {
  teamName: string;
  slogan: string;
  logoUrl: string;
  primaryColor: string; // Ex: #f59e0b (ouro)
  accentColor: string;  // Ex: #dc2626 (rubi)
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;
  heroVideoUrl?: string;
  historyText: string;
  missionText: string;
  visionText: string;
  valuesText: string[];
  masterName: string;
  masterTitle: string; // Ex: Grande Mestre 8º Dan - Fundador
  masterPhotoUrl: string;
  masterBio: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialInstagram: string;
  socialYoutube: string;
  socialWhatsapp: string;
  faviconUrl?: string;
  footerText?: string;
  announcementBar?: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  navigationMenu?: {
    id: string;
    label: string;
    url: string;
    order: number;
    isExternal?: boolean;
  }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface PageBlock {
  id: string;
  type: 'hero' | 'text' | 'gallery' | 'video' | 'pdf' | 'form' | 'cts_grid' | 'faq' | 'notice';
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  galleryImages?: string[];
  faqItems?: { question: string; answer: string }[];
  formFields?: {
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    required?: boolean;
    options?: string[];
  }[];
  backgroundColor?: string;
  textColor?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  published: boolean;
  showInMenu: boolean;
  menuOrder: number;
  blocks: PageBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface DigitalSignature {
  id: string;
  studentId: string;
  studentName: string;
  documentType: 'Regulamento Interno' | 'Contrato de Matrícula' | 'Termo de Responsabilidade & Parq' | 'Autorização de Menores';
  signatureDataUrl: string;
  signedAt: string;
  ipAddress: string;
  deviceInfo: string;
  status: 'Válido' | 'Revogado';
}
