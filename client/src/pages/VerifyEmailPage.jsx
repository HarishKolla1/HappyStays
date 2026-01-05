import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios'; // Or use your axios instance
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        // Call the backend route we just created
        // Note: Make sure to include '/user' if your routes are setup that way
        await axios.get(`/user/verify-email/${token}`);
        setVerified(true);
        toast.success('Email verified successfully!');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Verification failed');
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyAccount();
    }
  }, [token]);

  if (verifying) {
    return <div className="text-center mt-20 text-2xl">Verifying your email...</div>;
  }

  return (
    <div className="flex grow items-center justify-around p-4">
      <div className="mb-40 text-center">
        <h1 className="text-4xl mb-4">
          {verified ? 'Email Verified!' : 'Verification Failed'}
        </h1>
        {verified ? (
          <div>
            <p className="mb-4 text-gray-500">Thank you for verifying your email.</p>
            <Link to="/login" className="primary px-6 py-2 rounded text-white no-underline">
              Login Now
            </Link>
          </div>
        ) : (
          <p className="text-red-500">The link might be invalid or expired.</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;