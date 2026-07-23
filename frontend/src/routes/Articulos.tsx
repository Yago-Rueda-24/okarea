import ItemGrid, { type GridItem } from '../components/ItemGrid';
import bolso2 from '../assets/bolsos/bolso2.webp';

const bagItems: GridItem[] = [
  {
    id: 'kenza-small-cow',
    src: bolso2,
    title: 'Kenza Small Cow',
    fabricante: 'oliviamareque'
  },
];

export default function Articulos() {
  return (
    <div className="min-h-screen bg-[#FEEBE7] font-sans text-[#654321]">
      <ItemGrid title="Colección Bolsos" items={bagItems} />
    </div>
  );
}
