import { useState, useMemo } from 'react';

const getMonday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

const formatDate = (d: Date, options: Intl.DateTimeFormatOptions): string => {
  return d.toLocaleDateString('pt-BR', options);
};

export const useWeekNavigator = (initialDate: Date = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const weekData = useMemo(() => {
    const monday = getMonday(currentDate);
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDates.push(day);
    }
    const sunday = weekDates[6];

    const startDay = monday.getDate();
    const endDay = sunday.getDate();
    const startMonth = formatDate(monday, { month: 'long' });
    const endMonth = formatDate(sunday, { month: 'long' });

    const weekString = startMonth === endMonth 
      ? `Semana ${startDay}-${endDay} de ${startMonth}`
      : `Semana ${startDay} de ${startMonth} - ${endDay} de ${endMonth}`;
      
    const dayName = formatDate(monday, { weekday: 'long' });

    return { weekDates, weekString, dayName };
  }, [currentDate]);

  const goToNextWeek = () => {
    setCurrentDate(prevDate => {
      const nextWeek = new Date(prevDate);
      nextWeek.setDate(prevDate.getDate() + 7);
      return nextWeek;
    });
  };

  const goToPrevWeek = () => {
    setCurrentDate(prevDate => {
      const prevWeek = new Date(prevDate);
      prevWeek.setDate(prevDate.getDate() - 7);
      return prevWeek;
    });
  };

  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  return {
    ...weekData,
    goToNextWeek,
    goToPrevWeek,
    goToCurrentWeek,
  };
};