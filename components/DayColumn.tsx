import React from 'react';
import type { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface DayColumnProps {
  activities: Activity[];
  dayName: string;
  onDeleteActivity: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  editingActivityId: string | null;
}

export const DayColumn: React.FC<DayColumnProps> = ({ activities, dayName, onDeleteActivity, onSelectActivity, editingActivityId }) => {
  const sortedActivities = [...activities].sort((a, b) => a.time.localeCompare(b.time));
  
  return (
    <div className="bg-gray-50/50 p-2 rounded-lg flex flex-col border border-gray-200 min-h-[200px]">
      <h3 className="font-semibold text-center text-sm text-gray-700 mb-2">{dayName}</h3>
      <div className="grid grid-cols-1 gap-2 auto-rows-max flex-grow">
        {sortedActivities.length > 0 ? (
          sortedActivities.map(activity => (
            <ActivityCard 
              key={activity.id}
              activity={activity} 
              onDelete={() => onDeleteActivity(activity.id)}
              onSelect={() => onSelectActivity(activity)}
              isSelected={activity.id === editingActivityId}
            />
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-center text-gray-400 text-xs py-10 border-2 border-dashed rounded-lg bg-white">
            Nenhuma atividade
          </div>
        )}
      </div>
    </div>
  );
};
