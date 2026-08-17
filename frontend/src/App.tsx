import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import Welcome from './routes/Welcome';
import Navbar from './components/Navbar';
import Articulos from './routes/Articulos';
import ProductInfo from './routes/ProductInfo';
import Eventos from './routes/Eventos';
import Trabajando from './routes/Trabajando';
import Lugares from './routes/Lugares';
import NotFound from './routes/NotFound';
import { usePageTracking } from './hooks/usePageTracking';
import ChatWidget from './components/ChatWidget';

const setPathScroll = (path: string, scrollY: number) => {
  try {
    sessionStorage.setItem(`scroll_pos_${path}`, scrollY.toString());
  } catch (e) {}
};

const getPathScroll = (path: string): number => {
  try {
    const val = sessionStorage.getItem(`scroll_pos_${path}`);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
};

function ScrollRestorationManager() {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    const handleScroll = () => {
      setPathScroll(location.pathname, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (navType === 'POP') {
      const savedScroll = getPathScroll(location.pathname);
      const restore = () => {
        window.scrollTo(0, savedScroll);
      };
      restore();
      requestAnimationFrame(restore);
      const timer = setTimeout(restore, 50);
      return () => clearTimeout(timer);
    } else if (navType === 'PUSH') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navType]);

  return null;
}

function App() {
  usePageTracking();
  const location = useLocation();

  return (
    <div className="relative">
      <ScrollRestorationManager />
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/bolsos" element={<Articulos categoria="bolsos" title="Colección Bolsos" />} />
        <Route path="/calzado" element={<Articulos categoria="calzado" title="Colección Calzado" />} />
        <Route path="/ropa" element={<Articulos categoria="ropa" title="Colección Ropa" />} />
        <Route path="/accesorios" element={<Articulos categoria="accesorios" title="Colección Accesorios" />} />
        <Route path="/hombre" element={<Articulos categoria="hombre" title="Colección Hombre" />} />
        <Route path="/tiendas" element={<Articulos categoria="tiendas" title="Colección Tiendas" />} />
        <Route path="/artesanos" element={<Articulos categoria="artesanos" title="Colección Artesanos" />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/lugares" element={<Lugares />} />
        <Route path="/trabajando" element={<Trabajando />} />
        <Route path="/articulos" element={<Articulos />} />
        <Route path="/producto" element={<ProductInfo />} />
        <Route path="/producto/:id" element={<ProductInfo />} />
        <Route path="/product-info" element={<ProductInfo />} />
        <Route path="/product-info/:id" element={<ProductInfo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatWidget />
    </div>
  );
}

export default App;
