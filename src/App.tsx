import { useEffect, useState } from 'preact/hooks';
import data from './data/bosses_sekiro_completo.json';
import type { BossEstado, BossData } from './types/Boss';
import BossCard from './components/BossCard';
import Footer from './components/Footer';
import confetti from 'canvas-confetti'; 
const efectSound = new Audio('/sounds/efect.mp3');

efectSound.volume = 0.5;

interface JSONBosses {
  Boss: BossData[];
  Miniboss: BossData[];
}

const STORAGE_KEY = 'sekiro-boss-progress';

function App() {
  const [bosses, setBosses] = useState<BossEstado[]>([]);
  const [filtro, setFiltro] = useState<'Todos' | 'Boss' | 'Miniboss'>('Todos');
  const [busqueda, setBusqueda] = useState('');
  


  useEffect(() => {
    const jsonData = data as JSONBosses;

    const bossesBase: BossEstado[] = [
      ...jsonData.Boss.map((b, idx) => ({
        ...b,
        id: `boss-${idx}`,
        tipo: "Boss" as "Boss",
        defeated: false
      })),
      ...jsonData.Miniboss.map((b, idx) => ({
        ...b,
        id: `miniboss-${idx}`,
        tipo: "Miniboss" as "Miniboss",
        defeated: false
      }))
    ];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Record<string, boolean> = JSON.parse(stored);
        const updated = bossesBase.map(b => ({
          ...b,
          defeated: parsed[b.id] || false
        }));
        setBosses(updated);
      } catch {
        setBosses(bossesBase);
      }
    } else {
      setBosses(bossesBase);
    }
  }, []);

  useEffect(() => {
    if (bosses.length > 0) {
      const progressMap: Record<string, boolean> = {};
      bosses.forEach(b => {
        progressMap[b.id] = b.defeated;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    }
  }, [bosses]);

  const toggleDefeated = (id: string) => {
  setBosses(prev => {
    return prev.map(b => {
      if (b.id === id) {
        const nuevoEstado = !b.defeated;
        if (nuevoEstado) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          efectSound.currentTime = 0; 
          efectSound.play();
          return { ...b, defeated: nuevoEstado };
        }
        return b;
      });
    });
  };

  const derrotados = bosses.filter(b => b.defeated).length;
  const total = bosses.length;
  const progreso = Math.round((derrotados / total) * 100);

  const bossesFiltrados = bosses.filter(b => {
    const coincideTipo = filtro === 'Todos' || b.tipo === filtro;
    const coincideBusqueda = b.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  const conteoPorTipo = bosses.reduce(
  (acc, b) => {
    if (b.tipo === 'Boss') {
      acc.bossesTotales += 1;
      if (b.defeated) acc.bossesDerrotados += 1;
    } else if (b.tipo === 'Miniboss') {
      acc.minibossesTotales += 1;
      if (b.defeated) acc.minibossesDerrotados += 1;
    }
    return acc;
  },
  {
    bossesTotales: 0,
    bossesDerrotados: 0,
    minibossesTotales: 0,
    minibossesDerrotados: 0
  }
);

  return (
    <div className="container mx-auto ">
      <div className="mb-2 flex justify-between w-full sm:gap-4 gap-1 mt-4">
        <div className="sm:w-2/3">
          <progress class="progress progress-primary" value={progreso} max="100" />
          <p class="mt-2 font-semibold text-primary">
            {derrotados} / {total} jefes derrotados ({progreso}%)
          </p>
          <div className="text-warning/90 text-sm">
            <p>Bosses: {conteoPorTipo.bossesDerrotados} / {conteoPorTipo.bossesTotales}</p>
            <p>Minibosses: {conteoPorTipo.minibossesDerrotados} / {conteoPorTipo.minibossesTotales}</p>
          </div>
        </div>
        <div className="sm:w-1/3 flex items-center justify-end">
          <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              placeholder="Buscar jefe..."
              className="grow"
              value={busqueda}
              onInput={(e) => setBusqueda((e.target as HTMLInputElement).value)}
            />
          </label>
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <ul className="menu bg-base-200 menu-horizontal rounded-box self-center">
        {['Todos', 'Boss', 'Miniboss'].map(tipo => (
          <li>
            <a
              className={`cursor-pointer ${filtro === tipo ? 'text-primary font-bold' : ''}`}
              onClick={() => setFiltro(tipo as 'Todos' | 'Boss' | 'Miniboss')}
            >
              {tipo}
            </a>
          </li>
        ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bossesFiltrados.map(b => (
          <BossCard key={b.id} boss={b} onToggle={toggleDefeated} />
        ))}
      </div>
      <Footer bosses={bosses} setBosses={setBosses} />

    </div>
    
  );
}

export default App;
