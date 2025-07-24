import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { BossEstado } from '../types/Boss';

interface BossCardProps {
  boss: BossEstado;
  onToggle: (id: string) => void;
  onUpdateBoss: (id: string, data: Partial<BossEstado>) => void;
}

const BossCard: FunctionalComponent<BossCardProps> = ({ boss, onToggle, onUpdateBoss }) => {
  const [tiempo, setTiempo] = useState<number >(0);
  
  useEffect(() => {
    let intervalo: number | undefined;

    if (boss.corriendo && boss.tiempoInicio) {
      intervalo = setInterval(() => {
        setTiempo(Date.now() - boss.tiempoInicio!);
      }, 1000);
    } else if (boss.tiempoTotal) {
      setTiempo(boss.tiempoTotal);
    } else {
      setTiempo(0);
    }

    return () => clearInterval(intervalo);
  }, [boss.corriendo, boss.tiempoInicio]);

  const iniciar = () => {
    onUpdateBoss(boss.id, {
      tiempoInicio: Date.now(),
      corriendo: true,
    });
  };

  const detener = () => {
    if (boss.tiempoInicio) {
      const tiempoTranscurrido = Date.now() - boss.tiempoInicio;
      onUpdateBoss(boss.id, {
        tiempoTotal: tiempoTranscurrido,
        tiempoInicio: null,
        corriendo: false,
      });
    }
  };

  const formatoTiempo = (ms: number) => {
    const segundos = Math.floor(ms / 1000) % 60;
    const minutos = Math.floor(ms / 1000 / 60);
    return `${minutos}m ${segundos}s`;
  };
  
  return (
    <div
      className={`card shadow-sm transition-colors duration-500 ease-in-out mb-2 border-b-2 border-t-2 border-r border-l border-base-300 ${
        boss.defeated ? 'bg-success text-success-content' : 'bg-base-100'
      }`}
      onDblClick={() => onToggle(boss.id)}
    >
      <figure className="p-4 flex justify-center">
        <div className={`skeleton ${boss.imagen ? 'hidden' : 'block'} h-48 w-48`}></div>
        <img
          src={boss.imagen}
          className="h-auto w-auto object-contain max-h-48 max-w-full rounded-sm"
          width="200"
          height="200"
          loading="lazy"
          crossorigin="anonymous"
          alt={boss.nombre}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {boss.nombre}
          <div className="badge badge-accent">{boss.tipo}</div>
        </h2>
        <p>{boss.descripcion}</p>
        <div className="card-actions justify-between items-center">
          <div className="flex items-center gap-2">
              <div className="flex w-fit gap-2">
                {!boss.corriendo ? (
                  <button className="btn btn-xs btn-success" onClick={iniciar} hidden={boss.defeated}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                      <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
                    </svg>
                  </button>
                ) : (
                  <button className="btn btn-xs btn-warning" onClick={detener}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
                      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
                    </svg>
                  </button>
                )}
                <span className="countdown items-center font-mono text-lg">{formatoTiempo(tiempo)}</span>
              </div>
          </div>
          <div className="text-accent ">{boss.detalles?.Location}</div>
        </div>
        <div className={`text-sm ${boss.defeated ? 'text-success' : 'text-warning'}`}>
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title text-md font-medium">
              Ver detalles
            </div>
            <div className="collapse-content text-sm">
              {boss.detalles?.['Deathblow Markers'] && (
                <p><strong>Deathblow Markers:</strong> {boss.detalles['Deathblow Markers']}</p>
              )}
              {boss.detalles?.['Useful Tools'] && (
                <p><strong>Herramientas útiles:</strong> {boss.detalles['Useful Tools']}</p>
              )}
              {boss.detalles?.Reward && (
                <p><strong>Recompensa:</strong> {boss.detalles.Reward}</p>
              )}
              {boss.detalles?.XP && (
                <p><strong>XP:</strong> {boss.detalles.XP}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer flex items-center justify-between px-4 py-2">
        <div>
          <input
            type="checkbox"
            className="checkbox checkbox-primary mr-2"
            checked={boss.defeated}
            onChange={() => onToggle(boss.id)}
          />
          <span>Derrotado</span>
        </div>
        <button
          className="btn btn-link btn-md"
          onClick={() => window.open(`${boss.link}`, '_blank')}
        >
          Ver en Wiki
        </button>
      </div>
    </div>
  );
};

export default BossCard;
