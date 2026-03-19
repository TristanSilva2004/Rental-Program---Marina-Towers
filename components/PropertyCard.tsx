import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Maximize2, Eye, Star } from 'lucide-react';
import { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';

  return (
    <Link href={`/rentals/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#C9A84C]/30 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1628]/60 via-transparent to-transparent" />

          {/* Floor badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#0B1628]/80 backdrop-blur-sm text-[#C9A84C] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wider">
              Floor {property.floor} · Unit {property.unitNumber}
            </span>
          </div>

          {/* Views */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Eye className="w-3 h-3 text-white/80" />
            <span className="text-white/80 text-xs">{property.views}</span>
          </div>

          {/* Price */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-[#C9A84C] text-[#0B1628] text-sm font-bold px-3 py-1.5 rounded-lg">
              ${property.pricePerNight.toLocaleString()}<span className="font-normal text-xs">/night</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-[#0B1628] text-lg leading-tight group-hover:text-[#C9A84C] transition-colors">
                {property.title}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5 tracking-wider uppercase">Marina Towers, Miami</p>
            </div>
            <div className="flex items-center gap-1 text-[#C9A84C]">
              <Star className="w-4 h-4 fill-[#C9A84C]" />
              <span className="text-sm font-semibold text-[#0B1628]">5.0</span>
            </div>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 pt-4 border-t border-gray-100">
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-[#C9A84C]" />
              {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-[#C9A84C]" />
              {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-[#C9A84C]" />
              {property.sqft.toLocaleString()} sqft
            </span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="bg-[#F9F7F2] text-gray-600 text-xs px-2.5 py-1 rounded-md">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="bg-[#C9A84C]/10 text-[#C9A84C] text-xs px-2.5 py-1 rounded-md font-medium">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
