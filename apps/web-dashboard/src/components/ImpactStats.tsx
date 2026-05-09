import React from 'react';
import { Globe, Leaf, Heart } from 'lucide-react';

const ImpactStats = () => {
  return (
    <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Network Impact</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Leaf size={24} />
          </div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>1,240kg</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Food Waste Prevented</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Globe size={24} />
          </div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>3.2 Tons</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>CO2 Offset</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Heart size={24} />
          </div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>124</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Farmers Supported</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactStats;
