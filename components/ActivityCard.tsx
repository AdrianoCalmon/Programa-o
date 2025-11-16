import React from 'react';
import type { Activity } from '../types';
import { DAY_OPTIONS } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onDelete: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const getPeriodOfDay = (time: string): string => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour >= 5 && hour < 12) {
    return 'manhã';
  } else if (hour >= 12 && hour < 18) {
    return 'tarde';
  } else {
    return 'noite';
  }
};


export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onDelete, onSelect, isSelected }) => {
  const period = getPeriodOfDay(activity.time);
  const dayLabel = DAY_OPTIONS.find(d => d.value === activity.day)?.label || '';

  const cardClasses = `
    relative group bg-white rounded-lg shadow-md overflow-hidden 
    transform transition-all duration-200 hover:scale-105 cursor-pointer
    flex flex-col
    ${isSelected ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
  `;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique acione o onSelect do card
    onDelete();
  };

  return (
    <div className={cardClasses} onClick={onSelect}>
      <img src={activity.imageUrl} alt={activity.location} className="w-full h-36 object-cover" />
      <div className="p-2 flex-grow flex flex-col">
        <div>
            <p className="text-base font-semibold text-indigo-600 tracking-wider mb-1">{dayLabel}</p>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-bold text-gray-800 text-base">{activity.time}</p>
                <span className="text-sm text-gray-500 italic">({period})</span>
            </div>
            {activity.group && (
              <p className="text-gray-700 text-sm font-bold mb-1" title={activity.group}>
                {activity.group}
              </p>
            )}
            <p className="text-gray-600 text-sm line-clamp-2" title={activity.location}>{activity.location}</p>
            <p className="text-gray-500 text-sm italic truncate mt-1" title={activity.leader}>{activity.leader || ' '}</p>
        </div>
      </div>
       <button
        onClick={handleDeleteClick}
        className="absolute top-1 right-1 bg-white/70 rounded-full p-0.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-700"
        aria-label="Remover atividade"
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};