import React, { useState, useMemo } from 'react';
import { usePlaces } from '../../hooks';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';
import { 
  Palmtree, Mountain, Building, Waves, Snowflake, Tent, 
  Search, SlidersHorizontal, Check 
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: null },
  { name: 'Beach', icon: <Palmtree className="w-4 h-4" /> },
  { name: 'Modern', icon: <Building className="w-4 h-4" /> },
  { name: 'Countryside', icon: <Mountain className="w-4 h-4" /> },
  { name: 'Pools', icon: <Waves className="w-4 h-4" /> },
  { name: 'Camping', icon: <Tent className="w-4 h-4" /> },
  { name: 'Skiing', icon: <Snowflake className="w-4 h-4" /> },
  { name: 'Islands', icon: <Palmtree className="w-4 h-4" /> },
  { name: 'Lake', icon: <Waves className="w-4 h-4" /> },
  { name: 'Lux', icon: <Building className="w-4 h-4" /> },
];

const PERKS_LIST = [
  { id: 'wifi', label: 'Wifi' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'tv', label: 'TV' },
  { id: 'pets', label: 'Pets Allowed' },
  { id: 'entrance', label: 'Private Entrance' },
  { id: 'radio', label: 'Radio' },
  { id: 'ac', label: 'Air Conditioning' },
];

const ExplorePage = () => {
  const { places, loading } = usePlaces();
  
  // -- Filter States --
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [guestCount, setGuestCount] = useState(1);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // -- Handlers --
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePerkToggle = (perkId) => {
    setSelectedPerks(prev => 
      prev.includes(perkId) 
        ? prev.filter(p => p !== perkId) 
        : [...prev, perkId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: '', max: '' });
    setGuestCount(1);
    setSelectedPerks([]);
  };

  // -- Filtering Logic --
  const filteredPlaces = useMemo(() => {
    if (!places) return [];

    return places.filter(place => {
      // 1. Category Filter
      if (selectedCategory !== 'All' && place.category !== selectedCategory) return false;

      // 2. Price Filter
      const placePrice = Number(place.price) || 0;
      const minPrice = priceRange.min ? Number(priceRange.min) : 0;
      const maxPrice = priceRange.max ? Number(priceRange.max) : Infinity;
      if (placePrice < minPrice) return false;
      if (priceRange.max && placePrice > maxPrice) return false;

      // 3. Guests Filter
      const placeGuests = Number(place.maxGuests) || 0;
      if (placeGuests < guestCount) return false;

      // 4. Perks Filter
      if (selectedPerks.length > 0) {
        const placePerks = place.perks || [];
        const hasAllSelectedPerks = selectedPerks.every(selected => 
          placePerks.includes(selected)
        );
        if (!hasAllSelectedPerks) return false;
      }

      return true;
    });
  }, [places, selectedCategory, priceRange, guestCount, selectedPerks]);

  return (
    // UPDATED: h-screen and overflow-hidden ensures the window doesn't scroll.
    // pt-28 accounts for your fixed Header.
    <div className="container mx-auto px-4 pt-28 h-screen flex flex-col overflow-hidden">
      
      {/* --- Top Bar: Categories (Fixed) --- */}
      <div className="shrink-0 flex items-center justify-between mb-6 gap-4">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar mask-gradient w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all
                ${selectedCategory === cat.name 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 text-sm font-semibold shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* --- Main Content Wrapper (Takes remaining height) --- */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden pb-4">
        
        {/* --- Sidebar Filters (Scrollable independently) --- */}
        <aside className={`
            lg:w-64 shrink-0 h-full overflow-y-auto no-scrollbar pb-20
            ${showMobileFilters ? 'block' : 'hidden lg:block'}
          `}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
                Reset all
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                   <span className="absolute left-3 top-2.5 text-gray-400 text-xs">₹</span>
                   <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative w-full">
                   <span className="absolute left-3 top-2.5 text-gray-400 text-xs">₹</span>
                   <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Guest Count */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Guests</h3>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                <button 
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
                >-</button>
                <span className="text-sm font-medium">{guestCount} Guest{guestCount > 1 ? 's' : ''}</span>
                <button 
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
                >+</button>
              </div>
            </div>

            {/* Perks */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Perks</h3>
              <div className="space-y-3">
                {PERKS_LIST.map((perk) => (
                  <label key={perk.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${selectedPerks.includes(perk.id) 
                        ? 'bg-black border-black text-white' 
                        : 'border-gray-300 group-hover:border-gray-400 bg-white'}
                    `}>
                      {selectedPerks.includes(perk.id) && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={selectedPerks.includes(perk.id)}
                      onChange={() => handlePerkToggle(perk.id)}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{perk.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* --- Main Grid (Scrollable independently) --- */}
        <section className="flex-1 h-full overflow-y-auto no-scrollbar pb-20">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-2">
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedCategory === 'All' ? 'All Places' : `${selectedCategory} Stays`}
                </h1>
                <span className="text-sm text-gray-500">
                  {filteredPlaces.length} places found
                </span>
              </div>

              <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPlaces.length > 0 ? (
                  filteredPlaces.map((place) => <PlaceCard place={place} key={place._id} />)
                ) : (
                  <div className="col-span-full w-full py-20 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">No matches found</h2>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                      Try adjusting your perks or price range to find what you're looking for.
                    </p>
                    <button 
                      onClick={clearFilters}
                      className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

      </div>
    </div>
  );
};

export default ExplorePage;