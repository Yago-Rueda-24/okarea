import { useState } from 'react';
import { FAQ_ITEMS_MOCK } from '../../mocks/asesoriaData';

export default function FaqAccordion() {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="max-w-2xl mb-space-lg">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
          Resolución de Dudas
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Preguntas Frecuentes
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Detalles operativos sobre las consultas personalizadas y el salón virtual.
        </p>
      </div>

      <div className="space-y-space-sm max-w-4xl" id="faq-container">
        {FAQ_ITEMS_MOCK.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="faq-item rounded-lg bg-surface-container-low transition-all overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="faq-btn w-full p-space-md flex items-center justify-between text-left cursor-pointer"
                type="button"
                aria-expanded={isOpen}
              >
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  {item.question}
                </span>
                <span
                  className={`material-symbols-outlined text-outline transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {isOpen && (
                <div className="faq-content px-space-md pb-space-md pt-0 text-on-surface-variant font-body-md text-body-md animate-fade-in">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
