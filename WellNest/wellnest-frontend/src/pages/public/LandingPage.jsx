import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Heart, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            {/* Hero Section */}
            <section style={{
                padding: '6rem 0 4rem', textAlign: 'center', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: '1.5rem'
            }} className="animate-slide-up">
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.375rem 1rem', background: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: '999px', width: 'fit-content'
                }}>
                    <Award size={16} className="text-primary" />
                    <span className="font-black uppercase tracking-widest text-primary" style={{ fontSize: '10px' }}>Elevate Your Life</span>
                </div>

                <h1 className="font-black text-slate-900 tracking-tighter" style={{ fontSize: '4.5rem', lineHeight: 1.1, maxWidth: '800px' }}>
                    Your Fitness <br />
                    <span className="gradient-text">Journey Begins</span>
                </h1>

                <p className="text-slate-500 font-medium" style={{ fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.6 }}>
                    The ultimate platform where you and dedicated trainers work together to achieve your personal health and wellness goals.
                </p>

                <div className="flex gap-6" style={{ marginTop: '2.5rem' }}>
                    <Link to="/register" className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.125rem', textDecoration: 'none' }}>
                        Start Today <ArrowRight size={20} className="ml-2" />
                    </Link>
                    <Link to="/login" className="card" style={{ padding: '1.25rem 3.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '14px', textDecoration: 'none', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                        Login
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '4rem' }}>
                {[
                    { icon: <Activity className="text-primary" size={32} />, title: "Detailed Analytics", desc: "Track every step, meal, and habit with easy-to-understand progress charts." },
                    { icon: <Shield className="text-secondary" size={32} />, title: "Personal Coaching", desc: "Connect with professional trainers who build your customized fitness plans." },
                    { icon: <Heart className="text-error" size={32} />, title: "Total Wellness", desc: "Monitor your complete health including sleep, mood, and nutrition." }
                ].map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="card"
                        style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                        <div style={{ width: '4rem', height: '4rem', background: '#f8fafc', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {f.icon}
                        </div>
                        <h3 className="font-black text-slate-900" style={{ fontSize: '1.5rem' }}>{f.title}</h3>
                        <p className="text-slate-500 font-medium" style={{ lineHeight: 1.6 }}>{f.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* Social Proof */}
            <section style={{ marginTop: '8rem', textAlign: 'center' }}>
                <p className="font-black text-slate-400 uppercase tracking-widest" style={{ fontSize: '12px', marginBottom: '3rem' }}>Trusted by fitness enthusiasts everywhere</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', filter: 'grayscale(1)', opacity: 0.4 }}>
                    <div className="font-black" style={{ fontSize: '2rem' }}>WELLNESS</div>
                    <div className="font-black" style={{ fontSize: '2rem' }}>STAMINA</div>
                    <div className="font-black" style={{ fontSize: '2rem' }}>FORGE</div>
                    <div className="font-black" style={{ fontSize: '2rem' }}>VIGOR</div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
