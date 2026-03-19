import { Property, ContactInquiry } from './types';

// In-memory store using globalThis so state persists across
// hot-module reloads in dev and within a warm serverless container.
declare global {
  // eslint-disable-next-line no-var
  var __marina_properties: Property[] | undefined;
  // eslint-disable-next-line no-var
  var __marina_inquiries: ContactInquiry[] | undefined;
}

function getStore() {
  if (!globalThis.__marina_properties) {
    globalThis.__marina_properties = getSeedProperties();
  }
  if (!globalThis.__marina_inquiries) {
    globalThis.__marina_inquiries = [];
  }
  return {
    properties: globalThis.__marina_properties,
    inquiries: globalThis.__marina_inquiries,
  };
}

export function getProperties(): Property[] {
  return getStore().properties;
}

export function addProperty(property: Property) {
  getStore().properties.push(property);
}

export function updatePropertyStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  const properties = getStore().properties;
  const item = properties.find(p => p.id === id);
  if (item) {
    item.status = status;
    return item;
  }
  return null;
}

export function incrementViews(id: string) {
  const item = getStore().properties.find(p => p.id === id);
  if (item) item.views = (item.views || 0) + 1;
}

export function getInquiries(): ContactInquiry[] {
  return getStore().inquiries;
}

export function addInquiry(inquiry: ContactInquiry) {
  getStore().inquiries.push(inquiry);
}

export function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') {
  const item = getStore().inquiries.find(i => i.id === id);
  if (item) {
    item.status = status;
    return item;
  }
  return null;
}

function getSeedProperties(): Property[] {
  return [
    {
      id: 'mt-001',
      title: 'Sky Suite — Tower A',
      unitNumber: 'A-4501',
      floor: 45,
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2400,
      pricePerNight: 850,
      pricePerMonth: 18000,
      description: "A breathtaking sky suite on the 45th floor of Tower A offering 270-degree panoramic views of the marina, bay, and city skyline. This meticulously furnished residence features floor-to-ceiling windows, Italian marble finishes, and a chef's kitchen with premium appliances. The master suite includes a spa-inspired bathroom with a soaking tub overlooking the water.",
      amenities: ['Concierge', 'Valet Parking', 'Pool & Spa', 'Fitness Center', 'Private Terrace', 'Smart Home System', 'Wine Cellar', 'Panoramic Views'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      ownerName: 'Jonathan Harrington',
      ownerEmail: 'j.harrington@email.com',
      ownerPhone: '+1 (305) 555-0101',
      availableFrom: '2026-02-01',
      availableTo: '2026-12-31',
      minimumStay: 7,
      petFriendly: false,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2026-01-10T10:00:00Z',
      views: 234,
    },
    {
      id: 'mt-002',
      title: 'Marina Penthouse — Tower B',
      unitNumber: 'B-PH01',
      floor: 52,
      bedrooms: 4,
      bathrooms: 4.5,
      sqft: 4200,
      pricePerNight: 1800,
      pricePerMonth: 32000,
      description: 'The crown jewel of Marina Towers — a full-floor penthouse with a private rooftop terrace featuring a plunge pool and outdoor kitchen. Four en-suite bedrooms, a grand living room with 14-foot ceilings, and a formal dining room for 12. The private elevator opens directly into a marble foyer. Unmatched luxury at every turn.',
      amenities: ['Private Rooftop Terrace', 'Plunge Pool', 'Private Elevator', 'Outdoor Kitchen', 'Butler Service', 'Home Theater', 'Concierge', '4-Car Garage'],
      images: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      ownerName: 'Victoria Sinclair',
      ownerEmail: 'vsinclair@privatemail.com',
      ownerPhone: '+1 (305) 555-0202',
      availableFrom: '2026-03-01',
      availableTo: '2027-03-01',
      minimumStay: 30,
      petFriendly: false,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2026-01-15T09:30:00Z',
      views: 412,
    },
    {
      id: 'mt-003',
      title: 'Waterfront Residence — Tower C',
      unitNumber: 'C-2203',
      floor: 22,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1650,
      pricePerNight: 450,
      pricePerMonth: 9500,
      description: 'An elegant two-bedroom waterfront residence with direct marina views from every room. The open-plan living and dining area flows seamlessly to a private balcony perfect for sunset cocktails. Featuring premium hardwood floors, custom cabinetry, and fully equipped with top-of-the-line appliances.',
      amenities: ['Private Balcony', 'Marina Views', 'Concierge', 'Pool', 'Gym', 'Covered Parking', 'In-Unit Laundry', 'Smart Home'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
      ],
      ownerName: 'Michael Chen',
      ownerEmail: 'm.chen@invest.com',
      ownerPhone: '+1 (305) 555-0303',
      availableFrom: '2026-02-15',
      availableTo: '2026-11-30',
      minimumStay: 7,
      petFriendly: true,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2026-01-20T14:00:00Z',
      views: 187,
    },
    {
      id: 'mt-004',
      title: 'Executive Studio — Tower A',
      unitNumber: 'A-1812',
      floor: 18,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 780,
      pricePerNight: 280,
      pricePerMonth: 5500,
      description: 'A sophisticated executive studio designed for the discerning traveler. Every detail has been considered — from the custom built-in storage to the high-end finishes throughout. The king bed faces floor-to-ceiling windows with city views, and the marble bathroom features a rainfall shower.',
      amenities: ['City Views', 'Concierge', 'Gym', 'Rooftop Pool', 'Business Center', 'Covered Parking', 'Room Service'],
      images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      ],
      ownerName: 'Sarah Westbrook',
      ownerEmail: 's.westbrook@email.com',
      ownerPhone: '+1 (305) 555-0404',
      availableFrom: '2026-02-01',
      availableTo: '2026-08-31',
      minimumStay: 3,
      petFriendly: false,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2026-01-22T11:00:00Z',
      views: 156,
    },
    {
      id: 'mt-005',
      title: 'Corner Residence — Tower B',
      unitNumber: 'B-3301',
      floor: 33,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2100,
      pricePerNight: 620,
      pricePerMonth: 13500,
      description: 'A stunning corner unit with wraparound balcony and views spanning the marina to the north and the bay to the east. Three spacious bedrooms, a gourmet kitchen, and a large living area make this perfect for families or those who love to entertain. Premium furnishings by a local interior designer.',
      amenities: ['Wraparound Balcony', 'Dual Exposure Views', 'Concierge', 'Pool', 'Spa', 'Tennis Court', 'Parking', 'Storage Unit'],
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=800',
      ],
      ownerName: 'Robert & Diana Ashford',
      ownerEmail: 'ashford.rentals@email.com',
      ownerPhone: '+1 (305) 555-0505',
      availableFrom: '2026-04-01',
      availableTo: '2027-04-01',
      minimumStay: 14,
      petFriendly: true,
      parkingIncluded: true,
      furnished: true,
      status: 'pending',
      submittedAt: '2026-01-28T16:30:00Z',
      views: 89,
    },
  ];
}
