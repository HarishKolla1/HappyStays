const Place = require('../models/Place');

exports.getAllPlaces = async (req, res) => {
  try {
    const {
      category,
      priceMin,
      priceMax,
      rooms,
      propertyType,
      amenities,
      search,
    } = req.query;

    // Build filter query
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    if (rooms) {
      filter.numberOfRooms = Number(rooms);
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (amenities) {
      const amenitiesList = amenities.split(',');
      filter.amenities = { $all: amenitiesList };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const places = await Place.find(filter).populate('owner');

    res.status(200).json({
      success: true,
      count: places.length,
      places,
    });
  } catch (error) {
    console.error('Error in getAllPlaces:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching places',
      error: error.message
    });
  }
};

exports.saveSearchPreferences = async (req, res) => {
  try {
    const { userId } = req.user;
    const preferences = req.body;

    // Save preferences logic here (you'll need to create a SearchPreference model)
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Search preferences saved successfully',
    });
  } catch (error) {
    console.error('Error in saveSearchPreferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving search preferences',
      error: error.message
    });
  }
};

exports.getPlacesByLocation = async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius in meters

    const places = await Place.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius,
        },
      },
    }).populate('owner');

    res.status(200).json({
      success: true,
      count: places.length,
      places,
    });
  } catch (error) {
    console.error('Error in getPlacesByLocation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching places by location',
      error: error.message
    });
  }
};