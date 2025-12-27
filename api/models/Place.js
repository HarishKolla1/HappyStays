const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: [{ type: String }],
  description: {
    type: String,
  },
  perks: [{ type: String }],
  extraInfo: {
    type: String,
  },
  maxGuests: {
    type: Number,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
    enum: ['Beach', 'Windmills', 'Modern', 'Countryside', 'Pools', 'Islands', 
           'Lake', 'Skiing', 'Castles', 'Caves', 'Camping', 'Arctic', 'Desert', 
           'Barns', 'Lux'],
  },
  propertyType: {
    type: String,
    enum: ['Entire place', 'Private room', 'Shared room', 'Hotel room',
           'Apartment', 'House', 'Villa', 'Cabin', 'Cottage'],
  },
  amenities: [{
    type: String,
  }],
  numberOfRooms: {
    type: Number,
    default: 1,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
