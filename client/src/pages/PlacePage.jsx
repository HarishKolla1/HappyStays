import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Users, DoorOpen, BedDouble, MapPin, 
  Clock, Info, Star 
} from 'lucide-react';

import axiosInstance from '@/utils/axios';

import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading true

  useEffect(() => {
    if (!id) return;
    
    const getPlace = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/places/${id}`);
        setPlace(data.place);
      } catch (error) {
        console.error("Failed to fetch place", error);
      } finally {
        setLoading(false);
      }
    };
    
    getPlace();
  }, [id]);

  if (loading) return <Spinner />;
  if (!place) return null;

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 sm:px-8 max-w-7xl">
      
      {/* --- Header: Title & Address --- */}
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          {place.title}
        </h1>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 underline decoration-gray-300 underline-offset-4 hover:decoration-black transition-all">
          <AddressLink placeAddress={place.address} />
        </div>
      </div>

      {/* --- Gallery --- */}
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <PlaceGallery place={place} />
      </div>

      {/* --- Main Content Layout --- */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-[2fr_1.1fr] gap-12">
        
        {/* === LEFT COLUMN: Details === */}
        <div className="min-w-0"> {/* min-w-0 prevents flex/grid blowout */}
          
          {/* 1. Property Stats Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-gray-200">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {place.propertyType || 'Entire Home'} hosted by Owner
              </h2>
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                 <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {place.maxGuests} Guest{place.maxGuests !== 1 && 's'}
                 </span>
                 <span className="text-gray-300">•</span>
                 <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" /> {place.numberOfRooms || 1} Bedroom{place.numberOfRooms !== 1 && 's'}
                 </span>
                 <span className="text-gray-300">•</span>
                 <span className="flex items-center gap-1">
                    <DoorOpen className="w-4 h-4" /> {place.category || 'Stay'}
                 </span>
              </div>
            </div>
            {/* Optional: Host Avatar Placeholder could go here */}
          </div>

          {/* 2. Check-In / Check-Out Highlights */}
          <div className="py-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-6">
               {/* Check In */}
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-full border border-gray-100">
                     <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                     <h3 className="font-semibold text-gray-900">Check-in</h3>
                     <p className="text-gray-500 text-sm mt-0.5">After {place.checkIn || '14:00'}</p>
                  </div>
               </div>

               {/* Check Out */}
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-full border border-gray-100">
                     <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                     <h3 className="font-semibold text-gray-900">Checkout</h3>
                     <p className="text-gray-500 text-sm mt-0.5">Before {place.checkOut || '11:00'}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* 3. Description */}
          <div className="py-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this place</h2>
            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line break-words">
              {place.description}
            </div>
          </div>

          {/* 4. Perks / Amenities */}
          <div className="py-8 border-b border-gray-200">
             <PerksWidget perks={place?.perks || []} />
          </div>

          {/* 5. Extra Info / Rules */}
          {place.extraInfo && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-6 h-6" />
                Things to know
              </h2>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {place.extraInfo}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* === RIGHT COLUMN: Booking Sidebar === */}
        <div className="relative">
          {/* Sticky container needs a defined height/context, usually simple div works unless overflow issues exist upstream */}
          <div className="sticky top-28">
             <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-100/50 p-1 overflow-hidden">
                <BookingWidget place={place} />
             </div>
             
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlacePage;