import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [tips, setTips] = useState([]);
    const [newTip, setNewTip] = useState('');
    const [loading, setLoading] = useState(true);
    const [assignmentData, setAssignmentData] = useState({ trainerId: '', userId: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchUsers(), fetchTips()]);
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/admin/users');
            const trainersRes = await api.get('/api/admin/trainers');
            setUsers([...response.data, ...trainersRes.data.filter(t => !response.data.some(u => u.id === t.id))]);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchTips = async () => {
        try {
            const response = await api.get('/api/admin/tips');
            setTips(response.data);
        } catch (error) {
            console.error('Error fetching tips:', error);
        }
    };

    const handleAddTip = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/tips', newTip, { headers: { 'Content-Type': 'text/plain' } });
            setNewTip('');
            fetchTips();
        } catch (error) {
            console.error('Error adding tip:', error);
        }
    };

    const handleDeleteTip = async (id) => {
        try {
            await api.delete(`/api/admin/tips/${id}`);
            fetchTips();
        } catch (error) {
            console.error('Error deleting tip:', error);
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
            alert('Trainer Assigned Successfully!');
            setAssignmentData({ trainerId: '', userId: '' });
            fetchUsers();
        } catch (error) {
            console.error('Error assigning trainer:', error);
            alert(`Failed: ${error.response?.data || error.message}`);
        }
    };

    if (loading) return <div className="p-10 text-center font-black">SYNCING SECURE DATA...</div>;

    const trainers = users.filter(u => u.role === 'TRAINER');
    const regularUsers = users.filter(u => u.role === 'USER');

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            <header>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                    Administrator <span className="text-primary italic">Command Center</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Scale and Manage WellNest Ecosystem</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assignment Console */}
                <section className="lg:col-span-2 card p-10 bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">Assign</div>
                        Roster Management
                    </h3>
                    <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Member / User</label>
                            <select
                                className="input-field w-full"
                                value={assignmentData.userId}
                                onChange={(e) => setAssignmentData({ ...assignmentData, userId: e.target.value })}
                                required
                            >
                                <option value="">Select Member</option>
                                {regularUsers.map(u => <option key={u.id} value={u.id}>{u.username} (ID: {u.id})</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Performance Coach</label>
                            <select
                                className="input-field w-full"
                                value={assignmentData.trainerId}
                                onChange={(e) => setAssignmentData({ ...assignmentData, trainerId: e.target.value })}
                                required
                            >
                                <option value="">Select Trainer</option>
                                {trainers.map(t => <option key={t.id} value={t.id}>{t.username} (ID: {t.id})</option>)}
                            </select>
                        </div>
                        <button type="submit" className="lg:col-span-2 btn-primary py-4 font-black uppercase tracking-widest text-xs">
                            Confirm Assignment
                        </button>
                    </form>
                </section>

                <div className="space-y-8">
                    {/* Tip of the Day Management */}
                    <section className="card p-8 bg-slate-900 text-white border-none shadow-2xl">
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary">Daily Wisdom</h4>
                        <form onSubmit={handleAddTip} className="space-y-4">
                            <textarea
                                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold text-slate-300 focus:ring-2 ring-primary outline-none resize-none h-32"
                                placeholder="Enter daily fitness tip..."
                                value={newTip}
                                onChange={(e) => setNewTip(e.target.value)}
                                required
                            />
                            <button className="w-full bg-primary text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                                Publish Tip
                            </button>
                        </form>
                    </section>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Users Table */}
                <section className="card p-8">
                    <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider">User Directory</h3>
                    <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b-2 border-slate-50">
                                    <th className="pb-4 text-[10px] font-black uppercase text-slate-400">Identity</th>
                                    <th className="pb-4 text-[10px] font-black uppercase text-slate-400">Role</th>
                                    <th className="pb-4 text-right text-[10px] font-black uppercase text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={`${u.id}-${u.role}`} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 font-black text-slate-800">{u.username} <span className="text-[10px] text-slate-400 ml-1">#{u.id}</span></td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${u.role === 'ADMIN' ? 'bg-red-50 text-red-500' : u.role === 'TRAINER' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button onClick={() => handleDelete(u.id)} className="text-[10px] font-black text-rose-500 uppercase hover:underline">Revoke Access</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Tips Table */}
                <section className="card p-8">
                    <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider">Historical Tips</h3>
                    <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                        <div className="space-y-4">
                            {tips.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">No tips published yet.</p>}
                            {tips.map(tip => (
                                <div key={tip.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-start gap-4">
                                    <p className="text-xs font-bold text-slate-600 italic">"{tip.content}"</p>
                                    <button onClick={() => handleDeleteTip(tip.id)} className="text-rose-500 font-black uppercase text-[10px] hover:underline">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
