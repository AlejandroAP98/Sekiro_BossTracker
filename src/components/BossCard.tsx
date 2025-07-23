import type { FunctionalComponent } from 'preact';
import type { BossEstado } from '../types/Boss';

interface BossCardProps {
  boss: BossEstado;
  onToggle: (id: string) => void;
}

const BossCard: FunctionalComponent<BossCardProps> = ({ boss, onToggle }) => {
  return (
    <div
      className={`card shadow-sm mb-4 border-b-2 border-t-2 border-r border-l border-base-300 ${
        boss.defeated ? 'bg-success text-success-content' : 'bg-base-100'
      }`}
    >
      <figure className="p-4 flex justify-center">
        <img
          src={boss.imagen}
          className="h-auto w-auto object-contain max-h-48 max-w-full rounded-sm"
          alt={boss.nombre}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {boss.nombre}
          <div className="badge badge-accent">{boss.tipo}</div>
        </h2>
        <p>{boss.descripcion}</p>
        <div className="card-actions justify-end">
          <div className="text-accent">{boss.detalles?.Location}</div>
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

      <div className="card-footer flex items-center justify-between p-4">
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
