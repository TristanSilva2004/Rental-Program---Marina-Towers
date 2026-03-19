'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Anchor } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/rentals', label: 'Browse Rentals' },
  { href: '/submit', label: 'List Your Unit' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1628]/95 backdrop-blur-md border-b border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-all">
              <Anchor className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight tracking-wide">Marina Towers</div>
              <div className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase">Private Rentals</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wider transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#C9A84C] font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="ml-2 px-5 py-2.5 rounded border border-[#C9A84C]/40 text-[#C9A84C] text-sm tracking-wider hover:bg-[#C9A84C]/10 transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0B1628] border-t border-[#C9A84C]/20 px-4 py-6 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm tracking-wider ${
                pathname === link.href ? 'text-[#C9A84C] font-semibold' : 'text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm tracking-wider text-[#C9A84C]"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
