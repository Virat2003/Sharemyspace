import { useEffect, useState } from 'react';
import "../../styles/AdminUsers.css";

// admin panel added
const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/admin/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('fetch users failed', err);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const removeUser = async (id) => {
        if (!window.confirm('Delete user?')) return;
        try {
            await fetch(`http://localhost:3001/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setUsers((u) => u.filter((x) => x._id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="admin-container">
            <h2>Users</h2>

            <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td data-label="Name">{u.firstName} {u.lastName}</td>
                            <td data-label="Email">{u.email}</td>
                            <td data-label="Role">{u.role}</td>
                            <td data-label="Action">
                                <button className="btn danger small" onClick={() => removeUser(u._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
