import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Image as ImageIcon, Trash2, Plus, X, Upload, Loader2, Link as LinkIcon } from 'lucide-react';

const GalleryAdmin = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Nayi photo ke liye state
  const [newPhoto, setNewPhoto] = useState({ image_url: '', caption: '' });

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('Gallery')
      .select('*')
      .order('id', { ascending: false });
    if (data) setImages(data);
  };

  useEffect(() => { fetchGallery(); }, []);

  // Mobile Gallery / PC se upload logic
  const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `gallery-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setNewPhoto({ ...newPhoto, image_url: data.publicUrl });
    } catch (error: any) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhoto.image_url) return alert("Please add an image first!");
    
    setLoading(true);
    const { error } = await supabase.from('Gallery').insert([newPhoto]);
    
    if (!error) {
      setIsModalOpen(false);
      setNewPhoto({ image_url: '', caption: '' });
      fetchGallery();
    } else {
      alert("Error adding photo: " + error.message);
    }
    setLoading(false);
  };

  const deletePhoto = async (id: number) => {
    if (window.confirm('Remove this photo from gallery?')) {
      const { error } = await supabase.from('Gallery').delete().eq('id', id);
      if (!error) fetchGallery();
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Add Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-48 border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center text-orange-500 hover:bg-orange-50 transition-all bg-white shadow-sm"
        >
          <div className="bg-orange-100 p-3 rounded-full mb-2">
            <Plus size={24} />
          </div>
          <span className="text-sm font-bold">Add New Photo</span>
        </button>

        {/* Image Cards */}
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-md bg-white border border-slate-100 h-48">
            <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
            
            {/* Delete Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
              <button 
                onClick={() => deletePhoto(img.id)} 
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 mb-2 transform scale-75 group-hover:scale-100 transition-transform"
              >
                <Trash2 size={20} />
              </button>
              <p className="text-white text-xs font-medium line-clamp-2">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add Gallery Photo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Source Selection */}
              <div className="flex gap-2">
                 <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={handleLocalUpload} />
                      <Upload className="mx-auto text-slate-400 mb-1" size={20} />
                      <span className="text-[10px] font-bold block">GALLERY / FILES</span>
                    </div>
                 </label>
              </div>

              {/* URL Input */}
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  placeholder="Or paste Image URL here..."
                  value={newPhoto.image_url}
                  onChange={(e) => setNewPhoto({...newPhoto, image_url: e.target.value})}
                />
              </div>

              {/* Preview */}
              {newPhoto.image_url && (
                <div className="relative rounded-xl overflow-hidden h-32 bg-slate-100">
                  <img src={newPhoto.image_url} className="w-full h-full object-cover" />
                  {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>}
                </div>
              )}

              {/* Caption */}
              <input 
                className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="Write a caption (e.g. Morning Coffee Vibes)"
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})}
              />

              <button 
                onClick={handleAddPhoto}
                disabled={loading || uploading}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                Add to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;