
import React from 'react';

interface SettingsTab {
    id: string;
    label: string;
    icon: any;
}

interface SettingsSidebarProps {
    tabs: SettingsTab[];
    activeTab: string;
    onSelect: (id: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ tabs, activeTab, onSelect }) => {
    return (
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 shrink-0 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
            {tabs.map(t => (
                <button 
                    key={t.id} 
                    onClick={() => onSelect(t.id)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                    <t.icon className="w-5 h-5" /> {t.label}
                </button>
            ))}
        </div>
    );
};

export default SettingsSidebar;
