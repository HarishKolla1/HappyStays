import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';
import { 
  MapPin, Calendar, Users, CreditCard, 
  Phone, User, ArrowLeft, Trash2, Moon 
} from 'lucide-react';

import AccountNav from '../components/ui/AccountNav';
import AddressLink from '../components/ui/AddressLink';
import PlaceGallery from '../components/ui/PlaceGallery';
import Spinner from '../components/ui/Spinner';
import axiosInstance from '../utils/axios';

const SingleBookedPlace = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all bookings and filter (matches your current backend setup)
  useEffect(() => {
    const getBooking = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/bookings');
        
        // Find the specific booking
        const foundBooking = data.booking.find((b) => b._id === id);
        
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          // Handle booking not found
          console.error("Booking not found");
        }
      } catch (error) {
        console.log('Error fetching booking: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) getBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      navigate('/account/bookings');
    } catch (err) {
      console.log('Cancel error:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) return <Spinner />;

  if (!booking) {
    return (
      <div className="container mx-auto px-4 pt-8">
         <AccountNav />
         <div className="text-center mt-20">
            <h2 className="text-2xl font-bold">Booking not found</h2>
            <Link to="/account/bookings" className="text-primary underline mt-4 block">
              Go back to my bookings
            </Link>
         </div>
      </div>
    );
  }

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = differenceInCalendarDays(checkOutDate, checkInDate);

  return (
    <div className="container mx-auto px-4 pt-8 pb-12 max-w-6xl">
      <AccountNav />
      
      {/* Back Button & Title Header */}
      <div className="mt-8 mb-6">
        <Link 
          to="/account/bookings" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to bookings
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{booking.place?.title}</h1>
          <div className="flex items-center gap-2 text-gray-600 font-medium">
             
             <AddressLink placeAddress={booking.place?.address} className="hover:underline" />
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-2xl overflow-hidden shadow-sm mb-8">
         <PlaceGallery place={booking.place} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        
        {/* LEFT COLUMN: Details */}
        <div className="space-y-8">
          
          {/* Booking Details Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Booking Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Dates */}
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-gray-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-gray-700" />
                 </div>
                 <div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Check-in</div>
                    <div className="font-semibold text-lg">{format(checkInDate, 'EEE, MMM d, yyyy')}</div>
                    <div className="text-gray-400 text-sm mt-1">After 2:00 PM</div>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="p-3 bg-gray-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-gray-700" />
                 </div>
                 <div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Check-out</div>
                    <div className="font-semibold text-lg">{format(checkOutDate, 'EEE, MMM d, yyyy')}</div>
                    <div className="text-gray-400 text-sm mt-1">Before 11:00 AM</div>
                 </div>
              </div>
            </div>

            <div className="my-6 border-t border-gray-100"></div>

            <div className="flex items-center gap-4">
               <div className="p-3 bg-gray-100 rounded-xl">
                  <Moon className="w-6 h-6 text-gray-700" />
               </div>
               <div>
                  <div className="font-semibold text-lg">Total Length of Stay</div>
                  <div className="text-gray-600">{nights} Night{nights !== 1 && 's'}</div>
               </div>
            </div>
          </div>

          {/* Guest Info Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-semibold text-gray-900">Booked by:</span> {booking.name}
                  </span>
               </div>
               <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-semibold text-gray-900">Phone:</span> {booking.phone}
                  </span>
               </div>
               
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment & Actions */}
        <div className="space-y-6">
           
           {/* Payment Summary */}
           <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg shadow-gray-100 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                 <CreditCard className="w-5 h-5" /> Payment Info
              </h2>

              <div className="space-y-3 text-gray-600">
                 <div className="flex justify-between">
                    <span>Rate per night</span>
                    <span>₹{booking.place?.price?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Nights</span>
                    <span>x {nights}</span>
                 </div>
              </div>

              <div className="my-4 border-t border-gray-100"></div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                 <span>Total Paid</span>
                 <span>₹{booking.price?.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCancel}
                className="w-full mt-8 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                 <Trash2 className="w-4 h-4" /> Cancel Booking
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">
                Free cancellation until 24 hours before check-in.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SingleBookedPlace;