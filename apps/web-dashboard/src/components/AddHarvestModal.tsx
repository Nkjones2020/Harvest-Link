import React, { useState } from 'react';
import { X, Package, Calendar, Warehouse, MapPin, ArrowRight } from 'lucide-react';

interface AddHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const AddHarvestModal: React.FC<AddHarvestModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    quantityKg: '',
    storageMethod: 'open_air',
    askingPrice: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3005/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // In a real app, we would include the JWT token here
          // For this demo, we'll pass the userId in the body if the backend is mocked,
          // but our backend expects JWT. 
          // Since I haven't implemented full JWT storage in web yet, I'll mock the token for now
          'Authorization': `Bearer dev_token` 
        },
        body: JSON.stringify({
          ...formData,
          quantityKg: parseFloat(formData.quantityKg),
          askingPrice: parseFloat(formData.askingPrice),
          harvestDate: new Date().toISOString().split('T')[0],
          latitude: 5.6037, // Default Accra
          longitude: -0.1870
        }),
      });

      if (!res.ok) throw new Error('Failed to save harvest');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal card glass">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="auth-header">
          <h2>Log New Harvest</h2>
          <p>Record your harvest to find buyers and predict spoilage.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <div className="input-wrapper">
              <Package size={18} className="input-icon" />
              <select 
                required 
                value={formData.cropType}
                onChange={e => setFormData({...formData, cropType: e.target.value})}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}
              >
                <option value="">Select Crop Type</option>
                <option value="Tomatoes">Tomatoes</option>
                <option value="Maize">Maize</option>
                <option value="Onions">Onions</option>
                <option value="Cassava">Cassava</option>
                <option value="Yam">Yam</option>
                <option value="Plantain">Plantain</option>
                <option value="Pepper">Pepper</option>
                <option value="Cabbage">Cabbage</option>
                <option value="Carrot">Carrot</option>
                <option value="Beans">Beans</option>
                <option value="Mango">Mango</option>
                <option value="Orange">Orange</option>
                <option value="Pineapple">Pineapple</option>
                <option value="Avocado">Avocado</option>
                <option value="Watermelon">Watermelon</option>
                <option value="Papaya">Papaya</option>
                <option value="Banana">Banana</option>
                <option value="Okra">Okra</option>
                <option value="Cucumber">Cucumber</option>
                <option value="Spinach">Spinach</option>
                <option value="Ginger">Ginger</option>
                <option value="Garlic">Garlic</option>
                <option value="Lettuce">Lettuce</option>
              </select>
            </div>

            <div className="input-wrapper">
              <Package size={18} className="input-icon" />
              <input 
                type="number" 
                placeholder="Quantity (kg)" 
                required 
                value={formData.quantityKg}
                onChange={e => setFormData({...formData, quantityKg: e.target.value})}
              />
            </div>

            <div className="input-wrapper">
              <Warehouse size={18} className="input-icon" />
              <select 
                required 
                value={formData.storageMethod}
                onChange={e => setFormData({...formData, storageMethod: e.target.value})}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}
              >
                <option value="open_air">Open Air</option>
                <option value="grain_bag">Grain Bag</option>
                <option value="cold_store">Cold Store</option>
                <option value="silo">Silo</option>
              </select>
            </div>

            <div className="input-wrapper">
              <span className="input-icon" style={{ left: '1rem', fontWeight: 700 }}>₵</span>
              <input 
                type="number" 
                placeholder="Asking Price (per kg)" 
                required 
                value={formData.askingPrice}
                onChange={e => setFormData({...formData, askingPrice: e.target.value})}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? 'Saving...' : 'Register Harvest'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHarvestModal;
