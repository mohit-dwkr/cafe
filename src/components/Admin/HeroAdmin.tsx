import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, ImageIcon, Upload, Loader2, Type, AlignLeft, Sparkles } from 'lucide-react';

const HeroAdmin = () => {
  // ID hamesha 3 rahegi sync ke liye
  const [hero, setHero] = useState({ id: 3, title: '', subtitle: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchHero = async () => {
    const { data } = await supabase
      .from('Hero')
      .select('*')
      .eq('id', 3)
      .maybeSingle();

    if (data) {
      setHero(data);
    }
  };

  useEffect(() => { fetchHero(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-bg-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setHero(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error: any) {
      alert("Storage Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Hero')
        .upsert({
          id: 3, 
          title: hero.title,
          subtitle: hero.subtitle,
          image_url: hero.image_url
        });

      if (error) throw error;
      alert('✨ Success! Website updated successfully.');
      fetchHero(); 
    } catch (error: any) {
      alert("Database Update Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-slate-50/50 p-8 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Hero Settings
          </h2>
        </div>
        <p className="text-slate-500 text-sm">Control the main headline and background of your website.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
            <ImageIcon size={14} /> Background Image
          </label>
          <div className="relative group aspect-video rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center transition-all hover:border-orange-300">
            {hero.image_url ? (
              <>
                <img src={hero.image_url} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <label className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold cursor-pointer flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      <Upload size={18} /> Replace Image
                   </label>
                </div>
              </>
            ) : (
              <label className="flex flex-col items-center gap-3 cursor-pointer p-10 text-center">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <div className="bg-white p-4 rounded-3xl shadow-sm text-slate-300 group-hover:text-orange-500 transition-colors">
                  <Upload size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-600">Click to upload banner</p>
                  <p className="text-xs text-slate-400">High resolution recommended (1920x1080)</p>
                </div>
              </label>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="animate-spin text-orange-600 mb-2" size={32} />
                <p className="text-xs font-black text-orange-600 uppercase tracking-tighter">Uploading to Cloud...</p>
              </div>
            )}
          </div>
        </div>

        {/* Text Content Section */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <Type size={14} /> Main Headline
            </label>
            <input 
              placeholder="Enter catchy title..."
              className="w-full p-5 bg-slate-50 border-none rounded-[1.2rem] outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-slate-800 placeholder:text-slate-300" 
              value={hero.title} 
              onChange={(e) => setHero({...hero, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <AlignLeft size={14} /> Sub-headline Text
            </label>
            <textarea 
              placeholder="Tell your customers more..."
              rows={3}
              className="w-full p-5 bg-slate-50 border-none rounded-[1.2rem] outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-600 placeholder:text-slate-300 resize-none" 
              value={hero.subtitle} 
              onChange={(e) => setHero({...hero, subtitle: e.target.value})}
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleUpdate} 
          disabled={loading || isUploading}
          className={`
            w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95
            flex items-center justify-center gap-3
            ${loading || isUploading 
              ? 'bg-slate-200 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
            }
          `}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              Publish Changes
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-50 p-4 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Changes will be live on the homepage instantly.
         </p>
      </div>
    </div>
  );
};

export default HeroAdmin;