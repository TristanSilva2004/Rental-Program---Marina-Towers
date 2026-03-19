/* ============================================
   MARINA TOWERS — Data Layer
   localStorage-based data management
   ============================================ */

const DB = {
  LISTINGS_KEY:  'mt_listings',
  BOOKINGS_KEY:  'mt_bookings',

  // ── Listings ──────────────────────────────
  getListings() {
    try { return JSON.parse(localStorage.getItem(this.LISTINGS_KEY)) || []; }
    catch { return []; }
  },
  saveListings(listings) {
    localStorage.setItem(this.LISTINGS_KEY, JSON.stringify(listings));
  },
  addListing(data) {
    const listings = this.getListings();
    const listing = {
      id: 'lst_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...data
    };
    listings.unshift(listing);
    this.saveListings(listings);
    return listing;
  },
  updateListing(id, updates) {
    const listings = this.getListings();
    const idx = listings.findIndex(l => l.id === id);
    if (idx === -1) return null;
    listings[idx] = { ...listings[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveListings(listings);
    return listings[idx];
  },
  deleteListing(id) {
    const listings = this.getListings().filter(l => l.id !== id);
    this.saveListings(listings);
  },
  getListing(id) {
    return this.getListings().find(l => l.id === id) || null;
  },
  getApprovedListings() {
    return this.getListings().filter(l => l.status === 'approved');
  },

  // ── Bookings ──────────────────────────────
  getBookings() {
    try { return JSON.parse(localStorage.getItem(this.BOOKINGS_KEY)) || []; }
    catch { return []; }
  },
  saveBookings(bookings) {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
  },
  addBooking(data) {
    const bookings = this.getBookings();
    const booking = {
      id: 'bkg_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...data
    };
    bookings.unshift(booking);
    this.saveBookings(bookings);
    return booking;
  },
  updateBooking(id, updates) {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    bookings[idx] = { ...bookings[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveBookings(bookings);
    return bookings[idx];
  },
  deleteBooking(id) {
    const bookings = this.getBookings().filter(b => b.id !== id);
    this.saveBookings(bookings);
  },
  getBookingsByListing(listingId) {
    return this.getBookings().filter(b => b.listingId === listingId);
  },

  // ── Stats ─────────────────────────────────
  getStats() {
    const listings = this.getListings();
    const bookings = this.getBookings();
    return {
      totalListings:     listings.length,
      approvedListings:  listings.filter(l => l.status === 'approved').length,
      pendingListings:   listings.filter(l => l.status === 'pending').length,
      rejectedListings:  listings.filter(l => l.status === 'rejected').length,
      totalBookings:     bookings.length,
      pendingBookings:   bookings.filter(b => b.status === 'pending').length,
      approvedBookings:  bookings.filter(b => b.status === 'approved').length,
    };
  },

  // ── Seed sample data ──────────────────────
  seed() {
    if (localStorage.getItem('mt_seeded')) return;

    const sampleListings = [
      {
        id: 'lst_sample_001',
        status: 'approved',
        submittedAt: new Date(Date.now() - 7*24*3600*1000).toISOString(),
        ownerName: 'Alexandra Reeves',
        ownerEmail: 'a.reeves@email.com',
        ownerPhone: '+971 50 123 4567',
        unitNumber: 'TA-4201',
        apartmentType: 'Penthouse',
        bedrooms: 3,
        maxGuests: 6,
        availableFrom: '2024-01-15',
        availableTo: '2024-06-30',
        minimumStay: 3,
        price: 950,
        optimizePricing: false,
        serviceType: 'full',
        notes: 'No smoking. Pets considered upon request.',
        photos: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
        ],
        title: 'Oceanfront Penthouse Residence',
        tower: 'Tower A',
        description: 'A breathtaking full-floor penthouse offering panoramic ocean views from every room. Featuring soaring 4-meter ceilings, bespoke Italian furnishings, and a wraparound terrace perfect for sunset gatherings. The ultimate expression of Marina Towers living.',
        amenities: ['Private Terrace', 'Ocean View', 'Floor-to-Ceiling Windows', 'Gourmet Kitchen', 'Marble Bathrooms', 'Smart Home', 'Gym Access', 'Concierge', 'Valet Parking', 'Private Pool Access'],
      },
      {
        id: 'lst_sample_002',
        status: 'approved',
        submittedAt: new Date(Date.now() - 5*24*3600*1000).toISOString(),
        ownerName: 'Jonathan Mercer',
        ownerEmail: 'j.mercer@email.com',
        ownerPhone: '+971 55 987 6543',
        unitNumber: 'TB-1807',
        apartmentType: 'Residence',
        bedrooms: 2,
        maxGuests: 4,
        availableFrom: '2024-02-01',
        availableTo: '2024-08-31',
        minimumStay: 2,
        price: 480,
        optimizePricing: true,
        serviceType: 'basic',
        notes: 'Recently renovated. No events or parties.',
        photos: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        ],
        title: 'Garden Terrace Suite',
        tower: 'Tower B',
        description: 'An elegant two-bedroom residence with a private landscaped terrace overlooking the marina. Thoughtfully designed interiors blend contemporary luxury with warm, residential comfort. Ideal for couples or small families seeking a refined retreat.',
        amenities: ['Private Terrace', 'Marina View', 'Designer Kitchen', 'Ensuite Bathrooms', 'Smart TV', 'High-Speed WiFi', 'Pool Access', 'Gym Access', 'Dedicated Parking'],
      },
      {
        id: 'lst_sample_003',
        status: 'approved',
        submittedAt: new Date(Date.now() - 3*24*3600*1000).toISOString(),
        ownerName: 'Sofia Andersen',
        ownerEmail: 's.andersen@email.com',
        ownerPhone: '+971 52 456 7890',
        unitNumber: 'TC-2903',
        apartmentType: 'Studio',
        bedrooms: 1,
        maxGuests: 2,
        availableFrom: '2024-01-20',
        availableTo: '2024-12-31',
        minimumStay: 1,
        price: 260,
        optimizePricing: false,
        serviceType: 'full',
        notes: 'Perfect for business travelers. Express check-in available.',
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
        ],
        title: 'Executive City View Studio',
        tower: 'Tower C',
        description: 'A sleek, sophisticated studio residence with floor-to-ceiling city views. Perfectly appointed for the discerning business traveler or couple seeking an immersive Marina Towers experience. Minimalist design meets maximum luxury.',
        amenities: ['City View', 'Floor-to-Ceiling Windows', 'Murphy Bed', 'Kitchenette', 'Rain Shower', 'High-Speed WiFi', 'Smart Home', 'Pool Access', 'Business Lounge'],
      },
      {
        id: 'lst_sample_004',
        status: 'approved',
        submittedAt: new Date(Date.now() - 2*24*3600*1000).toISOString(),
        ownerName: 'Marcus Holloway',
        ownerEmail: 'm.holloway@email.com',
        ownerPhone: '+971 54 321 0987',
        unitNumber: 'TA-3504',
        apartmentType: 'Residence',
        bedrooms: 4,
        maxGuests: 8,
        availableFrom: '2024-03-01',
        availableTo: '2024-09-30',
        minimumStay: 5,
        price: 1400,
        optimizePricing: false,
        serviceType: 'full',
        notes: 'Private chef available on request. Minimum stay 5 nights.',
        photos: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
          'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        ],
        title: 'Grand Four-Bedroom Sky Residence',
        tower: 'Tower A',
        description: 'An exceptional four-bedroom sky residence spanning an entire floor of Tower A. Offering uninterrupted 270-degree views of the ocean, marina, and city skyline. The pinnacle of Marina Towers luxury — with a private dining room, staff quarters, and bespoke finishes throughout.',
        amenities: ['270° Views', 'Private Dining Room', 'Staff Quarters', 'Chef\'s Kitchen', 'Home Theater', 'Jacuzzi', 'Smart Home', 'Private Pool Access', 'Dedicated Concierge', 'Valet Parking', 'Gym Access'],
      },
      {
        id: 'lst_sample_005',
        status: 'pending',
        submittedAt: new Date(Date.now() - 1*24*3600*1000).toISOString(),
        ownerName: 'Elena Vasquez',
        ownerEmail: 'e.vasquez@email.com',
        ownerPhone: '+971 56 654 3210',
        unitNumber: 'TB-1204',
        apartmentType: 'Residence',
        bedrooms: 2,
        maxGuests: 4,
        availableFrom: '2024-04-01',
        availableTo: '2024-07-31',
        minimumStay: 3,
        price: 520,
        optimizePricing: true,
        serviceType: 'full',
        notes: 'Newly furnished. Art collection displayed throughout.',
        photos: [],
        title: 'Marina View Art Residence',
        tower: 'Tower B',
        description: 'A curated two-bedroom residence showcasing a private art collection alongside stunning marina views.',
        amenities: ['Marina View', 'Art Collection', 'Designer Furnishings', 'Pool Access'],
      },
    ];

    localStorage.setItem(this.LISTINGS_KEY, JSON.stringify(sampleListings));
    localStorage.setItem('mt_seeded', '1');
  }
};

// Seed on first load
DB.seed();
