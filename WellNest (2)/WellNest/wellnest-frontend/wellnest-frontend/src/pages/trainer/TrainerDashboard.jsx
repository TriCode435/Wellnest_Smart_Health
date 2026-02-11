import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Activity,
  Search,
  LogOut,
  User,
  MoreVertical,
  Flame,
  CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { createBlogPost } from "../../api/userApi";
import { Link } from "react-router-dom";

const TrainerDashboard = () => {
  const { user, logout } = useAuth();
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ activeClients: 0, totalAssignments: 0, completionRate: 0 });
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogData, setBlogData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchAssignedUsers(), fetchStats()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedUsers = async () => {
    try {
      const res = await api.get("/api/trainer/assigned-users");
      setAssignedUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/trainer/stats");
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const handlePublishBlog = async (e) => {
    e.preventDefault();
    try {
      await createBlogPost(blogData);
      alert("Article published to community!");
      setShowBlogModal(false);
      setBlogData({ title: '', content: '' });
    } catch (err) {
      alert("Failed to publish article");
    }
  };

  const filteredUsers = assignedUsers.filter((u) =>
    (u.fullName || u.username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center font-black">SYNCING TRAINER DATA...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Coach <span className="text-primary italic">Dashboard</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Managing {assignedUsers.length} Elite Athletes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-3 pr-6">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black uppercase shadow-lg shadow-primary/20">
              {user?.username?.[0] || 'T'}
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{user?.username}</span>
          </div>
          <button
            onClick={() => setShowBlogModal(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group"
          >
            Publish Article
          </button>
          <button onClick={logout} className="p-4 bg-slate-900 text-white rounded-[20px] hover:bg-rose-500 transition-colors shadow-xl">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-8 bg-indigo-600 text-white border-none shadow-2xl shadow-indigo-200">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/10 rounded-2xl"><Users size={24} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Active Roster</p>
          </div>
          <h2 className="text-4xl font-black">{stats.activeClients}</h2>
          <p className="text-[10px] font-bold text-indigo-200 uppercase mt-1">Directly Assigned Members</p>
        </div>
        <div className="card p-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-slate-50 text-emerald-500 rounded-2xl"><Activity size={24} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Plans</p>
          </div>
          <h2 className="text-4xl font-black text-slate-800">{stats.totalAssignments}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Weekly Blueprints Issued</p>
        </div>
        <div className="card p-8 bg-slate-900 text-white border-none shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/10 text-primary rounded-2xl"><TrendingUp size={24} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Success Rate</p>
          </div>
          <h2 className="text-4xl font-black">{Math.round(stats.completionRate)}%</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Average Program Fidelity</p>
        </div>
      </div>

      {/* Members Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            Member <span className="text-primary italic">Directory</span>
          </h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search member identity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 py-3 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((u, idx) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-sm">
                    <User size={32} />
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Active</div>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-1">{u.fullName || u.username}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.fitnessGoal || 'Goal: Body Recomposition'}</p>

                <div className="mt-8 flex items-center gap-4 text-slate-400 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5"><Flame size={14} className="text-rose-400" /> {Math.round(u.currentWeight || 0)}kg</div>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-1.5"><CalendarDays size={14} className="text-indigo-400" /> {u.lastActivityDate || 'No Logs'}</div>
                </div>
              </div>

              <div className="flex border-t border-slate-50">
                <Link
                  to={`/trainer/user-details/${u.id}`}
                  className="flex-1 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors border-r border-slate-50"
                >
                  Edit Plan
                </Link>
                <Link
                  to={`/trainer/athlete-insight/${u.id}`}
                  className="flex-1 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                >
                  Insights
                </Link>
              </div>
            </motion.div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <Users size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching members found</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-10 w-full max-w-2xl shadow-2xl"
          >
            <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Post <span className="text-primary italic">Expert Content</span></h3>
            <form onSubmit={handlePublishBlog} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Title</label>
                <input
                  type="text"
                  required
                  className="input-field bg-slate-50 border-slate-50 py-4"
                  value={blogData.title}
                  onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                  placeholder="e.g. The Science of Progressive Overload"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Content</label>
                <textarea
                  required
                  className="input-field bg-slate-50 border-slate-50 py-4 min-h-[200px]"
                  value={blogData.content}
                  onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                  placeholder="Share your wisdom with the community..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBlogModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary shadow-xl shadow-primary/20 transition-all"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
