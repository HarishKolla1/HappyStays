import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, MapPin, Home } from 'lucide-react';

import axiosInstance from '@/utils/axios';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';
import PlaceImg from '@/components/ui/PlaceImg'; // Reusing your image component

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const { data } = await axiosInstance.get('places/user-places');
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };
    getPlaces();
  }, []);

  const handleDeletePlace = async (e, placeId) => {
    e.preventDefault(); // Prevent link navigation if wrapped
    if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;

    try {
      await axiosInstance.delete(`places/${placeId}`);
      setPlaces(prev => prev.filter(place => place._id !== placeId));
    } catch (error) {
      console.error('Error deleting place:', error);
      alert('Failed to delete place. Please try again.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 pt-8 pb-12 max-w-6xl">
      <AccountNav />

      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Accommodations</h1>
        
        <Link
          to={'/account/places/new'}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add new place
        </Link>
      </div>

      {/* --- Places Grid --- */}
      {places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div 
              key={place._id} 
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <PlaceImg 
                  place={place} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                
                {/* Floating Price Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-gray-900 shadow-sm">
                  ₹{place.price?.toLocaleString()} <span className="text-xs font-normal text-gray-500">/night</span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1" title={place.title}>
                  {place.title}
                </h2>
                
                <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-4">
                   <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                   <p className="line-clamp-1">{place.address}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                  {/* Edit Button */}
                  <Link 
                    to={`/account/places/${place._id}`}
                    className="flex-1 inline-flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors border border-gray-200"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>

                  {/* Delete Button */}
                  <button 
                    onClick={(e) => handleDeletePlace(e, place._id)}
                    className="inline-flex justify-center items-center p-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-200 hover:border-red-100"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- Empty State --- */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Home className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No places listed yet</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            It looks like you haven't listed any accommodations. Start earning by sharing your space with travelers.
          </p>
          <Link 
            to={'/account/places/new'}
            className="mt-8 inline-flex items-center gap-2 bg-black text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-800 transition-transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            List your first place
          </Link>
        </div>
      )}
    </div>
  );
};

export default PlacesPage;