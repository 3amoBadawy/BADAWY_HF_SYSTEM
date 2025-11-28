
import React, { useState, useEffect } from 'react';
import { X, Fingerprint, LogOut, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Employee, Branch } from '../../../types';
import { Button, Card } from '../../../components/common/UIComponents';

interface AttendanceKioskProps {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    branches: Branch[];
    onCheckAction: (employee: Employee, action: 'in' | 'out') => void;
}

const AttendanceKiosk: React.FC<AttendanceKioskProps> = ({ isOpen, onClose, employees, branches, onCheckAction }) => {
    const [step, setStep] = useState<'select' | 'action'>('select');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [locationStatus, setLocationStatus] = useState<'waiting' | 'success' | 'fail'>('waiting');
    const [distance, setDistance] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (!isOpen) return;
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    const getDistanceFromLatLonInM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        var R = 6371; 
        var dLat = (lat2-lat1) * (Math.PI/180);
        var dLon = (lon2-lon1) * (Math.PI/180); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c * 1000; 
    };

    const verifyLocation = (action: 'in' | 'out') => {
        if (!selectedEmployee) return;
        setLocationStatus('waiting');
        
        const branch = branches.find(b => b.id === selectedEmployee.branchId);
        if (!branch || !branch.coordinates) {
            alert("إحداثيات الفرع غير محددة. يرجى مراجعة المدير.");
            return;
        }

        if (!navigator.geolocation) {
            alert("المتصفح لا يدعم تحديد الموقع الجغرافي.");
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const dist = getDistanceFromLatLonInM(
                position.coords.latitude, position.coords.longitude, 
                branch.coordinates!.lat, branch.coordinates!.lng
            );
            setDistance(Math.round(dist));

            if (dist <= (branch.coordinates!.radius || 100)) {
                setLocationStatus('success');
                setTimeout(() => {
                    onCheckAction(selectedEmployee, action);
                    reset();
                }, 1000);
            } else {
                setLocationStatus('fail');
            }
        }, () => alert("تم رفض الوصول للموقع الجغرافي."));
    };

    const reset = () => {
        setStep('select');
        setSelectedEmployee(null);
        setLocationStatus('waiting');
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X className="w-8 h-8"/></button>
            
            <div className="text-center mb-10">
                <div className="text-6xl font-black text-white font-mono tracking-wider mb-2">
                    {currentTime.toLocaleTimeString('ar-EG', { hour12: false })}
                </div>
                <p className="text-slate-400 text-xl">{currentTime.toLocaleDateString('ar-EG', {weekday: 'long', month: 'long', day: 'numeric'})}</p>
            </div>

            {step === 'select' ? (
                <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {employees.map(emp => (
                        <button 
                          key={emp.id}
                          onClick={() => { setSelectedEmployee(emp); setStep('action'); }}
                          className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all group"
                        >
                             <div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center text-2xl font-bold text-white group-hover:bg-indigo-600 transition-colors overflow-hidden shadow-lg">
                                 {emp.avatarUrl ? <img src={emp.avatarUrl} className="w-full h-full object-cover" /> : emp.name.charAt(0)}
                             </div>
                             <div className="text-center">
                                 <p className="text-white font-bold text-lg truncate w-full max-w-[150px]">{emp.name}</p>
                                 <p className="text-slate-400 text-sm">{emp.role}</p>
                             </div>
                             {emp.isCheckedIn ? (
                                 <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">حاضر</span>
                             ) : (
                                 <span className="bg-slate-700 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">غائب</span>
                             )}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-800 p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200">
                    <h2 className="text-3xl font-bold text-white mb-2">مرحباً، {selectedEmployee?.name}</h2>
                    <p className="text-slate-400 mb-8">اختر الإجراء المطلوب</p>
                    
                    {locationStatus === 'waiting' ? (
                        <div className="grid grid-cols-2 gap-6">
                            <button 
                              onClick={() => verifyLocation('in')}
                              disabled={selectedEmployee?.isCheckedIn}
                              className={`h-40 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${selectedEmployee?.isCheckedIn ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105 shadow-lg shadow-emerald-900/50'}`}
                            >
                                <div className="p-4 bg-white/10 rounded-full"><Fingerprint className="w-10 h-10 text-white"/></div>
                                <span className="text-2xl font-bold text-white">تسجيل دخول</span>
                            </button>
                            
                            <button 
                              onClick={() => verifyLocation('out')}
                              disabled={!selectedEmployee?.isCheckedIn}
                              className={`h-40 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${!selectedEmployee?.isCheckedIn ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500 hover:scale-105 shadow-lg shadow-rose-900/50'}`}
                            >
                                <div className="p-4 bg-white/10 rounded-full"><LogOut className="w-10 h-10 text-white"/></div>
                                <span className="text-2xl font-bold text-white">تسجيل خروج</span>
                            </button>
                        </div>
                    ) : (
                        <div className="py-10">
                            {locationStatus === 'success' ? (
                                <div className="text-emerald-400 flex flex-col items-center animate-bounce">
                                    <CheckCircle className="w-20 h-20 mb-6"/>
                                    <p className="text-2xl font-bold">تم التحقق بنجاح!</p>
                                </div>
                            ) : (
                                <div className="text-rose-400 flex flex-col items-center">
                                    <XCircle className="w-20 h-20 mb-6"/>
                                    <p className="text-2xl font-bold mb-2">فشل التحقق من الموقع</p>
                                    <p className="text-slate-400 text-sm">أنت تبعد {distance} متر عن الفرع.</p>
                                    <Button onClick={() => setLocationStatus('waiting')} className="mt-6" variant="secondary">حاول مرة أخرى</Button>
                                </div>
                            )}
                        </div>
                    )}

                    <button onClick={reset} className="mt-8 text-slate-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors">
                        العودة للقائمة <ArrowRight className="w-4 h-4"/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AttendanceKiosk;
