import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Flame,
  Droplets,
  Moon,
  TrendingUp,
  LogOut,
  Award
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const UserDashboard = ({ viewedUser }) => {
  const { user, logout } = useAuth();
  const activeUser = viewedUser || user;

  const [viewMode, setViewMode] = useState(viewedUser ? "weekly" : "daily");
  const [stats, setStats] = useState({
    calories: 0,
    water: 0,
    workouts: 0,
    sleep: 0
  });
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sleep Modal State
  const [sleepModal, setSleepModal] = useState(false);
  const [sleepData, setSleepData] = useState({
    sleepHours: '',
    mood: 'Neutral',
    stressLevel: 5
  });
  const [isSleepLogged, setIsSleepLogged] = useState(false);

  const [goals, setGoals] = useState({
    calories: 2000,
    water: 3,
    workouts: 1,
    sleep: 8
  });

  const tips = [
    "Consistency beats motivation. Show up daily.",
    "Drink at least 3L of water to stay hydrated.",
    "Sleep 7-8 hours for muscle recovery.",
    "Protein supports muscle growth and fat loss.",
    "Small progress every day leads to big results."
  ];

  const randomTip = tips[new Date().getDate() % tips.length];

  // Helper for local date YYYY-MM-DD
  const getLocalDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      const targetUser = viewedUser || user;
      if (!targetUser) return;

      setLoading(true);
      try {
        const today = new Date();
        let startDate, endDate;

        if (viewMode === "daily") {
          startDate = getLocalDate(today);
          endDate = startDate;
        } else if (viewMode === "weekly") {
          const start = new Date(today);
          const day = start.getDay();
          const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
          start.setDate(diff);

          const end = new Date(start);
          end.setDate(start.getDate() + 6); // Sunday

          startDate = getLocalDate(start);
          endDate = getLocalDate(end);
        } else {
          // monthly - show this current month
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          startDate = getLocalDate(start);
          endDate = getLocalDate(end);
        }

        const params = { startDate, endDate };

        let dashboardData;
        if (viewedUser && (viewedUser.id || viewedUser.userId)) {
          const uid = viewedUser.id || viewedUser.userId;
          const res = await api.get(`/api/trainer/users/${uid}/dashboard-stats`, { params });
          dashboardData = res.data;
        } else {
          const res = await api.get("/api/user/dashboard", { params });
          dashboardData = res.data;
        }

        if (dashboardData) {
          if (dashboardData.trainer) setTrainer(dashboardData.trainer);

          setStats({
            calories: dashboardData.caloriesConsumed || 0,
            water: dashboardData.water || 0,
            workouts: dashboardData.completedWorkouts || 0,
            sleep: dashboardData.avgSleep || 0
          });

          // Check if sleep is already logged for today (only in daily mode)
          if (viewMode === "daily") {
            setIsSleepLogged(dashboardData.avgSleep > 0);
          }

          // Update dynamic goals from backend
          setGoals(prev => ({
            ...prev,
            calories: dashboardData.caloriesTarget || prev.calories,
            water: dashboardData.waterTarget || prev.water,
            workouts: dashboardData.totalWorkouts || prev.workouts,
            sleep: 8 // Default or from backend if available
          }));
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode, activeUser]);

  const handleLogSleep = async () => {
    if (isSleepLogged) {
      alert("You have already logged your sleep for today!");
      setSleepModal(false);
      return;
    }

    try {
      const response = await api.post('/api/user/sleep-mood', {
        ...sleepData,
        sleepHours: Number(sleepData.sleepHours), // Ensure numeric
        date: new Date().toISOString().split('T')[0]
      });
      setSleepModal(false);
      // Update state immediately instead of reloading
      setStats(prev => ({
        ...prev,
        sleep: response.data.sleepHours || Number(sleepData.sleepHours)
      }));
      setIsSleepLogged(true);
      // Re-fetch everything to be safe and accurate
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to log sleep. Please try again.");
    }
  };

  const ProgressBar = ({ current, goal }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <div
        style={{
          background: "#f1f5f9",
          height: "8px",
          borderRadius: "999px",
          marginTop: "10px",
          overflow: "hidden"
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg,#14b8a6,#6366f1)"
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!activeUser) return null;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#0f172a"
            }}
          >
            Welcome back,{" "}
            <span style={{ color: "#14b8a6" }}>
              {activeUser.username}
            </span>
          </h1>
          <p style={{ color: "#64748b", marginTop: "6px" }}>
            Your health progress at a glance.
          </p>
        </div>

        {!viewedUser && (
          <button
            onClick={logout}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
              color: '#ef4444'
            }}
          >
            Logout
          </button>
        )}
      </header>

      {/* VIEW MODE TOGGLE */}
      <div style={{ marginBottom: "2rem", display: "flex", gap: "10px" }}>
        {["daily", "weekly", "monthly"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background:
                viewMode === mode ? "#14b8a6" : "#f1f5f9",
              color:
                viewMode === mode ? "white" : "#475569",
              fontWeight: 600
            }}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      {/* STATS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}
      >
        {[
          {
            label: "Calories",
            value: stats.calories,
            goal: goals.calories,
            icon: <Flame size={22} />,
            color: "#f97316"
          },
          {
            label: "Water (L)",
            value: stats.water,
            goal: goals.water,
            icon: <Droplets size={22} />,
            color: "#3b82f6"
          },
          {
            label: "Workouts",
            value: stats.workouts,
            goal: goals.workouts,
            icon: <Activity size={22} />,
            color: "#14b8a6"
          },
          {
            label: "Sleep (hrs)",
            value: stats.sleep,
            goal: goals.sleep,
            icon: <Moon size={22} />,
            color: "#6366f1",
            action: () => setSleepModal(true)
          }
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: "1.75rem",
              borderRadius: "18px",
              background: "white",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.05)",
              position: 'relative'
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  color: "#475569"
                }}
              >
                {item.label}
              </span>
              <div style={{ color: item.color }}>{item.icon}</div>
            </div>

            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                marginTop: "10px",
                color: "#0f172a"
              }}
            >
              {item.value || 0}
            </h2>

            <ProgressBar
              current={item.value || 0}
              goal={item.goal}
            />

            {item.action && (
              <button
                onClick={item.action}
                style={{
                  position: 'absolute', top: '1.5rem', right: '1.5rem',
                  background: '#f1f5f9', border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748b'
                }}
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      {/* TIP OF THE DAY */}
      <div
        style={{
          padding: "1.75rem",
          borderRadius: "18px",
          background:
            "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "white",
          marginBottom: "2rem"
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            opacity: 0.7,
            margin: 0
          }}
        >
          Tip of the Day
        </p>

        <h3 style={{ marginTop: "10px", fontSize: '1.25rem', fontWeight: 600 }}>
          {randomTip}
        </h3>
      </div>

      {/* TRAINER CARD */}
      {trainer && (
        <div
          style={{
            padding: "1.5rem",
            borderRadius: "18px",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Award size={32} color="#14b8a6" />
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
              Coach {trainer.username}
            </h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: '0.9rem' }}>
              {trainer.specialization}
            </p>
          </div>
        </div>
      )}

      {/* SLEEP MODAL */}
      <AnimatePresence>
        {sleepModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 9999
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                backgroundColor: 'white', borderRadius: '24px', padding: '2rem',
                width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '8px',
                background: 'linear-gradient(to right, #6366f1, #a855f7)'
              }} />

              <button
                onClick={() => setSleepModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <LogOut size={20} color="#94a3b8" />
              </button>

              <div style={{ margin: '0 auto 1.5rem', width: '4rem', height: '4rem', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={32} color="#4f46e5" />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Log Sleep & Mood</h3>

              <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Hours Slept</label>
                <input
                  type="number"
                  value={sleepData.sleepHours}
                  onChange={e => setSleepData({ ...sleepData, sleepHours: e.target.value })}
                  style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Mood Check-in</label>
                <select
                  value={sleepData.mood}
                  onChange={e => setSleepData({ ...sleepData, mood: e.target.value })}
                  style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
                >
                  <option>Energized</option>
                  <option>Happy</option>
                  <option>Neutral</option>
                  <option>Tired</option>
                  <option>Stressed</option>
                </select>
              </div>

              <button
                onClick={handleLogSleep}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(to right, #6366f1, #a855f7)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '1rem' }}
              >
                Save Entry
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
