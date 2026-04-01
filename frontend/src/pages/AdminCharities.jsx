import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Loader2, Trash2, Plus } from 'lucide-react';

const AdminCharities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  
  const [newCharity, setNewCharity] = useState({ name: '', description: '', image: '' });
  const [adding, setAdding] = useState(false);

  const fetchCharities = async () => {
    try {
      const res = await api.get('/charities');
      setCharities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/admin/charities', newCharity);
      setNewCharity({ name: '', description: '', image: '' });
      setShowAdd(false);
      fetchCharities();
    } catch (err) {
      alert('Failed to add charity');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this charity completely?')) return;
    try {
      await api.delete(`/admin/charities/${id}`);
      fetchCharities();
    } catch (err) {
      alert('Failed to delete charity');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-nature-600" /></div>;

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Charities</h1>
          <p className="text-gray-500 mt-1">{charities.length} active organizations.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
          <Plus className="w-5 h-5 mr-1" /> Add Charity
        </button>
      </div>

      {showAdd && (
        <div className="card p-6 mb-8 animate-fade-in-up border-nature-200 ring-1 ring-nature-100">
          <h2 className="text-lg font-bold mb-4">Add New Organization</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input required type="text" className="input-field" value={newCharity.name} onChange={e => setNewCharity({...newCharity, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required rows="2" className="input-field" value={newCharity.description} onChange={e => setNewCharity({...newCharity, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input type="url" className="input-field" value={newCharity.image} onChange={e => setNewCharity({...newCharity, image: e.target.value})} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={adding} className="btn-primary">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map(c => (
          <div key={c.id} className="card relative group">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${c.image || 'https://images.unsplash.com/photo-1593111774240'})` }} />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2">{c.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
            </div>
            <button 
              onClick={() => handleDelete(c.id)}
              className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCharities;
