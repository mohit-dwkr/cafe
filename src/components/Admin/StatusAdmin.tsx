import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Power, PowerOff, Store, Clock } from 'lucide-react';

const StatusAdmin = () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase.from('Status').select('is_open').eq('id', 1).single();
      if (data) setIsOpen(data.is_open);
    };
    fetchStatus();
  }, []);

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = !isOpen;
    const { error } = await supabase
      .from('Status')
      .update({ is_open: newStatus })
      .eq('id', 1);
      
    if (!error) setIsOpen(newStatus);
    setLoading(false);
  };

  if (isOpen === null) return <div className="p-10 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Loading Status...</div>;

  return (
    // Mobile par p-6 aur Desktop par p-8
    <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl max-w-md mx-auto w-full">
      {/* Background Subtle Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 transition-colors duration-500 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon Header */}
        <div className={`p-4 rounded-2xl mb-6 transition-colors duration-500 ${isOpen ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          <Store size={32} />
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1">Store Visibility</h3>
        <p className="text-slate-500 text-xs md:text-sm mb-8 flex items-center justify-center gap-2">
          <Clock size={14} /> Real-time status update
        </p>

        {/* Main Toggle Button - Full width on mobile */}
        <button 
          onClick={toggleStatus}
          disabled={loading}
          className={`
            group relative flex items-center justify-center space-x-4 w-full md:w-auto md:px-10 py-5 rounded-2xl 
            text-white font-black tracking-wider transition-all duration-300 active:scale-95 shadow-2xl
            ${isOpen 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-200 hover:shadow-green-300' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-200 hover:shadow-red-300'
            }
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {/* Animated Glow behind button */}
          <div className={`absolute inset-0 rounded-2xl blur-lg transition-opacity duration-500 group-hover:opacity-100 opacity-50 ${isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
          
          <div className="relative flex items-center gap-3">
            {isOpen ? (
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                <Power size={22} className="animate-pulse" />
              </div>
            ) : (
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                <PowerOff size={22} />
              </div>
            )}
            <span className="text-base md:text-lg uppercase">{isOpen ? 'Open Now' : 'Closed Now'}</span>
          </div>
        </button>

        {/* Status Indicator Bar */}
        <div className="mt-8 flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
          <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${isOpen ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
          <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest">
            Current: {isOpen ? 'Accepting Orders' : 'Offline'}
          </span>
        </div>

        <p className="mt-6 text-[10px] md:text-[11px] text-slate-400 leading-relaxed max-w-[200px] md:max-w-none">
          Switching this will instantly update the <br className="hidden md:block" /> 
          <span className="font-semibold text-slate-500 underline decoration-slate-200 italic">Shop Header</span> on your website.
        </p>
      </div>
    </div>
  );
};

export default StatusAdmin;