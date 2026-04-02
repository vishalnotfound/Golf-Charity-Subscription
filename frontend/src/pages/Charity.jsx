import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

const Charity = () => {
  const { user } = useAuth();
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(user?.charity_id || null);
  const [percentage, setPercentage] = useState(user?.charity_percentage || 50);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await api.get('/charities');
      setCharities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = async () => {
    if (!selectedCharity) return;
    try {
      await api.post('/charity/select', {
        charity_id: selectedCharity,
        percentage: parseInt(percentage)
      });
      setSuccess('Charity preferences updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Select Charity</h1>
        <p>Choose where a portion of your subscription goes.</p>
      </div>

      {success && <div className="alert-success mb-4">{success}</div>}

      <div className="glass-panel mb-6">
        <h2>Donation Settings</h2>
        <div className="form-group mt-4 max-w-md">
          <label className="flex-between">
            <span>Donation Percentage</span>
            <span className="font-bold text-gradient">{percentage}%</span>
          </label>
          <input 
            type="range" 
            min="10" 
            max="100" 
            step="10"
            value={percentage} 
            onChange={(e) => setPercentage(e.target.value)}
            className="slider"
          />
          <p className="text-sm mt-2 text-muted">Slide to choose how much of your allocated funds go to charity.</p>
          <button onClick={handleSelect} className="btn-primary mt-4" disabled={!selectedCharity}>
            Save Preferences
          </button>
        </div>
      </div>

      <div className="charity-grid">
        {charities.map(charity => (
          <div 
            key={charity.id} 
            className={`charity-card ${selectedCharity === charity.id ? 'selected' : ''}`}
            onClick={() => setSelectedCharity(charity.id)}
          >
            <div className="charity-content">
              <h3>{charity.name}</h3>
              <p>{charity.description}</p>
            </div>
            <div className="charity-footer flex-between">
              <a href={charity.website_url} target="_blank" rel="noreferrer" className="text-link" onClick={e => e.stopPropagation()}>
                Visit Website
              </a>
              {selectedCharity === charity.id && <Heart className="text-pink fill-current" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Charity;
