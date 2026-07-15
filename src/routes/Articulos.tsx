import ItemGrid, { type GridItem } from '../components/ItemGrid';
import ropa1 from '../assets/ropa/ropa1.png';
import ropa2 from '../assets/ropa/ropa2.png';
import ropa3 from '../assets/ropa/ropa3.png';
import ropa4 from '../assets/ropa/ropa4.png';

const clothingItems: GridItem[] = [
  { src: ropa1, title: 'Camisa Lino Premium', price: '49,90 €' },
  { src: ropa2, title: 'Jersey Lana Ivory', price: '69,90 €' },
  { src: ropa3, title: 'Gabardina Clásica', price: '129,00 €' },
  { src: ropa4, title: 'Pantalón Lino Oliva', price: '59,90 €' },
];

export default function Articulos() {
  return (
    <div className="min-h-screen bg-[#FEEBE7] font-sans text-[#654321]">
      <ItemGrid title="Colección Bolsos" items={clothingItems} />
    </div>
  );
}
