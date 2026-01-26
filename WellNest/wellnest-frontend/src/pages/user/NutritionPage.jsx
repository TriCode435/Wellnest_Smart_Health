import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Droplets, Plus, Coffee, Pizza, Cookie, X, Apple, Scale } from 'lucide-react';
import api from '../../api/axios';

const NutritionPage = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mealModal, setMealModal] = useState(false);
    const [formData, setFormData] = useState({
        calories: '', protein: '', carbs: '', fats: '', waterIntake: ''
    });

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const res = await api.get('/api/user/meals?date=' + new Date().toISOString().split('T')[0]);
            setMeals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMeal = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/user/meals', {
                ...formData,
                date: new Date().toISOString().split('T')[0]
            });
            fetchMeals();
            setMealModal(false);
            setFormData({ calories: '', protein: '', carbs: '', fats: '', waterIntake: '' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            <header className="flex justify-between items-end" style={{ marginBottom: '2.5rem', paddingTop: '1rem' }}>
                <div>
                    <h1 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '2.25rem' }}>
                        Nutrition <span className="text-secondary italic">Log</span>
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest uppercase" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Fuel your potential</p>
                </div>
                <button
                    onClick={() => setMealModal(true)}
                    className="btn-primary"
                    style={{
                        width: '3.5rem', height: '3.5rem', borderRadius: '1.25rem',
                        backgroundColor: 'var(--secondary)', boxShadow: 'var(--shadow-secondary)'
                    }}
                >
                    <Plus size={30} />
                </button>
            </header>

            <div className="flex flex-col gap-6">
                {meals.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--border-color)', background: 'transparent' }}
                    >
                        <div style={{ width: '5rem', height: '5rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--secondary)' }}>
                            <Apple size={40} />
                        </div>
                        <h3 className="font-bold text-slate-800" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Meals Recorded</h3>
                        <p className="text-slate-500">Start logging your nutrition to see your daily macros.</p>
                    </motion.div>
                )}

                {meals.map((meal, idx) => (
                    <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card"
                        style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                    >
                        <div style={{
                            width: '4rem', height: '4rem', backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--secondary)', borderRadius: '1.25rem', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            {meal.calories > 500 ? < Pizza size={32} /> : (meal.calories > 200 ? <Coffee size={32} /> : <Cookie size={32} />)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                <h3 className="font-black text-slate-800" style={{ fontSize: '1.125rem' }}>Meal Entry</h3>
                                <div className="flex items-baseline" style={{ gap: '0.25rem' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)' }}>{meal.calories}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>kcal</span>
                                </div>
                            </div>
                            <div className="flex" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                                {[
                                    { label: 'P', value: meal.protein, color: '#f97316' },
                                    { label: 'C', value: meal.carbs, color: '#22c55e' },
                                    { label: 'F', value: meal.fats, color: '#a855f7' },
                                ].map(macro => (
                                    <div key={macro.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.5rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 900, color: macro.color }}>{macro.label}</span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{macro.value}g</span>
                                    </div>
                                ))}
                                {meal.waterIntake > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.5rem', background: '#eff6ff', borderRadius: '0.5rem', color: '#2563eb' }}>
                                        <Droplets size={12} />
                                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{meal.waterIntake}L</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {mealModal && (
                    <div style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '500px', padding: 0, overflow: 'hidden', border: 'none' }}
                        >
                            <div style={{ backgroundColor: 'var(--secondary)', padding: '2rem', color: 'white', position: 'relative' }}>
                                <button
                                    onClick={() => setMealModal(false)}
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
                                    <Scale size={32} className="text-secondary" />
                                </div>
                                <h3 className="font-black" style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Nutrition Log</h3>
                                <p style={{ opacity: 0.8, fontWeight: 500, fontStyle: 'italic' }}>Track your intake precisely</p>
                            </div>

                            <form onSubmit={handleAddMeal} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px' }}>Total Calories</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 900 }}
                                            placeholder="0"
                                            value={formData.calories}
                                            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px' }}>Water (Litres)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="input-field"
                                            style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 900 }}
                                            placeholder="0.0"
                                            value={formData.waterIntake}
                                            onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.25rem' }}>
                                    <h4 className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px', marginBottom: '1rem' }}>Macro Breakdown (g)</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Protein', field: 'protein' },
                                            { label: 'Carbs', field: 'carbs' },
                                            { label: 'Fats', field: 'fats' },
                                        ].map(macro => (
                                            <div key={macro.field} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    style={{ textAlign: 'center', fontWeight: 700, padding: '0.75rem' }}
                                                    placeholder={macro.label}
                                                    value={formData[macro.field]}
                                                    onChange={(e) => setFormData({ ...formData, [macro.field]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setMealModal(false)}
                                        style={{
                                            flex: 1, padding: '1rem', background: '#f1f5f9',
                                            color: '#64748b', fontWeight: 900, borderRadius: '1rem',
                                            border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ flex: 1, backgroundColor: 'var(--secondary)', boxShadow: 'var(--shadow-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}
                                    >
                                        Log Entry
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NutritionPage;
