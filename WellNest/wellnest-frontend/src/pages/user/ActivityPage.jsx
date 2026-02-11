import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, Clock, Flame, ChevronRight, X, Trophy } from 'lucide-react';
import api from '../../api/axios';

const ActivityPage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [logModal, setLogModal] = useState(null);

    useEffect(() => {
        fetchWorkouts();
    }, [selectedDate]);

    const fetchWorkouts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/user/workouts?date=${selectedDate}`);
            setWorkouts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLog = async (id, actualReps) => {
        try {
            await api.post(`/api/user/workouts/${id}/log?actualReps=${actualReps}&completed=true`);
            fetchWorkouts();
            setLogModal(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            <header className="flex justify-between items-center" style={{ marginBottom: '2.5rem', paddingTop: '1rem' }}>
                <div>
                    <h1 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '2.25rem' }}>
                        Daily <span className="gradient-text">Activity</span>
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest uppercase" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Keep track of your fitness progress</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="card" style={{ padding: '0.25rem 0.25rem 0.25rem 1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white' }}>
                        <span className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '10px' }}>Date</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                border: 'none', background: '#f1f5f9', padding: '0.5rem 0.75rem',
                                borderRadius: '0.75rem', fontWeight: 900, color: 'var(--primary)',
                                fontSize: '12px', outline: 'none', cursor: 'pointer'
                            }}
                        />
                    </div>
                    <div className="card" style={{ padding: '0.75rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={24} className="text-primary" />
                    </div>
                </div>
            </header>

            <div className="flex flex-col gap-6">
                {workouts.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--border-color)', background: 'transparent' }}
                    >
                        <div style={{ width: '5rem', height: '5rem', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Activity className="text-slate-300" size={40} />
                        </div>
                        <h3 className="font-bold text-slate-800" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Workouts Found</h3>
                        <p className="text-slate-500">Your trainer hasn't assigned anything for today yet.</p>
                    </motion.div>
                )}

                {workouts.map((workout, idx) => (
                    <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card"
                        style={{
                            position: 'relative', overflow: 'hidden',
                            backgroundColor: workout.completed ? 'rgba(248, 250, 252, 0.5)' : 'white'
                        }}
                    >
                        {workout.completed && (
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                <CheckCircle2 className="text-success" size={24} />
                            </div>
                        )}

                        <div className="flex items-center justify-between" style={{ gap: '1.5rem' }}>
                            <div className="flex items-center gap-6">
                                <div style={{
                                    width: '4rem', height: '4rem', borderRadius: '1.25rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: workout.completed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(20, 184, 166, 0.1)',
                                    color: workout.completed ? '#22c55e' : '#14b8a6'
                                }}>
                                    <Activity size={32} />
                                </div>
                                <div>
                                    <h3 className="font-black" style={{
                                        fontSize: '1.25rem',
                                        color: workout.completed ? '#94a3b8' : '#0f172a',
                                        textDecoration: workout.completed ? 'line-through' : 'none'
                                    }}>
                                        {workout.workoutName}
                                    </h3>
                                    <div className="flex items-center gap-4" style={{ marginTop: '0.25rem' }}>
                                        <span className="text-slate-400 font-bold uppercase tracking-wider" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Clock size={14} /> {workout.targetTime || 'Anytime'}
                                        </span>
                                        <span className="text-slate-400 font-bold uppercase tracking-wider" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Flame size={14} style={{ color: '#f97316' }} /> {workout.targetReps} Reps
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!workout.completed && (
                                <button
                                    onClick={() => setLogModal(workout)}
                                    className="btn-primary"
                                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
                                >
                                    LOG PROGRESS <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Log Modal */}
            <AnimatePresence>
                {logModal && (
                    <div style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '400px', padding: 0, overflow: 'hidden', border: 'none' }}
                        >
                            <div className="gradient-bg" style={{ padding: '2rem', color: 'white', position: 'relative' }}>
                                <button
                                    onClick={() => setLogModal(null)}
                                    style={{
                                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                                        width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.2)',
                                        borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                                <div style={{
                                    width: '4rem', height: '4rem', background: 'white',
                                    borderRadius: '1.25rem', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                                }}>
                                    <Trophy size={32} className="text-primary" />
                                </div>
                                <h3 className="font-black" style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Great Work!</h3>
                                <p style={{ opacity: 0.8, fontWeight: 500 }}>Record your accomplishments for <span className="font-black" style={{ color: 'white' }}>{logModal.workoutName}</span></p>
                            </div>

                            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <label className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '12px' }}>Your Total Reps</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="input-field"
                                            style={{ fontSize: '2.25rem', padding: '1.25rem 2rem', textAlign: 'center', fontWeight: '900' }}
                                            id="actualReps"
                                            autoFocus
                                        />
                                        <div style={{
                                            position: 'absolute', right: '1.5rem', top: '50%',
                                            transform: 'translateY(-50%)', color: '#94a3b8',
                                            fontWeight: '900', fontSize: '1.25rem', fontStyle: 'italic', textTransform: 'uppercase'
                                        }}>Reps</div>
                                    </div>
                                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Target was <span className="font-bold" style={{ color: '#334155' }}>{logModal.targetReps} reps</span></p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setLogModal(null)}
                                        style={{
                                            flex: 1, padding: '1rem', background: '#f1f5f9',
                                            color: '#64748b', fontWeight: 900, borderRadius: '1rem',
                                            border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleLog(logModal.id, document.getElementById('actualReps').value)}
                                        className="btn-primary"
                                        style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}
                                    >
                                        Complete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActivityPage;
