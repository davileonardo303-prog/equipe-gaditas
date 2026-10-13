import { 
  TrainingCenter, 
  Student, 
  Athlete, 
  Professor, 
  Master,
  Tournament, 
  Fight, 
  GraduationExam, 
  FinancialTransaction, 
  StoreProduct, 
  CertificateItem, 
  MediaFile, 
  NewsArticle, 
  TeamEvent, 
  Sponsor, 
  SiteConfiguration,
  UserAccount,
  ModulePermissions,
  AuditLog,
  DatabaseBackup,
  CustomPage,
  DigitalSignature
} from '../types';

export const INITIAL_MASTERS: Master[] = [
  {
    id: 'mestre-daniel',
    name: 'Mestre Daniel Braga',
    photoUrl: '/src/assets/images/mestre_daniel_braga_1790944987945.jpg',
    phone: '(21) 98765-4321',
    email: 'danielbraga@gaditasfteam.com.br',
    cpf: '123.456.789-00',
    belt: 'Preta',
    title: 'Grau Preta e Branca (Muay Thai) · Faixa Preta (Luta Livre) · Líder e Fundador',
    bio: 'Ingresso nas artes marciais aos 15 anos. Formação na conceituada Equipe Nael Pedra e Faixa Preta diplomado em 2017 pelo Mestre Leandro Vilela (Equipe Gladiador). Amplo domínio técnico em Boxe, Luta Livre, Muay Thai, Kickboxing, MMA, Sambo e Jiu-Jitsu. Em 2017 fundou em Nova Iguaçu a Equipe Gaditas F Team, hoje com +12 faixas pretas formados e diversos polos ativos no Rio de Janeiro.',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Nova Iguaçu (Sede Fundacional)',
    status: 'Aprovado',
    joinedDate: '2017-01-01',
    isFounder: true
  },
  {
    id: 'mestre-davi',
    name: 'Mestre Davi Leonardo',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98112-0012',
    email: 'davileonardo303@gmail.com',
    cpf: '321.654.987-12',
    belt: 'Preta',
    title: 'Faixa Preta 4º Grau · Coordenador Técnico Geral · Mestre Gaditas',
    bio: 'Liderança técnica da Equipe Gaditas Fight Team. Responsável pela coordenação pedagógica, supervisão dos 13 polos e homologação de graduações e exames de faixa.',
    trainingCenterId: 'ct-davi',
    trainingCenterName: 'CT Gaditas - Polo Davi (MT-12)',
    status: 'Aprovado',
    joinedDate: '2017-01-01',
    isFounder: true
  }
];

export const INITIAL_TRAINING_CENTRES: TrainingCenter[] = [
  {
    id: 'ct-gabriel',
    name: 'CT Gaditas - Polo Gabriel (MT-01)',
    address: 'Av. Nilo Peçanha, 420 - Centro',
    city: 'Nova Iguaçu',
    state: 'RJ',
    neighborhood: 'Centro',
    phone: '(21) 98101-0001',
    responsibleName: 'Prof. Gabriel (MT-01)',
    coordinatorName: 'Prof. Gabriel',
    activeStudentsCount: 38,
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7558, lng: -43.4514 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '07:00 - 08:30', modality: 'Muay Thai Manhã', instructor: 'Prof. Gabriel' },
      { day: 'Seg / Qua / Sex', hours: '19:30 - 21:00', modality: 'Muay Thai Avançado', instructor: 'Prof. Gabriel' },
      { day: 'Ter / Qui', hours: '18:00 - 19:30', modality: 'Iniciantes & Infantil', instructor: 'Instrutor Auxiliar' }
    ]
  },
  {
    id: 'ct-juliocesar',
    name: 'CT Gaditas - Polo Júlio César (MT-02)',
    address: 'Rua Silva Teles, 310 - Andaraí',
    city: 'Rio de Janeiro',
    state: 'RJ',
    neighborhood: 'Andaraí / Tijuca',
    phone: '(21) 98102-0002',
    responsibleName: 'Prof. Júlio César (MT-02)',
    coordinatorName: 'Prof. Júlio César',
    activeStudentsCount: 44,
    photoUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.9231, lng: -43.2458 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '08:00 - 09:30', modality: 'Muay Thai Funcional', instructor: 'Prof. Júlio César' },
      { day: 'Seg / Qua / Sex', hours: '20:00 - 21:30', modality: 'Muay Thai & Sparring', instructor: 'Prof. Júlio César' }
    ]
  },
  {
    id: 'ct-leonardoleal',
    name: 'CT Gaditas - Polo Leonardo Leal (MT-03)',
    address: 'Rua Bernardino de Melo, 1580 - Juscelino',
    city: 'Nova Iguaçu',
    state: 'RJ',
    neighborhood: 'Juscelino',
    phone: '(21) 98103-0003',
    responsibleName: 'Prof. Leonardo Leal (MT-03)',
    coordinatorName: 'Prof. Leonardo Leal',
    activeStudentsCount: 52,
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7661, lng: -43.4398 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '09:00 - 10:30', modality: 'Muay Thai Geral', instructor: 'Prof. Leonardo Leal' },
      { day: 'Seg / Qua / Sex', hours: '19:00 - 20:30', modality: 'Preparação para Atletas', instructor: 'Prof. Leonardo Leal' }
    ]
  },
  {
    id: 'ct-fernando',
    name: 'CT Gaditas - Polo Fernando (MT-04)',
    address: 'Av. Governador Portela, 750 - Centro',
    city: 'Nilópolis',
    state: 'RJ',
    neighborhood: 'Centro',
    phone: '(21) 98104-0004',
    responsibleName: 'Prof. Fernando (MT-04)',
    coordinatorName: 'Prof. Fernando',
    activeStudentsCount: 35,
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.8081, lng: -43.4144 },
    schedules: [
      { day: 'Ter / Qui / Sáb', hours: '08:00 - 09:30', modality: 'Muay Thai Turma Matutina', instructor: 'Prof. Fernando' },
      { day: 'Seg / Qua / Sex', hours: '19:30 - 21:00', modality: 'Noite de Combate', instructor: 'Prof. Fernando' }
    ]
  },
  {
    id: 'ct-alison',
    name: 'CT Gaditas - Polo Alison (MT-05)',
    address: 'Av. Benjamin Pinto Dias, 920 - Centro',
    city: 'Belford Roxo',
    state: 'RJ',
    neighborhood: 'Centro',
    phone: '(21) 98105-0005',
    responsibleName: 'Prof. Alison (MT-05)',
    coordinatorName: 'Prof. Alison',
    activeStudentsCount: 41,
    photoUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7639, lng: -43.3986 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '18:30 - 20:00', modality: 'Muay Thai & Boxe', instructor: 'Prof. Alison' },
      { day: 'Ter / Qui', hours: '20:00 - 21:30', modality: 'Luta Livre & Submission', instructor: 'Prof. Alison' }
    ]
  },
  {
    id: 'ct-fabio',
    name: 'CT Gaditas - Polo Fábio (MT-06)',
    address: 'Rua da Matriz, 480 - Centro',
    city: 'São João de Meriti',
    state: 'RJ',
    neighborhood: 'Centro',
    phone: '(21) 98106-0006',
    responsibleName: 'Prof. Fábio (MT-06)',
    coordinatorName: 'Prof. Fábio',
    activeStudentsCount: 39,
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.8028, lng: -43.3725 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '19:00 - 20:30', modality: 'Muay Thai Tradicional', instructor: 'Prof. Fábio' }
    ]
  },
  {
    id: 'ct-breno',
    name: 'CT Gaditas - Polo Breno (MT-07)',
    address: 'Rua Feliciano Sodré, 610 - Centro',
    city: 'Mesquita',
    state: 'RJ',
    neighborhood: 'Centro',
    phone: '(21) 98107-0007',
    responsibleName: 'Prof. Breno (MT-07)',
    coordinatorName: 'Prof. Breno',
    activeStudentsCount: 33,
    photoUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7842, lng: -43.4308 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '20:00 - 21:30', modality: 'Muay Thai Noturno', instructor: 'Prof. Breno' }
    ]
  },
  {
    id: 'ct-fernando2',
    name: 'CT Gaditas - Polo Fernando II (MT-08)',
    address: 'Av. Brigadeiro Lima e Silva, 1120 - 25 de Agosto',
    city: 'Duque de Caxias',
    state: 'RJ',
    neighborhood: '25 de Agosto',
    phone: '(21) 98108-0008',
    responsibleName: 'Prof. Fernando II (MT-08)',
    coordinatorName: 'Prof. Fernando II',
    activeStudentsCount: 36,
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7911, lng: -43.3039 },
    schedules: [
      { day: 'Ter / Qui', hours: '19:00 - 20:30', modality: 'Muay Thai Competitivo', instructor: 'Prof. Fernando II' },
      { day: 'Sáb', hours: '10:00 - 12:00', modality: 'Aulão de Sparring Caxias', instructor: 'Prof. Fernando II' }
    ]
  },
  {
    id: 'ct-unamar',
    name: 'CT Gaditas - Polo Unamar (MT-09)',
    address: 'Rodovia Amaral Peixoto, Km 135 - Unamar (Tamoios)',
    city: 'Cabo Frio',
    state: 'RJ',
    neighborhood: 'Unamar / Região dos Lagos',
    phone: '(22) 98109-0009',
    responsibleName: 'Prof. Leo Una Mar (MT-09)',
    coordinatorName: 'Prof. Leo Una Mar',
    activeStudentsCount: 60,
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.6139, lng: -41.9958 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '08:00 - 09:30', modality: 'Muay Thai Litoral Manhã', instructor: 'Prof. Leo Una Mar' },
      { day: 'Seg / Qua / Sex', hours: '19:30 - 21:00', modality: 'Muay Thai Noite', instructor: 'Prof. Leo Una Mar' }
    ]
  },
  {
    id: 'ct-dirceu',
    name: 'CT Gaditas - Polo Dirceu (MT-10)',
    address: 'Rua Getúlio Vargas, 340 - Olinda',
    city: 'Nilópolis',
    state: 'RJ',
    neighborhood: 'Olinda',
    phone: '(21) 98110-0010',
    responsibleName: 'Prof. Dirceu (MT-10)',
    coordinatorName: 'Prof. Dirceu',
    activeStudentsCount: 31,
    photoUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.8122, lng: -43.4189 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '20:00 - 21:30', modality: 'Muay Thai Adulto', instructor: 'Prof. Dirceu' }
    ]
  },
  {
    id: 'ct-matriz',
    name: 'CT Matriz Nova Iguaçu (Sede Fundacional) (MT-11)',
    address: 'Rua das Artes Marciais, 150 - Centro',
    city: 'Nova Iguaçu',
    state: 'RJ',
    neighborhood: 'Centro Histórico',
    phone: '(21) 98765-4321',
    responsibleName: 'Mestre Daniel Braga (MT-11)',
    coordinatorName: 'Mestre Daniel Braga & Mestre Davi Leonardo',
    activeStudentsCount: 85,
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7569, lng: -43.4502 },
    schedules: [
      { day: 'Seg a Sex', hours: '07:00 - 08:30', modality: 'Muay Thai Matutino', instructor: 'Mestre Daniel Braga' },
      { day: 'Seg a Sex', hours: '18:00 - 19:30', modality: 'Turma Geral e Graduados', instructor: 'Mestre Daniel Braga' },
      { day: 'Seg / Qua / Sex', hours: '20:00 - 21:30', modality: 'Luta Livre & MMA Pro', instructor: 'Mestre Davi Leonardo' },
      { day: 'Sábado', hours: '09:00 - 12:00', modality: 'Treinão Geral de Graduação', instructor: 'Mestres & Professores' }
    ]
  },
  {
    id: 'ct-davi',
    name: 'CT Gaditas - Polo Davi (MT-12)',
    address: 'Estrada de Madureira, 2200 - Bairro da Luz',
    city: 'Nova Iguaçu',
    state: 'RJ',
    neighborhood: 'Bairro da Luz',
    phone: '(21) 98112-0012',
    responsibleName: 'Prof. Davi Leonardo (MT-12)',
    coordinatorName: 'Mestre Davi Leonardo',
    activeStudentsCount: 67,
    photoUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7505, lng: -43.4688 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '08:30 - 10:00', modality: 'Muay Thai & Condicionamento', instructor: 'Prof. Davi Leonardo' },
      { day: 'Seg / Qua / Sex', hours: '19:30 - 21:00', modality: 'Muay Thai Noturno', instructor: 'Prof. Davi Leonardo' }
    ]
  },
  {
    id: 'ct-iagum',
    name: 'CT Gaditas - Polo Iagum (MT-13)',
    address: 'Av. Irmãos Guinle, 520 - Centro',
    city: 'Queimados',
    state: 'RJ',
    neighborhood: 'Centro',
    phone: '(21) 98113-0013',
    responsibleName: 'Prof. Iagum (MT-13)',
    coordinatorName: 'Prof. Iagum',
    activeStudentsCount: 29,
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: -22.7161, lng: -43.5558 },
    schedules: [
      { day: 'Seg / Qua / Sex', hours: '19:30 - 21:00', modality: 'Muay Thai & Defesa Pessoal', instructor: 'Prof. Iagum' }
    ]
  }
];

