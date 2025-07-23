export interface DetallesBoss {
  Location?: string;
  "Deathblow Markers"?: string;
  "Useful Tools"?: string;
  Reward?: string;
  XP?: string;
}

export interface BossData {
  nombre: string;
  link: string;
  imagen: string;
  descripcion: string;
  detalles?: DetallesBoss;
}

export interface BossEstado extends BossData {
  id: string;
  tipo: 'Boss' | 'Miniboss';
  defeated: boolean;
}
