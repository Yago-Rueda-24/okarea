import { Routes, Route, useLocation } from 'react-router-dom'
import Welcome from './routes/Welcome'
import Trabajando from './routes/Trabajando'
import Navbar from './components/Navbar'
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
        <Route path="/bolsos" element={<Articulos />} />
        <Route path="/producto" element={<ProductInfo />} />
        <Route path="/producto/:id" element={<ProductInfo />} />
        <Route path="/product-info" element={<ProductInfo />} />
        <Route path="/product-info/:id" element={<ProductInfo />} />
        <Route path="/calzado" element={<Trabajando />} />
        <Route path="/ropa" element={<Trabajando />} />
        <Route path="/accesorios" element={<Trabajando />} />
      </Routes>
    </div>
  )
}

export default App

