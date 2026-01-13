import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead Not Found</h1>
      <p className="text-gray-600 mb-8">The lead you're looking for doesn't exist.</p>
      <Link href="/dashboard/leads">
        <Button>Back to Leads</Button>
      </Link>
    </div>
  );
}
