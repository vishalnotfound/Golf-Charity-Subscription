import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Trash } from 'lucide-react';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await api.get('/charities');
      setCharities(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/charities', { name, description: desc, image: url });
      setName(''); setDesc(''); setUrl('');
      fetchCharities();
    } catch (err) {
      alert('Failed to add charity');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/charities/${id}`);
      fetchCharities();
    } catch(err) {
      alert('Delete charity failed - check if endpoint exists');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Charities</h1>
        <p>Add or remove supported charities.</p>
      </div>

      <div className="two-col-layout">
        <div className="glass-panel">
          <h2>Add Charity</h2>
          <form onSubmit={handleAdd} className="mt-4">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Website URL</label>
              <input type="url" value={url} onChange={e=>setUrl(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary w-full">Add Charity</button>
          </form>
        </div>

        <div className="glass-panel">
          <h2>Current Charities</h2>
          <div className="mt-4 flex flex-col gap-4">
            {charities.map(c => (
              <div key={c.id} className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <a href={c.website_url} target="_blank" rel="noreferrer" className="text-sm text-link">{c.website_url}</a>
                </div>
                <button className="text-red hover:text-red-400" onClick={() => handleDelete(c.id)}>
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charities;