export const INITIAL_PROFESSORS: Professor[] = [
  {
    id: 'prof-gabriel',
    name: 'Gabriel',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98101-0001',
    email: 'gabriel@gaditasfteam.com.br',
    cpf: '111.001.001-01',
    belt: 'Preta',
    degrees: 2,
    role: 'Head Coach Muay Thai · Responsável CT Polo Gabriel (MT-01)',
    trainingCenterId: 'ct-gabriel',
    trainingCenterName: 'CT Gaditas - Polo Gabriel (MT-01)',
    bio: 'Professor Faixa Preta diplomado da Gaditas Team. Coordenador do polo em Nova Iguaçu com foco em Muay Thai competitivo e formação disciplinar de alunos.',
    studentsCount: 38,
    commissionRate: 20,
    baseSalary: 1500,
    status: 'Aprovado'
  },
  {
    id: 'prof-juliocesar',
    name: 'Júlio César',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98102-0002',
    email: 'juliocesar@gaditasfteam.com.br',
    cpf: '222.002.002-02',
    belt: 'Preta',
    degrees: 3,
    role: 'Head Coach Luta Livre & Muay Thai · Responsável CT Polo Júlio César (MT-02)',
    trainingCenterId: 'ct-juliocesar',
    trainingCenterName: 'CT Gaditas - Polo Júlio César (MT-02)',
    bio: 'Faixa Preta 3º Grau, especialista em quedas, clinch e finalizações. Líder do polo da Zona Norte/Andaraí RJ.',
    studentsCount: 44,
    commissionRate: 20,
    baseSalary: 1600,
    status: 'Aprovado'
  },
  {
    id: 'prof-leonardoleal',
    name: 'Leonardo Leal',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98103-0003',
    email: 'leonardoleal@gaditasfteam.com.br',
    cpf: '333.003.003-03',
    belt: 'Preta',
    degrees: 2,
    role: 'Head Coach Jiu-Jitsu & MMA · Responsável CT Polo Leonardo Leal (MT-03)',
    trainingCenterId: 'ct-leonardoleal',
    trainingCenterName: 'CT Gaditas - Polo Leonardo Leal (MT-03)',
    bio: 'Treinador com experiência em MMA e grappling. Comanda o polo de Juscelino / Nova Iguaçu com turmas de base e rendimento.',
    studentsCount: 52,
    commissionRate: 22,
    baseSalary: 1800,
    status: 'Aprovado'
  },
  {
    id: 'prof-fernando',
    name: 'Fernando',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98104-0004',
    email: 'fernando@gaditasfteam.com.br',
    cpf: '444.004.004-04',
    belt: 'Preta',
    degrees: 1,
    role: 'Professor Muay Thai & Kickboxing · Responsável CT Polo Fernando (MT-04)',
    trainingCenterId: 'ct-fernando',
    trainingCenterName: 'CT Gaditas - Polo Fernando (MT-04)',
    bio: 'Formador de atletas strikers de alta precisão. Comanda a unidade em Nilópolis com excelente aproveitamento técnico.',
    studentsCount: 35,
    commissionRate: 20,
    baseSalary: 1400,
    status: 'Aprovado'
  },
  {
    id: 'prof-alison',
    name: 'Alison',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98105-0005',
    email: 'alison@gaditasfteam.com.br',
    cpf: '555.005.005-05',
    belt: 'Preta',
    degrees: 2,
    role: 'Professor Boxe & Muay Thai · Responsável CT Polo Alison (MT-05)',
    trainingCenterId: 'ct-alison',
    trainingCenterName: 'CT Gaditas - Polo Alison (MT-05)',
    bio: 'Especialista em movimentação de pernas, esquivas e combinações de boxe para esportes de combate no polo de Belford Roxo.',
    studentsCount: 41,
    commissionRate: 20,
    baseSalary: 1500,
    status: 'Aprovado'
  },
  {
    id: 'prof-fabio',
    name: 'Fábio',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98106-0006',
    email: 'fabio@gaditasfteam.com.br',
    cpf: '666.006.006-06',
    belt: 'Preta',
    degrees: 2,
    role: 'Head Coach Luta Livre · Responsável CT Polo Fábio (MT-06)',
    trainingCenterId: 'ct-fabio',
    trainingCenterName: 'CT Gaditas - Polo Fábio (MT-06)',
    bio: 'Liderança forte e dedicada no polo de São João de Meriti. Ênfase no jogo de chão agressivo e defesa de quedas.',
    studentsCount: 39,
    commissionRate: 20,
    baseSalary: 1500,
    status: 'Aprovado'
  },
  {
    id: 'prof-breno',
    name: 'Breno',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98107-0007',
    email: 'breno@gaditasfteam.com.br',
    cpf: '777.007.007-07',
    belt: 'Preta',
    degrees: 1,
    role: 'Professor Muay Thai & MMA · Responsável CT Polo Breno (MT-07)',
    trainingCenterId: 'ct-breno',
    trainingCenterName: 'CT Gaditas - Polo Breno (MT-07)',
    bio: 'Comanda o polo de Mesquita, formando turmas juvenis e adultas com metodologia estruturada e respeito aos princípios Gaditas.',
    studentsCount: 33,
    commissionRate: 20,
    baseSalary: 1400,
    status: 'Aprovado'
  },
  {
    id: 'prof-fernando2',
    name: 'Fernando',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98108-0008',
    email: 'fernando2@gaditasfteam.com.br',
    cpf: '888.008.008-08',
    belt: 'Preta',
    degrees: 1,
    role: 'Professor Jiu-Jitsu & Striking · Responsável CT Polo Fernando II (MT-08)',
    trainingCenterId: 'ct-fernando2',
    trainingCenterName: 'CT Gaditas - Polo Fernando II (MT-08)',
    bio: 'Responsável pela unidade de Duque de Caxias, com turmas de iniciação marcial e preparação física funcional.',
    studentsCount: 36,
    commissionRate: 20,
    baseSalary: 1450,
    status: 'Aprovado'
  },
  {
    id: 'prof-leounamar',
    name: 'Leo Una Mar',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    phone: '(22) 98109-0009',
    email: 'leounamar@gaditasfteam.com.br',
    cpf: '999.009.009-09',
    belt: 'Preta',
    degrees: 3,
    role: 'Coordenador Regional Lagos & Head Coach Polo Unamar (MT-09)',
    trainingCenterId: 'ct-unamar',
    trainingCenterName: 'CT Gaditas - Polo Unamar (MT-09)',
    bio: 'Líder regional da Gaditas Team na Região dos Lagos (Unamar/Tamoios - Cabo Frio). Polo referência com mais de 60 alunos e campeões regionais.',
    studentsCount: 60,
    commissionRate: 25,
    baseSalary: 2000,
    status: 'Aprovado'
  },
  {
    id: 'prof-dirceu',
    name: 'Dirceu',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98110-0010',
    email: 'dirceu@gaditasfteam.com.br',
    cpf: '101.010.010-10',
    belt: 'Preta',
    degrees: 2,
    role: 'Professor Muay Thai & Grappling · Responsável CT Polo Dirceu (MT-10)',
    trainingCenterId: 'ct-dirceu',
    trainingCenterName: 'CT Gaditas - Polo Dirceu (MT-10)',
    bio: 'Professor de longa trajetória na Baixada Fluminense. Conduz o polo Dirceu com foco na integridade física e evolução constante dos praticantes.',
    studentsCount: 31,
    commissionRate: 20,
    baseSalary: 1400,
    status: 'Aprovado'
  },
  {
    id: 'prof-daniel',
    name: 'Daniel',
    photoUrl: '/src/assets/images/mestre_daniel_braga_1790944987945.jpg',
    phone: '(21) 98765-4321',
    email: 'daniel@gaditasfteam.com.br',
    cpf: '123.456.789-00',
    belt: 'Preta',
    degrees: 4,
    role: 'Fundador Geral & Líder CT Matriz Nova Iguaçu (MT-11)',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Nova Iguaçu (Sede Fundacional) (MT-11)',
    bio: 'Mestre Daniel Braga, líder fundador da Gaditas Fight Team RJ em 2017. Formado na Equipe Nael Pedra e diplomado pelo Mestre Leandro Vilela.',
    studentsCount: 85,
    commissionRate: 30,
    baseSalary: 3000,
    status: 'Aprovado'
  },
  {
    id: 'prof-davi',
    name: 'Davi',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98112-0012',
    email: 'davileonardo303@gmail.com',
    cpf: '321.654.987-12',
    belt: 'Preta',
    degrees: 4,
    role: 'Coordenador Técnico Geral & Responsável CT Polo Davi (MT-12)',
    trainingCenterId: 'ct-davi',
    trainingCenterName: 'CT Gaditas - Polo Davi (MT-12)',
    bio: 'Mestre Davi Leonardo, coordenação técnica e administrativa geral da Equipe Gaditas. Gestão de bancas de faixa e supervisão dos 13 centros de treinamento.',
    studentsCount: 67,
    commissionRate: 28,
    baseSalary: 2800,
    status: 'Aprovado'
  },
  {
    id: 'prof-iagum',
    name: 'Iagum',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    phone: '(21) 98113-0013',
    email: 'iagum@gaditasfteam.com.br',
    cpf: '131.013.013-13',
    belt: 'Preta',
    degrees: 1,
    role: 'Professor Muay Thai & Kickboxing · Responsável CT Polo Iagum (MT-13)',
    trainingCenterId: 'ct-iagum',
    trainingCenterName: 'CT Gaditas - Polo Iagum (MT-13)',
    bio: 'Comanda o polo de Queimados com entusiasmo e técnica apurada em striking moderno e condicionamento atlético.',
    studentsCount: 29,
    commissionRate: 20,
    baseSalary: 1350,
    status: 'Aprovado'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'aluno-lucas',
    registrationNumber: 'GAD-2024-001',
    name: 'Lucas "Pitbull" Silva',
    cpf: '456.789.012-33',
    email: 'lucas.silva@gaditasteam.com.br',
    phone: '(11) 98877-6655',
    birthDate: '1998-05-14',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    status: 'Ativo',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Nova Iguaçu (Sede Fundacional)',
    professorId: 'prof-daniel',
    professorName: 'Mestre Daniel Braga',
    modality: 'Jiu-Jitsu',
    belt: 'Roxa',
    stripes: 2,
    weight: 75.5,
    height: 178,
    weightCategory: 'Leve (-76kg)',
    joinDate: '2022-03-10',
    lastGraduationDate: '2025-12-15',
    attendanceCount: 22,
    totalAttendance: 240,
    points: 215,
    rankPosition: 1,
    monthlyFee: 150,
    paymentStatus: 'Pago',
    emergencyContact: {
      name: 'Mariana Silva (Esposa)',
      phone: '(11) 99988-1122',
      relationship: 'Esposa',
    },
    medicalRecord: {
      bloodType: 'O+',
      allergies: 'Nenhuma alergia conhecida',
      medications: 'Nenhum',
      healthNotes: 'Apto para treinos de alta intensidade e combates.',
      hasSignedWaiver: true,
    }
  },
  {
    id: 'aluno-felipe',
    registrationNumber: 'GAD-2024-002',
    name: 'Felipe "Samurai" Santos',
    cpf: '567.890.123-44',
    email: 'felipe.santos@gmail.com',
    phone: '(21) 97766-5544',
    birthDate: '2001-08-20',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    status: 'Ativo',
    trainingCenterId: 'ct-gabriel',
    trainingCenterName: 'CT Gaditas - Polo Gabriel (MT-01)',
    professorId: 'prof-gabriel',
    professorName: 'Prof. Gabriel (MT-01)',
    modality: 'Muay Thai',
    belt: 'Azul',
    stripes: 3,
    weight: 81.0,
    height: 182,
    weightCategory: 'Médio (-82kg)',
    joinDate: '2023-01-15',
    lastGraduationDate: '2025-10-10',
    attendanceCount: 19,
    totalAttendance: 165,
    points: 170,
    rankPosition: 2,
    monthlyFee: 150,
    paymentStatus: 'Pago',
    emergencyContact: {
      name: 'Carlos Santos (Pai)',
      phone: '(21) 98123-4567',
      relationship: 'Pai',
    },
    medicalRecord: {
      bloodType: 'A+',
      allergies: 'Dipirona',
      medications: 'Nenhum',
      healthNotes: 'Cirurgia no menisco direito em 2021, 100% liberado pelo ortopedista.',
      hasSignedWaiver: true,
    }
  },
  {
    id: 'aluno-beatriz',
    registrationNumber: 'GAD-2024-003',
    name: 'Beatriz "Valquíria" Lima',
    cpf: '678.901.234-55',
    email: 'beatriz.lima@yahoo.com.br',
    phone: '(22) 99778-9900',
    birthDate: '1999-11-03',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    status: 'Ativo',
    trainingCenterId: 'ct-unamar',
    trainingCenterName: 'CT Gaditas - Polo Unamar (MT-09)',
    professorId: 'prof-leounamar',
    professorName: 'Prof. Leo Una Mar (MT-09)',
    modality: 'Jiu-Jitsu',
    belt: 'Azul',
    stripes: 2,
    weight: 62.5,
    height: 167,
    weightCategory: 'Pena (-70kg)',
    joinDate: '2023-05-02',
    lastGraduationDate: '2025-11-20',
    attendanceCount: 21,
    totalAttendance: 142,
    points: 145,
    rankPosition: 3,
    monthlyFee: 140,
    paymentStatus: 'Pago',
    emergencyContact: {
      name: 'Renata Lima (Irmã)',
      phone: '(13) 99887-7665',
      relationship: 'Irmã',
    },
    medicalRecord: {
      bloodType: 'B+',
      allergies: 'Nenhuma',
      medications: 'Nenhum',
      healthNotes: 'Excelente condicionamento cardiovascular.',
      hasSignedWaiver: true,
    }
  },
  {
    id: 'aluno-marcos',
    registrationNumber: 'GAD-2024-004',
    name: 'Marcos "Gladiador" Oliveira',
    cpf: '789.012.345-66',
    email: 'marcos.gladiador@hotmail.com',
    phone: '(11) 98456-7890',
    birthDate: '1995-02-18',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    status: 'Ativo',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Central Gaditas',
    professorId: 'prof-tiago',
    professorName: 'Tiago "Cyborg" Mendonça',
    modality: 'MMA',
    belt: 'Marrom',
    stripes: 1,
    weight: 92.0,
    height: 186,
    weightCategory: 'Pesado (-94kg)',
    joinDate: '2021-08-10',
    lastGraduationDate: '2025-06-12',
    attendanceCount: 16,
    totalAttendance: 310,
    points: 130,
    rankPosition: 4,
    monthlyFee: 160,
    paymentStatus: 'Pendente',
    emergencyContact: {
      name: 'Patrícia Oliveira (Mãe)',
      phone: '(11) 97711-2233',
      relationship: 'Mãe',
    },
    medicalRecord: {
      bloodType: 'O-',
      allergies: 'Penicilina',
      medications: 'Anti-inflamatório ocasional',
      healthNotes: 'Exames periódicos de ressonância e ECG atualizados para lutas de MMA.',
      hasSignedWaiver: true,
    }
  },
  {
    id: 'aluno-gabriel',
    registrationNumber: 'GAD-2024-005',
    name: 'Gabriel Costa',
    cpf: '890.123.456-77',
    email: 'gabriel.costa@gmail.com',
    phone: '(11) 97123-9988',
    birthDate: '2004-09-12',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    status: 'Ativo',
    trainingCenterId: 'ct-gabriel',
    trainingCenterName: 'CT Gaditas - Polo Gabriel (MT-01)',
    professorId: 'prof-gabriel',
    professorName: 'Prof. Gabriel (MT-01)',
    modality: 'Jiu-Jitsu',
    belt: 'Branca',
    stripes: 4,
    weight: 69.0,
    height: 174,
    weightCategory: 'Pena (-70kg)',
    joinDate: '2024-02-01',
    lastGraduationDate: '2024-02-01',
    attendanceCount: 24,
    totalAttendance: 95,
    points: 90,
    rankPosition: 5,
    monthlyFee: 140,
    paymentStatus: 'Pago',
    emergencyContact: {
      name: 'Sueli Costa (Mãe)',
      phone: '(21) 96655-4433',
      relationship: 'Mãe',
    },
    medicalRecord: {
      bloodType: 'A-',
      allergies: 'Nenhuma',
      medications: 'Nenhum',
      healthNotes: 'Pronto para exame de faixa azul.',
      hasSignedWaiver: true,
    }
  },
  {
    id: 'aluno-pendente-matheus',
    registrationNumber: 'GAD-2026-PEND-01',
    name: 'Matheus "Falcão" Ramos',
    cpf: '912.345.678-00',
    email: 'matheus.ramos@email.com',
    phone: '(21) 98122-3344',
    birthDate: '2001-07-22',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    status: 'Pendente',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Nova Iguaçu (Sede Fundacional) (MT-11)',
    professorId: 'prof-daniel',
    professorName: 'Mestre Daniel Braga (MT-11)',
    modality: 'Muay Thai',
    belt: 'Branca',
    stripes: 0,
    weight: 73.0,
    height: 176,
    weightCategory: 'Leve (-76kg)',
    joinDate: '2026-10-01',
    lastGraduationDate: '2026-10-01',
    attendanceCount: 0,
    totalAttendance: 0,
    points: 0,
    monthlyFee: 150,
    paymentStatus: 'Pendente',
    emergencyContact: {
      name: 'Ana Ramos (Mãe)',
      phone: '(21) 98877-6655',
      relationship: 'Mãe'
    },
    medicalRecord: {
      bloodType: 'O+',
      allergies: 'Nenhuma',
      medications: 'Nenhum',
      healthNotes: 'Cadastrou-se online no site oficial. Aguarda homologação do Professor.',
      hasSignedWaiver: true
    }
  },
  {
    id: 'aluno-pendente-larissa',
    registrationNumber: 'GAD-2026-PEND-02',
    name: 'Larissa "Pantera" Souza',
    cpf: '109.876.543-22',
    email: 'larissa.souza@gmail.com',
    phone: '(21) 99881-2233',
    birthDate: '2003-03-15',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    status: 'Pendente',
    trainingCenterId: 'ct-litoral',
    trainingCenterName: 'CT Gaditas Litoral Santos',
    professorId: 'prof-camila',
    professorName: 'Camila "Fênix" Castro',
    modality: 'Jiu-Jitsu',
    belt: 'Branca',
    stripes: 0,
    weight: 58.0,
    height: 165,
    weightCategory: 'Galo (-57kg)',
    joinDate: '2026-10-02',
    lastGraduationDate: '2026-10-02',
    attendanceCount: 0,
    totalAttendance: 0,
    points: 0,
    monthlyFee: 140,
    paymentStatus: 'Pendente',
    emergencyContact: {
      name: 'Cláudio Souza (Pai)',
      phone: '(21) 99112-3344',
      relationship: 'Pai'
    },
    medicalRecord: {
      bloodType: 'AB+',
      allergies: 'Nenhuma',
      medications: 'Nenhum',
      healthNotes: 'Cadastrou-se pelo portal. Aguarda liberação da Professora Camila.',
      hasSignedWaiver: true
    }
  }
];

