import React from 'react';
import { Link } from 'react-router-dom';
import PlaceImg from './PlaceImg';

const InfoCard = ({ place, onDelete }) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this place?')) {
      if (onDelete) {
        onDelete(place._id);
      }
    }
  };

  return (
    <div className="relative">
      <Link
        to={`/account/places/${place._id}`}
        className="my-3 flex cursor-pointer flex-col gap-4 rounded-2xl bg-gray-100 p-4 transition-all hover:bg-gray-300 md:flex-row"
        key={place._id}
      >
        <div className="flex w-full shrink-0 bg-gray-300 sm:h-32 sm:w-32 ">
          <PlaceImg place={place} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg md:text-xl">{place.title}</h2>
          <p className="line-clamp-3 mt-2 text-sm">{place.description}</p>
        </div>
      </Link>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600 transition-colors"
          title="Delete place"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default InfoCard;
