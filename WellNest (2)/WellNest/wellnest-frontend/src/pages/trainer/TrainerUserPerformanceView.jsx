import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../../api/axios';
import UserDashboard from '../user/UserDashboard';

const TrainerUserPerformanceView = () => {
    const { userId } = useParams();
    const [viewedUser, setViewedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch the user's profile to get username and full name
                const res = await api.get(`/api/trainer/users/${userId}/profile`);
                // Ensure the object has an explicit id field for UserDashboard's logic
                setViewedUser({ ...res.data, id: userId });
            } catch (err) {
                console.error("Failed to load user for trainer view", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!viewedUser) {
        return <div className="p-10 text-center text-red-500 font-bold">User not found.</div>;
    }

    return (
        <div className="pb-24">
            {/* Custom Header for Trainer Navigation */}
            <div className="container pt-6 pb-2">
                <Link
                    to={`/trainer/user-details/${userId}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-4"
                >
                    <ChevronLeft size={20} /> Back to Management
                </Link>
            </div>

            {/* Render the Dashboard in Read-Only Mode (mostly) */}
            <UserDashboard viewedUser={viewedUser} />
        </div>
    );
};

export default TrainerUserPerformanceView;