export const INITIAL_ATHLETES: Athlete[] = [
  {
    id: 'ath-lucas',
    studentId: 'aluno-lucas',
    name: 'Lucas "Pitbull" Silva',
    nickname: 'Pitbull',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    cpf: '456.789.012-33',
    age: 28,
    weight: 75.5,
    height: 178,
    belt: 'Roxa',
    category: 'Leve (-76kg)',
    modality: 'Jiu-Jitsu',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Central Gaditas',
    professorName: 'Roberto "Trator" Silva',
    victories: 15,
    defeats: 2,
    draws: 0,
    submissions: 11,
    knockouts: 0,
    titles: 3,
    points: 215,
    isHighlight: true,
    biography: 'Atleta destaque da divisão peso leve. Conquistou ouro no Open SP e Prata no Campeonato Brasileiro CBJJ 2025. Conhecido pelo estrangulamento triângulo invertido veloz.'
  },
  {
    id: 'ath-felipe',
    studentId: 'aluno-felipe',
    name: 'Felipe "Samurai" Santos',
    nickname: 'Samurai',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    cpf: '567.890.123-44',
    age: 25,
    weight: 81.0,
    height: 182,
    belt: 'Azul',
    category: 'Médio (-82kg)',
    modality: 'Jiu-Jitsu',
    trainingCenterId: 'ct-norte',
    trainingCenterName: 'CT Gaditas Zona Norte',
    professorName: 'Roberto "Trator" Silva',
    victories: 11,
    defeats: 3,
    draws: 1,
    submissions: 7,
    knockouts: 0,
    titles: 2,
    points: 170,
    isHighlight: true,
    biography: 'Especialista em passagem emborcando e controle de 100kg. Vice-campeão da Copa São Paulo e ouro no Torneio Regional Sudeste.'
  },
  {
    id: 'ath-beatriz',
    studentId: 'aluno-beatriz',
    name: 'Beatriz "Valquíria" Lima',
    nickname: 'Valquíria',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    cpf: '678.901.234-55',
    age: 26,
    weight: 62.5,
    height: 167,
    belt: 'Azul',
    category: 'Pena (-70kg)',
    modality: 'Jiu-Jitsu',
    trainingCenterId: 'ct-litoral',
    trainingCenterName: 'CT Gaditas Litoral Santos',
    professorName: 'Camila "Fênix" Castro',
    victories: 9,
    defeats: 1,
    draws: 0,
    submissions: 6,
    knockouts: 0,
    titles: 2,
    points: 145,
    isHighlight: true,
    biography: 'Destaque no time feminino Gaditas. Guarda De La Riva agressiva e finalizações de chave de braço voadora.'
  },
  {
    id: 'ath-marcos',
    studentId: 'aluno-marcos',
    name: 'Marcos "Gladiador" Oliveira',
    nickname: 'Gladiador',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    cpf: '789.012.345-66',
    age: 31,
    weight: 92.0,
    height: 186,
    belt: 'Marrom',
    category: 'Pesado (-94kg)',
    modality: 'MMA',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Central Gaditas',
    professorName: 'Tiago "Cyborg" Mendonça',
    victories: 8,
    defeats: 1,
    draws: 0,
    submissions: 3,
    knockouts: 5,
    titles: 1,
    points: 130,
    isHighlight: true,
    biography: 'Poder de nocaute brutal e jogo de chão consistente. Detentor do cinturão meio-pesado do Arena Combat Fight.'
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourn-copa-gaditas',
    name: 'Copa Gaditas Grand Prix 2026',
    date: '2026-11-20',
    time: '09:00',
    location: 'Ginásio do Pacaembu / Complexo Esportivo Central',
    city: 'São Paulo',
    state: 'SP',
    organizer: 'Mestre Davi Gaditas & Federação Paulista',
    modality: 'Jiu-Jitsu',
    categories: ['Pena (-70kg)', 'Leve (-76kg)', 'Médio (-82kg)', 'Absoluto'],
    status: 'Inscrições Abertas',
    registeredAthletesCount: 32,
    championName: 'Lucas "Pitbull" Silva',
    runnerUpName: 'Felipe "Samurai" Santos',
    registeredAthletes: [
      {
        athleteId: 'ath-lucas',
        name: 'Lucas "Pitbull" Silva',
        belt: 'Roxa',
        category: 'Leve (-76kg)',
        weightChecked: true,
        registeredAt: '2026-09-15',
      },
      {
        athleteId: 'ath-felipe',
        name: 'Felipe "Samurai" Santos',
        belt: 'Azul',
        category: 'Médio (-82kg)',
        weightChecked: true,
        registeredAt: '2026-09-18',
      },
      {
        athleteId: 'ath-beatriz',
        name: 'Beatriz "Valquíria" Lima',
        belt: 'Azul',
        category: 'Pena (-70kg)',
        weightChecked: true,
        registeredAt: '2026-09-20',
      }
    ],
    brackets: [
      {
        id: 'q1',
        round: 'Quartas',
        matchNumber: 1,
        athlete1: { id: 'ath-lucas', name: 'Lucas Silva', belt: 'Roxa', points: 6, isWinner: true },
        athlete2: { id: 'rival-1', name: 'Danilo Rocha', belt: 'Roxa', points: 2, isWinner: false },
        winnerId: 'ath-lucas',
        method: 'Finalização (Armlock)'
      },
      {
        id: 'q2',
        round: 'Quartas',
        matchNumber: 2,
        athlete1: { id: 'rival-2', name: 'Renato Prado', belt: 'Roxa', points: 4, isWinner: true },
        athlete2: { id: 'rival-3', name: 'Igor Martins', belt: 'Roxa', points: 0, isWinner: false },
        winnerId: 'rival-2',
        method: 'Pontos (4x0)'
      },
      {
        id: 's1',
        round: 'Semifinal',
        matchNumber: 3,
        athlete1: { id: 'ath-lucas', name: 'Lucas Silva', belt: 'Roxa', points: 9, isWinner: true },
        athlete2: { id: 'rival-2', name: 'Renato Prado', belt: 'Roxa', points: 0, isWinner: false },
        winnerId: 'ath-lucas',
        method: 'Finalização (Mata-leão)'
      },
      {
        id: 'f1',
        round: 'Final',
        matchNumber: 4,
        athlete1: { id: 'ath-lucas', name: 'Lucas Silva', belt: 'Roxa', points: 7, isWinner: true },
        athlete2: { id: 'ath-felipe', name: 'Felipe Santos', belt: 'Azul', points: 2, isWinner: false },
        winnerId: 'ath-lucas',
        method: 'Finalização (Triângulo)'
      }
    ]
  }
];

