import Link from 'next/link';
import { Anchor, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B1628] border-t border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full border border-[#C9A84C]/40 flex items-center justify-center">
                <Anchor className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">Marina Towers</div>
                <div className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase">Private Rentals</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Miami's most prestigious address. An exclusive collection of private residences available for discerning renters seeking waterfront luxury.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A84C]" />
                <span>1 Marina Towers Drive, Miami, FL 33132</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Phone className="w-4 h-4 text-[#C9A84C]" />
                <span>+1 (305) 800-MARINA</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-[#C9A84C]" />
                <span>rentals@marinatowers.com</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/rentals', label: 'Browse Rentals' },
                { href: '/submit', label: 'List Your Unit' },
                { href: '/admin', label: 'Admin Dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 text-sm hover:text-white/80 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-5">Services</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li>Concierge Services</li>
              <li>Private Events</li>
              <li>Property Management</li>
              <li>Valet Parking</li>
              <li>Housekeeping</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#C9A84C]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Marina Towers Private Rental Program. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-white/30 text-xs cursor-pointer hover:text-white/50 transition-colors">Privacy Policy</span>
            <span className="text-white/30 text-xs cursor-pointer hover:text-white/50 transition-colors">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
