const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  createBookings,
  getBookings,
  getPlaceBookings,
  deleteBooking,
} = require('../controllers/bookingController');

// Protected routes (user must be logged in)
router.route('/').get(isLoggedIn, getBookings).post(isLoggedIn, createBookings);

// Public route to get bookings for a place (for date blocking)
router.route('/place/:placeId').get(getPlaceBookings);

// Protected route to cancel a booking
router.route('/:id').delete(isLoggedIn, deleteBooking);

module.exports = router;
