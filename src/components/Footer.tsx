import type { BossEstado } from "../types/Boss";
import { exportarProgreso, importarProgreso } from "../utils/LocalStorage";

interface FooterProps {
  bosses: BossEstado[];
  setBosses: (bosses: BossEstado[]) => void;
}

export default function Footer({ bosses, setBosses }: FooterProps) {
  const manejarImportacion = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      importarProgreso(file, (data) => {
        setBosses(
          bosses.map((boss) => ({
            ...boss,
            defeated: (data as Record<string, boolean>)[boss.id] || false,
          }))
        );
      });
    }
  };

  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-neutral-content items-center p-4 ">
      <aside className="grid-flow-col items-center justify-between bg-bas-200 w-full">
        <p className="text-sm">
          Información extraída de{" "}
          <a
            href="https://sekiro.fandom.com/es/wiki/Sekiro_Wiki"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sekiro Wiki
          </a>{" "}
          y{" "}
          <a
            href="https://fextralife.com/sekiro-bosses/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fextralife
          </a>.
        </p>
        <p className="text-xs">
          Alejandro Álvarez {new Date().getFullYear()} - All rights reserved
        </p>
        <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={() => exportarProgreso(bosses)}>
            Guardar progreso (.json)
            </button>
            <label className="btn btn-secondary cursor-pointer">
            Cargar progreso (.json)
            <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={manejarImportacion}
            />
            </label>
        </div>
      </aside>
    </footer>
  );
}
