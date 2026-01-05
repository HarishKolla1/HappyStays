import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut, Mail, User as UserIcon, CheckCircle2, Shield } from 'lucide-react';

import AccountNav from '@/components/ui/AccountNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import EditProfileDialog from '@/components/ui/EditProfileDialog';

import PlacesPage from './PlacesPage';
import { useAuth } from '../../hooks';
import Spinner from '@/components/ui/Spinner';

const ProfilePage = () => {
  const auth = useAuth();
  const { user, logout, loading } = auth;
  const navigate = useNavigate();
  let { subpage } = useParams();

  if (!subpage) {
    subpage = 'profile';
  }

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success('Logged out successfully');
      navigate('/');
    } else {
      toast.error(response.message);
    }
  };

  if (loading) return <Spinner />;
  
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        <AccountNav />

        {subpage === 'profile' && (
          <div className="mt-10 flex flex-col md:flex-row gap-8">
            
            {/* --- Left Column: Identity Card --- */}
            <div className="w-full md:w-1/3">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32 border-4 border-gray-50">
                    <AvatarImage 
                      src={user.picture || "https://res.cloudinary.com/rahul4019/image/upload/v1695133265/pngwing.com_zi4cre.png"} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl bg-gray-100 text-gray-400">
                      {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" title="Online"></div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-6"></p>
                
                <div className="w-full">
                   <EditProfileDialog className="w-full" />
                </div>
              </div>

              {/* Security / Verification Badge */}
              <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                 <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                       <h3 className="font-bold text-gray-900">Identity Verified</h3>
                       <p className="text-sm text-gray-500 mt-1">
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            {/* --- Right Column: Account Details --- */}
            <div className="w-full md:w-2/3">
               <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                     <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
                     {/* <Button variant="ghost" className="text-primary">Edit</Button> */}
                  </div>

                  <div className="space-y-8">
                     {/* Field 1: Legal Name */}
                     <div className="pb-6 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                           <label className="text-sm font-semibold text-gray-900">Legal Name</label>
                           <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                           </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                           <UserIcon className="w-5 h-5 text-gray-400" />
                           <span>{user.name}</span>
                        </div>
                     </div>

                     {/* Field 2: Email Address */}
                     <div className="pb-6 border-b border-gray-100">
                        <label className="text-sm font-semibold text-gray-900 block mb-2">Email Address</label>
                        <div className="flex items-center gap-3 text-gray-600">
                           <Mail className="w-5 h-5 text-gray-400" />
                           <span>{user.email}</span>
                        </div>
                     </div>

                    
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                     <Button 
                       variant="outline" 
                       onClick={handleLogout}
                       className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                     >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                     </Button>
                  </div>
               </div>
            </div>

          </div>
        )}

        {subpage === 'places' && (
          <div className="mt-8">
            <PlacesPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;