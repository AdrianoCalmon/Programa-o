import React, { useState, useCallback } from 'react';
import { Controls } from './components/Controls';
import { SchedulePreview } from './components/SchedulePreview';
import { useWeekNavigator } from './hooks/useWeekNavigator';
import { useSources } from './hooks/useSources';
import { SourcesModal } from './components/SourcesModal';
import type { Activity, DayOfWeek } from './types';
import { DAY_INDEX_MAP } from './types';

declare const html2canvas: any;

const sortActivities = (activities: Activity[]) => {
  return [...activities].sort((a, b) => {
    const dayComparison = DAY_INDEX_MAP[a.day] - DAY_INDEX_MAP[b.day];
    if (dayComparison !== 0) return dayComparison;
    return a.time.localeCompare(b.time);
  });
};

const App: React.FC = () => {
  const [schedule, setSchedule] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const { weekString, goToNextWeek, goToPrevWeek, goToCurrentWeek } = useWeekNavigator();
  const [isSharing, setIsSharing] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const sources = useSources();

  const handleAddActivity = (day: DayOfWeek, time: string, location: string, leader: string, group?: string) => {
    const existingLocation = sources.locations.find(l => l.name === location);
    const imageUrl = existingLocation
      ? existingLocation.imageUrl
      : `https://picsum.photos/seed/${Math.random()}/400/300`;

    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      day,
      time,
      location,
      leader,
      group,
      imageUrl,
    };
    setSchedule(prevSchedule => sortActivities([...prevSchedule, newActivity]));
  };
  
  const handleDeleteActivity = (activityId: string) => {
    setSchedule(prevSchedule => prevSchedule.filter(activity => activity.id !== activityId));
    if (editingActivity?.id === activityId) {
      setEditingActivity(null);
    }
  };

  const handleSelectActivityForEdit = (activity: Activity) => {
    setEditingActivity(activity);
  };

  const handleUpdateActivity = (day: DayOfWeek, time: string, location: string, leader: string, group?: string) => {
    if (!editingActivity) return;

    let imageUrl = editingActivity.imageUrl;
    if (location !== editingActivity.location) {
        const existingLocation = sources.locations.find(l => l.name === location);
        imageUrl = existingLocation
            ? existingLocation.imageUrl
            : `https://picsum.photos/seed/${Math.random()}/400/300`;
    }

    const updatedActivity: Activity = {
      ...editingActivity,
      day,
      time,
      location,
      leader,
      group,
      imageUrl,
    };
    
    setSchedule(prevSchedule => {
      const updatedActivities = prevSchedule
        .map(act => (act.id === editingActivity.id ? updatedActivity : act));
      return sortActivities(updatedActivities);
    });

    setEditingActivity(null);
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
  };

  const handleDownloadImage = useCallback(() => {
    const scheduleElement = document.getElementById('schedule-preview');
    if (scheduleElement && typeof html2canvas !== 'undefined') {
      html2canvas(scheduleElement, { 
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `programacao-${weekString.replace(/\s/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    } else {
      console.error('Elemento da agenda não encontrado ou html2canvas não carregado.');
      alert('Não foi possível gerar a imagem. Tente novamente.');
    }
  }, [weekString]);
  
  const handleShareImage = useCallback(async () => {
    if (!navigator.share) {
      alert('Seu navegador não suporta a função de compartilhamento.');
      return;
    }
    
    const scheduleElement = document.getElementById('schedule-preview');
    if (!scheduleElement || typeof html2canvas === 'undefined') {
      console.error('Elemento da agenda não encontrado ou html2canvas não carregado.');
      alert('Não foi possível gerar a imagem para compartilhamento. Tente novamente.');
      return;
    }

    setIsSharing(true);
    try {
      const canvas = await html2canvas(scheduleElement, { 
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Falha ao criar a imagem. Tente novamente.');
          setIsSharing(false);
          return;
        }

        const file = new File([blob], `programacao-${weekString.replace(/\s/g, '-')}.png`, { type: 'image/png' });
        const shareData = {
          files: [file],
          title: 'Programação da Semana',
          text: `Confira a programação para a ${weekString}`,
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            console.log('Compartilhamento cancelado ou falhou', err);
          }
        } else {
          alert('Não é possível compartilhar esta imagem neste dispositivo.');
        }
        setIsSharing(false);
      }, 'image/png');

    } catch (error) {
      console.error('Erro ao gerar imagem com html2canvas:', error);
      alert('Ocorreu um erro ao gerar a imagem para compartilhamento.');
      setIsSharing(false);
    }
  }, [weekString]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {isSourcesModalOpen && (
        <SourcesModal
          onClose={() => setIsSourcesModalOpen(false)}
          // FIX: Pass props explicitly to match the expected prop names in SourcesModalProps.
          // The `useSources` hook returns handlers like `addLocation`, while `SourcesModal`
          // expects `onAddLocation`, causing a type mismatch when using object spread.
          locations={sources.locations}
          leaders={sources.leaders}
          groups={sources.groups}
          onAddLocation={sources.addLocation}
          onRemoveLocation={sources.removeLocation}
          onAddLeader={sources.addLeader}
          onRemoveLeader={sources.removeLeader}
          onAddGroup={sources.addGroup}
          onRemoveGroup={sources.removeGroup}
        />
      )}
      <main className="flex flex-col md:flex-row">
        <Controls
          weekString={weekString}
          onPrevWeek={goToPrevWeek}
          onNextWeek={goToNextWeek}
          onCurrentWeek={goToCurrentWeek}
          onAddActivity={handleAddActivity}
          onUpdateActivity={handleUpdateActivity}
          onCancelEdit={handleCancelEdit}
          onDownloadImage={handleDownloadImage}
          editingActivity={editingActivity}
          onShareImage={handleShareImage}
          isSharing={isSharing}
          onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
          locations={sources.locations}
          leaders={sources.leaders}
          groups={sources.groups}
        />
        <div className="flex-1 p-4 md:p-8 bg-gray-200 flex items-center justify-center">
          <SchedulePreview 
            schedule={schedule}
            weekString={weekString}
            onDeleteActivity={handleDeleteActivity}
            onSelectActivity={handleSelectActivityForEdit}
            editingActivityId={editingActivity?.id || null}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
