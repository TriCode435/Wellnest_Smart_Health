import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight,
  X,
  Trophy,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import api from '../../api/axios';
import { getLatestWeeklyPlan, completeWorkout } from '../../api/userApi';

const ActivityPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [planWorkouts, setPlanWorkouts] = useState([]);
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [loading, setLoading] = useState(true);
  const [logModal, setLogModal] = useState(null);
  const [actualReps, setActualReps] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [adhocRes, planRes] = await Promise.all([
        api.get(`/api/user/workouts?date=${selectedDate}`),
        getLatestWeeklyPlan().catch(() => ({ data: null }))
      ]);

      setWorkouts(adhocRes.data);

      if (planRes.data && planRes.data.workouts) {
        // Map and filter plan workouts for the selected date
        // Using a more robust date comparison for assigned workouts
        const mappedPlan = planRes.data.workouts
          .filter(w => {
            if (!w.workoutDate) return false;
            // Handle both string "YYYY-MM-DD" and array [YYYY, M, D] formats
            const wDateStr = Array.isArray(w.workoutDate)
              ? `${w.workoutDate[0]}-${String(w.workoutDate[1]).padStart(2, '0')}-${String(w.workoutDate[2]).padStart(2, '0')}`
              : String(w.workoutDate).split('T')[0];
            return wDateStr === selectedDate;
          })
          .map(w => ({
            ...w,
            isPlan: true,
            id: w.id
          }));
        setPlanWorkouts(mappedPlan);
      } else {
        setPlanWorkouts([]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    try {
      if (logModal.isPlan) {
        // Complete Weekly Plan Workout
        await completeWorkout(logModal.id);
      } else {
        // Log Ad-hoc Workout
        if (!actualReps) return;
        await api.post(
          `/api/user/workouts/${logModal.id}/log?actualReps=${actualReps}&completed=true`
        );
      }

      setActualReps('');
      setLogModal(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Combine for display: Plan workouts (top) + Ad-hoc (bottom) or mixed? 
  // Let's show filtered active plan workouts or all?
  // Showing all plan workouts might be cluttered if they are for the whole week.
  // But user wanted them displayed. We'll show them in a separate section if "Today" is selected, 
  // or just show them all. For now, let's merge them for the progress calculation but maybe display distinctively.

  const relevantWorkouts = [...planWorkouts, ...workouts];

  // ✅ Weekly Progress Calculation
  const progress = useMemo(() => {
    if (!relevantWorkouts.length) return 0;
    const completed = relevantWorkouts.filter(w => w.completed).length;
    return Math.round((completed / relevantWorkouts.length) * 100);
  }, [relevantWorkouts]);

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>

      {/* Header */}
      <header className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="font-black text-4xl text-slate-900">
            Daily <span className="gradient-text">Activity</span>
          </h1>
          <p className="text-slate-500 uppercase tracking-widest text-sm mt-2">
            Track your workout performance
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field"
          style={{ fontWeight: 700 }}
        />
      </header>

      {/* Progress Section */}
      <div className="card mb-8" style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} />
            <span className="font-bold text-slate-700">
              Activity Progress
            </span>
          </div>
          <span className="font-black text-lg text-primary">
            {progress}%
          </span>
        </div>

        <div
          style={{
            height: '10px',
            background: '#e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg,#14b8a6,#6366f1)'
            }}
          />
        </div>
      </div>

      {/* Workout List */}
      <div className="flex flex-col gap-6">
        {loading && (
          <div className="card p-10 text-center">
            <p className="text-slate-400 font-bold">Loading workouts...</p>
          </div>
        )}

        {!loading && relevantWorkouts.length === 0 && (
          <div className="card p-16 text-center border-dashed border-2 border-slate-200 bg-transparent">
            <Activity size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="font-bold text-lg text-slate-700">
              No workouts assigned or logged
            </h3>
          </div>
        )}

        {relevantWorkouts.map((workout, idx) => (
          <motion.div
            key={`${workout.isPlan ? 'plan' : 'adhoc'}-${workout.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`card p-6 flex justify-between items-center ${workout.isPlan ? 'border-l-4 border-l-secondary' : ''}`}
            style={{
              backgroundColor: workout.completed
                ? 'rgba(248,250,252,0.6)'
                : 'white'
            }}
          >
            <div className="flex items-center gap-5">
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: workout.completed
                    ? 'rgba(34,197,94,0.1)'
                    : (workout.isPlan ? 'rgba(99,102,241,0.1)' : 'rgba(20,184,166,0.1)')
                }}
              >
                {workout.isPlan ? (
                  <CalendarDays size={28} color="#6366f1" />
                ) : (
                  <Activity
                    size={28}
                    color={workout.completed ? '#22c55e' : '#14b8a6'}
                  />
                )}

              </div>

              <div>
                <h3
                  className="font-bold text-lg"
                  style={{
                    textDecoration: workout.completed
                      ? 'line-through'
                      : 'none',
                    color: workout.completed ? '#94a3b8' : '#0f172a'
                  }}
                >
                  {workout.workoutName}
                  {workout.isPlan && <span className="text-xs ml-2 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Weekly Plan</span>}
                </h3>

                <div className="flex gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {workout.targetTime || 'Anytime'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame size={14} /> {workout.targetReps} reps
                  </span>
                </div>
              </div>
            </div>

            {!workout.completed && (
              <button
                onClick={() => setLogModal(workout)}
                className="btn-primary flex items-center gap-2"
              >
                {workout.isPlan ? 'Complete' : 'Log'} <ChevronRight size={18} />
              </button>
            )}

            {workout.completed && (
              <CheckCircle2 size={22} className="text-green-500" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {logModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              zIndex: 9999,
              height: '100vh',
              width: '100vw'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Gradient Header Line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '8px',
                background: 'linear-gradient(to right, #2dd4bf, #6366f1)'
              }} />

              <button
                onClick={() => setLogModal(null)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: '#f1f5f9', border: 'none', borderRadius: '50%',
                  padding: '8px', cursor: 'pointer', color: '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>

              <div style={{
                margin: '0 auto 1.5rem auto', width: '5rem', height: '5rem',
                backgroundColor: logModal.isPlan ? '#eff6ff' : '#f0fdfa',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.5)'
              }}>
                {logModal.isPlan ? (
                  <Trophy size={40} color="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
                ) : (
                  <Activity size={40} color="#0d9488" />
                )}
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.5rem' }}>
                {logModal.isPlan ? 'Workout Complete?' : 'Log Activity'}
              </h3>

              {logModal.isPlan ? (
                <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '2rem', lineHeight: 1.6 }}>
                  Great job! Are you ready to mark <strong style={{ color: '#4f46e5' }}>{logModal.workoutName}</strong> as finished?
                </p>
              ) : (
                <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '1.5rem' }}>
                  Enter your results for <strong style={{ color: '#0d9488' }}>{logModal.workoutName}</strong>
                </p>
              )}

              {!logModal.isPlan && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Reps</label>
                  <input
                    type="number"
                    value={actualReps}
                    onChange={(e) => setActualReps(e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%', textAlign: 'center', fontSize: '2.25rem', fontWeight: 900,
                      color: '#1e293b', background: '#f8fafc', border: '2px solid #e2e8f0',
                      borderRadius: '1rem', padding: '1rem', outline: 'none'
                    }}
                    autoFocus
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setLogModal(null)}
                  style={{
                    flex: 1, padding: '0.875rem', borderRadius: '0.75rem', fontWeight: 700,
                    color: '#64748b', background: '#f1f5f9', border: 'none', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleLog}
                  style={{
                    flex: 1, padding: '0.875rem', borderRadius: '0.75rem', fontWeight: 700,
                    color: 'white', border: 'none', cursor: 'pointer',
                    background: logModal.isPlan
                      ? 'linear-gradient(to right, #6366f1, #9333ea)'
                      : 'linear-gradient(to right, #2dd4bf, #0d9488)',
                    boxShadow: logModal.isPlan ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : '0 10px 15px -3px rgba(20, 184, 166, 0.3)'
                  }}
                >
                  {logModal.isPlan ? 'Yes, I Did It!' : 'Save Log'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityPage;
