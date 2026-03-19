'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PropertyDetailClient from './PropertyDetailClient';
import { Property } from '@/lib/types';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/properties?id=${id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data: Property | null) => {
        if (data) setProperty(data);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0B1628] flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <div className="text-[#C9A84C] text-8xl font-bold mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">Residence Not Found</h1>
          <p className="text-white/50 mb-8">This unit may no longer be available.</p>
          <Link href="/rentals" className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0B1628] font-bold px-8 py-4 rounded-xl hover:bg-[#E8C97A] transition-all">
            Browse Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] pt-20">
        <div className="bg-white border-b border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/rentals" className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Listings
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl h-[420px] bg-gray-200 animate-pulse" />
              <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return <PropertyDetailClient property={property} />;
}