export const INITIAL_FIGHTS: Fight[] = [
  {
    id: 'luta-101',
    tournamentId: 'tourn-copa-gaditas',
    tournamentName: 'Copa Gaditas Grand Prix 2026',
    date: '2026-10-01',
    blueAthleteId: 'ath-lucas',
    blueAthleteName: 'Lucas "Pitbull" Silva',
    redAthleteId: 'ath-felipe',
    redAthleteName: 'Felipe "Samurai" Santos',
    category: 'Leve (-76kg)',
    modality: 'Jiu-Jitsu',
    winnerId: 'ath-lucas',
    winnerName: 'Lucas "Pitbull" Silva',
    method: 'Finalização',
    videoUrl: 'https://youtube.com',
    notes: 'Finalização aos 4:12 por triângulo ajustado da guarda fechada.'
  },
  {
    id: 'luta-102',
    tournamentName: 'Arena Combat Fight MMA 14',
    date: '2026-09-12',
    blueAthleteId: 'ath-marcos',
    blueAthleteName: 'Marcos "Gladiador" Oliveira',
    redAthleteId: 'rival-bruno',
    redAthleteName: 'Bruno "Titan" Barbosa',
    category: 'Pesado (-94kg)',
    modality: 'MMA',
    winnerId: 'ath-marcos',
    winnerName: 'Marcos "Gladiador" Oliveira',
    method: 'Nocaute / TKO',
    notes: 'Nocaute técnico no 2º round após sequência devastadora de cruzados.'
  }
];

