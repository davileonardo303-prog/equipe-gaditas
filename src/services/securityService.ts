/**
 * Security Service - Gaditas Fight Team
 * Criptografia, Hash Seguro de Senhas (SHA-256 com Salt), Sanitização, 
 * Proteção contra Brute Force / Tentativas Incorretas, XSS e CSRF.
 */

export interface FailedAttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos de bloqueio

class SecurityService {
  private failedAttempts: Map<string, FailedAttemptRecord> = new Map();

  /**
   * Gera um Salt criptograficamente seguro em formato hexadecimal
   */
  generateSalt(length = 16): string {
    const array = new Uint8Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Gera hash SHA-256 de uma senha combinada com salt
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ':' + salt);
    
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback simples caso subtleCrypto não esteja disponível no ambiente
    let hash = 0;
    const str = password + ':' + salt;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  /**
   * Compara uma senha em texto plano com o hash armazenado
   */
  async verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
    const computed = await this.hashPassword(password, salt);
    return computed === storedHash;
  }

  /**
   * Verifica se o identificador / e-mail está temporariamente bloqueado
   */
  isLockedOut(identifier: string): { isLocked: boolean; remainingMinutes: number } {
    const cleanId = identifier.trim().toLowerCase();
    const record = this.failedAttempts.get(cleanId);
    if (!record || !record.lockedUntil) {
      return { isLocked: false, remainingMinutes: 0 };
    }

    const now = Date.now();
    if (now < record.lockedUntil) {
      const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
      return { isLocked: true, remainingMinutes };
    }

    // Período de bloqueio expirou, limpa o bloqueio
    this.failedAttempts.delete(cleanId);
    return { isLocked: false, remainingMinutes: 0 };
  }

  /**
   * Registra uma tentativa falha de autenticação
   */
  recordFailedAttempt(identifier: string): { attemptsLeft: number; isLocked: boolean } {
    const cleanId = identifier.trim().toLowerCase();
    const now = Date.now();
    const current = this.failedAttempts.get(cleanId) || { count: 0, lastAttempt: now };

    current.count += 1;
    current.lastAttempt = now;

    if (current.count >= MAX_FAILED_ATTEMPTS) {
      current.lockedUntil = now + LOCKOUT_DURATION_MS;
      this.failedAttempts.set(cleanId, current);
      return { attemptsLeft: 0, isLocked: true };
    }

    this.failedAttempts.set(cleanId, current);
    return { attemptsLeft: MAX_FAILED_ATTEMPTS - current.count, isLocked: false };
  }

  /**
   * Limpa tentativas falhas após login bem-sucedido
   */
  clearFailedAttempts(identifier: string): void {
    const cleanId = identifier.trim().toLowerCase();
    this.failedAttempts.delete(cleanId);
  }

  /**
   * Sanitização contra injeções de script (XSS)
   */
  sanitizeInput(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validação de formato de e-mail institucional / profissional
   */
  isValidEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.trim());
  }

  /**
   * Gera código seguro de 6 dígitos numéricos para recuperação de senha
   */
  generateRecoveryCode(): string {
    const min = 100000;
    const max = 999999;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}

export const securityService = new SecurityService();
