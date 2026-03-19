'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/lib/types';

interface Props {
  properties: Property[];
}

export default function RentalsClient({ properties }: Props) {
  const [search, setSearch] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...properties];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.amenities.some(a => a.toLowerCase().includes(q))
      );
    }

    if (bedrooms) {
      list = list.filter(p => p.bedrooms === Number(bedrooms));
    }

    if (maxPrice) {
      list = list.filter(p => p.pricePerNight <= Number(maxPrice));
    }

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.pricePerNight - b.pricePerNight); break;
      case 'price-desc': list.sort((a, b) => b.pricePerNight - a.pricePerNight); break;
      case 'floor-desc': list.sort((a, b) => b.floor - a.floor); break;
      case 'size-desc': list.sort((a, b) => b.sqft - a.sqft); break;
      case 'popular': list.sort((a, b) => b.views - a.views); break;
    }

    return list;
  }, [properties, search, bedrooms, maxPrice, sortBy]);

  const hasFilters = search || bedrooms || maxPrice;

  function clearFilters() {
    setSearch('');
    setBedrooms('');
    setMaxPrice('');
    setSortBy('default');
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-28 pb-20">
      {/* Header */}
      <div className="bg-[#0B1628] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Available Now</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Browse Residences</h1>
          <p className="text-white/50">
            {properties.length} exclusive units at Marina Towers, Miami
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, amenity..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F9F7F2] rounded-xl text-sm text-[#0B1628] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
              />
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />}
            </button>

            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <select
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  className="appearance-none bg-[#F9F7F2] border-0 rounded-xl pl-4 pr-9 py-3 text-sm text-[#0B1628] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                >
                  <option value="">All Bedrooms</option>
                  <option value="0">Studio</option>
                  <option value="1">1 Bed</option>
                  <option value="2">2 Beds</option>
                  <option value="3">3 Beds</option>
                  <option value="4">4+ Beds</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="appearance-none bg-[#F9F7F2] border-0 rounded-xl pl-4 pr-9 py-3 text-sm text-[#0B1628] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                >
                  <option value="">Any Price</option>
                  <option value="300">Under $300/night</option>
                  <option value="500">Under $500/night</option>
                  <option value="1000">Under $1,000/night</option>
                  <option value="2000">Under $2,000/night</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-[#F9F7F2] border-0 rounded-xl pl-4 pr-9 py-3 text-sm text-[#0B1628] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                >
                  <option value="default">Sort By</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="floor-desc">Highest Floor</option>
                  <option value="size-desc">Largest Unit</option>
                  <option value="popular">Most Viewed</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-3 text-sm text-[#C9A84C] font-medium hover:bg-[#C9A84C]/5 rounded-xl transition-all">
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile filters expanded */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <select value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="bg-[#F9F7F2] rounded-xl px-4 py-3 text-sm text-[#0B1628] focus:outline-none">
                <option value="">All Bedrooms</option>
                <option value="0">Studio</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4+ Beds</option>
              </select>
              <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="bg-[#F9F7F2] rounded-xl px-4 py-3 text-sm text-[#0B1628] focus:outline-none">
                <option value="">Any Price</option>
                <option value="300">Under $300/night</option>
                <option value="500">Under $500/night</option>
                <option value="1000">Under $1,000/night</option>
                <option value="2000">Under $2,000/night</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-[#F9F7F2] rounded-xl px-4 py-3 text-sm text-[#0B1628] focus:outline-none col-span-2">
                <option value="default">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="floor-desc">Highest Floor</option>
                <option value="size-desc">Largest Unit</option>
                <option value="popular">Most Viewed</option>
              </select>
              {hasFilters && (
                <button onClick={clearFilters} className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 text-sm text-[#C9A84C] font-medium">
                  <X className="w-4 h-4" /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {filtered.length} {filtered.length === 1 ? 'residence' : 'residences'} found
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1628] mb-2">No results found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="text-[#C9A84C] font-semibold text-sm hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