export const INITIAL_EXAMS: GraduationExam[] = [
  {
    id: 'exam-gabriel',
    studentId: 'aluno-gabriel',
    studentName: 'Gabriel Costa',
    currentBelt: 'Branca',
    currentStripes: 4,
    targetBelt: 'Azul',
    targetStripes: 0,
    examDate: '2026-10-15',
    professorRecommendation: 'Aluno exemplar com 95 treinos concluídos, técnica de defesa pessoal impecável e excelente conduta no tatame.',
    status: 'Aguardando Aprovação'
  },
  {
    id: 'exam-felipe',
    studentId: 'aluno-felipe',
    studentName: 'Felipe Santos',
    currentBelt: 'Azul',
    currentStripes: 3,
    targetBelt: 'Azul',
    targetStripes: 4,
    examDate: '2026-10-15',
    professorRecommendation: 'Excelente desempenho no último GP, domínio sólido de passagens e liderança com os faixas brancas.',
    status: 'Aguardando Aprovação'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    date: '2026-10-01',
    type: 'Receita',
    category: 'Mensalidade',
    description: 'Mensalidade Aluno Lucas Silva (Outubro/2026)',
    amount: 150.00,
    paymentMethod: 'PIX',
    status: 'Concluído',
    referenceStudentId: 'aluno-lucas'
  },
  {
    id: 'tx-2',
    date: '2026-10-01',
    type: 'Receita',
    category: 'Mensalidade',
    description: 'Mensalidade Aluno Felipe Santos (Outubro/2026)',
    amount: 150.00,
    paymentMethod: 'PIX',
    status: 'Concluído',
    referenceStudentId: 'aluno-felipe'
  },
  {
    id: 'tx-3',
    date: '2026-10-02',
    type: 'Receita',
    category: 'Patrocínio',
    description: 'Patrocínio Oficial NutriForce Suplementos',
    amount: 2500.00,
    paymentMethod: 'Transferência',
    status: 'Concluído'
  },
  {
    id: 'tx-4',
    date: '2026-10-02',
    type: 'Receita',
    category: 'Loja Gaditas',
    description: 'Venda de 2 Kimonos Gold Weave + Faixa Bordada',
    amount: 880.00,
    paymentMethod: 'Cartão',
    status: 'Concluído'
  },
  {
    id: 'tx-5',
    date: '2026-09-30',
    type: 'Despesa',
    category: 'Aluguel CT',
    description: 'Aluguel Tatame Espaço CT Matriz Central',
    amount: 2800.00,
    paymentMethod: 'Transferência',
    status: 'Concluído'
  },
  {
    id: 'tx-6',
    date: '2026-09-30',
    type: 'Despesa',
    category: 'Comissão Professor',
    description: 'Comissão Mensal Prof. Roberto "Trator" (42 alunos x 20%)',
    amount: 1260.00,
    paymentMethod: 'PIX',
    status: 'Concluído',
    referenceProfessorId: 'prof-roberto'
  },
  {
    id: 'tx-7',
    date: '2026-09-28',
    type: 'Despesa',
    category: 'Equipamentos',
    description: 'Manutenção de Tatames e novos sacos de pancada Shoto',
    amount: 650.00,
    paymentMethod: 'Cartão',
    status: 'Concluído'
  }
];

