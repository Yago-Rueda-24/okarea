import { useState } from 'react';

export default function AccessModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: 'Madrid (Barrio de Salamanca / Chamberí)',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md transition-opacity duration-300 animate-fade-in"
      id="accessModal"
    >
      <div className="bg-surface rounded-2xl max-w-lg w-full p-space-xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          id="closeModalBtn"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
          Solicitud de Atelier
        </span>
        <h3 className="font-headline-md text-headline-md text-on-surface mt-1 mb-2">
          Ingreso al Salón Digital
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
          Complete sus datos para recibir una invitación formal y coordinar la primera sesión de
          escaneo fotográfico de su colección.
        </p>

        {submitted ? (
          <div className="p-space-lg rounded-xl bg-secondary-container text-on-secondary-container flex items-center gap-space-sm animate-fade-in">
            <span className="material-symbols-outlined text-secondary text-[24px]">check_circle</span>
            <span className="font-body-md text-body-md font-medium">
              Solicitud recibida. Un archivista se pondrá en contacto dentro de las próximas 24 horas.
            </span>
          </div>
        ) : (
          <form className="space-y-space-md" id="leadForm" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1">
                Nombre Completo
              </label>
              <input
                className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                placeholder="p. ej. Victoria Larrea"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1">
                Correo Electrónico Privado
              </label>
              <input
                className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                placeholder="v.larrea@atelier.com"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1">
                Ciudad de Residencia Principal
              </label>
              <select
                className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-xs"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option>Madrid (Barrio de Salamanca / Chamberí)</option>
                <option>París (Le Marais / 8ème)</option>
                <option>Barcelona (Eixample / Sarrià)</option>
                <option>Londres (Mayfair / Chelsea)</option>
                <option>Otra Residencia Internacional</option>
              </select>
            </div>

            <button
              className="w-full py-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-md transition-colors mt-space-md cursor-pointer"
              type="submit"
            >
              Enviar Candidatura
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
