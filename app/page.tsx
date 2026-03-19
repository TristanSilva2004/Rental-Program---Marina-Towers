import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Star, Shield, Key, Headphones, Building2, Waves, Award } from 'lucide-react';
import { getProperties } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const allProperties = getProperties();
  const featured = allProperties.filter(p => p.status === 'approved').slice(0, 3);

  const stats = [
    { value: '52', label: 'Floors', icon: Building2 },
    { value: '3', label: 'Towers', icon: Award },
    { value: '100+', label: 'Residences', icon: Key },
    { value: '5★', label: 'Rated', icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Private & Exclusive',
      desc: 'All listings are owner-verified and available exclusively through our trusted program.',
    },
    {
      icon: Headphones,
      title: '24/7 Concierge',
      desc: 'World-class concierge services available around the clock for every guest.',
    },
    {
      icon: Waves,
      title: 'Waterfront Living',
      desc: 'Direct marina access, bay views, and resort-style amenities at your doorstep.',
    },
    {
      icon: Key,
      title: 'Flexible Stays',
      desc: 'Short-term, long-term, and monthly arrangements tailored to your needs.',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1600"
            alt="Marina Towers"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1628]/80 via-[#0B1628]/60 to-[#0B1628]/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full px-5 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-medium">
              Now Accepting Applications
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
            Live Above
            <span className="block text-[#C9A84C]">The Marina</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            An exclusive collection of private residences at Miami's most prestigious waterfront address.
            Curated for those who demand the extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rentals"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0B1628] font-bold px-8 py-4 rounded-xl hover:bg-[#E8C97A] transition-all text-sm tracking-wider"
            >
              Browse Residences
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-sm tracking-wider"
            >
              List Your Unit
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <Icon className="w-5 h-5 text-[#C9A84C] mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-[#C9A84C] to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#0B1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">The Marina Advantage</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Uncompromising Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-[#C9A84C]/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:bg-[#C9A84C]/20 transition-all">
                  <Icon className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Curated Selection</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1628]">
                Featured Residences
              </h2>
            </div>
            <Link
              href="/rentals"
              className="inline-flex items-center gap-2 text-[#C9A84C] font-semibold text-sm tracking-wider hover:gap-3 transition-all"
            >
              View All Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">No listings available yet.</div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-[#0B1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C9A84C] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#C9A84C] blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-5">For Owners</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Own a Unit at Marina Towers?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Join our exclusive rental program and let us connect your residence with our curated network of premium tenants.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0B1628] font-bold px-10 py-5 rounded-xl hover:bg-[#E8C97A] transition-all text-sm tracking-wider"
          >
            Submit Your Property
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
