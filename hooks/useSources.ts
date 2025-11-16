import { useState, useEffect, useCallback } from 'react';
import type { SourceLocation } from '../types';

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value;
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

export const useSources = () => {
  const [locations, setLocations] = useLocalStorage<SourceLocation[]>('source_locations', []);
  const [leaders, setLeaders] = useLocalStorage<string[]>('source_leaders', initialLeaders);
  const [groups, setGroups] = useLocalStorage<string[]>('source_groups', []);

  const addLocation = useCallback((name: string, imageUrl: string) => {
    if (name.trim() === '' || locations.some(l => l.name.toLowerCase() === name.toLowerCase())) {
        alert('Nome do local inválido ou já existente.');
        return;
    }
    const newLocation: SourceLocation = {
      id: `${Date.now()}`,
      name,
      imageUrl,
    };
    setLocations([...locations, newLocation]);
  }, [locations, setLocations]);

  const removeLocation = useCallback((id: string) => {
    setLocations(locations.filter(location => location.id !== id));
  }, [locations, setLocations]);

  const addLeader = useCallback((name: string) => {
    if (name.trim() === '' || leaders.some(l => l.toLowerCase() === name.toLowerCase())) {
        alert('Nome do dirigente inválido ou já existente.');
        return;
    }
    setLeaders([...leaders, name].sort());
  }, [leaders, setLeaders]);

  const removeLeader = useCallback((name: string) => {
    setLeaders(leaders.filter(leader => leader !== name));
  }, [leaders, setLeaders]);

  const addGroup = useCallback((name: string) => {
     if (name.trim() === '' || groups.some(g => g.toLowerCase() === name.toLowerCase())) {
        alert('Nome do grupo inválido ou já existente.');
        return;
    }
    setGroups([...groups, name].sort());
  }, [groups, setGroups]);

  const removeGroup = useCallback((name: string) => {
    setGroups(groups.filter(group => group !== name));
  }, [groups, setGroups]);

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