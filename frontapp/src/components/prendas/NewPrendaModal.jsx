import { useState } from 'react';

const SAMPLE_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBgS8-8hZjsFo9jdf8gI0s6w_79-3xFfRQ7-XP3oyeNspmnV-4ktwcU1sI4OGTxPb9H6gCjnnl0S5whAlfvbq_FD2Bv6yybw-JBr08pXsEEGCuwsoebRm3BjT-P_gHYylqFUVV7JhzqB5IAIQKq7z9vk6imapKbWa1YZMditC2QYA6nd2UmIoa42hat_OGN2XvLT1eipUO1CI8nMi13K5anv_uLbf8JyACKnvJXta8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAjWfRR-dLBY-RvHn3CAbSbmImj8pb1cPB2K9TEY2-zIa15XwKS4x7b43fcNmWM6xV_oMamGthsRYtD-zUfvJ7faikG_ar-wgV5wJUkNGlShfLoICm2S4ABqMLJNkKTO_o7eMT2uJ8cjkLtRKa6krzM4De4ynNdz_z4t0fBcgEMT62B4pZ9wFpd13wV8DMZvrokH4kiHCnOny5rQTofikEU50qu2keN8ECLS53vnQ0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHi6vSINe9Hv6smfP2lRHWp40VBPei8wyXKu3aprysMV1SKblUdBXitSyyLbrAZavhh2JtxVb6_SwgHQZAdsCK2joYGdol-lkLgPIlrE-qzx__hQWhvHuMpFz226nYal8TZZ1Hr2kDOK0MCOtsOoesNNyvBAZPcHDpIfCxJmenHHZyowBn7S2yT0IORylza4JP0cG7cozf9sV33pCwNpbqVCobmRIbvfUiSGoq62E',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDxX4PuIo8A5VnTBTchJ46Y69K-YVbcpRW3G2CL0e_jYiZZPGC0DfNlGFuIfp6feF6AO9fLcgTGsXTEgOTQ_NN9N4dfcuScff18HmHJSr4n1c_wzFQu4kNv61eIh0jskiBL3yB8tBN1Gi8GmQyznF6pwUK2JdQIGyGbGIJcDTFcX_Yltv9nODv_DgexytZ0uxPpikZcGcrSgzg4_LvlsxpbSN-S-1S49kwehMLCuuY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCNQII1bB-28zoHJsJAir24FBDSieXl0JDrz0J3sbwbU0cXtmh5Bv9OWhoHUsMOuNnsA_zvLQJ4THuBnRxXOe81sr61TcE4g7uUxrUJq68RqRyLVl07SPowqW6o0IrTjTlP4jsu_qThCK7WT4k3dX5pdzkVd42jegyxHAR5uK2c36II8LgN_jhBjepeBk5E5T66Ur0LJ5Fij7bEF2hd6SedNoDpWM1tVqUjOUkEDFQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAuT1qW4BS-IPjJYklqz_r415L7roFth90sGesC2lUrkD3Wozkk6XppkYzCyPfsaA5_mb6W2JRFh2UxNagdIYlaxsYL9z6vsPHnIaEiuvsYK1Vp2Q5O-qE0ZslrZZZSBwrSgzARnFR50CbtqiKHhJQwTLATrkphhL94srBuQetib7O-5LeDd74l6-u8MsM0A_zWZGfFvnsZJB5MZ-33I8DXjAy6HbTW7ZP4WnGB-BU',
];

export default function NewPrendaModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Chaquetas & Blazers');
  const [season, setSeason] = useState('Otoño/Invierno');
  const [size, setSize] = useState('38 FR');
  const [exterior, setExterior] = useState('100% Lana');
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim()) return;

    const newPrenda = {
      id: Date.now(),
      ref: `${brand.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 900 + 100
      )}`,
      brand: brand.trim(),
      title: title.trim(),
      category,
      size,
      wearCount: 0,
      isFavorite: false,
      season,
      palette: 'Tierra & Neutros',
      status: 'Sin estrenar',
      materialTag: `${season === 'Otoño/Invierno' ? 'O/I' : 'P/V'} • ${exterior}`,
      image: selectedImage,
      detailImage: selectedImage,
      badges: [
        { text: category.split(' ')[0], bg: 'bg-surface-container-lowest/90 text-primary font-semibold' },
        { text: 'Sin estrenar', bg: 'bg-primary text-on-primary' },
      ],
      composition: {
        exterior,
        lining: '100% Cupro',
        washing: 'Lavado delicado / Tintorería',
        location: 'Armario Principal',
      },
      suggestedPairings: [],
    };

    onSave(newPrenda);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-surface-container-highest/60">
        {/* Modal Header */}
        <div className="px-space-lg pt-space-lg pb-space-sm flex items-center justify-between border-b border-surface-container-highest/50">
          <div>
            <span className="font-label-sm text-primary uppercase tracking-wider font-semibold">
              Atelier Archive
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Nueva Prenda</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-md">
          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Marca / Diseñador
              </label>
              <input
                required
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Totême, Céline, The Row..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
              />
            </div>
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Talla
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Ej. 38 FR, S, 39 EU..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
              Título de la Prenda
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Blazer Cruzado Lana Espresso"
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
              >
                <option value="Tops & Camisas">Tops &amp; Camisas</option>
                <option value="Chaquetas & Blazers">Chaquetas &amp; Blazers</option>
                <option value="Pantalones & Faldas">Pantalones &amp; Faldas</option>
                <option value="Vestidos">Vestidos</option>
                <option value="Calzado">Calzado</option>
                <option value="Bolsos & Accesorios">Bolsos &amp; Accesorios</option>
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Temporada
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
              >
                <option value="Otoño/Invierno">Otoño/Invierno</option>
                <option value="Primavera/Verano">Primavera/Verano</option>
                <option value="Todo Año">Todo Año</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
              Composición &amp; Material
            </label>
            <input
              type="text"
              value={exterior}
              onChange={(e) => setExterior(e.target.value)}
              placeholder="100% Lana, Seda, Algodón..."
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>

          <div>
            <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
              Seleccionar Fotografía Editorial
            </label>
            <div className="grid grid-cols-6 gap-2">
              {SAMPLE_IMAGES.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImage === img
                      ? 'border-primary ring-2 ring-primary/40'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img alt="" src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-space-sm flex items-center justify-end gap-space-sm">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-md transition-all cursor-pointer"
            >
              Guardar Prenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
