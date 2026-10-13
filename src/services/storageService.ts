/**
 * Gaditas Storage Service
 * Gerencia persistência local avançada em IndexedDB para fotos de alta resolução,
 * documentos PDF de apostilas/certificados e rotinas de backup/restauração.
 */

const DB_NAME = 'GaditasFightDB_v1';
const DB_VERSION = 1;
const STORE_FILES = 'media_files';
const STORE_BACKUP = 'system_backups';

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
          reject(new Error('IndexedDB não suportado neste navegador.'));
          return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_FILES)) {
            db.createObjectStore(STORE_FILES, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_BACKUP)) {
            db.createObjectStore(STORE_BACKUP, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    }
    return this.dbPromise;
  }

  /**
   * Converte um arquivo do dispositivo (imagem ou PDF) em string Base64 DataURL
   * Com compressão inteligente para imagens grandes
   */
  async processUploadedFile(file: File, maxWidth = 1600): Promise<{ dataUrl: string; name: string; sizeKb: number; type: string }> {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

    if (!isImage && !isPdf) {
      // Arquivo genérico
      const dataUrl = await this.fileToDataUrl(file);
      return {
        dataUrl,
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type || 'application/octet-stream'
      };
    }

    if (isPdf) {
      const dataUrl = await this.fileToDataUrl(file);
      return {
        dataUrl,
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: 'application/pdf'
      };
    }

    // Otimizar imagem via Canvas se for maior que 1MB ou muito grande
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const quality = file.size > 2 * 1024 * 1024 ? 0.85 : 0.92;
            const optimizedUrl = canvas.toDataURL('image/jpeg', quality);
            const sizeKb = Math.round((optimizedUrl.length * 3) / 4 / 1024);
            resolve({
              dataUrl: optimizedUrl,
              name: file.name,
              sizeKb,
              type: 'image/jpeg'
            });
            return;
          }
          resolve({
            dataUrl: rawUrl,
            name: file.name,
            sizeKb: Math.round(file.size / 1024),
            type: file.type
          });
        };
        img.onerror = () => {
          resolve({
            dataUrl: rawUrl,
            name: file.name,
            sizeKb: Math.round(file.size / 1024),
            type: file.type
          });
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Salva um arquivo diretamente no IndexedDB
   */
  async saveFileToDB(id: string, dataUrl: string, name: string, category: string): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_FILES, 'readwrite');
      const store = tx.objectStore(STORE_FILES);
      store.put({
        id,
        name,
        category,
        dataUrl,
        savedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Erro ao salvar no IndexedDB:', err);
    }
  }

  /**
   * Busca um arquivo do IndexedDB
   */
  async getFileFromDB(id: string): Promise<string | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_FILES, 'readonly');
        const store = tx.objectStore(STORE_FILES);
        const req = store.get(id);
        req.onsuccess = () => {
          resolve(req.result?.dataUrl || null);
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Exporta todo o estado do sistema como um arquivo JSON baixável
   */
  exportBackupFile(payload: Record<string, unknown>, teamName: string): void {
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${teamName.toLowerCase().replace(/\s+/g, '_')}_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();
