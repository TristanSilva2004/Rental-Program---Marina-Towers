'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Building2, MessageSquare, CheckCircle, XCircle, Clock,
  Eye, ChevronRight, Bed, Bath, Maximize2, Phone, Mail, Calendar, TrendingUp, Users
} from 'lucide-react';
import { Property, ContactInquiry } from '@/lib/types';

interface Props {
  initialProperties: Property[];
  initialInquiries: ContactInquiry[];
}

type Tab = 'overview' | 'properties' | 'inquiries';

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending' },
  approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Approved' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Rejected' },
};

const INQUIRY_COLORS = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'New' },
  contacted: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Contacted' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Closed' },
};

export default function AdminClient({ initialProperties, initialInquiries }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [properties, setProperties] = useState(initialProperties);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [loading, setLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterInquiry, setFilterInquiry] = useState<string>('all');

  async function updatePropertyStatus(id: string, status: 'approved' | 'rejected') {
    setLoading(id + status);
    try {
      const res = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProperties(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch {
      alert('Failed to update status');
    } finally {
      setLoading(null);
    }
  }

  async function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(prev => prev.map(i => i.id === id ? updated : i));
      }
    } catch {
      alert('Failed to update status');
    }
  }

  const stats = [
    { label: 'Total Listings', value: properties.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Approved', value: properties.filter(p => p.status === 'approved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Review', value: properties.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Inquiries', value: inquiries.length, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'New Inquiries', value: inquiries.filter(i => i.status === 'new').length, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Views', value: properties.reduce((s, p) => s + (p.views || 0), 0), icon: TrendingUp, color: 'text-[#C9A84C]', bg: 'bg-[#C9A84C]/10' },
  ];

  const filteredProperties = filterStatus === 'all' ? properties : properties.filter(p => p.status === filterStatus);
  const filteredInquiries = filterInquiry === 'all' ? inquiries : inquiries.filter(i => i.status === filterInquiry);

  const tabs: { id: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: `Listings (${properties.length})`, icon: Building2 },
    { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-20">
      {/* Header */}
      <div className="bg-[#0B1628] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">Admin Portal</div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-sm">Live</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-medium transition-all ${
                  tab === id
                    ? 'bg-[#F9F7F2] text-[#0B1628]'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {tab === 'overview' && (
          <div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="text-2xl font-bold text-[#0B1628]">{value.toLocaleString()}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Recent submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-[#0B1628]">Recent Listings</h2>
                  <button onClick={() => setTab('properties')} className="text-[#C9A84C] text-xs font-semibold hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {properties.slice(0, 5).map(p => {
                    const sc = STATUS_COLORS[p.status];
                    return (
                      <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200'} alt={p.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#0B1628] text-sm truncate">{p.title}</div>
                          <div className="text-gray-400 text-xs">{p.unitNumber} · {p.bedrooms}bd · ${p.pricePerNight}/night</div>
                        </div>
                        <span className={`${sc.bg} ${sc.text} text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0`}>
                          {sc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-[#0B1628]">Recent Inquiries</h2>
                  <button onClick={() => setTab('inquiries')} className="text-[#C9A84C] text-xs font-semibold hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {inquiries.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">No inquiries yet</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {inquiries.slice(0, 5).map(inq => {
                      const ic = INQUIRY_COLORS[inq.status];
                      return (
                        <div key={inq.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-[#0B1628] text-sm">{inq.name}</div>
                              <div className="text-gray-400 text-xs truncate">{inq.propertyTitle}</div>
                            </div>
                            <span className={`${ic.bg} ${ic.text} text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0`}>
                              {ic.label}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs mt-1">{new Date(inq.submittedAt).toLocaleDateString()}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {tab === 'properties' && (
          <div>
            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    filterStatus === s
                      ? 'bg-[#0B1628] text-white'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {s === 'all' ? `All (${properties.length})` :
                    s === 'pending' ? `Pending (${properties.filter(p => p.status === 'pending').length})` :
                    s === 'approved' ? `Approved (${properties.filter(p => p.status === 'approved').length})` :
                    `Rejected (${properties.filter(p => p.status === 'rejected').length})`}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredProperties.map(p => {
                const sc = STATUS_COLORS[p.status];
                return (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                        <Image
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-[#0B1628] text-lg">{p.title}</h3>
                              <span className={`${sc.bg} ${sc.text} border ${sc.border} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                                {sc.label}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">{p.unitNumber} · Floor {p.floor}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#0B1628]">${p.pricePerNight.toLocaleString()}<span className="text-sm font-normal text-gray-400">/night</span></div>
                            <div className="text-sm text-gray-400">${p.pricePerMonth.toLocaleString()}/month</div>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[#C9A84C]" /> {p.bedrooms} bed</span>
                          <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#C9A84C]" /> {p.bathrooms} bath</span>
                          <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-[#C9A84C]" /> {p.sqft.toLocaleString()} sqft</span>
                          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-[#C9A84C]" /> {p.views} views</span>
                        </div>

                        {/* Owner */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-5">
                          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {p.ownerEmail}</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {p.ownerPhone}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Submitted {new Date(p.submittedAt).toLocaleDateString()}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                          <Link href={`/rentals/${p.id}`} className="flex items-center gap-1.5 px-4 py-2 bg-[#F9F7F2] border border-gray-200 text-gray-600 text-sm rounded-xl hover:border-gray-300 transition-all">
                            <Eye className="w-4 h-4" /> View Listing
                          </Link>

                          {p.status !== 'approved' && (
                            <button
                              onClick={() => updatePropertyStatus(p.id, 'approved')}
                              disabled={loading === p.id + 'approved'}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl hover:bg-green-100 transition-all disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {loading === p.id + 'approved' ? 'Approving...' : 'Approve'}
                            </button>
                          )}

                          {p.status !== 'rejected' && (
                            <button
                              onClick={() => updatePropertyStatus(p.id, 'rejected')}
                              disabled={loading === p.id + 'rejected'}
                              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              {loading === p.id + 'rejected' ? 'Rejecting...' : 'Reject'}
                            </button>
                          )}

                          {p.status !== 'pending' && (
                            <button
                              onClick={() => updatePropertyStatus(p.id, 'pending' as 'approved' | 'rejected')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl hover:bg-amber-100 transition-all"
                            >
                              <Clock className="w-4 h-4" /> Set Pending
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredProperties.length === 0 && (
                <div className="text-center py-20 text-gray-400">No listings in this category</div>
              )}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {tab === 'inquiries' && (
          <div>
            {/* Filter */}
            <div className="flex items-center gap-2 mb-6">
              {['all', 'new', 'contacted', 'closed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterInquiry(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    filterInquiry === s
                      ? 'bg-[#0B1628] text-white'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {s === 'all' ? `All (${inquiries.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${inquiries.filter(i => i.status === s).length})`}
                </button>
              ))}
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">No inquiries yet</p>
                <p className="text-gray-300 text-sm mt-1">Inquiries from rental listings will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map(inq => {
                  const ic = INQUIRY_COLORS[inq.status];
                  return (
                    <div key={inq.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-[#0B1628]">{inq.name}</h3>
                            <span className={`${ic.bg} ${ic.text} text-xs font-medium px-2.5 py-1 rounded-full`}>
                              {ic.label}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">Inquiry for: <span className="font-medium text-[#0B1628]">{inq.propertyTitle}</span></p>
                        </div>
                        <div className="text-gray-400 text-sm">{new Date(inq.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#C9A84C]" /> <a href={`mailto:${inq.email}`} className="hover:text-[#0B1628]">{inq.email}</a></div>
                          {inq.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#C9A84C]" /> <a href={`tel:${inq.phone}`} className="hover:text-[#0B1628]">{inq.phone}</a></div>}
                          {inq.checkIn && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#C9A84C]" /> {inq.checkIn} → {inq.checkOut}</div>}
                        </div>
                        {inq.message && (
                          <div className="bg-[#F9F7F2] rounded-xl p-4 text-sm text-gray-600 italic">
                            "{inq.message}"
                          </div>
                        )}
                      </div>

                      {/* Status actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        <span className="text-gray-400 text-xs self-center mr-1">Update status:</span>
                        {(['new', 'contacted', 'closed'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => updateInquiryStatus(inq.id, s)}
                            disabled={inq.status === s}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                              inq.status === s
                                ? `${INQUIRY_COLORS[s].bg} ${INQUIRY_COLORS[s].text} opacity-100 font-bold`
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                        <a
                          href={`mailto:${inq.email}?subject=Re: Marina Towers - ${inq.propertyTitle}`}
                          className="ml-auto px-4 py-1.5 bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold rounded-lg hover:bg-[#C9A84C]/20 transition-all flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" /> Reply via Email
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
