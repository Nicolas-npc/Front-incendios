import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-[#790C0B] text-white shadow-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <p className="text-2xl font-bold">Municipalidad</p>
            <p className="text-2xl font-bold">Valle del Sol</p>
          </div>
        </div>

        <p className="text-3xl font-bold text-white ">Plataforma de Prevención de Incendios</p>

        <div className="flex items-center gap-3">
          <Link
            to="/alertas"
            aria-label="Alertas"
            title="Alertas"
            className="inline-flex items-center rounded-full p-3 transition-colors hover:bg-white/10 hover:text-yellow-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-9 w-9"
            >
              <path d="M4 6h16v12H4z" />
              <path d="m4 7 8 6 8-6" />
              <circle cx="18.5" cy="4.8" r="3.1" fill="#FACC15" stroke="none" />
              <line x1="18.5" y1="3.3" x2="18.5" y2="5.5" stroke="#790C0B" />
              <circle cx="18.5" cy="6.5" r="0.55" fill="#790C0B" stroke="none" />
            </svg>
          </Link>

          <Link
            to="/login"
            className="rounded-md border border-black/50 bg-[#cf0000] px-15 py-3 text-xs font-semibold transition-colors hover:bg-[#a5100d]"
          >
            Iniciar Sesion
          </Link>
        </div>
      </div>

      <nav className="border-t border-[#820E0D] bg-[#A80000] px-4 py-2 sm:px-6 flex justify-center gap-x-6 gap-y-2 text-lg font-medium">
        <Link to="/" className="hover:text-yellow-200 transition-colors">Inicio</Link>
        <Link to="/mapa" className="hover:text-yellow-200 transition-colors">Mapa en Tiempo Real</Link>
        <Link to="/reportar" className="hover:text-yellow-200 transition-colors">Reportar Incendio</Link>
        <a href="#Historial" className="hover:text-yellow-200 transition-colors">Historial</a>
        <a href="#Contacto" className="hover:text-yellow-200 transition-colors">Contacto</a>
      </nav>
    </header>
  )
}
