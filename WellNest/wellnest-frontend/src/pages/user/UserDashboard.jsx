import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Utensils, Moon, Flame, Droplets, TrendingUp, LogOut, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'
    const [stats, setStats] = useState({
        calories: 0,
        water: 0,
        workouts: 0,
        sleep: 0
    });
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

    const goals = {
        calories: 2000,
        water: 3,
        workouts: 1,
        sleep: 8
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const today = new Date();
                let startDate, endDate;

                if (viewMode === 'daily') {
                    startDate = today.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                } else if (viewMode === 'weekly') {
                    const lastWeek = new Date();
                    lastWeek.setDate(today.getDate() - 7);
                    startDate = lastWeek.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                } else if (viewMode === 'monthly') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(today.getMonth() - 1);
                    startDate = lastMonth.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                }

                const params = { startDate, endDate };
                const [workoutsRes, mealsRes, sleepRes, trainerRes] = await Promise.all([
                    api.get('/api/user/workouts', { params }),
                    api.get('/api/user/meals', { params }),
                    api.get('/api/user/sleep-mood', { params }),
                    api.get('/api/user/assigned-trainer').catch(() => null)
                ]);

                if (trainerRes) setTrainer(trainerRes.data);

                const totalCalories = mealsRes.data.reduce((acc, meal) => acc + (meal.calories || 0), 0);
                const totalWater = mealsRes.data.reduce((acc, meal) => acc + (meal.waterIntake || 0), 0);
                const completedWorkouts = workoutsRes.data.filter(w => w.completed).length;
                const avgSleep = sleepRes.data.length > 0
                    ? (sleepRes.data.reduce((acc, s) => acc + s.sleepHours, 0) / sleepRes.data.length).toFixed(1)
                    : 0;

                setStats({
                    calories: totalCalories,
                    water: totalWater,
                    workouts: completedWorkouts,
                    sleep: parseFloat(avgSleep)
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [viewMode]);

    const ProgressBar = ({ current, goal, color }) => {
        const percentage = Math.min((current / goal) * 100, 100);
        return (
            <div style={{ width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', height: '8px', marginTop: '1rem', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: '100%', borderRadius: '999px', backgroundColor: color }}
                />
            </div>
        );
    };

    return (
        <div className="container animate-slide-up" style={{ paddingBottom: '6rem' }}>
            <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '1.875rem' }}>
                        Hey <span className="gradient-text">{user?.username}</span>!
                    </h1>
                    <p className="text-slate-500 font-bold tracking-wide uppercase" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Let's achieve your goals</p>
                </div>
                <button
                    onClick={logout}
                    className="card flex items-center justify-center logout-btn"
                    style={{ padding: '0.75rem', width: '3rem', height: '3rem', borderRadius: '1rem' }}
                >
                    <LogOut size={20} className="text-slate-400" />
                </button>
            </header>

            {/* View Selector */}
            <div style={{
                display: 'flex', gap: '0.5rem', padding: '0.25rem',
                background: '#f1f5f9', borderRadius: '1rem', marginBottom: '1.5rem',
                width: 'fit-content'
            }}>
                {['daily', 'weekly', 'monthly'].map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        style={{
                            padding: '0.5rem 1.25rem', border: 'none', borderRadius: '0.75rem',
                            fontSize: '11px', fontWeight: 900, textTransform: 'uppercase',
                            letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s',
                            background: viewMode === mode ? 'white' : 'transparent',
                            color: viewMode === mode ? 'var(--primary)' : '#94a3b8',
                            boxShadow: viewMode === mode ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* Streak Tracking */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    borderRadius: '24px',
                    padding: '2rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '2rem'
                }}
                className="gradient-bg"
            >
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', width: 'fit-content' }}>
                            <TrendingUp size={14} />
                            <span className="font-black uppercase tracking-widest" style={{ fontSize: '10px' }}>Daily Streak</span>
                        </div>
                        <h2 className="font-black" style={{ fontSize: '3rem', margin: 0 }}>
                            07 <span style={{ fontSize: '1.25rem', opacity: 0.8 }} className="font-bold uppercase tracking-widest">Days</span>
                        </h2>
                        <p style={{ opacity: 0.9, fontWeight: 500 }}>You are on fire! Keep going.</p>
                    </div>
                    <div className="card" style={{ width: '5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.5rem', transform: 'rotate(-12deg)' }}>
                        <Flame size={40} className="text-primary" />
                    </div>
                </div>
            </motion.div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '1rem' }}>
                {[
                    { icon: <Flame size={20} />, label: 'Calories', value: stats.calories, goal: goals.calories, unit: 'kcal', color: '#f59e0b', bg: '#fff7ed', text: '#ea580c' },
                    { icon: <Droplets size={20} />, label: 'Water', value: stats.water, goal: goals.water, unit: 'L', color: '#3b82f6', bg: '#eff6ff', text: '#2563eb' },
                    { icon: <Activity size={20} />, label: 'Workouts', value: stats.workouts, goal: goals.workouts, unit: 'today', color: '#10b981', bg: '#ecfdf5', text: '#059669' },
                    { icon: <Moon size={20} />, label: 'Sleep', value: stats.sleep, goal: goals.sleep, unit: 'hrs', color: '#8b5cf6', bg: '#f5f3ff', text: '#7c3aed' },
                ].map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="card flex-col"
                        style={{ display: 'flex' }}
                    >
                        <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                            <div style={{
                                width: '3rem', height: '3rem',
                                backgroundColor: item.bg, color: item.text,
                                borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {item.icon}
                            </div>
                            <span className="font-black text-slate-400 uppercase tracking-widest" style={{ fontSize: '10px' }}>{item.label}</span>
                        </div>
                        <div>
                            <div className="flex items-baseline" style={{ gap: '0.25rem' }}>
                                <h3 className="font-black text-slate-800" style={{ fontSize: '1.875rem' }}>{item.value}</h3>
                                <span className="font-bold text-slate-400 uppercase" style={{ fontSize: '0.75rem' }}>{item.unit}</span>
                            </div>
                            <ProgressBar current={item.value} goal={item.goal} color={item.color} />
                            <p className="font-bold text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', marginTop: '0.5rem', textAlign: 'right' }}>
                                Goal: {item.goal}{item.unit}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Assigned Trainer */}
            {trainer && (
                <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                    <div style={{ width: '4rem', height: '4rem', background: 'var(--primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Award size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p className="font-black text-slate-400 uppercase tracking-widest" style={{ fontSize: '10px' }}>Your Assigned Trainer</p>
                        <h3 className="font-black text-slate-800" style={{ fontSize: '1.25rem' }}>Coach {trainer.username || 'Pro'}</h3>
                        <p className="text-slate-500 text-sm font-medium italic">{trainer.specialization || 'Fitness Professional'}</p>
                    </div>
                    <div style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '0.75rem', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="text-primary shadow-sm">
                        Active Support
                    </div>
                </div>
            )}

            {/* Daily Challenge Card */}
            <div className="card" style={{ background: '#0f172a', border: 'none', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex items-center gap-4">
                            <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Award className="text-primary" size={24} />
                            </div>
                            <h3 className="font-black" style={{ color: 'white', fontSize: '1.25rem' }}>Daily Challenge</h3>
                        </div>
                        <p className="text-slate-400 font-medium" style={{ maxWidth: '300px' }}>Complete 2 more sets of pushups to earn your "Strength Master" badge!</p>
                        <button style={{
                            background: 'none', border: 'none', color: '#14b8a6',
                            fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem',
                            letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            View Details <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
