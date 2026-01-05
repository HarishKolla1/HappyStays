const Place = require('../models/Place');
const sendEmail = require('../utils/emailUtils');

// Adds a place in the DB
exports.addPlace = async (req, res) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
      category,
      propertyType,
      amenities,
      numberOfRooms,
      coordinates,
      checkIn,   // <--- extracted here
      checkOut,
    } = req.body;
    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
      category,
      propertyType,
      amenities,
      numberOfRooms,
      coordinates,
      checkIn,   // <--- extracted here
      checkOut,
    });
    res.status(200).json({
      place,
    });

    // Send notification email to owner (fire-and-forget)
    (async () => {
      try {
        const message = `Hi ${userData.name},\n\nGreat! Your accommodation '${title}' has been successfully listed on HappyStays.\n\nLocation: ${address}\nPrice: ₹${price}/night\nMax Guests: ${maxGuests}\n\nYour place is now visible to guests. Start receiving bookings!\n\nRegards,\nHappyStays Team`;
        await sendEmail({
          email: userData.email,
          subject: `Accommodation Listed: ${title}`,
          message,
        }).catch(err => console.log('Failed to send accommodation listing email:', err));
      } catch (err) {
        console.log('Error sending accommodation listing email:', err);
      }
    })();
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns user specific places
exports.userPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const id = userData.id;
    res.status(200).json(await Place.find({ owner: id }));
  } catch (err) {
    res.status(500).json({
      message: 'Internal serever error',
    });
  }
};

// Updates a place
exports.updatePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
      category,
      propertyType,
      amenities,
      numberOfRooms,
      coordinates,
      checkIn,   // <--- extracted here
      checkOut,
    } = req.body;

    const place = await Place.findById(id);
    if (userId === place.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        maxGuests,
        price,
        category,
        propertyType,
        amenities,
        numberOfRooms,
        coordinates,
        checkIn,   // <--- extracted here
        checkOut,
      });
      await place.save();
      res.status(200).json({
        message: 'place updated!',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns all the places in DB
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({
      places,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// Returns single place, based on passed place id
exports.singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(400).json({
        message: 'Place not found',
      });
    }
    res.status(200).json({
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal serever error',
    });
  }
};

// Search Places in the DB
exports.searchPlaces = async (req, res) => {
  try {
    const searchword = req.params.key;

    if (searchword === '') return res.status(200).json(await Place.find())

    const searchMatches = await Place.find({ address: { $regex: searchword, $options: "i" } })

    res.status(200).json(searchMatches);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Internal serever error 1',
    });
  }
};

// Deletes a place (only by the owner)
exports.deletePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const { id } = req.params;

    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        message: 'Place not found',
      });
    }

    if (userId !== place.owner.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to delete this place',
      });
    }

    const placeTitle = place.title;
    await Place.findByIdAndDelete(id);
    res.status(200).json({
      message: 'Place deleted successfully',
    });

    // Send notification email to owner (fire-and-forget)
    (async () => {
      try {
        const message = `Hi ${userData.name},\n\nYour accommodation '${placeTitle}' has been successfully removed from HappyStays.\n\nIf you'd like to list another property, you can always add a new accommodation anytime.\n\nRegards,\nHappyStays Team`;
        await sendEmail({
          email: userData.email,
          subject: `Accommodation Removed: ${placeTitle}`,
          message,
        }).catch(err => console.log('Failed to send accommodation deletion email:', err));
      } catch (err) {
        console.log('Error sending accommodation deletion email:', err);
      }
    })();
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};