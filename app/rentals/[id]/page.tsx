import { notFound } from 'next/navigation';
import { getProperties } from '@/lib/data';
import PropertyDetailClient from './PropertyDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default function PropertyDetailPage({ params }: Props) {
  const properties = getProperties();
  const property = properties.find(p => p.id === params.id);

  if (!property) notFound();

  return <PropertyDetailClient property={property} />;
}
