import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import HarvestTable from './components/HarvestTable';
import SpoilageChart from './components/SpoilageChart';
import { Tractor, TrendingUp, AlertTriangle, Users, Search, Bell } from 'lucide-react';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:3005/api';

import ImpactStats from './components/ImpactStats';

function App() {
  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/listings/all`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const totalQuantity = listings?.reduce((acc: number, curr: any) => acc + (curr.quantity_kg || 0), 0) || 0;
  const highRiskCount = listings?.filter((l: any) => l.spoilage_risk === 'red').length || 0;

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-layout">
        <header className="header-bar">
          <div className="search-bar card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', width: '350px' }}>
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search harvests, buyers..." 
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9375rem' }}
            />
          </div>

          <div className="user-profile">
            <button className="btn-primary" style={{ marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tractor size={18} />
              Add Harvest
            </button>
            <div className="card" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} color="#64748b" />
            </div>
            <div className="avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>John Farmer</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Farmer Account</span>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-section" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening with your harvests today.</p>
          </div>

          <div className="stats-grid">
            <StatCard 
              label="Total Harvests" 
              value={`${totalQuantity.toLocaleString()} kg`} 
              icon={Tractor} 
              trend="+12.5%" 
              color="#22c55e" 
            />
            <StatCard 
              label="Market Matches" 
              value="18" 
              icon={TrendingUp} 
              trend="+5" 
              color="#3b82f6" 
            />
            <StatCard 
              label="Spoilage Alerts" 
              value={highRiskCount.toString()} 
              icon={AlertTriangle} 
              trend="-2" 
              color="#f59e0b" 
            />
            <StatCard 
              label="Active Buyers" 
              value="124" 
              icon={Users} 
              trend="+18%" 
              color="#8b5cf6" 
            />
          </div>

          <ImpactStats />

          <div className="content-grid">
            <div className="left-column">
              <HarvestTable data={listings || []} />
            </div>
            <div className="right-column">
              <SpoilageChart data={listings || []} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
