import type { BossEstado } from '../types/Boss';
import { db } from '../firebase';
import {ref, set, get, child} from 'firebase/database';
import { getUsername } from './auth';

const STORAGE_KEY = 'sekiro-boss-progress';

export function guardarBossesEnStorage(bosses: BossEstado[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bosses));
}

export function cargarBossesEnStorage(): BossEstado[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as BossEstado[];
      if (!Array.isArray(parsed)) return [];
      return parsed; 
    } catch (e) {
      console.error('Error cargando datos desde localStorage:', e);
      return [];
    }
  }
  return [];
}


export function exportarProgreso(bosses: BossEstado[]) {
  const progresoMap: Record<string, Partial<BossEstado>> = {};

  bosses.forEach(b => {
    progresoMap[b.id] = {
      defeated: b.defeated,
      tiempoTotal: b.tiempoTotal,
      tiempoInicio: b.tiempoInicio,
      corriendo: b.corriendo
    };
  });

  const dataStr = JSON.stringify(progresoMap, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'sekiro_progreso.json';
  a.click();

  URL.revokeObjectURL(url);
}


export function importarProgreso(file: File, callback: (data: Record<string, Partial<BossEstado>>) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string;
      const data = JSON.parse(result);

      if (typeof data === 'object' && data !== null) {
        callback(data);
      } else {
        console.error('Archivo de progreso inválido');
        callback({});
      }
    } catch (err) {
      console.error('Error al leer el archivo JSON', err);
      callback({});
    }
  };

  reader.readAsText(file);
}

export async function subirDatosAFirebase(bosses: BossEstado[]) {
  const username = getUsername();
  const usuarioRef = ref(db, `usuarios/${username}`);
  const now = new Date().toISOString();
  await set(usuarioRef, {
    bosses,
    ultimaActualizacion: now,
  });
  return now;
}

export async function descargarDatosDesdeFirebase(): Promise<{ bosses: BossEstado[]; ultimaActualizacion: string } | null> {
  const username = getUsername();
  const snapshot = await get(child(ref(db), `usuarios/${username}`));

  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      bosses: data.bosses || [],
      ultimaActualizacion: data.ultimaActualizacion || '',
    };
  }
  return null;
}

export async function consultarUltimaActualizacion(): Promise<string | null> {
  const username = getUsername();
  const usuarioRef = ref(db, `usuarios/${username}`);
  const snapshot = await get(usuarioRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return data.ultimaActualizacion || '';
  }
  return null;
}