export const INITIAL_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-kimono-gold',
    name: 'Kimono Gaditas Gold Weave Pro 450g',
    category: 'Kimonos',
    price: 390.00,
    costPrice: 220.00,
    stock: 24,
    sizes: ['A1', 'A2', 'A3', 'A4'],
    photoUrl: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=400',
    minStockAlert: 5
  },
  {
    id: 'prod-rashguard',
    name: 'Rashguard Gaditas DryFit No-Gi Armor',
    category: 'Camisas',
    price: 140.00,
    costPrice: 65.00,
    stock: 35,
    sizes: ['P', 'M', 'G', 'GG'],
    photoUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400',
    minStockAlert: 8
  },
  {
    id: 'prod-shorts-mma',
    name: 'Bermuda Fight Short Gaditas Flex Pro',
    category: 'Shorts & Bermudas',
    price: 130.00,
    costPrice: 60.00,
    stock: 18,
    sizes: ['38', '40', '42', '44'],
    photoUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=400',
    minStockAlert: 5
  },
  {
    id: 'prod-luva-boxing',
    name: 'Luvas de Boxe/Muay Thai Couro Sintético 14oz',
    category: 'Luvas',
    price: 210.00,
    costPrice: 110.00,
    stock: 12,
    sizes: ['12oz', '14oz', '16oz'],
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
    minStockAlert: 4
  },
  {
    id: 'prod-faixa-bordada',
    name: 'Faixa Especial Gaditas Bordada em Ouro',
    category: 'Faixas & Acessórios',
    price: 85.00,
    costPrice: 35.00,
    stock: 40,
    sizes: ['A1', 'A2', 'A3', 'A4'],
    photoUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=400',
    minStockAlert: 10
  }
];

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-001',
    code: 'CERT-GAD-2025-089',
    studentName: 'Lucas "Pitbull" Silva',
    certificateType: 'Graduação',
    description: 'Promovido com louvor ao grau de Faixa Roxa de Jiu-Jitsu Brasileiro sob as regras da linhagem Gaditas Team.',
    issueDate: '15/12/2025',
    masterSignatory: 'Mestre Davi Gaditas - Faixa Coral 8º Dan',
    presidentSignatory: 'Roberto "Trator" Silva - Coordenador Técnico',
    beltAwarded: 'Roxa',
    degreesAwarded: 2
  },
  {
    id: 'cert-002',
    code: 'CERT-GAD-2026-012',
    studentName: 'Felipe Santos',
    certificateType: 'Campeão de Torneio',
    description: 'Campeão da Categoria Médio na Copa Regional Sudeste de Submission & Jiu-Jitsu.',
    issueDate: '20/02/2026',
    masterSignatory: 'Mestre Davi Gaditas - Presidente da Banca',
    presidentSignatory: 'Camila Castro - Diretora de Arbitragem'
  }
];

export const INITIAL_MEDIA: MediaFile[] = [
  {
    id: 'media-1',
    name: 'banner_hero_tatame.jpg',
    folder: 'Banners',
    fileType: 'image',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    sizeKb: 450,
    uploadedAt: '2026-09-01'
  },
  {
    id: 'media-2',
    name: 'mestre_davi_oficial.jpg',
    folder: 'Professores',
    fileType: 'image',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    sizeKb: 320,
    uploadedAt: '2026-09-05'
  },
  {
    id: 'media-3',
    name: 'campeonato_podio_ouro.jpg',
    folder: 'Eventos',
    fileType: 'image',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    sizeKb: 512,
    uploadedAt: '2026-09-22'
  },
  {
    id: 'media-4',
    name: 'regulamento_graduacao_2026.pdf',
    folder: 'Documentos',
    fileType: 'pdf',
    url: '#',
    sizeKb: 1280,
    uploadedAt: '2026-09-10'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Equipe Gaditas conquista 10 medalhas e o título geral por equipes no Open SP',
    summary: 'Com atuação histórica dos faixas roxas e marrons, a Gaditas Team subiu ao lugar mais alto do pódio neste final de semana.',
    content: 'O Ginásio do Ibirapuera foi palco de combates memoráveis neste final de semana. A delegação da Gaditas Team contou com 18 competidores e trouxe para a matriz 6 medalhas de ouro, 3 de prata e 1 de bronze, consagrando-se campeã geral por equipes. O Mestre Davi elogiou a disciplina e o espírito fraternal de todos os guerreiros.',
    photoUrl: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=800',
    author: 'Assessoria Gaditas',
    date: '28 de Setembro de 2026',
    published: true
  },
  {
    id: 'news-2',
    title: 'Seminário Internacional de Passagens de Guarda com Mestre Davi anunciado',
    summary: 'Aberto a todas as graduações e academias filiadas. Vagas limitadas para o encontro no CT Matriz.',
    content: 'No próximo dia 12 de Novembro, o Mestre Davi Gaditas ministrará um seminário imersivo de 4 horas abordando conceitos avançados de pressão, antecipação e transições do Jiu-Jitsu clássico e moderno. Todos os participantes receberão certificado oficial de participação.',
    photoUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800',
    author: 'Coordenação Técnica',
    date: '01 de Outubro de 2026',
    published: true
  }
];

export const INITIAL_EVENTS: TeamEvent[] = [
  {
    id: 'evt-1',
    title: 'Exame Geral de Faixas e Graduação de Fim de Ano',
    type: 'Exame de Faixa',
    date: '15 de Dezembro de 2026',
    location: 'CT Matriz Central Gaditas',
    description: 'Cerimônia solene de graduação para alunos infantis, juvenis e adultos com entrega de diplomas e confraternização.',
    posterUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'evt-2',
    title: 'Copa Gaditas Grand Prix 2026',
    type: 'Campeonato',
    date: '20 de Novembro de 2026',
    location: 'Complexo Esportivo Pacaembu',
    description: 'Chaves de todas as faixas e pesos, pesagem oficial, cronômetro digital e transmissão ao vivo.',
    posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sp-1',
    name: 'NutriForce Suplementos',
    logoUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=200',
    tier: 'Patrocinador Master'
  },
  {
    id: 'sp-2',
    name: 'Shoto Fight Gear',
    logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200',
    tier: 'Apoiador Oficial'
  },
  {
    id: 'sp-3',
    name: 'Clínica OrthoSport Fisioterapia',
    logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200',
    tier: 'Parceiro Local'
  }
];

export const INITIAL_SITE_CONFIG: SiteConfiguration = {
  teamName: 'Equipe Gaditas F Team',
  slogan: 'A dor é passageira, mas o orgulho é eterno',
  logoUrl: '', // Usa o brasão oficial vetorizado
  primaryColor: '#dc2626', // Vermelho Oficial Gaditas
  accentColor: '#ffffff',  // Branco Puro Oficial Gaditas
  heroTitle: 'EQUIPE GADITAS FIGHT TEAM — A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO',
  heroSubtitle: 'Fundada em 2017 em Nova Iguaçu pelo Mestre Daniel Braga. Uma das maiores e mais respeitadas famílias marciais do Rio de Janeiro. Muay Thai, Luta Livre, Boxe, Kickboxing, MMA, Sambo e Jiu-Jitsu.',
  heroBannerUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600',
  historyText: 'Fundada em 2017 em Nova Iguaçu pelo Mestre Daniel Braga, a Equipe Gaditas Fight Team evoluiu de um projeto residencial pioneiro para uma das maiores e mais respeitadas famílias marciais do Rio de Janeiro. Com formação inicial na conceituada Equipe Nael Pedra e a mentoria fundamental do Mestre Leandro Vilela (Equipe Gladiador), a instituição já formou mais de 12 faixas pretas e conta com diversos polos ativos no estado do Rio de Janeiro.',
  missionText: 'Fazer a diferença através da disciplina marcial, forjando campeões no tatame e cidadãos exemplares na vida.',
  visionText: 'Expandir os polos de artes marciais no Rio de Janeiro e Brasil, integrando tradição, técnica e acolhimento comunitário.',
  valuesText: [
    'Lema Oficial: "A dor é passageira, mas o orgulho é eterno"',
    'Honra e Respeito incondicional às mentorias e companheiros',
    'Disciplina no treino diário e conduta reta na sociedade',
    'Lealdade à bandeira Gaditas Fight Team RJ',
    'Domínio técnico multi-marcial (Muay Thai, Luta Livre, Boxe, MMA, Sambo)',
    'Fazendo a Diferença na vida de cada aluno e família'
  ],
  masterName: 'Mestre Daniel Braga',
  masterTitle: 'Grau Preta e Branca (Muay Thai) · Faixa Preta (Luta Livre) · Líder e Fundador',
  masterPhotoUrl: '/src/assets/images/mestre_daniel_braga_1790944987945.jpg',
  masterBio: 'Ingresso nas artes marciais aos 15 anos. Formação na conceituada Equipe Nael Pedra e Faixa Preta diplomado em 2017 pelo Mestre Leandro Vilela (Equipe Gladiador). Amplo domínio técnico em Boxe, Luta Livre, Muay Thai (Grau Preta e Branca), Kickboxing, MMA, Sambo e Jiu-Jitsu. Em 2017, fundou em Nova Iguaçu a Equipe Gaditas F Team, hoje com +12 faixas pretas formados e diversos polos ativos no Rio de Janeiro.',
  contactEmail: 'contato@gaditasfteam.com.br',
  contactPhone: '(21) 98765-4321',
  contactAddress: 'Nova Iguaçu - RJ · Polos Ativos em todo o Rio de Janeiro',
  socialInstagram: 'https://instagram.com/gaditasfightteam',
  socialYoutube: 'https://youtube.com/gaditasfightteam',
  socialWhatsapp: 'https://wa.me/5521987654321'
};

