import { NextRequest, NextResponse } from 'next/server';
import { addProperty, addInquiry } from '@/lib/data';
import { Property, ContactInquiry } from '@/lib/types';

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type } = body;

  if (type === 'property') {
    const property: Property = {
      id: generateId('mt'),
      title: body.title,
      unitNumber: body.unitNumber,
      floor: Number(body.floor),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      sqft: Number(body.sqft),
      pricePerNight: Number(body.pricePerNight),
      pricePerMonth: Number(body.pricePerMonth),
      description: body.description,
      amenities: body.amenities || [],
      images: body.images || [],
      ownerName: body.ownerName,
      ownerEmail: body.ownerEmail,
      ownerPhone: body.ownerPhone,
      availableFrom: body.availableFrom,
      availableTo: body.availableTo,
      minimumStay: Number(body.minimumStay) || 1,
      petFriendly: Boolean(body.petFriendly),
      parkingIncluded: Boolean(body.parkingIncluded),
      furnished: Boolean(body.furnished),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      views: 0,
    };

    addProperty(property);
    return NextResponse.json({ success: true, id: property.id });
  }

  if (type === 'inquiry') {
    const inquiry: ContactInquiry = {
      id: generateId('inq'),
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    addInquiry(inquiry);
    return NextResponse.json({ success: true, id: inquiry.id });
  }

  return NextResponse.json({ error: 'Unknown submission type' }, { status: 400 });
}
