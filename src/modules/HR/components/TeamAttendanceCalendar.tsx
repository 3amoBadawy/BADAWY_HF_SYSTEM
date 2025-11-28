
import React, { useState } from 'react';
import { Employee } from '../../../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { Table } from '../../../components/common/UIComponents';

interface TeamAttendanceCalendarProps {
    employees: Employee[];
}

const TeamAttendanceCalendar: React.FC<TeamAttendanceCalendarProps> = ({ employees }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
    const currentDay = today.getDate();

    const handleMonthChange = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const getMonthStr = () => currentDate.toISOString().slice(0, 7); // YYYY-MM

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    <CalIcon className="w-5 h-5 text-indigo-600"/>
                    {currentDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-slate-200 rounded"><ChevronRight className="w-5 h-5"/></button>
                    <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-slate-200 rounded"><ChevronLeft className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky right-0 z-10 bg-slate-50 border-b border-l border-slate-200 p-3 min-w-[200px] font-bold text-slate-700 text-right">الموظف</th>
                            {days.map(d => (
                                <th key={d} className={`p-2 border-b border-slate-100 text-center min-w-[32px] font-medium ${isCurrentMonth && d === currentDay ? 'bg-indigo-100 text-indigo-700 ring-2 ring-inset ring-indigo-500' : 'text-slate-500'}`}>
                                    {d}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-slate-50">
                                <td className="sticky right-0 z-10 bg-white hover:bg-slate-50 border-l border-slate-100 p-3 font-medium text-slate-900 truncate text-right">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {emp.name.charAt(0)}
                                        </div>
                                        {emp.name}
                                    </div>
                                </td>
                                {days.map(d => {
                                    const dateStr = `${getMonthStr()}-${d.toString().padStart(2, '0')}`;
                                    const log = emp.logs?.find(l => l.date === dateStr);
                                    const isToday = isCurrentMonth && d === currentDay;
                                    
                                    return (
                                        <td key={d} className={`border-l border-slate-50 text-center ${isToday ? 'bg-indigo-50/30' : ''}`}>
                                            {log ? (
                                                <div className="w-full h-full flex items-center justify-center py-2">
                                                    <div 
                                                        className={`w-2.5 h-2.5 rounded-full ${log.checkOut ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} 
                                                        title={`دخول: ${new Date(log.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`}
                                                    ></div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-200 text-[10px]">•</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex gap-4">
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> مكتمل (حضور وانصراف)</div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div> نشط (متواجد حالياً)</div>
            </div>
        </div>
    );
};

export default TeamAttendanceCalendar;
