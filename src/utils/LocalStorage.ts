import type { BossEstado } from '../types/Boss';
import data from '../data/bosses_sekiro_completo.json';

export function exportarProgreso(bosses: BossEstado[]) {

  const progressMap: Record<string, boolean> = {};
  bosses.forEach(b => {
    progressMap[b.id] = b.defeated;
  });

  const dataStr = JSON.stringify(progressMap, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'sekiro_progreso.json';
  a.click();

  URL.revokeObjectURL(url);
}


export function importarProgreso(file: File, callback: (data: Record<string, boolean>) => void) {
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



export function obtenerBossesDesdeStorage(): BossEstado[] {
  const progresoStr = localStorage.getItem("sekiro-boss-progress");
  const progreso: Record<string, boolean> = progresoStr ? JSON.parse(progresoStr) : {};
  const bossesBase: BossEstado[] = [
    ...data.Boss.map((b, idx) => ({
      ...b,
      id: `boss-${idx}`,
      tipo: "Boss" as const,
      defeated: progreso[`boss-${idx}`] || false
    })),
    ...data.Miniboss.map((b, idx) => ({
      ...b,
      id: `miniboss-${idx}`,
      tipo: "Miniboss" as const,
      defeated: progreso[`miniboss-${idx}`] || false
    }))
  ];

  return bossesBase;
}

