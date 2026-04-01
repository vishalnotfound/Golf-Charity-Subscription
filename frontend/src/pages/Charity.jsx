import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle2 } from 'lucide-react';

const Charity = () => {
  const { user, setUser } = useAuth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(user?.charity_id || null);
  const [percentage, setPercentage] = useState(user?.charity_percentage || 10);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data);
      } catch (err) {
        console.error('Failed to fetch charities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.post('/charity/select', { charity_id: selectedId, percentage: parseFloat(percentage) });
      // Update local context
      const userRes = await api.get('/admin/me');
      setUser(userRes.data);
      setSuccessMsg('Charity selection saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-nature-600" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Support a Charity</h1>
        <p className="text-gray-500 mt-1">Select a charity to dedicate your subscription percentage to.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {charities.map((charity) => (
            <div 
              key={charity.id}
              onClick={() => setSelectedId(charity.id)}
              className={`card cursor-pointer transition-all border-2 ${
                selectedId === charity.id ? 'border-nature-500 ring-2 ring-nature-100' : 'border-transparent hover:border-gray-200'
              }`}
            >
              <div 
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${charity.image || 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400'})` }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{charity.name}</h3>
                  {selectedId === charity.id && <CheckCircle2 className="text-nature-500 w-5 h-5" />}
                </div>
                <p className="text-sm text-gray-500 line-clamp-3">{charity.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 border-l pl-0 lg:pl-8">
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Allocation Details</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contribution Percentage ({percentage}%)
              </label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-nature-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Minimum 10%</span>
                <span>Maximum 100%</span>
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={!selectedId || saving}
              className="w-full btn-primary"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Selection'}
            </button>

            {successMsg && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {successMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charity;
