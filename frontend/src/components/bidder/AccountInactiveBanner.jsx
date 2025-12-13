import React from 'react';
import { AlertCircle, ShieldAlert, Mail, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const AccountInactiveBanner = () => {
    const { user } = useAuth();
    const [fetchedUser, setFetchedUser] = useState(null);

    const fetchUser = async () => {
        try {
            const { data } = await axiosInstance.get('/api/v1/users/profile');
            if (data.success) {
                setFetchedUser(data.data.user);
            } else {
                setError('Failed to fetch profile data');
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [user])

    // Only show if user is a bidder and account is inactive
    if (!fetchedUser || fetchedUser.userType !== 'bidder' || fetchedUser.isActive !== false) {
        return null;
    }

    return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <ShieldAlert className="h-6 w-6 text-amber-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-semibold text-amber-800">
                        Account Pending Approval
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                        <div className="flex flex-col gap-2">
                            <p className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Your account is currently inactive and requires admin approval.</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>You can browse auctions but cannot place bids until your account is approved.</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>You will receive an email notification once your account is activated.</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            onClick={() => {
                                // You can add functionality to resend verification or contact support
                                console.log('Contact support clicked');
                            }}
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInactiveBanner;