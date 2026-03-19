export interface Property {
  id: string;
  title: string;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  pricePerNight: number;
  pricePerMonth: number;
  description: string;
  amenities: string[];
  images: string[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  availableFrom: string;
  availableTo: string;
  minimumStay: number;
  petFriendly: boolean;
  parkingIncluded: boolean;
  furnished: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  views: number;
}

export interface ContactInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  checkIn: string;
  checkOut: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'closed';
}
