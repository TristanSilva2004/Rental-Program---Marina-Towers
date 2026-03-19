import { getProperties, getInquiries } from '@/lib/data';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const properties = getProperties();
  const inquiries = getInquiries();
  return <AdminClient initialProperties={properties} initialInquiries={inquiries} />;
}
