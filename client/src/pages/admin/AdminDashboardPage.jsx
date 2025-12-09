import { useEffect, useState } from 'react';
import '../../styles/Admin.css';

// admin panel added
const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="admin-stats">
        <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Users</p></div>
        <div className="stat-card"><h3>{stats.totalSpaces}</h3><p>Spaces</p></div>
        <div className="stat-card"><h3>{stats.totalBookings}</h3><p>Bookings</p></div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
