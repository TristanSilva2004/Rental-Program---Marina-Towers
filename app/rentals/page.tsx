'use client';

import { useEffect, useState } from 'react';
import RentalsClient from './RentalsClient';
import { Property } from '@/lib/types';

export default function RentalsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties?status=approved')
      .then(r => r.json())
      .then((data: Property[]) => setProperties(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] pt-28 pb-20">
        <div className="bg-[#0B1628] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Available Now</div>
            <div className="h-12 w-64 bg-white/10 rounded-xl animate-pulse mb-3" />
            <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <RentalsClient properties={properties} />;
}
