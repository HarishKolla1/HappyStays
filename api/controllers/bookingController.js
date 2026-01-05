const Booking = require('../models/Booking');
const Place = require('../models/Place');
const User = require('../models/User');
const sendEmail = require('../utils/emailUtils');

// Books a place
exports.createBookings = async (req, res) => {
  try {
    const userData = req.user;
    const { place, checkIn, checkOut, numOfGuests, name, phone, price } =
      req.body;

    // Check for booking conflicts
    const existingBookings = await Booking.find({
      place,
      $or: [
        {
          $and: [
            { checkIn: { $lte: new Date(checkIn) } },
            { checkOut: { $gt: new Date(checkIn) } }
          ]
        },
        {
          $and: [
            { checkIn: { $lt: new Date(checkOut) } },
            { checkOut: { $gte: new Date(checkOut) } }
          ]
        },
        {
          $and: [
            { checkIn: { $gte: new Date(checkIn) } },
            { checkOut: { $lte: new Date(checkOut) } }
          ]
        }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        message: 'These dates are already booked. Please select different dates.',
        success: false
      });
    }

    const booking = await Booking.create({
      user: userData.id,
      place,
      checkIn,
      checkOut,
      numOfGuests,
      name,
      phone,
      price,
    });

    // Respond quickly to client
    res.status(200).json({ booking });

    // Send notification emails to guest and owner (fire-and-forget)
    (async () => {
      try {
        const placeDoc = await Place.findById(place);
        const owner = placeDoc ? await User.findById(placeDoc.owner) : null;

        const userMessage = `Hi ${userData.name},\n\nYour booking for '${placeDoc?.title || 'the place'}' from ${new Date(checkIn).toDateString()} to ${new Date(checkOut).toDateString()} has been confirmed.\n\nTotal: ₹${price}\n\nThank you for booking with HappyStays.`;
        await sendEmail({
          email: userData.email,
          subject: `Booking confirmed: ${placeDoc?.title || 'Your booking'}`,
          message: userMessage,
        }).catch(err => console.log('Failed to send guest email:', err));

        if (owner) {
          const ownerMessage = `Hi ${owner.name || 'Host'},\n\nYour place '${placeDoc?.title || 'a place'}' has been booked by ${name} from ${new Date(checkIn).toDateString()} to ${new Date(checkOut).toDateString()}.\n\nGuest contact: ${phone}\nTotal: ₹${price}\n\nRegards,\nHappyStays`;
          await sendEmail({
            email: owner.email,
            subject: `New booking for your place: ${placeDoc?.title || ''}`,
            message: ownerMessage,
          }).catch(err => console.log('Failed to send owner email:', err));
        }
      } catch (err) {
        console.log('Error sending booking emails:', err);
      }
    })();
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns user specific bookings
exports.getBookings = async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to access this page!' });
    }

    const booking = await Booking.find({ user: userData.id }).populate('place')

    res
      .status(200).json({ booking, success: true })


  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns bookings for a specific place
exports.getPlaceBookings = async (req, res) => {
  try {
    const { placeId } = req.params;
    const bookings = await Booking.find({ place: placeId }).select('checkIn checkOut');

    res.status(200).json({
      bookings,
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Delete a booking (only booking owner can cancel)
exports.deleteBooking = async (req, res) => {
  try {
    const userData = req.user;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the user who made the booking can cancel it
    if (!userData || booking.user.toString() !== userData.id) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    // Capture related info before deletion
    const placeDoc = await Place.findById(booking.place);
    const owner = placeDoc ? await User.findById(placeDoc.owner) : null;

    await Booking.findByIdAndDelete(bookingId);

    // Respond to client
    res.status(200).json({ message: 'Booking cancelled successfully', success: true });

    // Send cancellation emails (fire-and-forget)
    (async () => {
      try {
        const userMessage = `Hi ${userData.name},\n\nYour booking for '${placeDoc?.title || 'the place'}' from ${new Date(booking.checkIn).toDateString()} to ${new Date(booking.checkOut).toDateString()} has been cancelled.\n\nIf this is a mistake, you can rebook via HappyStays.`;
        await sendEmail({
          email: userData.email,
          subject: `Booking cancelled: ${placeDoc?.title || 'Your booking'}`,
          message: userMessage,
        }).catch(err => console.log('Failed to send cancellation email to guest:', err));

        if (owner) {
          const ownerMessage = `Hi ${owner.name || 'Host'},\n\nThe booking for your place '${placeDoc?.title || 'a place'}' by ${booking.name} from ${new Date(booking.checkIn).toDateString()} to ${new Date(booking.checkOut).toDateString()} has been cancelled.\n\nRegards,\nHappyStays`;
          await sendEmail({
            email: owner.email,
            subject: `Booking cancelled for your place: ${placeDoc?.title || ''}`,
            message: ownerMessage,
          }).catch(err => console.log('Failed to send cancellation email to owner:', err));
        }
      } catch (err) {
        console.log('Error sending cancellation emails:', err);
      }
    })();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};
