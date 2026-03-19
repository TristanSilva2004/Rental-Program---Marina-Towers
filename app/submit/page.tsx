'use client';

import { useState } from 'react';
import { CheckCircle, Upload, Building2, User, Calendar, DollarSign, Home, ChevronDown } from 'lucide-react';

const AMENITIES = [
  'Concierge', 'Valet Parking', 'Pool', 'Spa', 'Fitness Center', 'Private Terrace',
  'Smart Home System', 'Marina Views', 'City Views', 'Bay Views', 'Home Theater',
  'Wine Cellar', 'Butler Service', 'In-Unit Laundry', 'Business Center', 'Tennis Court',
  'Private Elevator', 'Storage Unit', 'Outdoor Kitchen', 'Room Service',
];

const STEP_LABELS = ['Unit Details', 'Owner Info', 'Availability & Pricing', 'Amenities'];

interface FormData {
  unitNumber: string;
  floor: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  availableFrom: string;
  availableTo: string;
  pricePerNight: string;
  pricePerMonth: string;
  minimumStay: string;
  petFriendly: boolean;
  parkingIncluded: boolean;
  furnished: boolean;
  amenities: string[];
  imageUrls: string;
}

export default function SubmitPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    unitNumber: '',
    floor: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    description: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    availableFrom: '',
    availableTo: '',
    pricePerNight: '',
    pricePerMonth: '',
    minimumStay: '7',
    petFriendly: false,
    parkingIncluded: false,
    furnished: true,
    amenities: [],
    imageUrls: '',
  });

  function update(field: keyof FormData, value: string | boolean | string[]) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function toggleAmenity(amenity: string) {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  function validateStep(s: number): boolean {
    const newErrors: Record<string, string> = {};
    if (s === 0) {
      if (!form.unitNumber) newErrors.unitNumber = 'Required';
      if (!form.floor) newErrors.floor = 'Required';
      if (!form.bedrooms) newErrors.bedrooms = 'Required';
      if (!form.bathrooms) newErrors.bathrooms = 'Required';
      if (!form.sqft) newErrors.sqft = 'Required';
      if (!form.description || form.description.length < 50) newErrors.description = 'Please write at least 50 characters';
    }
    if (s === 1) {
      if (!form.ownerName) newErrors.ownerName = 'Required';
      if (!form.ownerEmail || !/\S+@\S+\.\S+/.test(form.ownerEmail)) newErrors.ownerEmail = 'Valid email required';
      if (!form.ownerPhone) newErrors.ownerPhone = 'Required';
    }
    if (s === 2) {
      if (!form.availableFrom) newErrors.availableFrom = 'Required';
      if (!form.availableTo) newErrors.availableTo = 'Required';
      if (!form.pricePerNight) newErrors.pricePerNight = 'Required';
      if (!form.pricePerMonth) newErrors.pricePerMonth = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      const images = form.imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(Boolean);

      const body = {
        type: 'property',
        title: `Unit ${form.unitNumber} — Tower ${form.unitNumber[0] || 'A'}`,
        ...form,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4 pt-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#C9A84C]" />
          </div>
          <h1 className="text-3xl font-bold text-[#0B1628] mb-4">Submission Received!</h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Thank you for submitting your unit to the Marina Towers Private Rental Program.
            Our team will review your listing and contact you within 24–48 hours.
          </p>
          <div className="bg-white border border-[#C9A84C]/20 rounded-2xl p-6 text-left mb-8">
            <div className="text-[#C9A84C] text-xs tracking-widest uppercase mb-4">What happens next?</div>
            {['Our team reviews your submission', 'We verify ownership and details', 'Your listing goes live within 48 hours', 'Inquiries are forwarded directly to you'].map((step, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="w-5 h-5 rounded-full bg-[#C9A84C] text-[#0B1628] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                <span className="text-gray-600 text-sm">{step}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm({ unitNumber: '', floor: '', bedrooms: '', bathrooms: '', sqft: '', description: '', ownerName: '', ownerEmail: '', ownerPhone: '', availableFrom: '', availableTo: '', pricePerNight: '', pricePerMonth: '', minimumStay: '7', petFriendly: false, parkingIncluded: false, furnished: true, amenities: [], imageUrls: '' }); }}
            className="text-[#C9A84C] text-sm font-semibold tracking-wider hover:underline"
          >
            Submit Another Unit
          </button>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full bg-white border ${errors[field] ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-[#0B1628] text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-all placeholder-gray-400`;

  const selectClass = `w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#0B1628] text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-all appearance-none`;

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Owner Program</div>
          <h1 className="text-4xl font-bold text-[#0B1628] mb-3">List Your Residence</h1>
          <p className="text-gray-500">Join Miami's most exclusive private rental network</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-[#C9A84C] text-[#0B1628]' :
                  i === step ? 'bg-[#0B1628] text-[#C9A84C] ring-2 ring-[#C9A84C]/30' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div className={`text-xs mt-2 font-medium hidden sm:block ${i === step ? 'text-[#0B1628]' : 'text-gray-400'}`}>
                  {label}
                </div>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[#C9A84C]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Step 0: Unit Details */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-xl font-bold text-[#0B1628]">Unit Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit Number *</label>
                  <input className={inputClass('unitNumber')} placeholder="e.g. A-4501" value={form.unitNumber} onChange={e => update('unitNumber', e.target.value)} />
                  {errors.unitNumber && <p className="text-red-500 text-xs mt-1">{errors.unitNumber}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Floor *</label>
                  <input className={inputClass('floor')} type="number" placeholder="e.g. 45" value={form.floor} onChange={e => update('floor', e.target.value)} />
                  {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bedrooms *</label>
                  <div className="relative">
                    <select className={selectClass} value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)}>
                      <option value="">Select</option>
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n === 0 ? 'Studio' : n}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bathrooms *</label>
                  <div className="relative">
                    <select className={selectClass} value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)}>
                      <option value="">Select</option>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sq Ft *</label>
                  <input className={inputClass('sqft')} type="number" placeholder="1800" value={form.sqft} onChange={e => update('sqft', e.target.value)} />
                  {errors.sqft && <p className="text-red-500 text-xs mt-1">{errors.sqft}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea
                  className={`${inputClass('description')} h-32 resize-none`}
                  placeholder="Describe your residence — views, finishes, unique features... (min 50 characters)"
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? <p className="text-red-500 text-xs">{errors.description}</p> : <span />}
                  <span className={`text-xs ${form.description.length < 50 ? 'text-gray-400' : 'text-[#C9A84C]'}`}>{form.description.length}/50</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <Upload className="inline w-3.5 h-3.5 mr-1" />
                  Image URLs (one per line)
                </label>
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#0B1628] text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-all h-24 resize-none placeholder-gray-400"
                  placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                  value={form.imageUrls}
                  onChange={e => update('imageUrls', e.target.value)}
                />
                <p className="text-gray-400 text-xs mt-1">Leave blank to use a default image. Unsplash URLs are supported.</p>
              </div>
            </div>
          )}

          {/* Step 1: Owner Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-xl font-bold text-[#0B1628]">Owner Information</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input className={inputClass('ownerName')} placeholder="Jonathan Harrington" value={form.ownerName} onChange={e => update('ownerName', e.target.value)} />
                {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                <input className={inputClass('ownerEmail')} type="email" placeholder="your@email.com" value={form.ownerEmail} onChange={e => update('ownerEmail', e.target.value)} />
                {errors.ownerEmail && <p className="text-red-500 text-xs mt-1">{errors.ownerEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                <input className={inputClass('ownerPhone')} type="tel" placeholder="+1 (305) 555-0000" value={form.ownerPhone} onChange={e => update('ownerPhone', e.target.value)} />
                {errors.ownerPhone && <p className="text-red-500 text-xs mt-1">{errors.ownerPhone}</p>}
              </div>

              <div className="bg-[#F9F7F2] rounded-xl p-4 mt-2">
                <p className="text-gray-500 text-sm leading-relaxed">
                  <strong className="text-[#0B1628]">Your information is secure.</strong> We only share your contact details with approved tenants after your explicit consent.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Availability & Pricing */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-xl font-bold text-[#0B1628]">Availability & Pricing</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Available From *</label>
                  <input className={inputClass('availableFrom')} type="date" value={form.availableFrom} onChange={e => update('availableFrom', e.target.value)} />
                  {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Available To *</label>
                  <input className={inputClass('availableTo')} type="date" value={form.availableTo} onChange={e => update('availableTo', e.target.value)} />
                  {errors.availableTo && <p className="text-red-500 text-xs mt-1">{errors.availableTo}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price / Night (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input className={`${inputClass('pricePerNight')} pl-7`} type="number" placeholder="450" value={form.pricePerNight} onChange={e => update('pricePerNight', e.target.value)} />
                  </div>
                  {errors.pricePerNight && <p className="text-red-500 text-xs mt-1">{errors.pricePerNight}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price / Month (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input className={`${inputClass('pricePerMonth')} pl-7`} type="number" placeholder="9500" value={form.pricePerMonth} onChange={e => update('pricePerMonth', e.target.value)} />
                  </div>
                  {errors.pricePerMonth && <p className="text-red-500 text-xs mt-1">{errors.pricePerMonth}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Minimum Stay (nights)</label>
                <div className="relative">
                  <select className={selectClass} value={form.minimumStay} onChange={e => update('minimumStay', e.target.value)}>
                    {[1, 2, 3, 7, 14, 30, 60, 90].map(n => <option key={n} value={n}>{n} {n === 1 ? 'night' : 'nights'}{n >= 30 ? ` (${n/30} ${n/30 === 1 ? 'month' : 'months'})` : ''}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { key: 'petFriendly', label: 'Pet Friendly' },
                  { key: 'parkingIncluded', label: 'Parking Included' },
                  { key: 'furnished', label: 'Furnished' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => update(key as keyof FormData, !form[key as keyof FormData])}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                      form[key as keyof FormData]
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C] text-[#C9A84C]'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${form[key as keyof FormData] ? 'bg-[#C9A84C] text-white' : 'border border-gray-300'}`}>
                      {form[key as keyof FormData] ? '✓' : ''}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-xl font-bold text-[#0B1628]">Amenities</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6">Select all amenities available in your residence or building.</p>

              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm transition-all text-left ${
                      form.amenities.includes(amenity)
                        ? 'bg-[#0B1628] border-[#0B1628] text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#C9A84C]/40'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      form.amenities.includes(amenity) ? 'bg-[#C9A84C] text-[#0B1628]' : 'border border-gray-300'
                    }`}>
                      {form.amenities.includes(amenity) ? '✓' : ''}
                    </span>
                    {amenity}
                  </button>
                ))}
              </div>

              {form.amenities.length > 0 && (
                <div className="mt-4 p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl">
                  <p className="text-[#C9A84C] text-sm font-medium">{form.amenities.length} amenities selected</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => { if (validateStep(step)) setStep(s => s + 1); }}
                className="px-8 py-2.5 rounded-xl bg-[#0B1628] text-white text-sm font-bold hover:bg-[#152238] transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2.5 rounded-xl bg-[#C9A84C] text-[#0B1628] text-sm font-bold hover:bg-[#E8C97A] transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit Listing'}
                {!loading && <Calendar className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
