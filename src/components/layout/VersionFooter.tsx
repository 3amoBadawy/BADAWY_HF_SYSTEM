
import React, { useState } from 'react';
import { Info, GitCommit, Layers, FileCode } from 'lucide-react';
import { VERSIONS, LATEST_VERSION } from '../../versions';
import { ARCHITECTURE_GUIDE } from '../../architecture';
import { Modal } from '../common/UIComponents';

const VersionFooter: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'changelog' | 'architecture'>('changelog');

    return (
        <>
            <div className="mt-10 py-6 border-t border-slate-200 flex flex-col items-center justify-center text-xs text-slate-400">
                <p>&copy; {new Date().getFullYear()} FurniFlow نظام إدارة المؤسسات. جميع الحقوق محفوظة.</p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 mt-2 hover:text-indigo-600 transition-colors"
                >
                    <Info className="w-3 h-3" />
                    <span>الإصدار {LATEST_VERSION}</span>
                </button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={<div className="flex items-center gap-2"><GitCommit className="w-5 h-5 text-indigo-600"/> معلومات النظام</div>}
                maxWidth="max-w-2xl"
            >
                <div className="flex border-b border-slate-100 mb-4">
                    <button 
                        onClick={() => setActiveTab('changelog')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'changelog' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        سجل التغييرات
                    </button>
                    <button 
                        onClick={() => setActiveTab('architecture')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'architecture' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        البنية البرمجية
                    </button>
                </div>

                <div className="min-h-[300px]">
                    {activeTab === 'changelog' ? (
                        <div className="divide-y divide-slate-100">
                            {VERSIONS.map((log, index) => (
                                <div key={log.version} className={`p-6 ${index === 0 ? 'bg-indigo-50/30 rounded-xl' : ''}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="font-bold text-slate-900 text-lg">v{log.version}</span>
                                            {index === 0 && <span className="mr-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">الأحدث</span>}
                                            {log.isMajor && index !== 0 && <span className="mr-2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">رئيسي</span>}
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">{log.date}</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {log.changes.map((change, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="block w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></span>
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 p-2" dir="ltr">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600"/> Overview</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{ARCHITECTURE_GUIDE.overview}</p>
                                <div className="mt-3 text-xs font-mono text-slate-500 bg-white p-2 rounded border border-slate-200">
                                    Data Flow: {ARCHITECTURE_GUIDE.dataFlow}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileCode className="w-4 h-4 text-indigo-600"/> Project Structure</h3>
                                {ARCHITECTURE_GUIDE.structure.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                        <div className="font-mono text-xs font-bold text-indigo-600 min-w-[140px]">{item.folder}</div>
                                        <div className="text-sm text-slate-600">{item.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default VersionFooter;
