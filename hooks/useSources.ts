
import { useState, useCallback } from 'react';
import type { SourceLocation } from '../types';

// Fix: Corrected useLocalStorage to handle functional updates.
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const initialLeaders = [
  'Adriano Calmon',
  'Atos',
  'Daniel',
  'Gabriel',
  'Gerfeson',
  'Gildeano',
  'Italo',
  'Jefferson',
  'Jonathan',
];

const initialGroups = [
  "Grupo Litoral",
  "Grupo Norte",
  "Todos os Grupos",
];

const initialLocations: SourceLocation[] = [
  {
    id: '4',
    name: 'Casa de Vitória',
    imageUrl: 'https://i.ibb.co/4RF4R9gt/Screenshot-20251116-173334-2.png',
  },
  {
    id: '1',
    name: 'Salão do Reino - Arthur Lundgren',
    imageUrl: 'https://i.ibb.co/DgW3sYC8/Screenshot-20251116-172839-2.png',
  },
  {
    id: '2',
    name: 'Salão do Reino - Beira Mar',
    imageUrl: 'https://i.ibb.co/Vc9hYZT8/Screenshot-20251116-172415-2.png',
  },
  {
    id: '3',
    name: 'Salão do Reino - Caetés',
    imageUrl: 'https://i.ibb.co/QLsjkh1/Screenshot-20251116-173041-2.png',
  },
  {
    id: '5',
    name: 'Salão do Reino - Central Abreu e Lima',
    imageUrl: 'https://i.ibb.co/CKQdKw8G/Screenshot-20251116-173133-2.png',
  },
  {
    id: '6',
    name: 'Salão do Reino - Janga',
    imageUrl: 'https://i.ibb.co/yFwDr7G7/Screenshot-20251116-172255-2.png',
  },
  {
    id: '7',
    name: 'Salão do Reino - Jardim Paulista',
    imageUrl: 'https://i.ibb.co/qMJtQFrQ/Screenshot-20251116-172947-2.png',
  },
  {
    id: '8',
    name: 'Salão do Reino - LS Paulista',
    imageUrl: 'https://i.ibb.co/5g4wYzmw/Screenshot-20251116-172752-2.png',
  },
  {
    id: '9',
    name: 'Salão do Reino - Maranguape I',
    imageUrl: 'https://i.ibb.co/8nTzRL5m/Screenshot-20251116-175107-2.png',
  },
  {
    id: '10',
    name: 'Salão do Reino - Norte Abreu e Lima',
    imageUrl: 'https://i.ibb.co/DSpzwv8/Screenshot-20251116-173220-2.png',
  },
  {
    id: '11',
    name: 'Salão do Reino - Pau Amarelo',
    imageUrl: 'https://i.ibb.co/vxfnFDCY/Screenshot-20251116-172446-2.png',
  },
  {
    id: '12',
    name: 'Salão do Reino - Riacho de Prata',
    imageUrl: 'https://i.ibb.co/d4vLzcPz/Screenshot-20251116-172524-2.png',
  },
  {
    id: '13',
    name: 'Zoom',
    imageUrl: 'https://i.ibb.co/Xk69mNbG/Screenshot-20251117-074457-2.jpg',
  },
].sort((a, b) => a.name.localeCompare(b.name));


// Fix: Implemented and exported the useSources hook, which was missing.
export const useSources = () => {
    const [locations, setLocations] = useLocalStorage<SourceLocation[]>('schedule_locations', initialLocations);
    const [leaders, setLeaders] = useLocalStorage<string[]>('schedule_leaders', initialLeaders);
    const [groups, setGroups] = useLocalStorage<string[]>('schedule_groups', initialGroups);

    const addLocation = useCallback((name: string, imageUrl: string) => {
        const newLocation: SourceLocation = {
            id: `${Date.now()}`,
            name,
            imageUrl,
        };
        setLocations(prev => [...prev, newLocation].sort((a, b) => a.name.localeCompare(b.name)));
    }, [setLocations]);

    const removeLocation = useCallback((id: string) => {
        setLocations(prev => prev.filter(loc => loc.id !== id));
    }, [setLocations]);

    const addLeader = useCallback((name: string) => {
        if (!name.trim() || leaders.includes(name.trim())) return;
        setLeaders(prev => [...prev, name.trim()].sort());
    }, [setLeaders, leaders]);

    const removeLeader = useCallback((name: string) => {
        setLeaders(prev => prev.filter(l => l !== name));
    }, [setLeaders]);

    const addGroup = useCallback((name: string) => {
        if (!name.trim() || groups.includes(name.trim())) return;
        setGroups(prev => [...prev, name.trim()].sort());
    }, [setGroups, groups]);

    const removeGroup = useCallback((name: string) => {
        setGroups(prev => prev.filter(g => g !== name));
    }, [setGroups]);

    return {
        locations,
        leaders,
        groups,
        addLocation,
        removeLocation,
        addLeader,
        removeLeader,
        addGroup,
        removeGroup,
    };
};