import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Palmtree, Mountain, Building, Waves, Snowflake, Tent, 
  Wind, Castle, Sun, Home, Briefcase, Users, Hotel 
} from 'lucide-react';

import axiosInstance from '@/utils/axios';
import AccountNav from '@/components/ui/AccountNav';
import Perks from '@/components/ui/Perks';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Spinner from '@/components/ui/Spinner';

const CATEGORIES = [
  { name: 'Beach', icon: <Palmtree className="w-6 h-6" /> },
  { name: 'Modern', icon: <Building className="w-6 h-6" /> },
  { name: 'Countryside', icon: <Mountain className="w-6 h-6" /> },
  { name: 'Pools', icon: <Waves className="w-6 h-6" /> },
  { name: 'Camping', icon: <Tent className="w-6 h-6" /> },
  { name: 'Skiing', icon: <Snowflake className="w-6 h-6" /> },
  { name: 'Islands', icon: <Palmtree className="w-6 h-6" /> },
  { name: 'Windmills', icon: <Wind className="w-6 h-6" /> },
  { name: 'Castles', icon: <Castle className="w-6 h-6" /> },
  { name: 'Desert', icon: <Sun className="w-6 h-6" /> },
  { name: 'Lux', icon: <Building className="w-6 h-6" /> },
];

const PROPERTY_TYPES = [
  { name: 'Entire place', description: 'Guests have the whole place to themselves', icon: <Home className="w-6 h-6"/> },
  { name: 'Private room', description: 'Guests have their own room in a home', icon: <Briefcase className="w-6 h-6"/> },
  { name: 'Shared room', description: 'Guests sleep in a room or common area', icon: <Users className="w-6 h-6"/> },
  { name: 'Hotel room', description: 'Private room in a hotel or hostel', icon: <Hotel className="w-6 h-6"/> },
];

const PlacesFormPage = () => {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    perks: [], 
    extraInfo: '',
    checkIn: '',
    checkOut: '',
    maxGuests: 4,
    price: 1500,
    category: '',
    propertyType: '',
    amenities: [],
    numberOfRooms: 1,
    coordinates: { lat: '', lng: '' },
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance.get(`/places/${id}`).then((response) => {
      const { place } = response.data;
      
      let coords = { lat: '', lng: '' };
      if (place.coordinates && place.coordinates.coordinates) {
        coords = {
          lng: place.coordinates.coordinates[0],
          lat: place.coordinates.coordinates[1]
        };
      }

      setFormData(prev => ({
        ...prev,
        ...place,
        coordinates: coords,
        amenities: place.amenities || [], 
        perks: place.perks || [],
        checkIn: place.checkIn || '',
        checkOut: place.checkOut || '',
        propertyType: place.propertyType || '',
        category: place.category || '',
      }));
      setAddedPhotos(place.photos || []);
      setLoading(false);
    });
  }, [id]);

  const handleFormData = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: value }
      }));
      return;
    }

    if (type === 'checkbox') {
        setFormData(prev => {
            const currentPerks = prev.perks || [];
            if (checked) {
                return { ...prev, perks: [...currentPerks, name] };
            } else {
                return { ...prev, perks: currentPerks.filter(p => p !== name) };
            }
        });
        return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelection = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const savePlace = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.address) return toast.error("Title and Address are required");
    if (addedPhotos.length < 3) return toast.error("Please add at least 3 photos");

    // FIX: Send 'addedPhotos' key to match backend requirement
    const payload = {
      ...formData,
      addedPhotos: addedPhotos, // <--- Corrected Key
      coordinates: {
        type: 'Point',
        coordinates: [
          parseFloat(formData.coordinates.lng) || 0, 
          parseFloat(formData.coordinates.lat) || 0
        ]
      }
    };

    try {
      if (id) {
        await axiosInstance.put('/places/update-place', { id, ...payload });
        toast.success("Place updated successfully");
      } else {
        await axiosInstance.post('/places/add-places', payload);
        toast.success("Place created successfully");
      }
      setRedirect(true);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  if (redirect) return <Navigate to={'/account/places'} />;
  if (loading) return <Spinner />;

  const SectionHeader = ({ title, sub }) => (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{sub}</p>
    </div>
  );

  return (
    <div className="max-w-[1000px] mx-auto p-4 pb-20">
      <AccountNav />
      
      <form onSubmit={savePlace} className="space-y-8 mt-8">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <SectionHeader title="Basic Information" sub="Title and location of your place" />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormData}
            placeholder="Property Title"
            className="input-field text-lg font-semibold"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleFormData}
            placeholder="Address"
            className="input-field"
          />
          <div className="grid grid-cols-2 gap-4">
             <input
                type="number"
                name="lat"
                value={formData.coordinates.lat}
                onChange={handleFormData}
                placeholder="Latitude (e.g. 40.7128)"
                className="input-field"
             />
             <input
                type="number"
                name="lng"
                value={formData.coordinates.lng}
                onChange={handleFormData}
                placeholder="Longitude (e.g. -74.0060)"
                className="input-field"
             />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <SectionHeader title="Category" sub="Which best describes your place?" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleSelection('category', cat.name)}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:border-black
                  ${formData.category === cat.name ? 'border-2 border-black bg-gray-50' : 'border-gray-200'}
                `}
              >
                {cat.icon}
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <SectionHeader title="Property Type" sub="What kind of place will guests have?" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROPERTY_TYPES.map((type) => (
              <div
                key={type.name}
                onClick={() => handleSelection('propertyType', type.name)}
                className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-all hover:border-black
                  ${formData.propertyType === type.name ? 'border-2 border-black bg-gray-50' : 'border-gray-200'}
                `}
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
                {type.icon}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <SectionHeader title="Photos" sub="Add at least 3 photos to show off your place" />
          <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <SectionHeader title="Description" sub="Tell guests what makes your place special" />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormData}
            className="input-field h-32 leading-relaxed"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-600">Max Guests</label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleFormData}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600">No. of Rooms</label>
              <input
                type="number"
                name="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={handleFormData}
                className="input-field mt-1"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <SectionHeader title="Amenities" sub="Select all amenities available" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Wifi', 'Parking', 'TV', 'Kitchen', 'Washer', 'AC', 'Pool', 'Gym', 'Hot tub', 'Fireplace', 'Balcony', 'Workspace'].map((amenity) => (
              <label key={amenity} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-gray-400 transition-all select-none">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
           <SectionHeader title="Perks & Safety" sub="Specific safety features" />
           <Perks selected={formData.perks} handleFormData={handleFormData} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <SectionHeader title="Important Details" sub="House rules, pricing and dates" />
          <textarea
            name="extraInfo"
            value={formData.extraInfo}
            onChange={handleFormData}
            placeholder="House rules, Check-in instructions..."
            className="input-field h-24"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
             <div>
                <label className="text-sm font-bold text-gray-600">Check-In Time</label>
                <input
                  type="text"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleFormData}
                  placeholder="14:00"
                  className="input-field mt-1"
                />
             </div>
             <div>
                <label className="text-sm font-bold text-gray-600">Check-Out Time</label>
                <input
                  type="text"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleFormData}
                  placeholder="11:00"
                  className="input-field mt-1"
                />
             </div>
             <div>
                <label className="text-sm font-bold text-gray-600">Price per night (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormData}
                  className="input-field mt-1 font-bold text-primary"
                />
             </div>
          </div>
        </div>

        <div className="flex justify-end pb-10">
           <button className="btn-primary px-10 py-3 text-lg rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
              Save & Publish
           </button>
        </div>

      </form>
    </div>
  );
};

export default PlacesFormPage;