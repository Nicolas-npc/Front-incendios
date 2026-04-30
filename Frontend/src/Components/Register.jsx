import { useState } from 'react'
import { Link } from 'react-router-dom'

function validateRut(value) {
  if (value.length < 2) {
    return false
  }

  const body = value.slice(0, -1)
  const verifier = value.slice(-1).toUpperCase()

  let sum = 0
  let multiplier = 2

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = 11 - (sum % 11)
  const expectedVerifier = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder)

  return verifier === expectedVerifier
}

function normalizeRut(value) {
  return value.replace(/[^0-9kK]/g, '').toUpperCase()
}

function normalizePhone(value) {
  return value.replace(/[^0-9+]/g, '')
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    rut: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (submitted) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Ingresa tu nombre completo.'
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = 'Ingresa tu apellido.'
    }

    const rutDigits = normalizeRut(formData.rut)
    if (!rutDigits) {
      nextErrors.rut = 'Ingresa tu RUT.'
    } else if (!validateRut(rutDigits)) {
      nextErrors.rut = 'El RUT no es valido.'
    }

    const normalizedPhone = normalizePhone(formData.phone)
    if (!normalizedPhone) {
      nextErrors.phone = 'Ingresa un telefono.'
    } else if (!/^(?:\+?56)?9\d{8}$/.test(normalizedPhone)) {
      nextErrors.phone = 'Ingresa un telefono movil chileno valido.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Ingresa un correo electronico.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Ingresa un correo valido.'
    }

    if (formData.password.length < 8) {
      nextErrors.password = 'La contrasena debe tener al menos 8 caracteres.'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      nextErrors.password = 'Incluye mayusculas, minusculas y al menos un numero.'
    }

    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Las contrasenas no coinciden.'
    }

    if (!formData.termsAccepted) {
      nextErrors.termsAccepted = 'Debes aceptar los terminos.'
    }

    setSubmitted(true)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(false)
    }
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
        <div className="w-full max-w-2xl rounded-xl bg-white p-7 shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-[#1f2937] flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-[#b80d0d]"
              aria-hidden="true"
            >
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
            </svg>
            Crear Cuenta
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">Unete a la plataforma de prevencion</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-semibold text-gray-700">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Juan Perez"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
                />
                {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
              </div>

              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-semibold text-gray-700">
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Perez"
                  value={formData.lastName}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.lastName)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
                />
                {errors.lastName ? <p className="mt-1 text-xs text-red-600">{errors.lastName}</p> : null}
              </div>

              <div>
                <label htmlFor="rut" className="mb-1 block text-sm font-semibold text-gray-700">
                  RUT
                </label>
                <input
                  id="rut"
                  name="rut"
                  type="text"
                  placeholder="12.345.678-5"
                  value={formData.rut}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.rut)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
                />
                {errors.rut ? <p className="mt-1 text-xs text-red-600">{errors.rut}</p> : null}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-gray-700">
                  Telefono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+56 9 11 2345-6789"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.phone)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
                />
                {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
              </div>

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
                  placeholder="Minimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
                />
                {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-gray-700">
                Confirmar
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite la contrasena"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={Boolean(errors.confirmPassword)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#b80d0d]"
              />
              {errors.confirmPassword ? <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p> : null}
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 accent-[#b80d0d]"
                />
                <span>
                  Acepto los{' '}
                  <a href="#" className="font-semibold text-[#1d4ed8] hover:underline">
                    Terminos de Uso
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="font-semibold text-[#1d4ed8] hover:underline">
                    Politica de Privacidad
                  </a>
                </span>
              </label>
              {errors.termsAccepted ? <p className="mt-1 text-xs text-red-600">{errors.termsAccepted}</p> : null}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#b80d0d] py-2.5 text-sm font-semibold text-white shadow hover:bg-[#960909] transition-colors"
            >
              Crear Cuenta
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-[#1d4ed8] hover:underline">
              Inicia sesion aqui
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
