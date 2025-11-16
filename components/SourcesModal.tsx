import React, { useState } from 'react';
import type { SourceLocation } from '../types';

interface SourcesModalProps {
  onClose: () => void;
  locations: SourceLocation[];
  leaders: string[];
  groups: string[];
  onAddLocation: (name: string, imageUrl: string) => void;
  onRemoveLocation: (id: string) => void;
  onAddLeader: (name: string) => void;
  onRemoveLeader: (name: string) => void;
  onAddGroup: (name: string) => void;
  onRemoveGroup: (name: string) => void;
}

type Tab = 'locations' | 'leaders' | 'groups';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
  
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const SourcesModal: React.FC<SourcesModalProps> = ({
  onClose,
  locations, leaders, groups,
  onAddLocation, onRemoveLocation,
  onAddLeader, onRemoveLeader,
  onAddGroup, onRemoveGroup,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('locations');
  const [locationName, setLocationName] = useState('');
  const [locationImage, setLocationImage] = useState<File | null>(null);
  const [leaderName, setLeaderName] = useState('');
  const [groupName, setGroupName] = useState('');

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locationName.trim() && locationImage) {
      const imageUrl = await fileToBase64(locationImage);
      onAddLocation(locationName, imageUrl);
      setLocationName('');
      setLocationImage(null);
      (e.target as HTMLFormElement).reset(); // Reset file input
    } else {
        alert('Por favor, preencha o nome e selecione uma imagem.');
    }
  };

  const handleAddLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (leaderName.trim()) {
      onAddLeader(leaderName);
      setLeaderName('');
    }
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      onAddGroup(groupName);
      setGroupName('');
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'locations':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 sr-only">Locais</h3>
            <form onSubmit={handleAddLocation} className="space-y-3 p-4 border rounded-md bg-gray-50">
               <div>
                  <label htmlFor="location-name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Local</label>
                  <input id="location-name" type="text" placeholder="Ex: Salão Principal" value={locationName} onChange={e => setLocationName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400" />
               </div>
               <div>
                  <label htmlFor="location-image" className="block text-sm font-medium text-gray-700 mb-1">Imagem do Local</label>
                  <input id="location-image" type="file" accept="image/*" onChange={e => setLocationImage(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
               </div>
              <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 font-semibold">Adicionar Local</button>
            </form>
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {locations.map(loc => (
                <li key={loc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <img src={loc.imageUrl} alt={loc.name} className="w-10 h-10 object-cover rounded mr-3" />
                  <span className="flex-grow text-sm text-gray-800 truncate">{loc.name}</span>
                  <button onClick={() => onRemoveLocation(loc.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors"><TrashIcon className="w-5 h-5" /></button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'leaders':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 sr-only">Dirigentes</h3>
            <form onSubmit={handleAddLeader} className="flex gap-2 items-end p-4 border rounded-md bg-gray-50">
              <div className="flex-grow">
                 <label htmlFor="leader-name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Dirigente</label>
                 <input id="leader-name" type="text" placeholder="Ex: João Silva" value={leaderName} onChange={e => setLeaderName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400" />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 h-10 font-semibold">Adicionar</button>
            </form>
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {leaders.map(leader => (
                <li key={leader} className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm text-gray-800">
                  {leader}
                  <button onClick={() => onRemoveLeader(leader)} className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors"><TrashIcon className="w-5 h-5"/></button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'groups':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 sr-only">Grupos</h3>
            <form onSubmit={handleAddGroup} className="flex gap-2 items-end p-4 border rounded-md bg-gray-50">
              <div className="flex-grow">
                <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Grupo</label>
                <input id="group-name" type="text" placeholder="Ex: Grupo de Jovens" value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400" />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 h-10 font-semibold">Adicionar</button>
            </form>
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {groups.map(group => (
                <li key={group} className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm text-gray-800">
                  {group}
                  <button onClick={() => onRemoveGroup(group)} className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors"><TrashIcon className="w-5 h-5"/></button>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getTabClassName = (tabName: Tab) => 
    `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors duration-200 ease-in-out
    ${activeTab === tabName 
      ? 'border-indigo-500 text-indigo-600' 
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Gerenciar Fontes</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
             <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                <button onClick={() => setActiveTab('locations')} className={getTabClassName('locations')}>
                    Locais
                </button>
                <button onClick={() => setActiveTab('leaders')} className={getTabClassName('leaders')}>
                    Dirigentes
                </button>
                <button onClick={() => setActiveTab('groups')} className={getTabClassName('groups')}>
                    Grupos
                </button>
            </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
