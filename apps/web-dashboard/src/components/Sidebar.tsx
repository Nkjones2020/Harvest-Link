import React from 'react';
import { LayoutDashboard, ShoppingCart, Tractor, BarChart3, Settings, LogOut, Search } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  role: 'farmer' | 'buyer';
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, role }) => {
  const [activeTab, setActiveTab] = React.useState('Overview');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    ...(role === 'farmer' 
      ? [{ icon: Tractor, label: 'My Harvests' }]
      : [{ icon: Search, label: 'Explore' }]
    ),
    { icon: ShoppingCart, label: 'Marketplace' },
    { icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">H</div>
        <span>HarvestLink</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`nav-item ${activeTab === item.label ? 'active' : ''}`}
            onClick={() => setActiveTab(item.label)}
            style={{ cursor: 'pointer' }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </div>
        <div className="nav-item logout" onClick={onLogout} style={{ cursor: 'pointer' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
