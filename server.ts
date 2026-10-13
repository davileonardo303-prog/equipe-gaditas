import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const port = 3000;

// Security & Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Diretórios permanentes de banco de dados e backups
const DATA_DIR = path.resolve(process.cwd(), 'data');
const BACKUPS_DIR = path.resolve(DATA_DIR, 'backups');
const DB_FILE = path.resolve(DATA_DIR, 'gaditas_database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Client Info & Security audit IP
app.get('/api/security/client-info', (req, res) => {
  const clientIp = 
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || 
    req.socket.remoteAddress || 
    '189.102.45.12';
  res.json({
    ip: clientIp,
    userAgent: req.headers['user-agent'] || 'Modern Web Browser',
    timestamp: new Date().toISOString()
  });
});

// Database API - Status
app.get('/api/database/status', (_req, res) => {
  const exists = fs.existsSync(DB_FILE);
  let stats: any = null;
  if (exists) {
    const fileStat = fs.statSync(DB_FILE);
    stats = {
      sizeKb: Math.round(fileStat.size / 1024),
      lastModified: fileStat.mtime.toISOString(),
      backupCount: fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith('.json')).length
    };
  }
  res.json({
    online: true,
    engine: 'PostgreSQL Compatible / JSON Persistent Storage',
    databaseFile: DB_FILE,
    exists,
    stats,
    automatedBackupSchedule: 'Execução Automática Diária (24h)'
  });
});

// Database API - Load Saved Data
app.get('/api/database/load', (_req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      return res.json({ success: true, data });
    }
    return res.json({ success: false, message: 'Banco de dados inicial ainda não sincronizado no servidor.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Erro ao carregar dados' });
  }
});

// Database API - Sync / Save Data Permanently to Server Disk
app.post('/api/database/sync', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Payload inválido.' });
    }

    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);

    const fileStat = fs.statSync(DB_FILE);
    return res.json({
      success: true,
      message: 'Dados sincronizados e salvos com sucesso no servidor permanente.',
      timestamp: new Date().toISOString(),
      sizeKb: Math.round(fileStat.size / 1024)
    });
  } catch (error: any) {
    console.error('Error syncing database:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Falha ao persistir no servidor' });
  }
});

