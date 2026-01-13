import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/mongodb';
import Lead from '@/lib/models/Lead';
import LeadForm from '@/components/leads/LeadForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { LeadStatus } from '@/types';
import { serializeDocument } from '@/lib/utils/serialize';

const statusColors: Record<LeadStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  new: 'info',
  contacted: 'default',
  replied: 'warning',
  demo_sent: 'info',
  converted: 'success',
  lost: 'danger',
};

async function getLead(id: string) {
  await connectDB();
  const lead = await Lead.findById(id).lean();
  return lead ? serializeDocument(lead) : null;
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id);

  if (!lead) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{lead.brandName}</h1>
          <p className="mt-2 text-sm text-gray-600">Lead details and management</p>
        </div>
        <Link href="/dashboard/leads">
          <Button variant="outline">Back to Leads</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadForm lead={lead} />
        </div>
        <div>
          <Card title="Quick Info">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge variant={statusColors[lead.status as LeadStatus] || 'default'}>
                    {lead.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Platform</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{lead.platform}</p>
              </div>
              {lead.instagramHandle && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Instagram Handle</label>
                  <p className="mt-1 text-sm text-gray-900">@{lead.instagramHandle}</p>
                </div>
              )}
              {lead.dateContacted && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Contacted</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(lead.dateContacted).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
