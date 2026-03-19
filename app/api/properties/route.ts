import { NextRequest, NextResponse } from 'next/server';
import { getProperties, updatePropertyStatus, incrementViews } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const id = searchParams.get('id');

  let properties = getProperties();

  if (id) {
    const property = properties.find(p => p.id === id);
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(property);
  }

  if (status) {
    properties = properties.filter(p => p.status === status);
  }

  return NextResponse.json(properties);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status, action } = body;

  if (action === 'view' && id) {
    incrementViews(id);
    return NextResponse.json({ success: true });
  }

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const updated = updatePropertyStatus(id, status);
  if (!updated) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  return NextResponse.json(updated);
}
