import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '@/utils/axios';

import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return '';
    }

    setLoading(true);

    const getPlace = async () => {
      const { data } = await axiosInstance.get(`/places/${id}`);
      setPlace(data.place);
      setLoading(false);
    };
    getPlace();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!place) {
    return;
  }

  return (
    <div className="container mx-auto mt-4 overflow-x-hidden px-4 pt-24 sm:px-8">
      <h1 className="text-4xl font-bold text-gray-900">{place.title}</h1>

      <AddressLink placeAddress={place.address} />
      <PlaceGallery place={place} />

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr]">
        <div className="">
          <div className="my-4 ">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Description</h2>
            <div className="text-lg leading-relaxed text-gray-700">
              {place.description}
            </div>
          </div>
          <div className="mt-6 text-lg font-medium text-gray-900">
            Max number of guests: {place.maxGuests}
          </div>
          <PerksWidget perks={place?.perks} />
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="-mx-8 border-t bg-gray-50 px-8 py-12">
        <div className="container mx-auto">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Extra Info</h2>
          <div className="text-base leading-relaxed text-gray-600">
            {place.extraInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
