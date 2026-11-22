import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import NewPrendaModal from '../prendas/NewPrendaModal';
import { PRENDAS_MOCK } from '../../mocks/prendasData';
import {
  getPrendasApi,
  createPrendaApi,
  updatePrendaApi,
  deletePrendaApi,
} from '../../api/prendas';
import { useAuth } from '../../context/useAuth';

export default function AppLayout() {
  const { isAuthenticated, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPrendaModalOpen, setIsNewPrendaModalOpen] = useState(false);
  const [prendas, setPrendas] = useState(PRENDAS_MOCK);
  const [selectedPrendaId, setSelectedPrendaId] = useState(() => PRENDAS_MOCK[0]?.id || 1);
  const [isLoadingPrendas] = useState(false);

  // Fetch prendas from backend using Axios
  const fetchPrendas = useCallback(async () => {
    if (!token) return;
    try {
      const serverPrendas = await getPrendasApi();
      if (serverPrendas && serverPrendas.length > 0) {
        setPrendas(serverPrendas);
        setSelectedPrendaId(serverPrendas[0].id);
      }
    } catch (err) {
      console.warn('No se pudieron sincronizar las prendas del servidor, usando catálogo local:', err);
    }
  }, [token]);

  useEffect(() => {
    let ignore = false;
    if (isAuthenticated && token) {
      getPrendasApi()
        .then((serverPrendas) => {
          if (!ignore && serverPrendas && serverPrendas.length > 0) {
            setPrendas(serverPrendas);
            setSelectedPrendaId(serverPrendas[0].id);
          }
        })
        .catch((err) => {
          console.warn('No se pudieron sincronizar las prendas del servidor:', err);
        });
    }
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, token]);

  // Add new prenda via Axios
  const handleAddNewPrenda = async (prendaData, file = null) => {
    try {
      let payload;
      if (file) {
        payload = new FormData();
        payload.append('foto', file);
        payload.append('nombre', prendaData.nombre || prendaData.title);
        payload.append('tipoPrenda', prendaData.tipoPrenda || 'superior');
        if (prendaData.color) payload.append('color', prendaData.color);
        if (prendaData.temporada) payload.append('temporada', prendaData.temporada);
        const notas = prendaData.notasAdicionales || {
          brand: prendaData.brand,
          category: prendaData.category,
          size: prendaData.size,
          wearCount: 0,
          isFavorite: false,
          status: 'Sin estrenar',
        };
        payload.append('notasAdicionales', JSON.stringify(notas));
      } else {
        payload = {
          nombre: prendaData.nombre || prendaData.title,
          tipoPrenda: prendaData.tipoPrenda || 'superior',
          color: prendaData.color || prendaData.palette || 'Tierra & Neutros',
          temporada: prendaData.temporada || prendaData.season || 'Otoño/Invierno',
          fotoUrl: prendaData.fotoUrl || prendaData.image,
          notasAdicionales: prendaData.notasAdicionales || {
            brand: prendaData.brand,
            category: prendaData.category,
            size: prendaData.size,
            wearCount: 0,
            isFavorite: false,
            status: 'Sin estrenar',
          },
        };
      }

      const created = await createPrendaApi(payload);
      setPrendas((prev) => [created, ...prev]);
      setSelectedPrendaId(created.id);
      return created;
    } catch (err) {
      console.error('Error al guardar prenda en el servidor con Axios:', err);
      // Fallback local addition if network issue
      const localFallback = {
        ...prendaData,
        id: prendaData.id || `local-${Date.now()}`,
      };
      setPrendas((prev) => [localFallback, ...prev]);
      setSelectedPrendaId(localFallback.id);
      return localFallback;
    }
  };

  // Update prenda via Axios
  const handleUpdatePrenda = async (id, updateDto) => {
    try {
      const updated = await updatePrendaApi(id, updateDto);
      setPrendas((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      return updated;
    } catch (err) {
      console.warn('Actualización local de prenda:', err);
      setPrendas((prev) => prev.map((p) => (p.id === id ? { ...p, ...updateDto } : p)));
    }
  };

  // Delete prenda via Axios
  const handleDeletePrenda = async (id) => {
    try {
      await deletePrendaApi(id);
    } catch (err) {
      console.warn('Eliminación local de prenda:', err);
    }
    setPrendas((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (selectedPrendaId === id && filtered.length > 0) {
        setSelectedPrendaId(filtered[0].id);
      }
      return filtered;
    });
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      <Header
        onOpenNewPrenda={() => setIsNewPrendaModalOpen(true)}
      />
      <Sidebar />
      <div className="pl-64">
        <main className="relative pt-20 w-full min-h-screen bg-surface">
          <Outlet
            context={{
              searchTerm,
              setSearchTerm,
              onOpenNewPrenda: () => setIsNewPrendaModalOpen(true),
              prendas,
              setPrendas,
              selectedPrendaId,
              setSelectedPrendaId,
              handleAddNewPrenda,
              handleUpdatePrenda,
              handleDeletePrenda,
              isLoadingPrendas,
              reloadPrendas: fetchPrendas,
            }}
          />
        </main>
      </div>

      {isNewPrendaModalOpen && (
        <NewPrendaModal
          isOpen={isNewPrendaModalOpen}
          onClose={() => setIsNewPrendaModalOpen(false)}
          onSave={handleAddNewPrenda}
        />
      )}
    </div>
  );
}
