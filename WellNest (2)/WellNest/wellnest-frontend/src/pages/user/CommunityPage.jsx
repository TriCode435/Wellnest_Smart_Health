import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, MessageSquare, ChevronRight, User, Award, Star, Search, Filter } from 'lucide-react';
import { getTrainerSuggestions, getBlogPosts, assignTrainer, getProfile } from '../../api/userApi';

const CommunityPage = () => {
    const [trainers, setTrainers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [userGoal, setUserGoal] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('blog'); // 'blog' or 'trainers'

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const profileRes = await getProfile();
                const goal = profileRes.data?.fitnessGoal || '';
                setUserGoal(goal);

                const [trainerRes, blogRes] = await Promise.all([
                    getTrainerSuggestions(goal),
                    getBlogPosts()
                ]);

                setTrainers(trainerRes.data);
                setPosts(blogRes.data);
            } catch (err) {
                console.error("Failed to fetch community data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleAssign = async (trainerId) => {
        try {
            await assignTrainer(trainerId);
            alert("Trainer assigned successfully!");
            window.location.reload(); // Refresh to show new trainer in dashboard
        } catch (err) {
            alert("Failed to assign trainer");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        WellNest <span className="gradient-text tracking-tighter italic">Community</span>
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] mt-2">Expert advice & Pro mentorship</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-[24px] shadow-sm border border-slate-100">
                    <button
                        onClick={() => setActiveTab('blog')}
                        className={`px-8 py-3 rounded-[20px] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'blog' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Expert Feed
                    </button>
                    <button
                        onClick={() => setActiveTab('trainers')}
                        className={`px-8 py-3 rounded-[20px] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'trainers' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Pro Trainers
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'blog' ? (
                    <motion.div
                        key="blog"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {posts.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                                <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-slate-400">No articles published yet</h3>
                            </div>
                        ) : (
                            posts.map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{post.author?.username || 'Expert Coach'}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-primary transition-colors cursor-pointer">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-8">
                                        {post.content}
                                    </p>
                                    <button className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all">
                                        Read Full Article <ChevronRight size={14} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="trainers"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {trainers.map((trainer, i) => (
                            <motion.div
                                key={trainer.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Users size={120} />
                                </div>

                                <div className="w-16 h-16 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-inner shadow-indigo-100/50">
                                    <User size={32} />
                                </div>

                                <div className="space-y-1 mb-6">
                                    <h3 className="text-xl font-black text-slate-900">{trainer.username}</h3>
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-full w-fit">
                                        <Award size={12} /> {trainer.specialization || 'Performance Coach'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-50 p-3 rounded-2xl">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Exp</p>
                                        <p className="text-sm font-black text-slate-800">{trainer.experienceYears || '5+'} Years</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                        <p className="text-sm font-black text-slate-800">4.9/5.0</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAssign(trainer.id)}
                                    className="w-full bg-slate-900 text-white py-4 rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                >
                                    Select as Mentor
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityPage;
