import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignmentData, setAssignmentData] = useState({ trainerId: '', userId: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchUsers(), fetchAssignments()]);
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            // We need a new endpoint for this, or we can just fetch all users and their assignments if available
            // Let's assume we add a /api/admin/assignments endpoint
            const response = await api.get('/api/admin/assignments');
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/api/admin/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/assign', null, {
                params: {
                    trainerId: assignmentData.trainerId,
                    userId: assignmentData.userId
                }
            });
            alert('Assignment completed successfully!');
            setAssignmentData({ trainerId: '', userId: '' });
            fetchAssignments();
        } catch (error) {
            console.error('Error assigning trainer:', error);
            const msg = error.response?.data?.message || error.message || 'Verification failure';
            alert(`Failed: ${msg}`);
        }
    };

    if (loading) return <div className="p-10 text-center font-black">SYNCING DATA...</div>;

    const trainers = users.filter(u => u.role === 'TRAINER');
    const regularUsers = users.filter(u => u.role === 'USER');

    return (
        <div className="container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <header>
                <h1 className="text-4xl font-black tracking-tight mb-2">Admin Portal</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">User Management & Assignment</p>
            </header>

            <div className="grid grid-cols-2 gap-8">
                {/* Assignment Console */}
                <section className="card p-8">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-wider">Assignment Console</h2>
                    <form onSubmit={handleAssign} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2">Select Member</label>
                            <select
                                className="input-field w-full"
                                value={assignmentData.userId}
                                onChange={(e) => setAssignmentData({ ...assignmentData, userId: e.target.value })}
                                required
                            >
                                <option value="">Choose Member</option>
                                {regularUsers.map(u => <option key={u.id} value={u.id}>{u.username} (ID: {u.id})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2">Assign Trainer</label>
                            <select
                                className="input-field w-full"
                                value={assignmentData.trainerId}
                                onChange={(e) => setAssignmentData({ ...assignmentData, trainerId: e.target.value })}
                                required
                            >
                                <option value="">Choose Trainer</option>
                                {trainers.map(t => <option key={t.id} value={t.id}>{t.username} (ID: {t.id})</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary mt-4 py-4 uppercase font-black tracking-widest">
                            Assign Trainer
                        </button>
                    </form>
                </section>

                {/* User Statistics */}
                <section className="card p-8 bg-slate-900 text-white border-none flex flex-col justify-center text-center">
                    <div className="text-5xl font-black mb-2">{users.length}</div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-60">Total Users</div>
                </section>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Active Users Table */}
                <section className="card p-8">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-wider">Active Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    <th className="py-4 text-xs font-black uppercase text-slate-400">ID</th>
                                    <th className="py-4 text-xs font-black uppercase text-slate-400">Name</th>
                                    <th className="py-4 text-xs font-black uppercase text-slate-400">Role</th>
                                    <th className="py-4 text-xs font-black uppercase text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={`${user.id}-${user.role}`} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 font-mono text-slate-400">{user.id}</td>
                                        <td className="py-4 font-black">{user.username}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                                                user.role === 'TRAINER' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-500 font-black uppercase text-[10px] hover:underline tracking-widest"
                                            >
                                                Delete User
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Current Assignments Table */}
                <section className="card p-8">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-wider">Live Assignments</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    <th className="py-4 text-xs font-black uppercase text-slate-400">Member</th>
                                    <th className="py-4 text-xs font-black uppercase text-slate-400">Trainer</th>
                                    <th className="py-4 text-xs font-black uppercase text-slate-400">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="py-10 text-center text-slate-400 font-bold uppercase text-xs">No active assignments found.</td>
                                    </tr>
                                )}
                                {assignments.map(a => (
                                    <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm">
                                        <td className="py-4 font-black">{a.user?.username}</td>
                                        <td className="py-4 text-primary font-black">Coach {a.trainer?.username}</td>
                                        <td className="py-4 text-slate-400 font-mono text-xs">{a.assignedDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
