'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Bed, Bath, Maximize2, MapPin, Star, Eye,
  CheckCircle, Phone, Mail, Calendar, ChevronLeft, ChevronRight,
  PawPrint, Car, Sofa, Clock
} from 'lucide-react';
import { Property } from '@/lib/types';

interface Props {
  property: Property;
}

export default function PropertyDetailClient({ property }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', checkIn: '', checkOut: '', message: '',
  });

  useEffect(() => {
    fetch('/api/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', id: property.id }),
    });
  }, [property.id]);

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200'];

  async function handleInquiry(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inquiry',
          propertyId: property.id,
          propertyTitle: property.title,
          ...form,
        }),
      });
      setInquirySubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-20">
      {/* Back nav */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/rentals" className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-[#0B1628] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Main content */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[520px] mb-4 group">
              <Image
                src={images[currentImage]}
                alt={property.title}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1628]/40 via-transparent to-transparent" />

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                {currentImage + 1} / {images.length}
              </div>

              {/* Floor badge */}
              <div className="absolute top-4 left-4 bg-[#0B1628]/80 backdrop-blur-sm text-[#C9A84C] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wider">
                Floor {property.floor} · {property.unitNumber}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all ${
                      i === currentImage ? 'ring-2 ring-[#C9A84C]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & basic info */}
            <div className="mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#0B1628] mb-1">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-[#C9A84C]" />
                    Marina Towers, {property.unitNumber} · Miami, FL
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{property.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#C9A84C] text-[#C9A84C]" />
                    <span className="text-sm font-semibold text-[#0B1628]">5.0</span>
                  </div>
                </div>
              </div>

              {/* Specs row */}
              <div className="flex flex-wrap items-center gap-6 py-5 border-y border-gray-100">
                <span className="flex items-center gap-2 text-[#0B1628]">
                  <Bed className="w-5 h-5 text-[#C9A84C]" />
                  <strong>{property.bedrooms}</strong> <span className="text-gray-500">Bedrooms</span>
                </span>
                <span className="flex items-center gap-2 text-[#0B1628]">
                  <Bath className="w-5 h-5 text-[#C9A84C]" />
                  <strong>{property.bathrooms}</strong> <span className="text-gray-500">Bathrooms</span>
                </span>
                <span className="flex items-center gap-2 text-[#0B1628]">
                  <Maximize2 className="w-5 h-5 text-[#C9A84C]" />
                  <strong>{property.sqft.toLocaleString()}</strong> <span className="text-gray-500">sqft</span>
                </span>
                <span className="flex items-center gap-2 text-[#0B1628]">
                  <Clock className="w-5 h-5 text-[#C9A84C]" />
                  <span className="text-gray-500">Min {property.minimumStay} nights</span>
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-5">
                {property.petFriendly && (
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    <PawPrint className="w-3.5 h-3.5" /> Pet Friendly
                  </span>
                )}
                {property.parkingIncluded && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    <Car className="w-3.5 h-3.5" /> Parking Included
                  </span>
                )}
                {property.furnished && (
                  <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    <Sofa className="w-3.5 h-3.5" /> Furnished
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#0B1628] mb-4">About This Residence</h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#0B1628] mb-5">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-4 py-3">
                    <CheckCircle className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                    <span className="text-[#0B1628] text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#0B1628] mb-4">Availability</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Available From</div>
                  <div className="text-[#0B1628] font-semibold">{new Date(property.availableFrom).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Available Until</div>
                  <div className="text-[#0B1628] font-semibold">{new Date(property.availableTo).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {/* Price card */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-[#0B1628]">${property.pricePerNight.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm">/ night</span>
                </div>
                <div className="text-gray-400 text-sm mb-6">
                  ${property.pricePerMonth.toLocaleString()} / month
                </div>

                {!showInquiry ? (
                  <button
                    onClick={() => setShowInquiry(true)}
                    className="w-full bg-[#C9A84C] text-[#0B1628] font-bold py-4 rounded-xl hover:bg-[#E8C97A] transition-all text-sm tracking-wider"
                  >
                    Request Information
                  </button>
                ) : inquirySubmitted ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-[#C9A84C] mx-auto mb-3" />
                    <h3 className="font-bold text-[#0B1628] mb-2">Inquiry Sent!</h3>
                    <p className="text-gray-500 text-sm">The owner will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <h3 className="font-bold text-[#0B1628] mb-4">Send Inquiry</h3>

                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[#F9F7F2] rounded-xl px-4 py-3 text-sm text-[#0B1628] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#F9F7F2] rounded-xl px-4 py-3 text-sm text-[#0B1628] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-[#F9F7F2] rounded-xl px-4 py-3 text-sm text-[#0B1628] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Check-in</label>
                        <input
                          type="date"
                          value={form.checkIn}
                          onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
                          className="w-full bg-[#F9F7F2] rounded-xl px-3 py-2.5 text-xs text-[#0B1628] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Check-out</label>
                        <input
                          type="date"
                          value={form.checkOut}
                          onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                          className="w-full bg-[#F9F7F2] rounded-xl px-3 py-2.5 text-xs text-[#0B1628] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                        />
                      </div>
                    </div>

                    {nights > 0 && (
                      <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">${property.pricePerNight.toLocaleString()} × {nights} nights</span>
                          <span className="font-bold text-[#0B1628]">${(property.pricePerNight * nights).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <textarea
                      placeholder="Message (questions, special requests...)"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-[#F9F7F2] rounded-xl px-4 py-3 text-sm text-[#0B1628] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 h-24 resize-none"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#C9A84C] text-[#0B1628] font-bold py-4 rounded-xl hover:bg-[#E8C97A] transition-all text-sm tracking-wider disabled:opacity-60"
                    >
                      {loading ? 'Sending...' : 'Send Inquiry'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInquiry(false)}
                      className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                )}

                {/* Contact info */}
                {!showInquiry && (
                  <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-sm text-gray-500">
                      <Phone className="w-4 h-4 text-[#C9A84C]" />
                      <span>{property.ownerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-500">
                      <Mail className="w-4 h-4 text-[#C9A84C]" />
                      <span className="truncate">{property.ownerEmail}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Owner card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Listed By</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
                    <span className="text-[#C9A84C] font-bold text-sm">{property.ownerName[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0B1628] text-sm">{property.ownerName}</div>
                    <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-500" /> Verified Owner
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
