import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDashboard from '../user/UserDashboard';
import { ArrowLeft } from 'lucide-react';

const AthleteInsightPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
            <div style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-black" style={{ fontSize: '1rem' }}>Athlete Insight Dashboard</h1>
            </div>
            <div style={{ padding: '1rem' }}>
                <UserDashboard athleteId={userId} readOnly={true} />
            </div>
        </div>
    );
};

export default AthleteInsightPage;
