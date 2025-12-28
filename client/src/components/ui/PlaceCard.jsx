import React from 'react';
import { Link } from 'react-router-dom';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price } = place;
  return (
    <Link to={`/place/${placeId}`} className="group m-4 flex flex-col transition-transform hover:scale-[1.02] md:m-2 xl:m-0">
      <div className="card h-full">
        {photos?.[0] && (
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
            <img
              src={`${photos?.[0]}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              alt={title}
            />
          </div>
        )}
        <h2 className="mt-3 truncate font-bold text-gray-900">{address}</h2>
        <h3 className="truncate text-sm text-gray-500">{title}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-bold text-gray-900">₹{price}</span>
          <span className="text-sm text-gray-500">per night</span>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
