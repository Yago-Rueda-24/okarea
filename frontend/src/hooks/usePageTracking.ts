import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export function usePageTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;

    if (lastTrackedPath.current === currentPath) {
      return;
    }

    lastTrackedPath.current = currentPath;

    const trackVisit = async () => {
      try {
        await fetch(`${API_BASE_URL}/visits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: currentPath }),
        });
      } catch (error) {
        // Ignorar fallos de red en analítica silenciosamente
      }
    };

    trackVisit();
  }, [location.pathname]);
}
