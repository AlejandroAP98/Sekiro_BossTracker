export interface DetallesBoss {
  Location?: string;
  "Deathblow Markers"?: string;
  "Useful Tools"?: string;
  Reward?: string;
  XP?: string;
  Weakness?: string;
}

export interface BossData {
  nombre: string;
  link: string;
  imagen: string;
  descripcion: string;
  detalles?: DetallesBoss;
}
// types/Boss.ts
export interface BossEstado extends BossData {
  id: string;
  tipo: 'Boss' | 'Miniboss';
  defeated: boolean;
  tiempoInicio?: number | null;
  tiempoTotal?: number | null;
  corriendo?: boolean;
  pinned?:boolean;
}

