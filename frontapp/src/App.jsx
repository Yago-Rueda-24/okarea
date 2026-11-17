import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import PrendasPage from './pages/PrendasPage';
import OutfitsPage from './pages/OutfitsPage';
import AsesoriaVipPage from './pages/AsesoriaVipPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated Atelier App Layout */}
        <Route element={<AppLayout />}>
          <Route path="/prendas" element={<PrendasPage />} />
          <Route path="/outfits" element={<OutfitsPage />} />
          <Route path="/asesoria-vip" element={<AsesoriaVipPage />} />
          <Route
            path="/moodboards"
            element={
              <PlaceholderPage
                title="Moodboards &amp; Colecciones"
                description="Tableros de inspiración visual y paletas estacionales."
                icon="dashboard_customize"
              />
            }
          />
          <Route
            path="/maleta-capsula"
            element={
              <PlaceholderPage
                title="Cápsula &amp; Viaje"
                description="Planificación inteligente de maletas y selecciones esenciales para tus viajes."
                icon="luggage"
              />
            }
          />
          <Route
            path="/perfil"
            element={
              <PlaceholderPage
                title="Perfil &amp; Preferencias"
                description="Ajustes de cuenta, suscripción Maison Privée y medidas personales."
                icon="person"
              />
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
