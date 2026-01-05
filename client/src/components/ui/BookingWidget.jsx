import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks';
import axiosInstance from '@/utils/axios';
import DatePickerWithRange from './DatePickerWithRange';

const BookingWidget = ({ place }) => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [bookingData, setBookingData] = useState({
    noOfGuests: 1,
    name: '',
    phone: '',
  });
  const [redirect, setRedirect] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const { user } = useAuth();

  const { noOfGuests, name, phone } = bookingData;
  const { _id: id, price } = place;

  // Prefill user data
  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  // Fetch Booked Dates
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/place/${id}`);
        setBookedDates(response.data.bookings);
      } catch (error) {
        console.log('Error fetching booked dates:', error);
      }
    };
    if (id) fetchBookedDates();
  }, [id]);

  // Calculate Nights
  const numberOfNights =
    dateRange?.from && dateRange?.to
      ? differenceInDays(
          new Date(dateRange.to).setHours(0, 0, 0, 0),
          new Date(dateRange.from).setHours(0, 0, 0, 0)
        )
      : 0;

  const handleBookingData = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    if (!user) return setRedirect(`/login`);

    // Validations
    if (numberOfNights < 1) return toast.error('Please select valid dates');
    if (noOfGuests < 1) return toast.error("Guests can't be less than 1");
    if (noOfGuests > place.maxGuests) return toast.error(`Max guests allowed: ${place.maxGuests}`);
    if (name.trim() === '') return toast.error("Name required");
    if (phone.trim() === '') return toast.error("Phone required");

    try {
      const response = await axiosInstance.post('/bookings', {
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        noOfGuests,
        name,
        phone,
        place: id,
        price: numberOfNights * price,
      });

      const bookingId = response.data.booking._id;
      setRedirect(`/account/bookings/${bookingId}`);
      toast('Congratulations! Enjoy your trip.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="sticky top-32 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all">
      <div className="text-center text-2xl">
        Price: <span className="font-bold text-primary">₹{place.price}</span> <span className="text-base text-gray-500">/ night</span>
      </div>
      <div className="mt-6 rounded-2xl border border-gray-300">
        <div className="flex w-full ">
          {/* We pass the bookedDates array here */}
          <DatePickerWithRange 
            setDateRange={setDateRange} 
            disabledDates={bookedDates} 
          />
        </div>
        
        {/* Helper text area */}
        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-300">
          
          {numberOfNights > 0 && (
            <span className="flex items-center gap-1 mt-1 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {numberOfNights} nights selected
            </span>
          )}
        </div>

        <div className="border-t border-gray-300 py-4 px-4">
          <label className="mb-1 block text-sm font-semibold text-gray-600">Number of guests:</label>
          <input
            type="number"
            name="noOfGuests"
            placeholder={`Max. guests: ${place.maxGuests}`}
            min={1}
            max={place.maxGuests}
            value={noOfGuests}
            onChange={handleBookingData}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none"
          />
        </div>
        {numberOfNights > 0 && (
          <div className="border-t border-gray-300 py-4 px-4">
            <label className="mb-1 block text-sm font-semibold text-gray-600">Your full name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleBookingData}
              className="mb-3 w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none"
            />
            <label className="mb-1 block text-sm font-semibold text-gray-600">Phone number:</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={handleBookingData}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none"
            />
          </div>
        )}
      </div>
      <button onClick={handleBooking} className="primary mt-6 w-full rounded-full py-3 text-lg font-bold shadow-md transition-transform hover:scale-[1.02]">
        Book this place
        {numberOfNights > 0 && <span> ₹{numberOfNights * place.price}</span>}
      </button>
    </div>
  );
};

export default BookingWidget;