import { useEffect, useState } from 'react';
import "../../styles/AdminSpaces.css";

// admin panel added
const AdminSpaces = () => {
  const [spaces, setSpaces] = useState([]);

  const fetchSpaces = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/spaces', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setSpaces(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSpaces(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/spaces/${id}/status`, { method: 'PATCH', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ status }) });
      const updated = await res.json();
      setSpaces((s) => s.map(x => x._id === updated._id ? updated : x));
    } catch (err) { console.error(err); }
  };

  const removeSpace = async (id) => {
    if (!window.confirm('Remove space?')) return;
    try {
      await fetch(`http://localhost:3001/admin/spaces/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setSpaces((s) => s.filter(x => x._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-container">
      <h2>Spaces</h2>
      <table className="admin-table">
        <thead><tr><th>Title</th><th>Creator</th><th>Actions</th></tr></thead>
        <tbody>
          {spaces.map(s => (
            <tr key={s._id}>
              <td data-label="Title">{s.title}</td>
              <td data-label="Creator">{s.creator?.firstName} {s.creator?.lastName}</td>
              {/* <td data-label="Status">{s.status}</td> */}
              <td data-label="Actions" className="admin-actions">
                {/* {s.status !== 'approved' && <button className="btn success small" onClick={() => updateStatus(s._id, 'approved')}>Confirm</button>}
                {s.status !== 'rejected' && <button className="btn danger small" onClick={() => updateStatus(s._id, 'rejected')}>Reject</button>} */}
                <button className="btn ghost small" onClick={() => removeSpace(s._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSpaces;
