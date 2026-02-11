import React, { useState } from 'react'; // useState add kiya
import { LayoutGrid, Coffee, Image as ImageIcon, Clock, Home, Settings2, LogOut, Menu, X } from 'lucide-react'; // Menu, X add kiya
import { supabase } from '@/supabaseClient';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile toggle state

  const menuItems = [
    { id: 'status', label: 'Shop Status', icon: Clock, desc: 'Open/Close toggle' },
    { id: 'products', label: 'Menu Products', icon: Coffee, desc: 'Manage food & drinks' },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, desc: 'Photos & Captions' },
    { id: 'hero', label: 'Hero Section', icon: LayoutGrid, desc: 'Banner & Headlines' },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed h-full z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:fixed md:z-20
      `}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-200">
                <Coffee className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Cafe <span className="text-orange-600">Admin</span></h2>
            </div>
            {/* Close button for mobile only */}
            <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false); // Mobile menu close after click
                }}
                className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === item.id
                    ? 'bg-orange-50 text-orange-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <div className="text-left">
                  <p className="text-sm font-bold tracking-tight">{item.label}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-2 border-t border-slate-50 bg-slate-50/50">
          <a href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-orange-600 transition-colors rounded-xl hover:bg-white font-medium text-sm">
            <Home size={18} />
            <span>View Website</span>
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 w-full overflow-hidden">
        
        {/* Mobile Top Bar (Only visible on mobile) */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Coffee className="text-orange-600" size={20} />
            <span className="font-black text-slate-800 uppercase text-xs tracking-tighter">Cafe Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-slate-50 rounded-lg text-slate-600"
          >
            <Menu size={20} />
          </button>
        </div>

        <header className="mb-10 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">
              <Settings2 size={12} /> Dashboard Control
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 capitalize tracking-tight">
              {activeTab} <span className="text-slate-400 font-light">Management</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium text-sm md:text-base">
              Update and manage your cafe's {activeTab} details in real-time.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-bold text-slate-700">Database Connected</p>
              </div>
            </div>
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </section>

        <footer className="mt-20 text-center border-t border-slate-100 pt-8">
          <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} Your Cafe Name • Built for Excellence
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;