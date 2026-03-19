import fs from 'fs';
import path from 'path';
import { Property, ContactInquiry } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getProperties(): Property[] {
  ensureDataDir();
  if (!fs.existsSync(PROPERTIES_FILE)) {
    const seed = getSeedProperties();
    fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  const raw = fs.readFileSync(PROPERTIES_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function saveProperties(properties: Property[]) {
  ensureDataDir();
  fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
}

export function addProperty(property: Property) {
  const properties = getProperties();
  properties.push(property);
  saveProperties(properties);
}

export function updatePropertyStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  const properties = getProperties();
  const idx = properties.findIndex(p => p.id === id);
  if (idx !== -1) {
    properties[idx].status = status;
    saveProperties(properties);
    return properties[idx];
  }
  return null;
}

export function incrementViews(id: string) {
  const properties = getProperties();
  const idx = properties.findIndex(p => p.id === id);
  if (idx !== -1) {
    properties[idx].views = (properties[idx].views || 0) + 1;
    saveProperties(properties);
  }
}

export function getInquiries(): ContactInquiry[] {
  ensureDataDir();
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
    return [];
  }
  const raw = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function addInquiry(inquiry: ContactInquiry) {
  const inquiries = getInquiries();
  inquiries.push(inquiry);
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
}

export function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') {
  const inquiries = getInquiries();
  const idx = inquiries.findIndex(i => i.id === id);
  if (idx !== -1) {
    inquiries[idx].status = status;
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
    return inquiries[idx];
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
      description: 'A breathtaking sky suite on the 45th floor of Tower A offering 270-degree panoramic views of the marina, bay, and city skyline. This meticulously furnished residence features floor-to-ceiling windows, Italian marble finishes, and a chef\'s kitchen with premium appliances. The master suite includes a spa-inspired bathroom with a soaking tub overlooking the water.',
      amenities: ['Concierge', 'Valet Parking', 'Pool & Spa', 'Fitness Center', 'Private Terrace', 'Smart Home System', 'Wine Cellar', 'Panoramic Views'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      ownerName: 'Jonathan Harrington',
      ownerEmail: 'j.harrington@email.com',
      ownerPhone: '+1 (305) 555-0101',
      availableFrom: '2024-02-01',
      availableTo: '2024-12-31',
      minimumStay: 7,
      petFriendly: false,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2024-01-10T10:00:00Z',
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
      availableFrom: '2024-03-01',
      availableTo: '2025-03-01',
      minimumStay: 30,
      petFriendly: false,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2024-01-15T09:30:00Z',
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
      availableFrom: '2024-02-15',
      availableTo: '2024-11-30',
      minimumStay: 7,
      petFriendly: true,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2024-01-20T14:00:00Z',
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
      availableFrom: '2024-02-01',
      availableTo: '2024-08-31',
      minimumStay: 3,
      petFriendly: false,
      parkingIncluded: true,
      furnished: true,
      status: 'approved',
      submittedAt: '2024-01-22T11:00:00Z',
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
      availableFrom: '2024-04-01',
      availableTo: '2025-04-01',
      minimumStay: 14,
      petFriendly: true,
      parkingIncluded: true,
      furnished: true,
      status: 'pending',
      submittedAt: '2024-01-28T16:30:00Z',
      views: 89,
    },
  ];
}