export const DEFAULT_ADMIN_PERMISSIONS: ModulePermissions = {
  usuarios: true,
  financeiro: true,
  professores: true,
  alunos: true,
  presencas: true,
  graduacoes: true,
  eventos: true,
  competicoes: true,
  relatorios: true,
  configuracoes: true,
  auditoria: true,
  site_cms: true
};

export const DEFAULT_SUBADMIN_PERMISSIONS: ModulePermissions = {
  usuarios: false,
  financeiro: true,
  professores: true,
  alunos: true,
  presencas: true,
  graduacoes: true,
  eventos: true,
  competicoes: true,
  relatorios: true,
  configuracoes: false,
  auditoria: false,
  site_cms: false
};

export const DEFAULT_PROFESSOR_PERMISSIONS: ModulePermissions = {
  usuarios: false,
  financeiro: false,
  professores: false,
  alunos: true,
  presencas: true,
  graduacoes: true,
  eventos: true,
  competicoes: true,
  relatorios: true,
  configuracoes: false,
  auditoria: false,
  site_cms: false
};

export const DEFAULT_COORDENADOR_PERMISSIONS: ModulePermissions = {
  usuarios: false,
  financeiro: false,
  professores: true,
  alunos: true,
  presencas: true,
  graduacoes: true,
  eventos: true,
  competicoes: true,
  relatorios: true,
  configuracoes: false,
  auditoria: false,
  site_cms: false
};

export const DEFAULT_FINANCEIRO_PERMISSIONS: ModulePermissions = {
  usuarios: false,
  financeiro: true,
  professores: false,
  alunos: true,
  presencas: false,
  graduacoes: false,
  eventos: false,
  competicoes: false,
  relatorios: true,
  configuracoes: false,
  auditoria: false,
  site_cms: false
};

export const DEFAULT_ALUNO_PERMISSIONS: ModulePermissions = {
  usuarios: false,
  financeiro: false,
  professores: false,
  alunos: false,
  presencas: false,
  graduacoes: false,
  eventos: true,
  competicoes: true,
  relatorios: false,
  configuracoes: false,
  auditoria: false,
  site_cms: false
};

export const DEFAULT_VISITANTE_PERMISSIONS: ModulePermissions = {
  usuarios: false,
  financeiro: false,
  professores: false,
  alunos: false,
  presencas: false,
  graduacoes: false,
  eventos: true,
  competicoes: true,
  relatorios: false,
  configuracoes: false,
  auditoria: false,
  site_cms: false
};

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-admin',
    name: 'Administrador Geral',
    email: 'admin@gaditas.com',
    password: 'Gaditas@2026!',
    role: 'admin',
    status: 'Aprovado',
    permissions: DEFAULT_ADMIN_PERMISSIONS,
    createdAt: '2024-01-01',
    phone: '(21) 98765-4321',
    provider: 'local'
  },
  {
    id: 'user-subadmin',
    name: 'Coordenação Administrativa (Secundário)',
    email: 'coordenacao@gaditas.com',
    password: 'Gaditas@2026!',
    role: 'subadmin',
    status: 'Aprovado',
    permissions: DEFAULT_SUBADMIN_PERMISSIONS,
    createdAt: '2024-02-15',
    phone: '(21) 98765-9988',
    provider: 'local'
  },
  {
    id: 'user-daniel',
    name: 'Mestre Daniel Braga',
    email: 'daniel@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'mestre',
    status: 'Aprovado',
    referenceId: 'prof-daniel',
    trainingCenterId: 'ct-matriz',
    trainingCenterName: 'CT Matriz Nova Iguaçu (Sede Fundacional) (MT-11)',
    createdAt: '2024-01-01',
    phone: '(21) 98765-4321',
    provider: 'local'
  },
  {
    id: 'user-davi',
    name: 'Mestre Davi Leonardo',
    email: 'davileonardo303@gmail.com',
    password: 'Gaditas@2026!',
    role: 'mestre',
    status: 'Aprovado',
    referenceId: 'prof-davi',
    trainingCenterId: 'ct-davi',
    trainingCenterName: 'CT Gaditas - Polo Davi (MT-12)',
    createdAt: '2024-01-01',
    phone: '(21) 98112-0012',
    provider: 'google'
  },
  {
    id: 'user-gabriel',
    name: 'Gabriel',
    email: 'gabriel@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-gabriel',
    trainingCenterId: 'ct-gabriel',
    trainingCenterName: 'CT Gaditas - Polo Gabriel (MT-01)',
    createdAt: '2024-01-01',
    phone: '(21) 98101-0001',
    provider: 'local'
  },
  {
    id: 'user-juliocesar',
    name: 'Júlio César',
    email: 'juliocesar@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-juliocesar',
    trainingCenterId: 'ct-juliocesar',
    trainingCenterName: 'CT Gaditas - Polo Júlio César (MT-02)',
    createdAt: '2024-01-01',
    phone: '(21) 98102-0002',
    provider: 'local'
  },
  {
    id: 'user-leonardoleal',
    name: 'Leonardo Leal',
    email: 'leonardoleal@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-leonardoleal',
    trainingCenterId: 'ct-leonardoleal',
    trainingCenterName: 'CT Gaditas - Polo Leonardo Leal (MT-03)',
    createdAt: '2024-01-01',
    phone: '(21) 98103-0003',
    provider: 'local'
  },
  {
    id: 'user-fernando',
    name: 'Fernando',
    email: 'fernando@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-fernando',
    trainingCenterId: 'ct-fernando',
    trainingCenterName: 'CT Gaditas - Polo Fernando (MT-04)',
    createdAt: '2024-01-01',
    phone: '(21) 98104-0004',
    provider: 'local'
  },
  {
    id: 'user-alison',
    name: 'Alison',
    email: 'alison@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-alison',
    trainingCenterId: 'ct-alison',
    trainingCenterName: 'CT Gaditas - Polo Alison (MT-05)',
    createdAt: '2024-01-01',
    phone: '(21) 98105-0005',
    provider: 'local'
  },
  {
    id: 'user-fabio',
    name: 'Fábio',
    email: 'fabio@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-fabio',
    trainingCenterId: 'ct-fabio',
    trainingCenterName: 'CT Gaditas - Polo Fábio (MT-06)',
    createdAt: '2024-01-01',
    phone: '(21) 98106-0006',
    provider: 'local'
  },
  {
    id: 'user-breno',
    name: 'Breno',
    email: 'breno@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-breno',
    trainingCenterId: 'ct-breno',
    trainingCenterName: 'CT Gaditas - Polo Breno (MT-07)',
    createdAt: '2024-01-01',
    phone: '(21) 98107-0007',
    provider: 'local'
  },
  {
    id: 'user-fernando2',
    name: 'Fernando',
    email: 'fernando2@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-fernando2',
    trainingCenterId: 'ct-fernando2',
    trainingCenterName: 'CT Gaditas - Polo Fernando II (MT-08)',
    createdAt: '2024-01-01',
    phone: '(21) 98108-0008',
    provider: 'local'
  },
  {
    id: 'user-leounamar',
    name: 'Leo Una Mar',
    email: 'leounamar@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-leounamar',
    trainingCenterId: 'ct-unamar',
    trainingCenterName: 'CT Gaditas - Polo Unamar (MT-09)',
    createdAt: '2024-01-01',
    phone: '(22) 98109-0009',
    provider: 'local'
  },
  {
    id: 'user-dirceu',
    name: 'Dirceu',
    email: 'dirceu@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-dirceu',
    trainingCenterId: 'ct-dirceu',
    trainingCenterName: 'CT Gaditas - Polo Dirceu (MT-10)',
    createdAt: '2024-01-01',
    phone: '(21) 98110-0010',
    provider: 'local'
  },
  {
    id: 'user-iagum',
    name: 'Iagum',
    email: 'iagum@gaditasfteam.com.br',
    password: 'Gaditas@2026!',
    role: 'professor',
    status: 'Aprovado',
    permissions: DEFAULT_PROFESSOR_PERMISSIONS,
    referenceId: 'prof-iagum',
    trainingCenterId: 'ct-iagum',
    trainingCenterName: 'CT Gaditas - Polo Iagum (MT-13)',
    createdAt: '2024-01-01',
    phone: '(21) 98113-0013',
    provider: 'local'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-03-12 14:32:10',
    userId: 'user-admin',
    userName: 'Administrador Geral',
    userRole: 'admin',
    action: 'LOGIN',
    module: 'Autenticação',
    details: 'Login com credenciais administrativas completas efetuado com sucesso.',
    ipAddress: '189.102.45.12 (Rio de Janeiro, RJ)',
    status: 'SUCCESS'
  },
  {
    id: 'log-2',
    timestamp: '2026-03-12 11:15:40',
    userId: 'user-pendente-carlos',
    userName: 'Carlos Eduardo Rocha',
    userRole: 'aluno',
    action: 'USER_CREATED',
    module: 'Cadastro Google OAuth',
    details: 'Novo cadastro via Google recebido. Conta colocada em status Pendente aguardando homologação do Administrador Geral.',
    ipAddress: '177.18.230.88 (Nova Iguaçu, RJ)',
    status: 'WARNING'
  },
  {
    id: 'log-3',
    timestamp: '2026-03-11 16:50:22',
    userId: 'user-admin',
    userName: 'Administrador Geral',
    userRole: 'admin',
    action: 'USER_SUSPENDED',
    module: 'Administração Geral',
    details: 'Conta de Ricardo Menezes suspensa temporariamente por inadimplência recorrente.',
    ipAddress: '189.102.45.12 (Rio de Janeiro, RJ)',
    status: 'SECURITY_ALERT'
  },
  {
    id: 'log-4',
    timestamp: '2026-03-10 09:20:15',
    userId: 'user-davi',
    userName: 'Mestre Davi Leonardo',
    userRole: 'mestre',
    action: 'LOGIN',
    module: 'Google OAuth',
    details: 'Autenticação com Google (davileonardo303@gmail.com) no Polo Davi MT-12 autorizada.',
    ipAddress: '201.88.94.10 (Rio de Janeiro, RJ)',
    status: 'SUCCESS'
  },
  {
    id: 'log-5',
    timestamp: '2026-03-09 18:05:00',
    userId: 'user-admin',
    userName: 'Administrador Geral',
    userRole: 'admin',
    action: 'BACKUP_CREATED',
    module: 'Banco de Dados',
    details: 'Snapshot de backup diário do banco de dados gerado com sucesso (gaditas_backup_20260309.json).',
    ipAddress: '189.102.45.12 (Rio de Janeiro, RJ)',
    status: 'SUCCESS'
  }
];

