import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpoilageChartProps {
  data: any[];
}

const SpoilageChart: React.FC<SpoilageChartProps> = ({ data }) => {
  // Simple transformation for the chart: show risk scores over time
  const chartData = [...data]
    .sort((a, b) => new Date(a.harvest_date).getTime() - new Date(b.harvest_date).getTime())
    .map(d => ({
      name: d.crop_type,
      risk: d.spoilage_score || 0,
      days: d.spoilage_days || 0
    }));

  return (
    <div className="card" style={{ padding: '1.5rem', height: '100%' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Spoilage Risk Trend</h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Predicted risk score across your inventory</p>
      </div>

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', risk: 0 }]}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="#22c55e" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRisk)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>System Health: Optimal</span>
        </div>
      </div>
    </div>
  );
};

export default SpoilageChart;
