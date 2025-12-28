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
  const { user } = useAuth();

  const { noOfGuests, name, phone } = bookingData;
  const { _id: id, price } = place;

  useEffect(() => {
    if (user) {
      setBookingData({ ...bookingData, name: user.name });
    }
  }, [user]);

  const numberOfNights =
    dateRange.from && dateRange.to
      ? differenceInDays(
        new Date(dateRange.to).setHours(0, 0, 0, 0),
        new Date(dateRange.from).setHours(0, 0, 0, 0),
      )
      : 0;

  // handle booking form
  const handleBookingData = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    // User must be signed in to book place
    if (!user) {
      return setRedirect(`/login`);
    }

    // BOOKING DATA VALIDATION
    if (numberOfNights < 1) {
      return toast.error('Please select valid dates');
    } else if (noOfGuests < 1) {
      return toast.error("No. of guests can't be less than 1");
    } else if (noOfGuests > place.maxGuests) {
      return toast.error(`Allowed max. no. of guests: ${place.maxGuests}`);
    } else if (name.trim() === '') {
      return toast.error("Name can't be empty");
    } else if (phone.trim() === '') {
      return toast.error("Phone can't be empty");
    }

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
      toast.error('Something went wrong!');
      console.log('Error: ', error);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="sticky top-32 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all">
      <div className="text-center text-2xl">
        Price: <span className="font-bold text-primary">₹{place.price}</span> <span className="text-base text-gray-500">/ night</span>
      </div>
      <div className="mt-6 rounded-2xl border border-gray-300">
        <div className="flex w-full ">
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>
        <div className="border-t border-gray-300 py-4 px-4">
          <label className="mb-1 block text-sm font-semibold text-gray-600">Number of guests: </label>
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
            <label className="mb-1 block text-sm font-semibold text-gray-600">Your full name: </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleBookingData}
              className="mb-3 w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none"
            />
            <label className="mb-1 block text-sm font-semibold text-gray-600">Phone number: </label>
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
