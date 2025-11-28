
export const THEME = {
  colors: {
    primary: 'indigo',
    success: 'emerald',
    warning: 'amber',
    danger: 'rose',
    slate: 'slate',
  },
};

export const CLASSES = {
  // Layout Containers
  pageContainer: "space-y-6 animate-in fade-in duration-500",
  header: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
  section: "bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden",
  
  // Typography
  h1: "text-3xl font-bold text-slate-900 tracking-tight",
  h2: "text-xl font-bold text-slate-900",
  h3: "text-lg font-bold text-slate-800",
  textSecondary: "text-sm text-slate-500",
  label: "block text-sm font-medium text-slate-700 mb-1",

  // Form Elements
  input: "w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400",
  select: "w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none",
  textarea: "w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400",
  
  // Buttons
  buttonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
  buttonSecondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm",
  buttonDanger: "bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2",
  buttonGhost: "text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors",
  
  // Badges
  badge: {
    base: "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },

  // Interactive
  cardHover: "hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-200",
  rowClickable: "hover:bg-slate-50 cursor-pointer transition-colors",
};
