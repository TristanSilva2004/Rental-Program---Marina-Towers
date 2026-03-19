import { NextRequest, NextResponse } from 'next/server';
import { getInquiries, updateInquiryStatus } from '@/lib/data';

export async function GET() {
  const inquiries = getInquiries();
  return NextResponse.json(inquiries);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const updated = updateInquiryStatus(id, status);
  if (!updated) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });

  return NextResponse.json(updated);
}
