import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import NewPrendaModal from '../prendas/NewPrendaModal';
import { PRENDAS_MOCK } from '../../mocks/prendasData';

export default function AppLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPrendaModalOpen, setIsNewPrendaModalOpen] = useState(false);
  const [prendas, setPrendas] = useState(PRENDAS_MOCK);
  const [selectedPrendaId, setSelectedPrendaId] = useState(1);

  const handleAddNewPrenda = (newPrenda) => {
    setPrendas((prev) => [newPrenda, ...prev]);
    setSelectedPrendaId(newPrenda.id);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      <Header
        onOpenNewPrenda={() => setIsNewPrendaModalOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
            }}
          />
        </main>
      </div>

      <NewPrendaModal
        isOpen={isNewPrendaModalOpen}
        onClose={() => setIsNewPrendaModalOpen(false)}
        onSave={handleAddNewPrenda}
      />
    </div>
  );
}
