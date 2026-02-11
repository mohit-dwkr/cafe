import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Trash2, Plus, X, Coffee, Upload, Link as LinkIcon, Image as ImageIcon, Edit3, Loader2, IndianRupee } from 'lucide-react';

const ProductsAdmin = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Coffee', 'Milk Shakes', 'Smoothies', 'Breakfast']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSource, setImageSource] = useState<'file' | 'url'>('file');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Coffee',
    image_url: '',
    newCategory: ''
  });

  const fetchProducts = async () => {
    const { data } = await supabase.from('Products').select('*').order('id', { ascending: false });
    if (data) {
      setProducts(data);
      const existingCats = data.map((p: any) => p.category);
      setCategories((prev: string[]) => {
        const combined = [...prev, ...existingCats];
        return Array.from(new Set(combined)) as string[];
      });
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload error: " + uploadError.message);
    } else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setFormData({ ...formData, image_url: data.publicUrl });
    }
    setIsUploading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalCategory = formData.newCategory.trim() !== '' ? formData.newCategory : formData.category;
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: finalCategory,
      image_url: formData.image_url
    };

    let result;
    if (editingId) {
      result = await supabase.from('Products').update(productData).eq('id', editingId);
    } else {
      result = await supabase.from('Products').insert([productData]);
    }

    if (!result.error) {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', price: '', description: '', category: 'Coffee', image_url: '', newCategory: '' });
      fetchProducts();
    } else {
      alert("Error: " + result.error.message);
    }
    setLoading(false);
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description || '',
      category: item.category,
      image_url: item.image_url,
      newCategory: ''
    });
    setIsModalOpen(true);
  };

  const deleteProduct = async (id: number) => {
    if (confirm('Delete this item?')) {
      await supabase.from('Products').delete().eq('id', id);
      fetchProducts();
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <Coffee size={24} />
            </div>
            Menu Management
          </h3>
          <p className="text-slate-500 text-sm mt-1">Manage your cafe products and pricing</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', price: '', description: '', category: 'Coffee', image_url: '', newCategory: '' });
            setIsModalOpen(true);
          }} 
          className="w-full sm:w-auto bg-orange-600 text-white px-6 py-4 sm:py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* Responsive View Switcher: Mobile Cards & Desktop Table */}
      <div className="max-w-6xl mx-auto">
        {/* Mobile Grid (Visible only on small screens) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {products.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex gap-4 items-center">
              <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">{item.name}</p>
                <span className="text-[9px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full inline-block mb-1">{item.category}</span>
                <p className="font-black text-slate-700 text-sm flex items-center gap-0.5"><IndianRupee size={12}/>{item.price}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEditClick(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16} /></button>
                <button onClick={() => deleteProduct(item.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (Hidden on small screens) */}
        <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-400">Product</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-400">Category</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-400">Price</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm flex-shrink-0">
                          <img src={item.image_url} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1">{item.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-slate-700 flex items-center gap-0.5">
                        <IndianRupee size={14} className="text-slate-400" />{item.price}
                      </p>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditClick(item)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => deleteProduct(item.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-800">{editingId ? 'Edit Item' : 'Create Item'}</h4>
                <p className="text-slate-400 text-xs sm:text-sm italic">Enter product details below</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-800">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 sm:space-y-5">
              {/* Image Picker Section */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200">
                <div className="flex gap-2 mb-4 bg-white p-1 rounded-xl border border-slate-100">
                  <button type="button" onClick={() => setImageSource('file')} className={`flex-1 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${imageSource === 'file' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>
                    <Upload size={14} /> Local File
                  </button>
                  <button type="button" onClick={() => setImageSource('url')} className={`flex-1 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${imageSource === 'url' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>
                    <LinkIcon size={14} /> Remote URL
                  </button>
                </div>

                {imageSource === 'file' ? (
                  <div className="flex flex-col items-center">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer group">
                      {formData.image_url ? (
                        <div className="relative">
                          <img src={formData.image_url} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg ring-1 ring-orange-500" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center text-white"><Edit3 size={20}/></div>
                        </div>
                      ) : (
                        <div className={`h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-slate-100 ${isUploading ? 'animate-bounce' : ''}`}>
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest">{isUploading ? "Uploading..." : "Tap to Upload"}</span>
                  </div>
                ) : (
                  <input type="text" placeholder="https://image-url.com" className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
                    value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                )}
              </div>

              {/* Input Fields */}
              <div className="space-y-3 sm:space-y-4">
                <input required type="text" placeholder="Product Name" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="number" placeholder="Price" className="w-full p-4 pl-10 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                      value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  
                  <select className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold appearance-none cursor-pointer"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <input type="text" placeholder="Or create a new category..." className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 italic text-sm"
                  value={formData.newCategory} onChange={e => setFormData({...formData, newCategory: e.target.value})} />

                <textarea placeholder="Description (Optional)" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 resize-none" rows={2}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              {/* Submit Button */}
              <button disabled={loading || isUploading} type="submit" 
                className={`w-full py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 ${loading || isUploading ? 'bg-slate-300' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'}`}>
                {loading ? <Loader2 className="animate-spin mx-auto" /> : (editingId ? 'Save Changes' : 'Confirm & Add Item')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;