import React from 'react';
import { MoreHorizontal, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface HarvestTableProps {
  data: any[];
}

const HarvestTable: React.FC<HarvestTableProps> = ({ data }) => {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Harvests</h3>
        <button className="card" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <MoreHorizontal size={20} color="#64748b" />
        </button>
      </div>

      <div className="table-responsive">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
              <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>CROP TYPE</th>
              <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>QUANTITY</th>
              <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>HARVEST DATE</th>
              <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>RISK LEVEL</th>
              <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No harvests logged yet.</td>
              </tr>
            ) : (
              data.map((harvest) => (
                <tr key={harvest.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 0.5rem', fontWeight: 600 }}>{harvest.crop_type}</td>
                  <td style={{ padding: '1.25rem 0.5rem' }}>{harvest.quantity_kg.toLocaleString()} kg</td>
                  <td style={{ padding: '1.25rem 0.5rem', color: '#64748b' }}>{harvest.harvest_date}</td>
                  <td style={{ padding: '1.25rem 0.5rem' }}>
                    <div className={`badge badge-${harvest.spoilage_risk}`}>
                      {harvest.spoilage_risk === 'red' && <AlertCircle size={14} style={{ marginRight: '4px' }} />}
                      {harvest.spoilage_risk === 'amber' && <Clock size={14} style={{ marginRight: '4px' }} />}
                      {harvest.spoilage_risk === 'green' && <CheckCircle2 size={14} style={{ marginRight: '4px' }} />}
                      {harvest.spoilage_risk.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 0.5rem' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#64748b'
                    }}>
                      {harvest.status || 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HarvestTable;
