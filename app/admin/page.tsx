'use client';

import { useEffect, useState } from 'react';
import AdminClient from './AdminClient';
import { Property, ContactInquiry } from '@/lib/types';

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/properties').then(r => r.json()),
      fetch('/api/inquiries').then(r => r.json()),
    ])
      .then(([props, inqs]: [Property[], ContactInquiry[]]) => {
        setProperties(props);
        setInquiries(inqs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] pt-20">
        <div className="bg-[#0B1628] border-b border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-3" />
            <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <AdminClient initialProperties={properties} initialInquiries={inquiries} />;
}
