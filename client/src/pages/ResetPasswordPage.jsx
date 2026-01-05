import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    
    // Get auth from hook
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Use the function from your hook (which now has the correct /user prefix)
        const response = await auth.resetPassword(token, password);

        if (response.success) {
            toast.success(response.message);
            setRedirect(true);
        } else {
            toast.error(response.message);
        }
    };

    if (redirect) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className="flex grow items-center justify-around p-4 md:p-0">
            <div className="mb-40">
                <h1 className="mb-4 text-center text-4xl">Reset Password</h1>
                <form className="mx-auto max-w-md" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        className="my-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                        className="my-2"
                        required
                    />
                    <button className="primary my-2">Reset Password</button>
                    <div className="py-2 text-center text-gray-500">
                        <Link className="text-black underline" to={'/login'}>
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;