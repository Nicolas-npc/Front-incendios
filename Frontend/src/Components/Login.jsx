import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'Ingresa tu correo electronico.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Ingresa un correo valido.'
    }

    if (!formData.password) {
      nextErrors.password = 'Ingresa tu contrasena.'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'La contrasena debe tener al menos 6 caracteres.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setFormMessage('Credenciales validas. Ya puedes conectar esto con tu API de inicio de sesion.')
      return
    }

    setFormMessage('Revisa los campos marcados para continuar.')
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      <header className="bg-[#990b0b] text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="leading-tight">
            <p className="text-sm font-bold sm:text-base">MUNICIPALIDAD VALLE DEL SOL</p>
            <p className="text-xs text-white/90 sm:text-sm">Plataforma de Prevencion de Incendios</p>
          </div>
          <Link
            to="/"
            className="rounded-md border border-black/50 bg-[#cf0000] px-5 py-2 text-xs font-semibold transition-colors hover:bg-[#a5100d] sm:text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl bg-white p-7 shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-[#1f2937] flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-[#b80d0d]"
              aria-hidden="true"
            >
              <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 12.2c-2.5-.9-4.5-2.7-5.7-5 .9-1.4 2.5-2.2 4.2-2.2h3c1.8 0 3.4.8 4.2 2.2-1.2 2.3-3.2 4.1-5.7 5Z" />
            </svg>
            Iniciar Sesion
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">Accede a tu cuenta para continuar</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-700">
                Correo Electronico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
              />
              {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-semibold text-gray-700">
                Contrasena
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Tu contrasena"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
              />
              {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="accent-[#b80d0d]"
                />
                Recordarme
              </label>
              <a href="#" className="text-[#1d4ed8] hover:underline">
                Olvidaste tu contrasena?
              </a>
            </div>

            {formMessage ? (
              <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" aria-live="polite">
                {formMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-md bg-[#b80d0d] py-2.5 text-sm font-semibold text-white shadow hover:bg-[#960909] transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
              </svg>
              Iniciar Sesion
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-[#1d4ed8] hover:underline">
              Registrate aqui
            </Link>
          </p>
        </div>
      </main>

      <footer className="bg-[#990b0b] text-white text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <p>© 2026 Municipalidad de Valle del Sol - Plataforma de Prevencion de Incendios</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-yellow-200">Terminos de Uso</a>
            <a href="#" className="hover:text-yellow-200">Privacidad</a>
            <span>Emergencias: 112</span>
          </div>
        </div>
      </footer>
    </div>
  )
}