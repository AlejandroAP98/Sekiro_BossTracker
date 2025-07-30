import type { BossEstado } from "../types/Boss";
import { useState, useEffect } from "preact/hooks";
import { guardarBossesEnStorage, subirDatosAFirebase, descargarDatosDesdeFirebase, consultarUltimaActualizacion } from "../utils/LocalStorage";

interface FooterProps {
  bosses: BossEstado[];
  setBosses: (bosses: BossEstado[]) => void;
}

export default function Footer({ bosses, setBosses }: FooterProps) {
  const [, setUltimaActualizacion] = useState<string | null>(null);
  const [ultimaSync, setUltimaSync] = useState<string | null>(null);

  // const manejarImportacion = (event: Event) => {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
  //   importarProgreso(file, (progresoImportado) => {
  //     const actualizados = bosses.map(b => {
  //       const progreso = progresoImportado[b.id];
  //       return progreso ? { ...b, ...progreso } : b;
  //     });

  //     guardarBossesEnStorage(actualizados);
  //     setBosses(actualizados);
  //     window.location.reload();  
  //   });
  //   }
  // };

  const handleSubirDatos = async () => {
    const fecha = await subirDatosAFirebase(bosses);
    setUltimaActualizacion(fecha);
    alert('Datos cargados exitosamente.');    
  };

const handleDescargarDatos = async () => {
  if(confirm('¿Estás seguro de descargar tus datos? Esto sobreescribirá tus datos actuales. HAZLO SOLO SI ESTÁS EN UN NUEVO DISPOSITIVO O SI BORRASTE LOS DATOS DE TÚ NAVEGADOR.')){
    const datos = await descargarDatosDesdeFirebase();
    if (datos) {
      const fusionados = bosses.map(b => {
        const remoto = datos.bosses.find(r => r.id === b.id);
        return { ...b, ...remoto };
      });
      setBosses(fusionados);
      guardarBossesEnStorage(fusionados);
      setUltimaActualizacion(datos.ultimaActualizacion);
      alert('Datos descargados con éxito.');
    } else {
      alert('No se encontraron datos en Firebase para este usuario.');
    }
  }
};

  useEffect(() => {
    consultarUltimaActualizacion().then((fecha) => {
      if (fecha) {
        setUltimaSync(fecha);
      }
    });
  }, []);

  const formatearFecha = (fecha: string) => {
    const fechaActual = new Date(fecha);
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const hora = fechaActual.getHours();
    const minuto = fechaActual.getMinutes();
    return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
  };


  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-neutral-content items-center p-4 min-h-auto">
      <aside className="flex w-full items-center justify-between bg-bas-200 ">
        <p className="text-sm sm:text-center">
          Información extraída de{" "}
          <a
            href="https://sekiro.fandom.com/es/wiki/Sekiro_Wiki"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            Sekiro Wiki
          </a>{" "}
          y{" "}
          <a
            href="https://fextralife.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            Fextralife
          </a>.
        </p>
        <div className="flex items-center w-full">
          <p className="text-xs text-neutral-content flex items-center gap-2 text-center w-full justify-center">
            <a className="pr-1" href="https://github.com/AlejandroAP98" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
            </svg>
          </a>
          Alejandro Álvarez - Sekiro Boss Tracker v1.1
          </p>
        </div>
        <div className="flex items-center flex-wrap justify-center">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-sm sm:justify-center justify-end ">
            <button
              className="btn btn-sm btn-secondary cursor-pointer"
              onClick={handleDescargarDatos}
              >
              Descargar datos
            </button>
            <button className="btn btn-sm btn-primary cursor-pointer" onClick={handleSubirDatos}>
            Subir datos
            </button>
          </div>
          <span className="text-xs text-neutral-content justify-center items-center text-end">
            {ultimaSync ? `Última actualización: ${formatearFecha(ultimaSync)}` : 'Sin datos'}
          </span> 
        </div>
      </aside>
    </footer>
  );
}
