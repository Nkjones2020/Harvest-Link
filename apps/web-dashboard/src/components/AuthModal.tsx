import React, { useState } from 'react';
import { X, Phone, User, Tractor, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = mode === 'signup' ? 'register' : 'login';
    const body = mode === 'signup' 
      ? { ...formData, role } 
      : { phone: formData.phone };

    try {
      const res = await fetch(`http://localhost:3005/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');

      onAuthSuccess(data.user, data.access_token);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal card glass">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="auth-header">
          <h2>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{mode === 'signup' ? 'Join the HarvestLink ecosystem today.' : 'Sign in to manage your harvests.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="role-selector">
              <div 
                className={`role-option ${role === 'farmer' ? 'active' : ''}`}
                onClick={() => setRole('farmer')}
              >
                <Tractor size={20} />
                <span>Farmer</span>
              </div>
              <div 
                className={`role-option ${role === 'buyer' ? 'active' : ''}`}
                onClick={() => setRole('buyer')}
              >
                <ShoppingBag size={20} />
                <span>Buyer</span>
              </div>
            </div>
          )}

          <div className="input-group">
            {mode === 'signup' && (
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input 
                type="tel" 
                placeholder="Phone Number (e.g. 0241234567)" 
                required 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            {mode === 'signup' && (
              <div className="input-wrapper">
                <ShieldCheck size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Location (City/Region)" 
                  required 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary btn-block">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
              {mode === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