export const INITIAL_DATABASE_BACKUPS: DatabaseBackup[] = [
  {
    id: 'backup-1',
    filename: 'gaditas_snapshot_20260312.json',
    timestamp: '2026-03-12 03:00:00',
    createdByName: 'Backup Automático Diário',
    sizeKb: 142,
    recordsCount: {
      users: 18,
      students: 24,
      professors: 13,
      trainingCenters: 13,
      auditLogs: 5
    }
  },
  {
    id: 'backup-2',
    filename: 'gaditas_snapshot_20260311.json',
    timestamp: '2026-03-11 03:00:00',
    createdByName: 'Backup Automático Diário',
    sizeKb: 140,
    recordsCount: {
      users: 17,
      students: 24,
      professors: 13,
      trainingCenters: 13,
      auditLogs: 4
    }
  }
];

export const INITIAL_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-historia',
    title: 'Nossa História & Linhagem',
    slug: 'historia',
    description: 'A trajetória da Equipe Gaditas Fight Team desde sua fundação em 2017 até os 13 polos no Rio de Janeiro.',
    published: true,
    showInMenu: true,
    menuOrder: 1,
    createdAt: '2024-01-10',
    updatedAt: '2026-03-01',
    blocks: [
      {
        id: 'block-1',
        type: 'hero',
        title: 'História & Tradição Marcial',
        subtitle: '"A dor é passageira, mas o orgulho é eterno"',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
        ctaText: 'Conheça Nossos Polos',
        ctaUrl: '#cts'
      },
      {
        id: 'block-2',
        type: 'text',
        title: 'Fundada pelo Mestre Daniel Braga',
        content: 'A Equipe Gaditas Fight Team nasceu do sonho de transformar vidas através da disciplina das artes marciais. Com raízes no Muay Thai tradicional e na Luta Livre brasileira, nossa equipe formou dezenas de faixas pretas e atletas campeões em torneios estaduais e nacionais.'
      },
      {
        id: 'block-3',
        type: 'gallery',
        title: 'Momentos Históricos no Tatame',
        galleryImages: [
          'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=600'
        ]
      },
      {
        id: 'block-4',
        type: 'faq',
        title: 'Perguntas Frequentes sobre a Equipe',
        faqItems: [
          { question: 'Quem pode treinar na Equipe Gaditas?', answer: 'Qualquer pessoa a partir dos 6 anos, de iniciantes a atletas profissionais de alto rendimento.' },
          { question: 'Como funciona a graduação de faixas?', answer: 'As graduações ocorrem periodicamente através de exames técnicos homologados pelo Mestre Daniel Braga e Mestre Davi Leonardo.' },
          { question: 'Posso treinar em qualquer um dos 13 CTs?', answer: 'Sim, alunos matriculados e ativos têm livre acesso aos aulões gerais e eventos unificados da equipe.' }
        ]
      }
    ]
  },
  {
    id: 'page-regulamento',
    title: 'Regulamento & Código de Ética',
    slug: 'regulamento',
    description: 'Diretrizes disciplinares, respeito aos mestres e normas para frequência e graduações.',
    published: true,
    showInMenu: true,
    menuOrder: 2,
    createdAt: '2024-02-15',
    updatedAt: '2026-02-20',
    blocks: [
      {
        id: 'block-reg-1',
        type: 'hero',
        title: 'Código de Conduta do Guerreiro',
        subtitle: 'Disciplina, Respeito, Humildade e Lealdade',
        imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'block-reg-2',
        type: 'notice',
        title: 'Regras Essenciais do Tatame',
        content: '1. Respeito absoluto aos Mestres, Professores e companheiros de treino.\n2. Uso obrigatório do uniforme e equipamentos de proteção adequados.\n3. Pontualidade e comprometimento nos horários de chamada.\n4. Proibido qualquer ato de agressão fora do contexto esportivo e pedagógico.'
      },
      {
        id: 'block-reg-3',
        type: 'pdf',
        title: 'Regulamento Geral em PDF',
        subtitle: 'Faça o download do documento oficial homologado da Equipe Gaditas',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ctaText: 'Baixar Regulamento Completo (PDF)'
      }
    ]
  },
  {
    id: 'page-matricula',
    title: 'Agende sua Aula Experimental',
    slug: 'aula-experimental',
    description: 'Venha treinar com a melhor equipe de artes marciais do Rio de Janeiro.',
    published: true,
    showInMenu: true,
    menuOrder: 3,
    createdAt: '2024-03-01',
    updatedAt: '2026-03-01',
    blocks: [
      {
        id: 'block-mat-1',
        type: 'hero',
        title: 'Venha Treinar Conosco',
        subtitle: 'Primeira aula experimental 100% gratuita em qualquer um dos nossos 13 polos',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 'block-mat-2',
        type: 'form',
        title: 'Preencha Seus Dados para Agendar',
        formFields: [
          { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
          { name: 'whatsapp', label: 'WhatsApp / Telefone', type: 'tel', required: true },
          { name: 'email', label: 'E-mail', type: 'email', required: true },
          { name: 'polo', label: 'Polo / CT de Preferência', type: 'select', required: true, options: [
            'CT Matriz Nova Iguaçu (MT-11)',
            'CT Gaditas - Polo Gabriel (MT-01)',
            'CT Gaditas - Polo Júlio César (MT-02)',
            'CT Gaditas - Polo Leonardo Leal (MT-03)',
            'CT Gaditas - Polo Fernando (MT-04)',
            'CT Gaditas - Polo Alison (MT-05)',
            'CT Gaditas - Polo Fábio (MT-06)',
            'CT Gaditas - Polo Breno (MT-07)',
            'CT Gaditas - Polo Fernando II (MT-08)',
            'CT Gaditas - Polo Unamar (MT-09)',
            'CT Gaditas - Polo Dirceu (MT-10)',
            'CT Gaditas - Polo Davi (MT-12)',
            'CT Gaditas - Polo Iagum (MT-13)'
          ]},
          { name: 'mensagem', label: 'Experiência prévia ou dúvidas', type: 'textarea' }
        ]
      }
    ]
  }
];

export const INITIAL_DIGITAL_SIGNATURES: DigitalSignature[] = [
  {
    id: 'sig-1',
    studentId: 'student-gabriel-santos',
    studentName: 'Gabriel Santos',
    documentType: 'Regulamento Interno',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="cursive" font-size="24" fill="white">Gabriel Santos</text></svg>',
    signedAt: '2024-01-15 14:30:00',
    ipAddress: '189.102.45.12 (Rio de Janeiro, RJ)',
    deviceInfo: 'Chrome / Android Mobile',
    status: 'Válido'
  },
  {
    id: 'sig-2',
    studentId: 'student-gabriel-santos',
    studentName: 'Gabriel Santos',
    documentType: 'Termo de Responsabilidade & Parq',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="cursive" font-size="24" fill="white">Gabriel Santos</text></svg>',
    signedAt: '2024-01-15 14:32:00',
    ipAddress: '189.102.45.12 (Rio de Janeiro, RJ)',
    deviceInfo: 'Chrome / Android Mobile',
    status: 'Válido'
  }
];



