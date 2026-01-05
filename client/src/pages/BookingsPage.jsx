import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { differenceInCalendarDays, format } from 'date-fns';
import { 
  Calendar, CreditCard, Moon, ArrowRight, 
  MapPin, AlertCircle, Trash2 
} from 'lucide-react';

import AccountNav from '@/components/ui/AccountNav';
import PlaceImg from '@/components/ui/PlaceImg';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const { data } = await axiosInstance.get('/bookings');
        setBookings(data.booking);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  const handleCancel = async (e, bookingId) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    
    try {
      await axiosInstance.delete(`/bookings/${bookingId}`);
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 pb-12 max-w-5xl">
      <AccountNav />
      
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings?.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => {
              // Handle case where place might have been deleted from DB
              if (!booking.place) return null;

              const checkIn = new Date(booking.checkIn);
              const checkOut = new Date(booking.checkOut);
              const nights = differenceInCalendarDays(checkOut, checkIn);
              const isPast = new Date() > checkOut;

              return (
                <div 
                  key={booking._id} 
                  className={`relative flex flex-col md:flex-row overflow-hidden rounded-2xl border transition-all hover:shadow-lg
                    ${isPast ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-300'}
                  `}
                >
                  {/* Cancel Button */}
                  {!isPast && (
                    <button
                      onClick={(e) => handleCancel(e, booking._id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full backdrop-blur-sm transition-colors border border-transparent hover:border-red-200 shadow-sm"
                      title="Cancel Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Image Section */}
                  <Link to={`/place/${booking.place._id}`} className="w-full md:w-64 h-48 md:h-auto shrink-0 bg-gray-200">
                    <PlaceImg 
                      place={booking.place} 
                      className="w-full h-full object-cover" 
                    />
                  </Link>

                  {/* Details Section */}
                  <Link to={`/account/bookings/${booking._id}`} className="flex-grow p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start pr-8">
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{booking.place.title}</h2>
                        {isPast && (
                          <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded uppercase tracking-wider">
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{booking.place.address}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-700">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {format(checkIn, 'MMM d')} <ArrowRight className="w-3 h-3 inline mx-1"/> {format(checkOut, 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                           <Moon className="w-4 h-4" />
                           <span className="text-sm font-medium">{nights} Night{nights !== 1 && 's'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                       <div className="p-1.5 bg-green-100 text-green-700 rounded-md">
                          <CreditCard className="w-5 h-5" />
                       </div>
                       <div>
                          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wide">Total Price</span>
                          <span className="text-lg font-bold text-gray-900">₹{booking.price.toLocaleString()}</span>
                       </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No trips booked... yet!</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Time to dust off your bags and start planning your next adventure.
            </p>
            <Link 
              to="/" 
              className="mt-6 px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-transform hover:scale-105 shadow-lg"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;