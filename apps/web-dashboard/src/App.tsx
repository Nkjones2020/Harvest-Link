import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import HarvestTable from './components/HarvestTable';
import SpoilageChart from './components/SpoilageChart';
import { Tractor, TrendingUp, AlertTriangle, Users, Search, Bell, ShoppingCart } from 'lucide-react';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:3005/api';

import ImpactStats from './components/ImpactStats';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import AddHarvestModal from './components/AddHarvestModal';

function App() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('harvestlink_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('harvestlink_token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(false);

  React.useEffect(() => {
    if (user && token) {
      localStorage.setItem('harvestlink_user', JSON.stringify(user));
      localStorage.setItem('harvestlink_token', token);
    } else {
      localStorage.removeItem('harvestlink_user');
      localStorage.removeItem('harvestlink_token');
    }
  }, [user, token]);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings', user?.role],
    queryFn: async () => {
      try {
        const endpoint = user.role === 'farmer' ? '/listings' : '/listings/all';
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) return [];
        return res.json();
      } catch (e) {
        return [];
      }
    },
    refetchInterval: 5000,
    enabled: !!user && !!token,
  });

  const totalQuantity = listings?.reduce((acc: number, curr: any) => acc + (curr.quantity_kg || 0), 0) || 0;
  const highRiskCount = listings?.filter((l: any) => l.spoilage_risk === 'red').length || 0;

  const handleAuthSuccess = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setIsAuthModalOpen(true)} />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      <Sidebar onLogout={handleLogout} role={user.role} />
      
      <main className="main-layout">
        <header className="header-bar">
          <div className="search-bar card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', width: '350px' }}>
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder={user.role === 'farmer' ? "Search your harvests..." : "Search marketplace..."} 
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9375rem' }}
            />
          </div>

          <div className="user-profile">
            {user.role === 'farmer' && (
              <button 
                className="btn-primary" 
                style={{ marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setIsAddHarvestOpen(true)}
              >
                <Tractor size={18} />
                Add Harvest
              </button>
            )}
            <div className="card" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} color="#64748b" />
            </div>
            <div className="avatar" onClick={handleLogout} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="User" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{user.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account</span>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-section" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {user.role === 'farmer' ? 'Farmer Dashboard' : 'Buyer Marketplace'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {user.role === 'farmer' 
                ? `Welcome back, ${user.name}! Here's your harvest overview.` 
                : `Welcome back, ${user.name}! Explore fresh harvests available today.`}
            </p>
          </div>

          <div className="stats-grid">
            <StatCard 
              label={user.role === 'farmer' ? "Your Total Produce" : "Market Availability"} 
              value={`${totalQuantity.toLocaleString()} kg`} 
              icon={user.role === 'farmer' ? Tractor : ShoppingCart} 
              trend="+12.5%" 
              color="#22c55e" 
            />
            <StatCard 
              label={user.role === 'farmer' ? "Market Matches" : "Verified Farmers"} 
              value={user.role === 'farmer' ? "18" : "342"} 
              icon={TrendingUp} 
              trend="+5" 
              color="#3b82f6" 
            />
            <StatCard 
              label="Critical Alerts" 
              value={highRiskCount.toString()} 
              icon={AlertTriangle} 
              trend="-2" 
              color="#f59e0b" 
            />
            <StatCard 
              label="Active Network" 
              value="1.2k" 
              icon={Users} 
              trend="+18%" 
              color="#8b5cf6" 
            />
          </div>

          <ImpactStats />

          <div className="content-grid">
            <div className="left-column">
              <HarvestTable 
                data={listings || []} 
                title={user.role === 'farmer' ? "Your Recent Harvests" : "Available Harvests"} 
              />
            </div>
            <div className="right-column">
              <SpoilageChart data={listings || []} />
            </div>
          </div>
        </section>
      </main>

      <AddHarvestModal 
        isOpen={isAddHarvestOpen} 
        onClose={() => setIsAddHarvestOpen(false)} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['listings'] })}
        userId={user.id}
      />
    </div>
  );
}

export default App;
