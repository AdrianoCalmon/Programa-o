import React from 'react';
import type { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface SchedulePreviewProps {
  schedule: Activity[];
  weekString: string;
  onDeleteActivity: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  editingActivityId: string | null;
}

export const SchedulePreview: React.FC<SchedulePreviewProps> = ({ schedule, weekString, onDeleteActivity, onSelectActivity, editingActivityId }) => {

  return (
    <div
      id="schedule-preview"
      className="bg-white p-6 rounded-md shadow-2xl w-full max-w-3xl flex flex-col aspect-[210/297]"
    >
      <div className="bg-gray-800 text-white text-center py-8 mb-6 rounded-t-md -mt-6 -mx-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold tracking-widest uppercase">PROGRAMAÇÃO DE CAMPO</h1>
        <h2 className="text-xl font-normal text-gray-300 mt-2">{weekString}</h2>
      </div>
      {schedule.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 flex-grow h-full">
          {schedule.slice(0, 9).map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDelete={() => onDeleteActivity(activity.id)}
              onSelect={() => onSelectActivity(activity)}
              isSelected={activity.id === editingActivityId}
            />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-center bg-gray-50/50 p-4 rounded-lg border-2 border-dashed border-gray-200 h-full">
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" />
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 3v4M7 3v4" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-800">Sua agenda está vazia</h3>
            <p className="mt-1 text-sm text-gray-500">
              Adicione uma atividade no painel para começar a planejar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};