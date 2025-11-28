
import React, { useState, useEffect } from 'react';
import { GeoRegion, SystemConfig } from '../../../types';
import { Button, Input, Select } from '../../../components/common/UIComponents';
import { Download, Upload, AlertTriangle, Save } from 'lucide-react';

interface GeneralSettingsProps {
    geoConfig: GeoRegion[];
    config: SystemConfig;
    onUpdate: (config: SystemConfig[]) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ geoConfig, config, onUpdate }) => {
    const [form, setForm] = useState<SystemConfig>(config);

    useEffect(() => {
        setForm(config);
    }, [config]);

    const timezones = [
        'UTC (GMT+0)', 'EST (GMT-5) - New York', 'CST (GMT-6) - Chicago', 'PST (GMT-8) - Los Angeles',
        'GMT (GMT+0) - London', 'CET (GMT+1) - Paris/Berlin', 'IST (GMT+5:30) - India', 'JST (GMT+9) - Tokyo', 'EET (GMT+2) - Cairo'
    ];

    const handleSave = () => {
        onUpdate([form]); 
        alert("تم تحديث إعدادات النظام.");
    };

    const handleExport = () => {
        const data: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('furniflow_')) {
                try {
                    data[key] = JSON.parse(localStorage.getItem(key) || '[]');
                } catch (e) {
                    console.error("Error exporting key", key);
                }
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `furniflow_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (confirm("تحذير: سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة. هل أنت متأكد؟")) {
                    Object.keys(data).forEach(key => {
                        if (key.startsWith('furniflow_')) {
                            localStorage.setItem(key, JSON.stringify(data[key]));
                        }
                    });
                    alert("تم استعادة البيانات بنجاح. سيتم إعادة تحميل الصفحة.");
                    window.location.reload();
                }
            } catch (err) {
                alert("ملف النسخة الاحتياطية غير صالح.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="space-y-6">
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-800 flex items-start gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm"><Save className="w-4 h-4 text-indigo-600"/></div>
                    <div>
                        <p className="font-bold">التكوين العام</p>
                        <p className="opacity-80">تؤثر هذه الإعدادات على الفواتير وعرض العملة والتنسيقات الإقليمية عبر جميع الفروع.</p>
                    </div>
                </div>

                <Input label="اسم الشركة" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
                <Input label="بريد الدعم الفني" value={form.supportEmail} onChange={e => setForm({...form, supportEmail: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input label="بادئة رقم الطلب" value={form.orderPrefix} onChange={e => setForm({...form, orderPrefix: e.target.value})} placeholder="ORD" />
                    <Input label="رمز العملة" value={form.defaultCurrency} onChange={e => setForm({...form, defaultCurrency: e.target.value})} />
                </div>

                <Select label="الدولة الافتراضية" value={form.defaultCountry} onChange={e => setForm({...form, defaultCountry: e.target.value})}>
                    {geoConfig.map(g => <option key={g.country} value={g.country}>{g.country}</option>)}
                </Select>
                <Select label="المنطقة الزمنية للنظام" value={form.defaultTimezone} onChange={e => setForm({...form, defaultTimezone: e.target.value})}>
                    {timezones.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
                
                <div className="flex justify-end">
                    <Button onClick={handleSave}>حفظ الإعدادات</Button>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">إدارة البيانات</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-6">
                        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0"/>
                        <p className="text-sm text-slate-600">
                            <strong>هام:</strong> يتم تخزين بياناتك محلياً في هذا المتصفح. 
                            قم بعمل نسخ احتياطي بانتظام لتجنب فقدان البيانات في حالة مسح ذاكرة التخزين المؤقت أو فقدان الجهاز.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="secondary" onClick={handleExport} className="h-auto py-4 flex-col gap-2 border-2 hover:border-indigo-200">
                            <Download className="w-6 h-6 text-indigo-600"/>
                            <span className="text-slate-700">نسخ احتياطي (تصدير)</span>
                        </Button>
                        
                        <label className="flex flex-col items-center justify-center h-auto py-4 gap-2 bg-white border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                            <Upload className="w-6 h-6 text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">استعادة بيانات (استيراد)</span>
                            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
