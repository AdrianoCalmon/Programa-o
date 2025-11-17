import React, { useState, useEffect } from 'react';
import type { Activity, DayOfWeek, SourceLocation } from '../types';
import { DAY_OPTIONS } from '../types';

interface ControlsProps {
  weekString: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onDownloadImage: () => void;
  onAddActivity: (day: DayOfWeek, time: string, location: string, leader: string, group?: string) => void;
  onUpdateActivity: (day: DayOfWeek, time: string, location: string, leader: string, group?: string) => void;
  onCancelEdit: () => void;
  editingActivity: Activity | null;
  onShareImage: () => void;
  isSharing: boolean;
  onOpenSourcesModal: () => void;
  locations: SourceLocation[];
  leaders: string[];
  groups: string[];
  onReset: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const ArrowUpTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const START_HOUR = 6;
const END_HOUR = 20;
const SLOTS_PER_HOUR = 4;
const START_SLOT_INDEX = START_HOUR * SLOTS_PER_HOUR;
const END_SLOT_INDEX = END_HOUR * SLOTS_PER_HOUR;
const NUM_SLOTS = END_SLOT_INDEX - START_SLOT_INDEX + 1;

const timeSlots = Array.from({ length: NUM_SLOTS }, (_, i) => {
  const slotIndex = START_SLOT_INDEX + i;
  const hours = Math.floor(slotIndex / SLOTS_PER_HOUR);
  const minutes = (slotIndex % SLOTS_PER_HOUR) * 15;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});


export const Controls: React.FC<ControlsProps> = ({ 
  weekString, 
  onPrevWeek, 
  onNextWeek, 
  onCurrentWeek, 
  onDownloadImage, 
  onAddActivity,
  onUpdateActivity,
  onCancelEdit,
  editingActivity,
  onShareImage,
  isSharing,
  onOpenSourcesModal,
  locations,
  leaders,
  groups,
  onReset,
}) => {
  const [day, setDay] = useState<DayOfWeek>('monday');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [leader, setLeader] = useState('');
  const [showGroupSelect, setShowGroupSelect] = useState(false);
  const [group, setGroup] = useState('');
  
  const isEditing = !!editingActivity;

  useEffect(() => {
    if (isEditing) {
      setDay(editingActivity.day);
      setTime(editingActivity.time);
      setLocation(editingActivity.location);
      setLeader(editingActivity.leader);
      if (editingActivity.group) {
        setShowGroupSelect(true);
        setGroup(editingActivity.group);
      } else {
        setShowGroupSelect(false);
        setGroup('');
      }
    } else {
      // Reset form when not editing or when edit is cancelled
      setDay('monday');
      setTime('09:00');
      setLocation('');
      setLeader('');
      setShowGroupSelect(false);
      setGroup('');
    }
  }, [editingActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      const groupToSend = showGroupSelect ? group : undefined;
      if (isEditing) {
        onUpdateActivity(day, time, location, leader, groupToSend);
      } else {
        onAddActivity(day, time, location, leader, groupToSend);
      }
    }
  };
  
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="w-full md:w-80 lg:w-96 p-4 bg-gray-50 md:h-screen md:sticky top-0 flex flex-col space-y-4 border-r border-gray-200">
      
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="font-semibold text-lg text-indigo-600 text-center mb-3">{weekString}</p>
        <div className="flex justify-center items-center space-x-2">
          <button onClick={onPrevWeek} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Semana anterior">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button onClick={onCurrentWeek} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-semibold" aria-label="Semana atual">
            Hoje
          </button>
          <button onClick={onNextWeek} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Próxima semana">
            <ArrowRightIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow flex-grow flex flex-col">
        {isEditing && (
          <h2 className="text-lg font-bold text-gray-800 mb-3">Editar Atividade</h2>
        )}
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">Dia</label>
              <select
                id="day"
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              >
                {DAY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Local</label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              disabled={locations.length === 0}
            >
              {locations.length > 0 ? (
                <>
                  <option value="">Selecione um local</option>
                  {locations.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
                </>
              ) : (
                <option value="">Adicione locais em 'Fontes'</option>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="group-toggle"
                type="checkbox"
                checked={showGroupSelect}
                onChange={(e) => {
                  setShowGroupSelect(e.target.checked);
                  if (!e.target.checked) {
                    setGroup('');
                  } else if (!group && groups.length > 0) {
                    setGroup(groups[0]);
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="group-toggle" className="ml-2 block text-sm font-medium text-gray-700">
                Grupo
              </label>
            </div>
            {showGroupSelect && (
              <div>
                <label htmlFor="group" className="sr-only">Selecionar Grupo</label>
                <select
                  id="group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  disabled={groups.length === 0}
                >
                  {groups.length > 0 ? groups.map(option => (
                    <option key={option} value={option}>{option}</option>
                  )) : (
                    <option>Adicione grupos em 'Fontes'</option>
                  )}
                </select>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="leader" className="block text-sm font-medium text-gray-700 mb-1">Dirigente</label>
             <select
              id="leader"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
            >
              <option value="">Opcional</option>
              {leaders.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          {isEditing && (
            <button type="button" onClick={onCancelEdit} className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors font-semibold">
              Cancelar
            </button>
          )}
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-semibold disabled:bg-indigo-300" disabled={!location.trim()}>
            {isEditing ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </form>
      
      <div className="pt-4 space-y-2">
         <button onClick={onDownloadImage} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors font-semibold">
           <ArrowDownTrayIcon className="w-5 h-5" />
           Baixar como Imagem
         </button>
         {canShare && (
            <button 
                onClick={onShareImage} 
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold disabled:bg-blue-300"
                disabled={isSharing}
            >
                {isSharing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Compartilhando...
                    </>
                ) : (
                    <>
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Compartilhar Imagem
                    </>
                )}
            </button>
         )}
         <button onClick={onOpenSourcesModal} className="w-full bg-gray-700 text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-semibold">
           Gerenciar Fontes
         </button>
         <button onClick={onReset} className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors font-semibold">
           Reiniciar
         </button>
      </div>
    </div>
  );
};