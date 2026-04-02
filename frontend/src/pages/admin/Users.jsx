import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View all registered users on the platform.</p>
      </div>

      <div className="glass-panel overflow-x-auto">
        {loading ? <p>Loading users...</p> : (
          <table className="data-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-white/10">ID</th>
                <th className="p-4 border-b border-white/10">Name</th>
                <th className="p-4 border-b border-white/10">Email</th>
                <th className="p-4 border-b border-white/10">Role</th>
                <th className="p-4 border-b border-white/10">Plan</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="p-4 border-b border-white/5">{u.id}</td>
                  <td className="p-4 border-b border-white/5">{u.name}</td>
                  <td className="p-4 border-b border-white/5">{u.email}</td>
                  <td className="p-4 border-b border-white/5">
                    <span className={`status-badge ${u.is_admin ? 'admin' : 'user'}`}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="p-4 border-b border-white/5 capitalize">{u.subscription_plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
