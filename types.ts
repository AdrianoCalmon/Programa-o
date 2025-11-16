
export interface Activity {
  id: string;
  day: DayOfWeek;
  time: string;
  location: string;
  leader: string;
  imageUrl: string;
  group?: string;
}

export interface SourceLocation {
  id: string;
  name: string;
  imageUrl: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday',label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' },
];

export const DAY_INDEX_MAP: Record<DayOfWeek, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};


export type Schedule = Record<DayOfWeek, Activity[]>;