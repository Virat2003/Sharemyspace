import { useEffect, useState } from 'react';
import "../../styles/AdminBookings.css";

// admin panel added
const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/bookings', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setBookings(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/bookings/${id}/status`, { method: 'PATCH', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ status }) });
      const updated = await res.json();
      setBookings((s) => s.map(x => x._id === updated._id ? updated : x));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-container">
      <h2>Bookings</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Space</th>
            <th>Customer</th>
            <th>Dates</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td data-label="Space">{b.listingId?.title || '—'}</td>
              <td data-label="Customer">{b.customerId?.firstName} {b.customerId?.lastName}</td>
              <td data-label="Dates">{b.startDate} - {b.endDate}</td>
              <td data-label="Price">₹{b.totalPrice}</td>
              <td data-label="Status">{b.status}</td>
              <td data-label="Action" className="admin-actions">
                <button className="btn success small" onClick={() => updateStatus(b._id, 'confirmed')}>Confirm</button>
                <button className="btn danger small" onClick={() => updateStatus(b._id, 'rejected')}>Reject</button>
                <button className="btn ghost small" onClick={() => updateStatus(b._id, 'pending')}>Set Pending</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
