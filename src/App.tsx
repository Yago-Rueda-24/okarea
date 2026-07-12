import { Routes, Route, useLocation } from 'react-router-dom'
import Welcome from './routes/Welcome'
import Trabajando from './routes/Trabajando'
import Navbar from './components/Navbar'

function App() {
  const location = useLocation();
  const isTransparent = location.pathname === '/';

  return (
    <div className="relative">
      <Navbar transparent={isTransparent} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/bolsos" element={<Trabajando />} />
        <Route path="/calzado" element={<Trabajando />} />
        <Route path="/ropa" element={<Trabajando />} />
        <Route path="/accesorios" element={<Trabajando />} />
      </Routes>
    </div>
  )
}

export default App

