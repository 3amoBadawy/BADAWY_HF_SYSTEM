
import React, { useState } from 'react';
import { GeoRegion } from '../../../types';
import { Button, Input } from '../../../components/common/UIComponents';
import { Trash2, Plus, MapPin } from 'lucide-react';

interface GeoSettingsProps {
    geoConfig: GeoRegion[];
    onUpdate: (geo: GeoRegion[]) => void;
}

const GeoSettings: React.FC<GeoSettingsProps> = ({ geoConfig, onUpdate }) => {
    const [newCountry, setNewCountry] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [newCounty, setNewCounty] = useState('');

    const addCountry = () => {
        if(!newCountry) return;
        onUpdate([...geoConfig, { country: newCountry, counties: [] }]);
        setNewCountry('');
    };

    const deleteCountry = (c: string) => {
        if(confirm(`حذف ${c}؟`)) onUpdate(geoConfig.filter(g => g.country !== c));
    };

    const addCounty = () => {
        if(!newCounty || !selectedCountry) return;
        const updated = geoConfig.map(g => g.country === selectedCountry ? { ...g, counties: [...g.counties, newCounty] } : g);
        onUpdate(updated);
        setNewCounty('');
    };

    const deleteCounty = (county: string) => {
        if(!selectedCountry) return;
        const updated = geoConfig.map(g => g.country === selectedCountry ? { ...g, counties: g.counties.filter(c => c !== county) } : g);
        onUpdate(updated);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
            <div className="border border-slate-200 rounded-xl flex flex-col overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2">
                    <Input placeholder="دولة جديدة" value={newCountry} onChange={e => setNewCountry(e.target.value)} />
                    <Button onClick={addCountry} className="px-3"><Plus className="w-4 h-4"/></Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {geoConfig.map(g => (
                        <div key={g.country} onClick={() => setSelectedCountry(g.country)} className={`p-3 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50 ${selectedCountry === g.country ? 'bg-indigo-50' : ''}`}>
                            <span className="font-medium text-slate-700">{g.country}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded">{g.counties.length}</span>
                                <button onClick={(e) => {e.stopPropagation(); deleteCountry(g.country);}} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border border-slate-200 rounded-xl flex flex-col overflow-hidden">
                {selectedCountry ? (
                    <>
                        <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                            <span>مناطق في {selectedCountry}</span>
                            <div className="flex gap-2 w-2/3">
                                <Input placeholder="محافظة/مدينة جديدة" value={newCounty} onChange={e => setNewCounty(e.target.value)} />
                                <Button onClick={addCounty} className="px-3"><Plus className="w-4 h-4"/></Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {geoConfig.find(g => g.country === selectedCountry)?.counties.map(c => (
                                <div key={c} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded group">
                                    <span className="text-sm text-slate-600">{c}</span>
                                    <button onClick={() => deleteCounty(c)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <MapPin className="w-8 h-8 mb-2 opacity-50"/>
                        <p>اختر دولة لعرض المناطق</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeoSettings;
