import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await auth.forgotPassword(email);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex grow items-center justify-around p-4 md:p-0">
            <div className="mb-40">
                <h1 className="mb-4 text-center text-4xl">Forgot Password</h1>
                <form className="mx-auto max-w-md" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        className="my-2"
                        required
                    />
                    <button className="primary my-2" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Recovery Email'}
                    </button>
                    <div className="py-2 text-center text-gray-500">
                        Remember your password?{' '}
                        <Link className="text-black underline" to={'/login'}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;