import { useEffect, useState } from 'preact/hooks';
import data from './data/bosses_sekiro_completo.json';
import { cargarBosses, guardarBossesEnStorage } from './utils/LocalStorage';
import type { BossEstado, BossData } from './types/Boss';
import BossCard from './components/BossCard';
import Footer from './components/Footer';
import confetti from 'canvas-confetti'; 
import { AnimatePresence, motion } from 'framer-motion';

const efectSound = new Audio('/sounds/efect.mp3');
efectSound.volume = 0.5;
interface JSONBosses {
  Boss: BossData[];
  Miniboss: BossData[];
}

function App() {
  const [bosses, setBosses] = useState<BossEstado[]>(cargarBosses());
  const [filtro, setFiltro] = useState<'Todos' | 'Boss' | 'Miniboss'>('Todos');
  const [busqueda, setBusqueda] = useState('');

  const actualizarBoss = (id: string, data: Partial<BossEstado>) => {
    setBosses(prev => {
      const actualizados = prev.map(b => {
        if (b.id === id) {
          return { ...b, ...data };
        }
        return b;
      });
      guardarBossesEnStorage(actualizados);
      return actualizados;
    });
  };
  
  useEffect(() => {
  const jsonData = data as JSONBosses;

  const bossesBase: BossEstado[] = [
    ...jsonData.Boss.map((b, idx) => ({
      ...b,
      id: `boss-${idx}`,
      tipo: "Boss" as const,
      defeated: false,
      tiempoInicio: null,
      tiempoTotal: null,
      corriendo: false
    })),
    ...jsonData.Miniboss.map((b, idx) => ({
      ...b,
      id: `miniboss-${idx}`,
      tipo: "Miniboss" as const,
      defeated: false,
      tiempoInicio: null,
      tiempoTotal: null,
      corriendo: false
    }))
  ];

  const guardados = cargarBosses();
  
  const fusionados = bossesBase.map(b => {
    const existente = guardados.find(g => g.id === b.id);
    return {
      ...b,
      ...existente 
    };
  });

  setBosses(fusionados);
  guardarBossesEnStorage(fusionados);
  }, []);
  
const toggleDefeated = (id: string) => {
  setBosses(prev => {
    const actualizados = prev.map(b => {
      if (b.id === id) {
        const nuevoEstado = !b.defeated;
        let tiempoTotalActualizado = b.tiempoTotal;

        // Si el boss estaba corriendo, actualizamos el tiempo total
        if (b.corriendo && b.tiempoInicio) {
          tiempoTotalActualizado = (b.tiempoTotal || 0) + (Date.now() - b.tiempoInicio);
        }

        // Actualizamos el estado del boss
        const actualizado: BossEstado = {
          ...b,
          defeated: nuevoEstado,
          corriendo: false,
          tiempoInicio: null,
          tiempoTotal: tiempoTotalActualizado,
        };

        // 🎉 Solo reproducir efectos si se marca como derrotado
        if (nuevoEstado) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          efectSound.currentTime = 0;
          efectSound.play();
        }
        return actualizado;
      }
      return b;
    });
    // Actualizar el estado de los bosses en el localStorage
    guardarBossesEnStorage(actualizados);
    return actualizados;
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

  const formatearTiempo = (ms: number) => {
  const totalSegundos = Math.floor(ms / 1000);
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  return `${horas.toString().padStart(2, '0')}:${minutos
    .toString()
    .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
};

  const tiempoGlobal = bosses.reduce((total, b) => {
    if (b.tiempoTotal) {
      return total + (b.tiempoTotal + (b.corriendo && b.tiempoInicio ? Date.now() - b.tiempoInicio : 0));
    }
    return total;
  }, 0);

 
  return (
    <div className="mx-auto w-full ">
      <div className="flex flex-col px-4 w-full sm:gap-4 gap-1 mt-4 ">
        <div className="flex flex-col fixed top-0 bg-base-100 z-10 w-full justify-center items-center ">
          <div className="w-full h-3 bg-base-300 rounded mt-2">
            <motion.div
              className={`h-full rounded ${
                progreso < 50
                  ? 'bg-success'
                  : progreso < 80
                  ? 'bg-primary'
                  : 'bg-success'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        <motion.span
          key={tiempoGlobal}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="countdown justify-center sm:text-2xl text-lg text-neutral-content font-mono mt-2"
        >
          {formatearTiempo(tiempoGlobal)}
        </motion.span>
        <div className="w-full flex justify-between items-center">  
          <div className="text-warning/90 w-full">
            <p class="font-semibold text-success sm:text-lg text-sm">
              {derrotados} / {total} - Jefes derrotados {progreso}%
            </p>
            <p className="text-sm">{conteoPorTipo.bossesDerrotados} / {conteoPorTipo.bossesTotales} - Bosses </p>
            <p className="text-sm">{conteoPorTipo.minibossesDerrotados} / {conteoPorTipo.minibossesTotales} - Minibosses</p>
          </div>
          <label className="input m-2">
            <svg className="h-[1em] opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
       <AnimatePresence mode="popLayout">
        {bossesFiltrados.map(b => (
          <motion.div
            key={b.id}
            layout
            initial={{ opacity: 0, y: 10, scale: 0.90 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.90 }}
            transition={{ duration: 0.5 }}
          >
            <BossCard boss={b} onToggle={toggleDefeated} onUpdateBoss={actualizarBoss} />
          </motion.div>
        ))}
      </AnimatePresence>
      </div>
      <Footer bosses={bosses} setBosses={setBosses} />
    </div>
  );
}

export default App;