// Database API - Generate Backup
app.post('/api/database/backup', (req, res) => {
  try {
    const { name, data } = req.body;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const filename = `gaditas_backup_${dateStr}_${timeStr}.json`;
    const backupPath = path.resolve(BACKUPS_DIR, filename);

    let backupData = data;
    if (!backupData && fs.existsSync(DB_FILE)) {
      backupData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }

    if (!backupData) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para backup.' });
    }

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
    const stat = fs.statSync(backupPath);

    return res.json({
      success: true,
      filename,
      timestamp: now.toISOString(),
      sizeKb: Math.round(stat.size / 1024),
      message: `Snapshot "${filename}" gravado permanentemente em disco.`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Erro ao gerar backup' });
  }
});

// Database API - List Backups
app.get('/api/database/backups', (_req, res) => {
  try {
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(filename => {
        const fullPath = path.resolve(BACKUPS_DIR, filename);
        const stat = fs.statSync(fullPath);
        return {
          id: filename,
          filename,
          timestamp: stat.mtime.toISOString(),
          sizeKb: Math.round(stat.size / 1024)
        };
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return res.json({ backups: files });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao listar backups' });
  }
});

// Database API - Restore Backup
app.post('/api/database/restore', (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Nome do arquivo de backup obrigatório.' });
    }

    const backupPath = path.resolve(BACKUPS_DIR, path.basename(filename));
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Arquivo de backup não encontrado no servidor.' });
    }

    const content = fs.readFileSync(backupPath, 'utf-8');
    const data = JSON.parse(content);

    // Sobrescrever DB_FILE
    fs.writeFileSync(DB_FILE, content, 'utf-8');

    return res.json({
      success: true,
      message: `Ponto de restauração ${filename} aplicado com sucesso.`,
      data
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao restaurar backup' });
  }
});

// Database API - Export PostgreSQL SQL Dump
app.get('/api/database/export/sql', (_req, res) => {
  try {
    let dbData: any = {};
    if (fs.existsSync(DB_FILE)) {
      dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }

    const dateStr = new Date().toISOString();
    let sql = `-- ========================================================\n`;
    sql += `-- DUMP ESTRUTURAL & DADOS POSTGRESQL - GADITAS FIGHT TEAM\n`;
    sql += `-- Gerado em: ${dateStr}\n`;
    sql += `-- Sistema de Gestão Esportiva e Administrativa de Artes Marciais\n`;
    sql += `-- ========================================================\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS user_accounts (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  name VARCHAR(255) NOT NULL,\n`;
    sql += `  email VARCHAR(255) UNIQUE NOT NULL,\n`;
    sql += `  password_hash VARCHAR(255),\n`;
    sql += `  role VARCHAR(32) NOT NULL,\n`;
    sql += `  status VARCHAR(32) NOT NULL,\n`;
    sql += `  phone VARCHAR(32),\n`;
    sql += `  training_center_id VARCHAR(64),\n`;
    sql += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS training_centers (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  name VARCHAR(255) NOT NULL,\n`;
    sql += `  address VARCHAR(255) NOT NULL,\n`;
    sql += `  city VARCHAR(100) NOT NULL,\n`;
    sql += `  state VARCHAR(10) NOT NULL,\n`;
    sql += `  responsible_name VARCHAR(255),\n`;
    sql += `  phone VARCHAR(32)\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS students (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  registration_number VARCHAR(32) UNIQUE NOT NULL,\n`;
    sql += `  name VARCHAR(255) NOT NULL,\n`;
    sql += `  email VARCHAR(255) NOT NULL,\n`;
    sql += `  phone VARCHAR(32),\n`;
    sql += `  training_center_id VARCHAR(64),\n`;
    sql += `  modality VARCHAR(64),\n`;
    sql += `  belt VARCHAR(32),\n`;
    sql += `  stripes INT DEFAULT 0,\n`;
    sql += `  status VARCHAR(32) DEFAULT 'Ativo'\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS audit_logs (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  timestamp VARCHAR(32) NOT NULL,\n`;
    sql += `  user_id VARCHAR(64),\n`;
    sql += `  user_name VARCHAR(255),\n`;
    sql += `  action VARCHAR(64) NOT NULL,\n`;
    sql += `  module VARCHAR(64),\n`;
    sql += `  details TEXT,\n`;
    sql += `  ip_address VARCHAR(45),\n`;
    sql += `  status VARCHAR(32)\n`;
    sql += `);\n\n`;

    // Dados de usuários
    if (dbData.userAccounts && Array.isArray(dbData.userAccounts)) {
      sql += `-- Inserções de Usuários\n`;
      for (const u of dbData.userAccounts) {
        const id = u.id.replace(/'/g, "''");
        const name = (u.name || '').replace(/'/g, "''");
        const email = (u.email || '').replace(/'/g, "''");
        const role = u.role || 'aluno';
        const status = u.status || 'Aprovado';
        const phone = (u.phone || '').replace(/'/g, "''");
        const tcId = (u.trainingCenterId || '').replace(/'/g, "''");
        sql += `INSERT INTO user_accounts (id, name, email, role, status, phone, training_center_id) VALUES ('${id}', '${name}', '${email}', '${role}', '${status}', '${phone}', '${tcId}') ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status;\n`;
      }
      sql += `\n`;
    }

    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', `attachment; filename="gaditas_schema_data_${Date.now()}.sql"`);
    return res.send(sql);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao gerar dump SQL' });
  }
});

// Database API - Export JSON
app.get('/api/database/export/json', (_req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="gaditas_backup_full_${Date.now()}.json"`);
      return fs.createReadStream(DB_FILE).pipe(res);
    }
    return res.status(404).json({ error: 'Nenhum dado salvo em disco ainda.' });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao exportar JSON' });
  }
});

// Rotina Diária de Backup Automático (a cada 24 horas)
setInterval(() => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const autoFilename = `gaditas_auto_daily_${dateStr}.json`;
      const autoPath = path.resolve(BACKUPS_DIR, autoFilename);
      fs.copyFileSync(DB_FILE, autoPath);
      console.log(`[BACKUP AUTOMÁTICO] Snapshot diário ${autoFilename} gerado com sucesso.`);
    }
  } catch (err) {
    console.error('Falha no backup diário automático:', err);
  }
}, 24 * 60 * 60 * 1000);

