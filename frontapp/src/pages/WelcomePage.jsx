import { Link } from 'react-router-dom';
import WelcomeHeader from '../components/welcome/WelcomeHeader';
import WelcomeFooter from '../components/welcome/WelcomeFooter';

export default function WelcomePage() {
  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      {/* 1. Fixed Editorial Header */}
      <WelcomeHeader />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* 2. Hero Editorial Section */}
          <section className="relative w-full px-gutter lg:px-margin pt-space-lg pb-space-xl overflow-hidden">
            {/* Subtle Ambient Blur Orbs */}
            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              {/* Left Column: Editorial Copy */}
              <div className="lg:col-span-6 flex flex-col items-start space-y-space-md z-10">
                {/* Subtitle Badge */}
                <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-medium">
                    Le Salon Privé • Archivo &amp; Estilismo Digital
                  </span>
                </div>

                <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-[1.08]">
                  El arte de vestir con <span className="italic font-normal text-primary">intención</span>,
                  curaduría y consciencia.
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Digitalice su guardarropa de autor, descubra armonías cromáticas de precisión
                  milimétrica y concierte sesiones privadas con nuestros archivistas textiles y
                  estilistas de atelier en París y Madrid.
                </p>

                {/* CTA Action Group */}
                <div className="flex flex-wrap items-center gap-space-md pt-space-sm w-full sm:w-auto">
                  <Link
                    to="/login"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary transition-all duration-300 shadow-md group cursor-pointer"
                    id="heroRegisterBtn"
                  >
                    <span className="font-label-md text-label-md uppercase tracking-wider">
                      Crear Mi Archivo Personal
                    </span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>

                  <a
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-space-lg py-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-all duration-300 cursor-pointer"
                    href="#pilares"
                  >
                    <span className="font-label-md text-label-md uppercase tracking-wider">
                      Explorar el Concepto
                    </span>
                  </a>
                </div>

                {/* Curated Micro-social Proof */}
                <div className="pt-space-md flex items-center gap-space-lg">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden shadow-sm">
                      <img
                        alt="Sophisticated fashion editor portrait"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs0BnCXUBdlXKp7AJqka1xZZYLngQbtxpz7cGG30898kq_ZNw-IV-qGlSxwq4sa9_zyEJewXAH0Z3XIIdHK9vx3hwURbChu4xXadJoUuuwL5qsLcPbwjVF-eIjc1XCr_bv6g8OLIZC6aEuWH9TVDq6FXiBgdB3DyfGFRMU_w_HvXSPZNNbesGUlRGTbfCEmkgKIuWJwsleLWieg99DrwwwKG7i8k-HTDpgWQ_96Pw"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden shadow-sm">
                      <img
                        alt="Parisian stylist portrait"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6kQt37NVTn-ZFC0a38LMp4cw3_Nxdu45XjQbl-ivc2hKw-W1nTXmY32C-ZJXaq-GYBZU3wJPA1eDeL1vDE7xGDQzeI6RcrAltxAdIS1Nfa_tmVTJtyPXUiOSiQwF4W3WF2SFWKPTfkP-i7GzyKGEVxJIu-x4SKoHwuS_ZvL3xlabOKdVnpBVNv_gCB06QYGUENz4xksGAQ5V6BkJB2Fvr3pXHC7_VsJbil6YnC0Q"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden shadow-sm">
                      <img
                        alt="Creative director portrait"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHkg9qmE2BDAgrx_48JbvmfsyTgVZrZC1UXw6erd-7awqUxexgR7sHrXewjNIZ8YCszKxpXrbjmto-NJr5cDTpfXKJ4eLhcYZ9Vb3FE0_Y7tj_Eoh7LFhBkYaq0Ssx9bVdgGUBJZkfx70wYrdUGJPYOWTNtXV2WKOgPYzTMeGoZIP0IAJQHfvPYeVUJX1W-HRohBDdmJlL2F8KsQ1DD-Uo_i_HvNu66wqqH9__fZI"
                      />
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    <strong className="font-title-md text-on-surface">320+</strong> colecciones
                    personales catalogadas bajo estándar de museo este mes.
                  </p>
                </div>
              </div>

              {/* Right Column: Editorial Triptych Mosaic */}
              <div className="lg:col-span-6 relative">
                <div className="grid grid-cols-12 gap-space-sm relative">
                  {/* Primary Garment Card */}
                  <div className="col-span-7 rounded-xl overflow-hidden shadow-xl bg-surface-container-lowest group relative">
                    <div className="relative h-[380px] overflow-hidden">
                      <img
                        alt="Editorial trench coat"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTm9yXS932iqM3J9cjiFiGp1U4abVbq7R3YpL6Q0kej7vF9hr9C5Wm8MVsghGkFSP8PQBjH8OFB4NLgMJUbYqokdx47g_C0tqtXJDK6C3c0Nr7vkyT7eSLvwSyJxMSGSKRxIfxsgQ4P0W7sbh7I-AxWwIgtdI7GTvP65PIW2_LAqr2GqRPjsK3zVXn8ghEsjAM5elJRZ1ZjXKKIyCk9AHqm7JTyZoCyT9Jpw6kr90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent"></div>
                      {/* Floating Metric Tag */}
                      <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
                          Pieza No. 042 • Trench Bottega
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-inverse-on-surface">
                        <p className="font-title-lg text-title-lg leading-tight font-semibold">
                          Gabardina Lino &amp; Seda Cruda
                        </p>
                        <div className="flex items-center justify-between mt-1 text-surface-container-high font-body-sm text-body-sm">
                          <span>Adquisición SS23</span>
                          <span className="text-secondary-container font-semibold">94% Armonía</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Atelier Card */}
                  <div className="col-span-5 flex flex-col gap-space-sm">
                    {/* Top Accessory Card */}
                    <div className="rounded-xl overflow-hidden shadow-lg bg-surface-container-lowest relative h-[210px] group">
                      <img
                        alt="Macro handbag detail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKm--NHMEm0ET3Hd6GTJNoD_sAdivQ0BsLtL97fGOe06vCUOOcnGIHBdXLt7NQk7xOwCYRFViTGTqtkxBKOq_8SMIqiCa55YR8bI0zQeB__R5PotdUWvukKG9y5x-9kpVf8EYM-HbfSu7zaAphRAsKByC-O3uDrh3q4KULIk9Po68_CwujPyxn2vRKAFQvMQHdcXM71E4eClfrfAJddXiUCS-HQftPCagiUXFft7g"
                      />
                      <div className="absolute bottom-3 left-3 bg-surface-container/90 px-3 py-1 rounded-lg">
                        <p className="font-label-sm text-label-sm text-on-surface font-medium">
                          Bolsa Totême Piel Tostada
                        </p>
                      </div>
                    </div>

                    {/* Bottom Live Moodboard Layer */}
                    <div className="rounded-xl p-space-md bg-surface-container-low shadow-sm flex flex-col justify-between h-[160px]">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                          Cromática Curada
                        </span>
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          palette
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="h-8 rounded bg-[#D8C7B5] shadow-inner" title="Lino Natural"></div>
                        <div className="h-8 rounded bg-[#B35C41] shadow-inner" title="Terracota Atelier"></div>
                        <div className="h-8 rounded bg-[#3A332C] shadow-inner" title="Espresso Profundo"></div>
                        <div className="h-8 rounded bg-[#8A9584] shadow-inner" title="Salvia Silvestre"></div>
                      </div>
                      <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                        <span>Régimen Otoño / Invierno</span>
                        <span className="font-title-md text-on-surface text-[12px]">82 Combinaciones</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlapping Archival Card */}
                <div className="hidden sm:flex absolute -bottom-6 -left-8 bg-surface-container-lowest p-space-md rounded-xl shadow-xl items-center gap-space-md max-w-xs z-20">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <p className="font-title-md text-title-md text-on-surface leading-tight">
                      Índice de Versatilidad
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      4.8 / 5.0 en rotación de cápsula
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Section 2: Los Tres Pilares del Atelier */}
          <section className="w-full px-gutter lg:px-margin py-space-xl" id="pilares">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                  Metodología de Haute Curaduría
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface mt-1">
                  Los Tres Pilares del Atelier
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-4 md:mt-0">
                Diseñado bajo los más rigurosos estándares de conservación textil y estilismo de
                pasarela.
              </p>
            </div>

            {/* Editorial Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Pilar 01 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-surface-container">
                  <img
                    alt="Pilar 1: Armario Digital"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-rwfy4YSpUFv06ZHgIYV-4q57RTrFtY8wmdVH9h0nCiL6P81DDXh0lJP9JrhpgwWWoyvKXhjMoGcoOBCCJYxFnL5Ekt5hXCiKclcBU0w3pOj2wciHsFqh5rDQ_JEPN1FXwbkEQnOAfaIRjOHA_-5HO7mIK8czOFAAt8G1L7PfjcX_YJul2zN9x7Ktv6sNT77CZ9sFj9hysKuwXgaZSAq1_lIWPTp__cazeJNJMvY"
                  />
                  <span className="absolute top-4 left-4 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded">
                    01
                  </span>
                  <div className="absolute bottom-3 right-3 bg-surface/90 px-3 py-1 rounded-md text-on-surface font-label-sm text-label-sm">
                    Inventario &amp; CPW
                  </div>
                </div>
                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                      Mi Armario Digital
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Catalogación fotográfica profesional en alta resolución, trazabilidad de
                      procedencia, fichas técnicas de cuidado textil y cálculo en tiempo real del
                      coste por puesta amortizado.
                    </p>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between border-t border-surface-container-high/40">
                    <Link
                      to="/prendas"
                      className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Abrir Archivo</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      photo_camera
                    </span>
                  </div>
                </div>
              </article>

              {/* Pilar 02 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-surface-container">
                  <img
                    alt="Pilar 2: Lookbook & Canvas"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrLYpcoyC7E5n0gnc9fiOkB1L_Sjp9JMwdtB9pZ6O1gSCN4X3-UcM2gdmWWqpL3EXcwg4M-v-duwarLeCg1bUNwEC2GgPzmmlDeJGQ6mkSP7qh3IMRnPrIbnv-nhB85zjxQlZynwPoncJftwv_w3qmRWWJHgycx6RTgZjf9vRVgwByh8SFYLk15yWBPZWb0eZGqcS0b9GZsaED74bj13bUlIivWUpxpfQZGmOP73U"
                  />
                  <span className="absolute top-4 left-4 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded">
                    02
                  </span>
                  <div className="absolute bottom-3 right-3 bg-surface/90 px-3 py-1 rounded-md text-on-surface font-label-sm text-label-sm">
                    Colorimetría &amp; Canvas
                  </div>
                </div>
                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                      Lookbook &amp; Canvas
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Constructor de outfits interactivo por capas con motor de validación cromática
                      instantánea. Agende sus propuestas para viajes, compromisos sociales o semanas
                      ejecutivas de alta visibilidad.
                    </p>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between border-t border-surface-container-high/40">
                    <Link
                      to="/outfits"
                      className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Ver Outfits</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      layers
                    </span>
                  </div>
                </div>
              </article>

              {/* Pilar 03 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-surface-container">
                  <img
                    alt="Pilar 3: Consultoría Residencial"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsRR0QmXP2WCwj-VaGm5BRPcVzBjgZkVl8d3XbOCC9ubwuZHgM_5Vgu87EJH2Qerng3R-lLuFFW1sStemEuxFaWuRmTnjnoqmxhBIFh1WMUCLCtE016iU398768iygOdcJyvnNKPAXJaSDv8a2yVbJx22Ij5UiH3HlYbopMo4FgO3sdJKKUU_SW1PHE188lP4C5dse5XwlWjeyNw2bXIucWPor4PGXjiBnDuRiuh0"
                  />
                  <span className="absolute top-4 left-4 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded">
                    03
                  </span>
                  <div className="absolute bottom-3 right-3 bg-surface/90 px-3 py-1 rounded-md text-on-surface font-label-sm text-label-sm">
                    Atelier 1 a 1
                  </div>
                </div>
                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                      Consultoría Residencial
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Sesiones privadas 1 a 1 por videollamada cifrada con historiadores de moda,
                      estilistas editoriales y curadores. Reciba un dossier semestral personalizado
                      con prescripción de compras estratégicas.
                    </p>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between border-t border-surface-container-high/40">
                    <Link
                      to="/asesoria-vip"
                      className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Reservar Cita</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      video_camera_front
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* 5. Section 3: Métricas y Filosofía "Quiet Luxury" */}
          <section className="w-full bg-surface-container-low py-space-xl px-gutter lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              {/* Data Visualization & Metrics Bento */}
              <div className="lg:col-span-6 space-y-space-md">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                  El Manifiesto de la Moderación Elegante
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">
                  Menos piezas,<br />
                  <span className="italic font-normal">infinitas combinaciones.</span>
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  El verdadero lujo contemporáneo no radica en la saturación del vestidor, sino en la
                  serenidad de una colección rigurosamente seleccionada donde cada pieza conversa
                  fluidamente con las demás.
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-space-md pt-space-md">
                  <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm text-center">
                    <span className="font-headline-lg text-headline-lg text-primary font-serif block">
                      148
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mt-1">
                      Piezas Óptimas
                    </span>
                  </div>
                  <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm text-center">
                    <span className="font-headline-lg text-headline-lg text-secondary font-serif block">
                      -72%
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mt-1">
                      Compras Impulsivas
                    </span>
                  </div>
                  <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm text-center">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-serif block">
                      98%
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mt-1">
                      Coherencia Visual
                    </span>
                  </div>
                </div>

                {/* Archival Timeline Chart SVG Inline */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm mt-space-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">
                      Curva de Amortización • Colección Cápsula vs Fast Luxury
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-semibold">
                      +84% Longevidad
                    </span>
                  </div>
                  <svg
                    className="w-full h-20 text-primary"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 80"
                  >
                    <path
                      d="M0,70 C80,65 140,50 200,35 C260,20 340,15 400,10"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,70 C100,72 200,75 400,78"
                      stroke="#88726c"
                      strokeDasharray="4 4"
                      strokeWidth="1.5"
                    />
                    <circle cx="200" cy="35" fill="currentColor" r="4" />
                    <circle cx="400" cy="10" fill="currentColor" r="4" />
                  </svg>
                  <div className="flex justify-between text-outline font-label-sm text-label-sm mt-1">
                    <span>Mes 0 (Inventario)</span>
                    <span>Mes 12 (Rotación Óptima)</span>
                    <span>Mes 36 (Archivo Histórico)</span>
                  </div>
                </div>
              </div>

              {/* Editorial Quote Card */}
              <div className="lg:col-span-6">
                <div className="relative bg-surface-container-lowest p-space-xl rounded-2xl shadow-xl">
                  <span className="font-display-lg text-primary/20 text-7xl font-serif absolute top-6 left-6 leading-none select-none">
                    “
                  </span>
                  <div className="relative z-10 pt-4">
                    <blockquote className="font-headline-md text-headline-md text-on-surface font-serif leading-relaxed italic">
                      &quot;El guardarropa moderno debe respirar como una galería privada: curada con
                      devoción, desprovista de ruido y dispuesta a contar la historia más auténtica de
                      quien la habita.&quot;
                    </blockquote>
                    <div className="mt-space-lg flex items-center gap-space-md">
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm bg-surface-container">
                        <img
                          alt="Éléonore de Saint-Germain portrait"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgdb8NCxXkP6Yez8xw--towNN0Aw9xaN51vaaQuTQwRRGlZ4flupXdnlc4HQJ9Bf79GZgdFPY5xCNaaE0qAp4vGHZFAhQoSQT9-RcpX5j2Iac5rFl0ADQFPZ7xsggAbZGMAZSEWpXNAA1-AAYYOusgfX1KjyWjU0qOIChbzC-qZUWkfHrGVkWZOHFAwxOEUIRAQDH9EICgb9gtItlh1RHYx5e2EV87sloDPHVea_4"
                        />
                      </div>
                      <div>
                        <p className="font-title-md text-title-md text-on-surface">
                          Éléonore de Saint-Germain
                        </p>
                        <p className="font-body-sm text-body-sm text-primary uppercase tracking-widest font-medium">
                          Dirección Creativa • Vestiaire Studio París
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Section 4: Llamada a la Acción Final (CTA Welcome) */}
          <section className="w-full px-gutter lg:px-margin py-space-xl">
            <div className="relative w-full rounded-2xl bg-inverse-surface text-inverse-on-surface p-space-xl md:p-20 overflow-hidden shadow-2xl">
              {/* Decorative Background Shimmer */}
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute left-1/3 top-0 w-80 h-80 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl space-y-space-md">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-semibold">
                  Membresía por Selección
                </span>
                <h2 className="font-display-lg text-display-lg font-serif text-inverse-on-surface leading-tight">
                  Inicie su membresía privada en Vestiaire Studio.
                </h2>
                <p className="font-body-lg text-body-lg text-surface-variant max-w-xl">
                  Admisión sujeta a cupos mensuales para garantizar una atención minuciosa y
                  personalizada por parte de nuestro equipo de archivistas y curadores.
                </p>

                {/* CTA Buttons inside Card */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md pt-space-md">
                  <Link
                    to="/login?mode=register"
                    className="inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary transition-all duration-300 font-label-md text-label-md uppercase tracking-wider shadow-lg group cursor-pointer"
                    id="ctaRequestBtn"
                  >
                    <span>Registro</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      lock_open
                    </span>
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-space-lg py-space-md rounded-xl bg-inverse-surface hover:bg-surface/10 text-inverse-on-surface transition-all duration-300 font-label-md text-label-md uppercase tracking-wider cursor-pointer"
                    id="ctaLoginBtn"
                  >
                    <span>Iniciar Sesión • Socios</span>
                  </Link>
                </div>

                <div className="pt-space-md flex flex-wrap items-center gap-space-md text-surface-dim font-body-sm text-body-sm">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                      verified
                    </span>{' '}
                    Cifrado de Bóveda Bancaria
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                      diamond
                    </span>{' '}
                    Valuación Pericial Homologada
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 7. Footer */}
      <WelcomeFooter />
    </div>
  );
}
