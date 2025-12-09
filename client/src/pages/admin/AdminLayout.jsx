import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../styles/Admin.css';

// admin panel added
const AdminLayout = () => {
  const user = useSelector((s) => s.user);

  // minimal auth guard for frontend
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ padding: 40 }}>
        <h3>Access denied</h3>
        <p>Admin login required. <Link to="/admin/login">Go to Admin Login</Link></p>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/spaces">Spaces</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