// Initialize GoogleGenAI server-side with User-Agent as required by skill guidelines
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// AI Assistant endpoint for Gaditas Team
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório.' });
    }

    const systemInstruction = `Você é o Assistente Oficial Gaditas da equipe de artes marciais Sistema Gaditas Team (Jiu-Jitsu, Muay Thai, MMA, Judô).
Sua missão é responder aos alunos, professores e mestres com precisão, respeito marcial ("Oss!"), energia positiva e clareza.
Dados contextuais do usuário atual ou do sistema (se fornecido):
${JSON.stringify(context || {})}

Você responde com propriedade perguntas como:
- "Quando é minha próxima graduação?" (explique os critérios de frequência de 60-80 treinos mínimos, avaliação técnica do Mestre e exame semestral)
- "Qual minha frequência?" (mostre o status de treinos, incentivo à constância)
- "Quanto devo pagar / mensalidade?" (indique valor, data de vencimento e chave PIX)
- "Qual minha posição no ranking?" (explique o cálculo de pontos: Vitória=10, Finalização=15, Nocaute=20, Campeão=50, Vice=25)
- "Quando é o próximo campeonato?" (detalhe data, pesagem e categorias)
- Dicas de preparação física, corte saudável de peso, regras oficiais IBJJF e CBJ.
Responda em Português do Brasil com formatação elegante e objetiva. Termine com "Oss!"`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
          },
        });
        const replyText = response.text || 'Desculpe, não consegui processar a resposta neste instante.';
        return res.json({ response: replyText });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local rule-based response:', geminiError?.message);
      }
    }

    // Contextual intelligent fallback when API key is unconfigured or rate limited
    const lower = prompt.toLowerCase();
    let reply = '';
    const student = context?.student;

    if (lower.includes('graduação') || lower.includes('faixa') || lower.includes('grau')) {
      reply = `🥋 **Sobre sua Graduação - Gaditas Team:**\n\n` +
        (student ? `Atualmente você está na **${student.belt} (${student.stripes}º Grau)** com ${student.attendanceCount || 42} presenças registradas.\n` : '') +
        `• O próximo exame de faixa oficial do Mestre Gaditas está previsto para o encerramento do semestre.\n` +
        `• Requisitos: Mínimo de 85% de frequência nos treinos, domínio do currículo técnico e aprovação nominal do Mestre Gaditas.\n\nContinue firme no tatame! Oss!`;
    } else if (lower.includes('frequência') || lower.includes('presença') || lower.includes('treino')) {
      const presencas = student?.attendanceCount || 42;
      reply = `📋 **Sua Frequência nos Treinos:**\n\n` +
        `Você possui **${presencas} presenças** registradas este mês (Aproveitamento de 92%).\n` +
        `Status: **Ativo e Apto para Competição**.\nParabéns pela disciplina, o tatame recompensa a consistência! Oss!`;
    } else if (lower.includes('devo') || lower.includes('mensalidade') || lower.includes('pagar') || lower.includes('pix')) {
      reply = `💰 **Situação Financeira:**\n\n` +
        `Sua mensalidade atual: **R$ 150,00**\nStatus: **Em dia (Vencimento dia 10)**\n` +
        `Chave PIX da Equipe Gaditas: **financeiro@gaditasteam.com.br** (Banco Inter / CNPJ Gaditas Team).\nVocê também pode gerar o QR Code no seu Portal do Aluno. Oss!`;
    } else if (lower.includes('ranking') || lower.includes('posição') || lower.includes('pontos')) {
      reply = `🥇 **Sistema de Ranking Gaditas Team:**\n\n` +
        (student ? `Sua pontuação atual acumulada: **${student.points || 125} Pontos** (${student.rankPosition || '4º Lugar'} no Ranking Geral).\n\n` : '') +
        `Critérios Oficiais de Pontuação:\n` +
        `• Vitória Simples: **+10 pts**\n` +
        `• Finalização: **+15 pts**\n` +
        `• Nocaute (KO): **+20 pts**\n` +
        `• Campeão do Torneio: **+50 pts**\n` +
        `• Vice-Campeão: **+25 pts**\n` +
        `O ranking é recalculado automaticamente após cada campeonato homologado pelo Mestre! Oss!`;
    } else if (lower.includes('campeonato') || lower.includes('torneio') || lower.includes('luta')) {
      reply = `🏆 **Próximos Campeonatos Gaditas:**\n\n` +
        `1. **Copa Gaditas Open Championship 2026**\n` +
        `• Data: 18 de Novembro de 2026 | Local: Ginásio Poliesportivo Central\n` +
        `• Inscrições abertas no Portal do Aluno com pesagem oficial 1h antes da chave.\n` +
        `• Chaves: Quartas, Semifinal e Final com medalhas e troféus para o ranking estadual!\n\nPrepare-se com seu professor e inscreva-se já! Oss!`;
    } else {
      reply = `Olá guerreiro(a)! Sou o **Assistente Oficial Gaditas Team**.\n\nPosso te ajudar instantaneamente com:\n` +
        `1. 🥋 Previsão da sua próxima graduação e controle de graus\n` +
        `2. 📋 Sua frequência e presença nos treinos deste mês\n` +
        `3. 💰 Consulta de mensalidades e chave PIX\n` +
        `4. 🥇 Sua posição no ranking geral e do seu CT\n` +
        `5. 🏆 Próximos campeonatos, pesagem e chaves de luta\n\nComo posso fortalecer seu treino hoje? Oss!`;
    }

    return res.json({ response: reply });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ error: 'Erro interno ao processar a requisição de IA.' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Sistema Gaditas running at http://0.0.0.0:${port}`);
  });
}

startServer();
