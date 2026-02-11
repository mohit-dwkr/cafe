import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; // Path check kar lein agar error aaye
import AdminLayout from '@/components/Admin/AdminLayout';
import StatusAdmin from '@/components/Admin/StatusAdmin';
import ProductsAdmin from '@/components/Admin/ProductsAdmin';
import GalleryAdmin from '@/components/Admin/GalleryAdmin';
import HeroAdmin from '@/components/Admin/HeroAdmin';
import Login from '@/components/Admin/Login'; // Login component import karein

const Admin = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session when page loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading state jab tak Supabase check kar raha hai
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // AGAR USER LOGIN NAHI HAI TO LOGIN PAGE DIKHAO
  if (!session) {
    return <Login />;
  }

  // AGAR LOGIN HAI TO ACTUAL DASHBOARD DIKHAO
  const renderContent = () => {
    switch (activeTab) {
      case 'status': return <StatusAdmin />;
      case 'products': return <ProductsAdmin />;
      case 'gallery': return <GalleryAdmin />;
      case 'hero': return <HeroAdmin />;
      default: return <StatusAdmin />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default Admin;