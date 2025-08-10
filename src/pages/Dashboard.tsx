"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const { user, logout, isLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const justLoggedOut = useRef(false);

    useEffect(() => {
        if (!isLoading && user === null) {
            if (!justLoggedOut.current) {
                // toast.error("You must be logged in to access the dashboard.");
            }
            navigate("/")
            justLoggedOut.current = false; // reset after redirect
        }
        console.log(user)
    }, [user, isLoading, navigate]);

    if (isLoading || user === null) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        logout();
        navigate('/');
    };

    const membership = user.userMembership;

    return(
        <>
            <h1 className='flex justify-center text-4xl font-extrabold'>Dashboard</h1>
            <p className='text-blue-800 font-medium text-2xl'>
                User Email : {user?.email}
            </p>
            <div className='text-blue-800 font-medium text-2xl'>
                <div>Membership: {membership?.membership_type?.name ?? '-'}</div>
                <div>Since: {membership?.created_at ?? '-'}</div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 my-10 flex justify-center">
                <Button disabled={loading} type="submit" className="bg-red-600 hover:cursor-pointer hover:bg-red-500">
                    Logout
                </Button>
            </form>
        </>
    )
}