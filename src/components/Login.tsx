// src/components/Login.tsx
import { useState } from 'preact/hooks';
import { saveUsername } from '../utils/auth';

interface Props {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [nombre, setNombre] = useState('');

  const manejarLogin = () => {
  const nombreLimpio = nombre.trim();
  // Validar que no esté vacío y que no tenga espacios
  if (!nombreLimpio || /\s/.test(nombreLimpio)) {
    alert('El nombre no debe estar vacío ni contener espacios.');
    return;
  }
  saveUsername(nombreLimpio);
  onLogin(nombreLimpio);
};

  
  return (
    <div className="p-6 text-center h-full flex flex-col gap-4 items-center justify-center w-full mt-4">
      <img src="/icon.webp" className="object-contain max-h-48 max-w-full rounded-sm" alt="Sekiro Boss Tracker" />
      <h2 className="text-xl font-bold mb-4">Bienvenido a Sekiro Boss Tracker</h2>
      <p className="mb-2">Escribe un nombre único para guardar tu progreso, con este podrás almacenar y recuperar tu progreso en cualquier dispositivo.</p>
      <input
        className=" input input-bordered w-full mb-4"
        value={nombre}
        onInput={(e) => setNombre((e.target as HTMLInputElement).value)}
        placeholder="Ej: sekiro1234"
      />
      <button
        className="btn btn-primary btn-lg"
        onClick={manejarLogin}
      >
        Entrar
      </button>
    </div>
  );
}
