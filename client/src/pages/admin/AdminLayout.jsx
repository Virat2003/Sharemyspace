import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../../redux/state';
import '../../styles/Admin.css';

// admin panel added
const AdminLayout = () => {
  const user = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // minimal auth guard for frontend
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ padding: 40 }}>
        <h3>Access denied</h3>
        <p>Admin login required. <Link to="/admin/login">Go to Admin Login</Link></p>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(setLogout());
    try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch (e) {}
    navigate('/login');
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <p style={{color:'rgba(255,255,255,0.85)', marginBottom:12}}>{user?.firstName} {user?.lastName}</p>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/spaces">Spaces</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </nav>
        <div style={{marginTop:18}}>
          <button className="btn ghost logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
