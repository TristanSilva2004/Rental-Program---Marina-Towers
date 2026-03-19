import { getProperties } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import RentalsClient from './RentalsClient';

export const dynamic = 'force-dynamic';

export default function RentalsPage() {
  const properties = getProperties().filter(p => p.status === 'approved');
  return <RentalsClient properties={properties} />;
}
