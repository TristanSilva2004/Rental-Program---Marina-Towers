import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1628] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-[#C9A84C] text-8xl font-bold mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Residence Not Found</h1>
        <p className="text-white/50 mb-8">This unit may no longer be available or the link may be incorrect.</p>
        <Link
          href="/rentals"
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0B1628] font-bold px-8 py-4 rounded-xl hover:bg-[#E8C97A] transition-all"
        >
          Browse Available Listings
        </Link>
      </div>
    </div>
  );
}
