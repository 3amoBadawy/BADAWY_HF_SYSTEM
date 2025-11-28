
import React, { useState, useEffect } from 'react';
import { Clock, Timer, LogIn, LogOut } from 'lucide-react';
import { Employee } from '../../../types';
import { CLASSES } from '../../../styles/designSystem';
import { Table, Badge } from '../../../components/common/UIComponents';

interface LiveAttendanceProps {
    employees: Employee[];
}

const LiveAttendance: React.FC<LiveAttendanceProps> = ({ employees }) => {
    const [, setTick] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000); 
        return () => clearInterval(timer);
    }, []);

    const getDailyStats = (e: Employee) => {
        const now = new Date();
        const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        
        const todaysLogs = e.logs?.filter(l => l.date === today) || [];
        
        const firstIn = todaysLogs.length > 0 ? new Date(todaysLogs[0].checkIn).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'}) : '-';
        const lastOut = todaysLogs.length > 0 && todaysLogs[todaysLogs.length-1].checkOut 
            ? new Date(todaysLogs[todaysLogs.length-1].checkOut!).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'}) 
            : '-';

        let totalMilliseconds = todaysLogs.reduce((sum, log) => {
            if (log.checkOut) {
                return sum + (new Date(log.checkOut).getTime() - new Date(log.checkIn).getTime());
            }
            return sum;
        }, 0);

        if (e.isCheckedIn && e.lastCheckInTime) {
            const currentSession = new Date().getTime() - new Date(e.lastCheckInTime).getTime();
            totalMilliseconds += currentSession;
        }

        const hours = Math.floor(totalMilliseconds / 3600000);
        const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);

        return {
            firstIn,
            lastOut,
            duration: `${hours}س ${minutes}د`,
            rawDuration: totalMilliseconds
        };
    };

    return (
        <div className={CLASSES.section}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className={CLASSES.h3}><Clock className="w-5 h-5 inline ml-2 text-indigo-600"/> الحضور اليومي المباشر</h3>
                <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> 
                        <span>متواجد: {employees.filter(e => e.isCheckedIn).length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> 
                        <span>منصرف: {employees.filter(e => !e.isCheckedIn).length}</span>
                    </div>
                </div>
            </div>
            
            <Table
                data={employees}
                columns={[
                    { 
                        header: 'الموظف', 
                        accessor: 'name', 
                        render: (e: Employee) => (
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${e.isCheckedIn ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {e.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{e.name}</p>
                                    <p className="text-[10px] text-slate-500">{e.role}</p>
                                </div>
                            </div>
                        )
                    },
                    { 
                        header: 'الحالة', 
                        render: (e: Employee) => e.isCheckedIn 
                            ? <Badge variant="success">حاضر</Badge> 
                            : <Badge variant="neutral">منصرف</Badge>
                    },
                    { 
                        header: 'أول حضور', 
                        render: (e: Employee) => (
                            <div className="flex items-center gap-1 text-slate-600 text-xs">
                                <LogIn className="w-3 h-3 text-slate-400"/>
                                {getDailyStats(e).firstIn}
                            </div>
                        )
                    },
                    { 
                        header: 'آخر انصراف', 
                        render: (e: Employee) => (
                            <div className="flex items-center gap-1 text-slate-600 text-xs">
                                <LogOut className="w-3 h-3 text-slate-400"/>
                                {getDailyStats(e).lastOut}
                            </div>
                        )
                    },
                    { 
                        header: 'إجمالي الساعات', 
                        align: 'right',
                        render: (e: Employee) => {
                            const stats = getDailyStats(e);
                            return (
                                <div className={`font-mono font-bold ${e.isCheckedIn ? 'text-indigo-600' : 'text-slate-700'}`}>
                                    {stats.duration}
                                </div>
                            );
                        }
                    }
                ]}
                emptyMessage="لا يوجد موظفين."
            />
        </div>
    );
};

export default LiveAttendance;
