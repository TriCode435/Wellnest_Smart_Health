import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Utensils,
    Plus,
    Flame,
    Droplets,
    TrendingUp,
    ChevronRight,
    PieChart,
    CheckCircle2,
    Clock,
    ChevronDown,
    Calendar,
    X,
    Trash2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
    getNutritionLog,
    logNutrition,
    getDashboardSummary,
    deleteNutritionLog
} from "../../api/userApi";
import CalendarNavigator from "../../components/CalendarNavigator";

const NutritionPage = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [nutritionData, setNutritionData] = useState({
        caloriesTarget: 2000,
        proteinTarget: 150,
        carbsTarget: 300,
        fatsTarget: 70,
        caloriesConsumed: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatsConsumed: 0,
        waterIntake: 0
    });
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const [allLogs, setAllLogs] = useState([]);

    const [formData, setFormData] = useState({
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        water: '',
        steps: ''
    });

    const fetchNutrition = useCallback(async () => {
        setLoading(true);
        try {
            const [nutRes, sumRes] = await Promise.all([
                getNutritionLog({ date: selectedDate }),
                getDashboardSummary({ startDate: selectedDate, endDate: selectedDate })
            ]);

            const summary = sumRes.data;
            const logs = Array.isArray(nutRes.data) ? nutRes.data : (nutRes.data ? [nutRes.data] : []);
            setAllLogs(logs);

            setNutritionData({
                caloriesTarget: summary.caloriesTarget || 2000,
                proteinTarget: summary.proteinTarget || 150,
                carbsTarget: summary.carbsTarget || 300,
                fatsTarget: summary.fatsTarget || 70,
                caloriesConsumed: summary.caloriesConsumed || 0,
                proteinConsumed: summary.proteinConsumed || 0,
                carbsConsumed: summary.carbsConsumed || 0,
                fatsConsumed: summary.fatsConsumed || 0,
                waterIntake: summary.water || 0
            });

            setIsLogged(logs.length > 0);
        } catch (err) {
            console.error("Failed to fetch nutrition", err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchNutrition();
    }, [fetchNutrition]);

    const handleLogNutrition = async (e) => {
        e.preventDefault();
        try {
            await logNutrition({
                nutritionDate: selectedDate,
                caloriesConsumed: Number(formData.calories) || 0,
                proteinConsumed: Number(formData.protein) || 0,
                carbsConsumed: Number(formData.carbs) || 0,
                fatsConsumed: Number(formData.fats) || 0,
                waterIntake: Number(formData.water) || 0,
                steps: Number(formData.steps) || 0
            });
            fetchNutrition();
            setFormData({ calories: '', protein: '', carbs: '', fats: '', water: '', steps: '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to log nutrition.");
        }
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm("Delete this log?")) return;
        try {
            await deleteNutritionLog(id);
            fetchNutrition();
        } catch (err) {
            console.error(err);
            alert("Failed to delete log");
        }
    };

    const MacroCard = ({ label, consumed, target, unit = "g", color }) => {
        const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
        return (
            <div className="card p-6 bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                    <span className={`text-xs font-black px-2 py-1 rounded-lg ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
                        {Math.round(consumed)}{unit} / {Math.round(target)}{unit}
                    </span>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full ${color} shadow-lg shadow-current/20`}
                    />
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-3 text-right">
                    {Math.round(percentage)}% of target
                </p>
            </div>
        );
    };

    if (loading && allLogs.length === 0) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                        Log your <span className="text-primary italic">Fuel</span>
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] mt-2">
                        Precision tracking for elite performance
                    </p>
                </div>
                <div className="relative">
                    <input
                        type="date"
                        className="input-field bg-white py-3 pl-12 pr-6 text-sm font-bold min-w-[200px]"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
            </header>

            {/* TARGET DISPLAY */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MacroCard
                    label="Calories"
                    consumed={nutritionData.caloriesConsumed}
                    target={nutritionData.caloriesTarget}
                    unit="kcal"
                    color="bg-indigo-500"
                />
                <MacroCard
                    label="Protein"
                    consumed={nutritionData.proteinConsumed}
                    target={nutritionData.proteinTarget}
                    color="bg-rose-500"
                />
                <MacroCard
                    label="Carbs"
                    consumed={nutritionData.carbsConsumed}
                    target={nutritionData.carbsTarget}
                    color="bg-amber-500"
                />
                <MacroCard
                    label="Fats"
                    consumed={nutritionData.fatsConsumed}
                    target={nutritionData.fatsTarget}
                    color="bg-emerald-500"
                />
            </section>

            {/* ENTRIES LIST */}
            {allLogs.length > 0 && (
                <section className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800">Logs for {selectedDate}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {allLogs.map((log) => (
                            <div key={log.id} className="card p-5 bg-white border border-slate-100 flex justify-between items-center">
                                <div className="flex gap-6 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Calories</span>
                                        <span className="font-bold text-slate-800">{log.caloriesConsumed} kcal</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Macros (P/C/F)</span>
                                        <span className="font-bold text-slate-800">{log.proteinConsumed}g / {log.carbsConsumed}g / {log.fatsConsumed}g</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Water</span>
                                        <span className="font-bold text-slate-800">{log.waterIntake} ml</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteLog(log.id)}
                                    className="p-3 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 rounded-xl"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* LOGGING FORM */}
            <section className="card p-10 bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                    <div className="p-3 bg-primary-light text-primary rounded-2xl">
                        <Utensils size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add to Daily Record</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {isLogged ? "You have already logged for today" : `Add your performance for ${selectedDate}`}
                        </p>
                    </div>
                </div>

                {isLogged ? (
                    <div className="bg-slate-50 p-12 rounded-3xl text-center">
                        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                        <h4 className="text-xl font-black text-slate-800">Daily Log Complete</h4>
                        <p className="text-slate-500 font-medium mt-2">You can only log consumption once per day. Great job stay consistent!</p>
                    </div>
                ) : (
                    <form onSubmit={handleLogNutrition} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Total Calories</label>
                                <input
                                    type="number"
                                    className="input-field py-4 text-center text-xl font-black text-indigo-600"
                                    placeholder="2500"
                                    required
                                    value={formData.calories}
                                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Protein (g)</label>
                                <input
                                    type="number"
                                    className="input-field py-4 text-center text-xl font-black text-rose-500"
                                    placeholder="150"
                                    required
                                    value={formData.protein}
                                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Carbons (g)</label>
                                <input
                                    type="number"
                                    className="input-field py-4 text-center text-xl font-black text-amber-500"
                                    placeholder="300"
                                    required
                                    value={formData.carbs}
                                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Fats (g)</label>
                                <input
                                    type="number"
                                    className="input-field py-4 text-center text-xl font-black text-emerald-500"
                                    placeholder="70"
                                    required
                                    value={formData.fats}
                                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Water (ml)</label>
                                <input
                                    type="number"
                                    className="input-field py-4 text-center text-xl font-black text-cyan-500"
                                    placeholder="2000"
                                    value={formData.water}
                                    onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Steps Taken</label>
                                <input
                                    type="number"
                                    className="input-field py-4 text-center text-xl font-black text-slate-700"
                                    placeholder="10000"
                                    value={formData.steps}
                                    onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary py-5 rounded-3xl text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
                        >
                            Commit Daily Log
                        </button>
                    </form>
                )}
            </section>
        </div>
    );
};

export default NutritionPage;
