import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card stat-card"
    >
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`stat-trend ${trend.startsWith('+') ? 'up' : 'down'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="stat-body">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
