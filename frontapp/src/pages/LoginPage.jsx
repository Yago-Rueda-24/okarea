import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const setMode = (newMode) => {
    setSearchParams(newMode === 'register' ? { mode: 'register' } : {});
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    aestheticStyle: 'quiet_luxury',
    email: 'c.vidal@maison.com',
    password: 'password123',
    remember: true,
    consent: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to Prendas in the atelier dashboard
      navigate('/prendas');
    }, 800);
  };

  const isLogin = mode === 'login';

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-gutter bg-surface">
      <div className="flex flex-col w-full max-w-7xl mx-auto py-space-md lg:py-space-xl px-gutter">
        {/* Brand Mark Header */}
        <header className="flex flex-col items-center text-center mb-space-lg">
          <Link
            to="/welcome"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high text-primary mb-space-sm shadow-sm hover:bg-surface-container-highest transition-colors"
            title="Volver a Inicio"
          >
            <span className="material-symbols-outlined text-[26px]">downloading</span>
          </Link>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-medium">
            Salon Privé • Acceso a Miembros
          </span>
          <Link to="/welcome">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs tracking-tight hover:text-primary transition-colors">
              Vestiaire Studio
            </h1>
          </Link>

          {/* Mode Switcher Tab */}
          <div className="mt-space-md bg-surface-container-low p-1 rounded-full flex items-center shadow-inner relative max-w-xs w-full">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all duration-300 text-center cursor-pointer ${
                isLogin
                  ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              id="tab-login"
              type="button"
            >
              Acceso Privado
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all duration-300 text-center cursor-pointer ${
                !isLogin
                  ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              id="tab-register"
              type="button"
            >
              Crear Archivo
            </button>
          </div>
        </header>

        {/* Main Split Canvas Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Column: Editorial Atmospheric Retrospective */}
          <div className="lg:col-span-5 relative bg-surface-container-high flex flex-col justify-between p-space-lg lg:p-margin overflow-hidden">
            {/* Background Ambient Image with Soft Editorial Scrim */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-90 scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBH5jEukhoFtpyZO7B0mTDXe-LIuDo5jsh9jtQe6l8dUGCJ7U361V8gxGoVlbbOhJfRuNUpRn7G50SeCu4nMqjwofolQZPuQr6bvYtUlPAJCxtzz81W1UERu8CkqwSspuGanRKocXU196jOgw-oJkIVS-N4Lu_SpbrFubRi1O7QX5AKhfSAndf-TLrBJuMdhkXd-FGpahTo9xIQXjBMRILrGhHfrl_D9hrLrvBy2sY')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent"></div>

            {/* Top Tag */}
            <div className="relative z-10 flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-fixed"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-inverse-on-surface/90 font-medium">
                Edición Privada • N° 04
              </span>
            </div>

            {/* Center & Bottom Editorial Content */}
            <div className="relative z-10 text-inverse-on-surface mt-space-xl">
              <span className="material-symbols-outlined text-primary-fixed text-3xl mb-space-sm opacity-80 block">
                format_quote
              </span>
              <blockquote className="font-headline-md text-headline-md text-inverse-on-surface leading-snug tracking-tight mb-space-md font-serif italic">
                “Un armario ordenado es la expresión más pura de serenidad y estilo personal.”
              </blockquote>
              <p className="font-body-sm text-body-sm text-surface-variant mb-space-lg tracking-wide">
                Curaduría textil de archivo, indumentaria de colección y estilismo satorial con
                discreción absoluta.
              </p>

              {/* Privileges Matrix */}
              <div className="space-y-3 pt-space-sm">
                <div className="flex items-center space-x-3 bg-surface-dim/20 backdrop-blur-md rounded-lg p-2.5">
                  <span className="material-symbols-outlined text-primary-fixed text-lg">
                    enhanced_encryption
                  </span>
                  <div className="min-w-0">
                    <p className="font-label-md text-label-md text-inverse-on-surface truncate font-semibold">
                      Cifrado de Colección
                    </p>
                    <p className="font-body-sm text-body-sm text-surface-variant truncate">
                      Bóveda digital sellada para piezas de alto valor
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-surface-dim/20 backdrop-blur-md rounded-lg p-2.5">
                  <span className="material-symbols-outlined text-primary-fixed text-lg">
                    person_pin
                  </span>
                  <div className="min-w-0">
                    <p className="font-label-md text-label-md text-inverse-on-surface truncate font-semibold">
                      Atelier Concierge Directo
                    </p>
                    <p className="font-body-sm text-body-sm text-surface-variant truncate">
                      Intercambio fluido con su asesor sartorial
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-surface-dim/20 backdrop-blur-md rounded-lg p-2.5">
                  <span className="material-symbols-outlined text-primary-fixed text-lg">
                    auto_awesome
                  </span>
                  <div className="min-w-0">
                    <p className="font-label-md text-label-md text-inverse-on-surface truncate font-semibold">
                      Predictor de Composición
                    </p>
                    <p className="font-body-sm text-body-sm text-surface-variant truncate">
                      Sinergia estilística entre estaciones y siluetas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Authentication Engine */}
          <div className="lg:col-span-7 p-space-lg lg:p-margin flex flex-col justify-between bg-surface-container-lowest">
            <div>
              {/* Dynamic Subtitle Area */}
              <div className="mb-space-lg">
                <div className="flex items-center justify-between mb-space-xs">
                  <span
                    className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold"
                    id="status-tag"
                  >
                    {isLogin ? 'Membresía Activa' : 'Nueva Solicitud de Atelier'}
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface" id="form-heading">
                  {isLogin
                    ? 'Bienvenido de nuevo a su Atelier'
                    : 'Solicite su Acceso Privado'}
                </h2>
                <p
                  className="font-body-md text-body-md text-on-surface-variant mt-1"
                  id="form-subheading"
                >
                  {isLogin
                    ? 'Ingrese sus credenciales privadas para inspeccionar su colección y registros de temporada.'
                    : 'Inaugure su catálogo personal con curaduría y salvaguarda sartorial.'}
                </p>
              </div>

              {/* Dynamic Form Fields */}
              <form className="space-y-space-md" id="auth-form" onSubmit={handleSubmit}>
                {/* Registration Exclusive Fields */}
                {!isLogin && (
                  <div className="space-y-space-md animate-fade-in" id="register-fields">
                    <div>
                      <label
                        className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-1.5 font-medium"
                        htmlFor="name"
                      >
                        Nombre Completo o Razón de Archivo
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">
                          badge
                        </span>
                        <input
                          className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg font-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
                          id="name"
                          placeholder="ej. Condesa Elena de Valmont"
                          required={!isLogin}
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-1.5 font-medium">
                        Perfil de Estilismo Preferente
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label
                          onClick={() => setFormData({ ...formData, aestheticStyle: 'quiet_luxury' })}
                          className="cursor-pointer"
                        >
                          <input
                            checked={formData.aestheticStyle === 'quiet_luxury'}
                            onChange={() =>
                              setFormData({ ...formData, aestheticStyle: 'quiet_luxury' })
                            }
                            className="sr-only"
                            name="aesthetic_style"
                            type="radio"
                            value="quiet_luxury"
                          />
                          <div
                            className={`p-2.5 text-center rounded-lg transition-all ${
                              formData.aestheticStyle === 'quiet_luxury'
                                ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary'
                                : 'bg-surface hover:bg-surface-container'
                            }`}
                          >
                            <p className="font-label-md text-label-md font-semibold">
                              Lujo Silencioso
                            </p>
                            <p className="font-body-sm text-body-sm opacity-80">Tonos neutros</p>
                          </div>
                        </label>

                        <label
                          onClick={() =>
                            setFormData({ ...formData, aestheticStyle: 'contemporary_tailoring' })
                          }
                          className="cursor-pointer"
                        >
                          <input
                            checked={formData.aestheticStyle === 'contemporary_tailoring'}
                            onChange={() =>
                              setFormData({ ...formData, aestheticStyle: 'contemporary_tailoring' })
                            }
                            className="sr-only"
                            name="aesthetic_style"
                            type="radio"
                            value="contemporary_tailoring"
                          />
                          <div
                            className={`p-2.5 text-center rounded-lg transition-all ${
                              formData.aestheticStyle === 'contemporary_tailoring'
                                ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary'
                                : 'bg-surface hover:bg-surface-container'
                            }`}
                          >
                            <p className="font-label-md text-label-md font-semibold">Sastrería</p>
                            <p className="font-body-sm text-body-sm opacity-80">Cortes pulcros</p>
                          </div>
                        </label>

                        <label
                          onClick={() =>
                            setFormData({ ...formData, aestheticStyle: 'minimal_avantgarde' })
                          }
                          className="cursor-pointer"
                        >
                          <input
                            checked={formData.aestheticStyle === 'minimal_avantgarde'}
                            onChange={() =>
                              setFormData({ ...formData, aestheticStyle: 'minimal_avantgarde' })
                            }
                            className="sr-only"
                            name="aesthetic_style"
                            type="radio"
                            value="minimal_avantgarde"
                          />
                          <div
                            className={`p-2.5 text-center rounded-lg transition-all ${
                              formData.aestheticStyle === 'minimal_avantgarde'
                                ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary'
                                : 'bg-surface hover:bg-surface-container'
                            }`}
                          >
                            <p className="font-label-md text-label-md font-semibold">Vanguardia</p>
                            <p className="font-body-sm text-body-sm opacity-80">Minimalismo</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label
                    className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-1.5 font-medium"
                    htmlFor="email"
                  >
                    Dirección de Correo Electrónico
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">
                      alternate_email
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg font-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
                      id="email"
                      placeholder="ej. c.vidal@maison.com"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-medium"
                      htmlFor="password"
                    >
                      Contraseña de Seguridad
                    </label>
                    {isLogin && (
                      <button
                        onClick={() =>
                          alert('Se ha enviado un enlace de restauración a su correo privado.')
                        }
                        className="font-body-sm text-body-sm text-primary hover:text-primary-container transition-colors cursor-pointer"
                        id="forgot-password-link"
                        type="button"
                      >
                        ¿Olvidó su clave?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">
                      key
                    </span>
                    <input
                      className="w-full pl-10 pr-10 py-2.5 bg-surface rounded-lg font-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
                      id="password"
                      placeholder="••••••••••••"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      aria-label="Alternar visibilidad"
                      className="absolute right-3 top-2.5 text-outline hover:text-on-surface transition-colors cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg" id="eye-icon">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      checked={formData.remember}
                      onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                      className="w-4 h-4 rounded bg-surface text-primary accent-primary cursor-pointer"
                      id="remember"
                      type="checkbox"
                    />
                    <span className="font-body-md text-body-md text-on-surface-variant select-none">
                      Recordar sesión en esta terminal de atelier
                    </span>
                  </label>

                  {!isLogin && (
                    <div id="consent-row" className="animate-fade-in">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded bg-surface text-primary accent-primary cursor-pointer"
                          id="consent"
                          required={!isLogin}
                          type="checkbox"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant select-none">
                          Acepto los estatutos y normativas de confidencialidad del Club Privado
                          Vestiaire Studio.
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-lg bg-inverse-surface hover:bg-primary text-inverse-on-surface font-title-md transition-all duration-300 shadow-md flex items-center justify-center gap-2 group mt-space-sm cursor-pointer disabled:opacity-75"
                  id="submit-button"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        autorenew
                      </span>
                      <span>Autenticando en Atelier...</span>
                    </>
                  ) : (
                    <>
                      <span id="button-label">
                        {isLogin ? 'Ingresar a Mi Armario' : 'Completar Registro & Acceder'}
                      </span>
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                        east
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Switcher Prompt Footer */}
            <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-lg p-3 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                <span>
                  {isLogin
                    ? '¿Aún no posee un archivo en Vestiaire Studio?'
                    : '¿Ya dispone de un archivo personal activo?'}
                </span>
                <button
                  onClick={() => setMode(isLogin ? 'register' : 'login')}
                  className="font-title-md text-title-md text-primary hover:text-primary-container ml-1.5 inline-flex items-center transition-colors underline decoration-1 underline-offset-4 cursor-pointer font-semibold"
                  id="bottom-action-button"
                  type="button"
                >
                  {isLogin
                    ? 'Solicitar registro de miembro'
                    : 'Iniciar sesión existente'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
