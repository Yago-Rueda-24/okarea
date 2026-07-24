import { Routes, Route, useLocation } from 'react-router-dom';
import Welcome from './routes/Welcome';
import Navbar from './components/Navbar';
import Articulos from './routes/Articulos';
import ProductInfo from './routes/ProductInfo';

function App() {
  const location = useLocation();
  const isTransparent = location.pathname === '/';

  return (
    <div className="relative">
      <Navbar transparent={isTransparent} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/bolsos" element={<Articulos categoria="bolsos" title="Colección Bolsos" />} />
        <Route path="/calzado" element={<Articulos categoria="calzado" title="Colección Calzado" />} />
        <Route path="/ropa" element={<Articulos categoria="ropa" title="Colección Ropa" />} />
        <Route path="/accesorios" element={<Articulos categoria="accesorios" title="Colección Accesorios" />} />
        <Route path="/articulos" element={<Articulos />} />
        <Route path="/producto" element={<ProductInfo />} />
        <Route path="/producto/:id" element={<ProductInfo />} />
        <Route path="/product-info" element={<ProductInfo />} />
        <Route path="/product-info/:id" element={<ProductInfo />} />
      </Routes>
    </div>
  );
}

export default App;
