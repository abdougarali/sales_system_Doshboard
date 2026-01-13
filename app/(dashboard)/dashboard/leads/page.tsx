import Link from 'next/link';
import Card from '@/components/ui/Card';
import Table, { TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import connectDB from '@/lib/db/mongodb';
import Lead from '@/lib/models/Lead';
import { LeadStatus } from '@/types';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const statusColors: Record<LeadStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
  new: 'info',
  contacted: 'default',
  replied: 'warning',
  demo_sent: 'purple',
  converted: 'success',
  lost: 'danger',
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  replied: 'Replied',
  demo_sent: 'Demo Sent',
  converted: 'Converted',
  lost: 'Lost',
};

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  messenger: 'Messenger',
  whatsapp: 'WhatsApp',
};

async function getLeads() {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).limit(50).lean();
  return leads;
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Manage your brand outreach and leads</p>
        </div>
        <Link href="/dashboard/leads/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </Link>
      </div>

      {/* Content */}
      <Card noPadding>
        {leads.length === 0 ? (
          <div className="empty-state">
            <UserGroupIcon className="empty-state-icon" />
            <h3 className="empty-state-title">No leads yet</h3>
            <p className="empty-state-text">Get started by adding your first lead.</p>
            <div className="mt-6">
              <Link href="/dashboard/leads/new">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add First Lead
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHead>
                  <TableRow hover={false}>
                    <TableHeader>Brand Name</TableHeader>
                    <TableHeader>Platform</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Date Contacted</TableHeader>
                    <TableHeader>Reply</TableHeader>
                    <TableHeader>Demo</TableHeader>
                    <TableHeader></TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.map((lead: any) => (
                    <TableRow key={lead._id.toString()}>
                      <TableCell className="font-medium text-gray-900">
                        <div>
                          <div>{lead.brandName}</div>
                          {lead.instagramHandle && (
                            <div className="text-xs text-gray-500">@{lead.instagramHandle}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{platformLabels[lead.platform] || lead.platform}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[lead.status as LeadStatus] || 'default'}>
                          {statusLabels[lead.status as LeadStatus] || lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.dateContacted
                          ? new Date(lead.dateContacted).toLocaleDateString()
                          : <span className="text-gray-400">—</span>}
                      </TableCell>
                      <TableCell>
                        {lead.replyStatus ? (
                          <Badge variant={lead.replyStatus === 'yes' ? 'success' : 'default'} size="sm">
                            {lead.replyStatus}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.demoSent ? (
                          <Badge variant="success" size="sm">Sent</Badge>
                        ) : (
                          <Badge variant="default" size="sm">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/leads/${lead._id}`}>
                          <Button variant="ghost" size="xs">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {leads.map((lead: any) => (
                <Link 
                  key={lead._id.toString()} 
                  href={`/dashboard/leads/${lead._id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {lead.brandName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {platformLabels[lead.platform]} 
                        {lead.instagramHandle && ` • @${lead.instagramHandle}`}
                      </p>
                    </div>
                    <Badge variant={statusColors[lead.status as LeadStatus] || 'default'} size="sm">
                      {statusLabels[lead.status as LeadStatus] || lead.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    {lead.dateContacted && (
                      <span>Contacted: {new Date(lead.dateContacted).toLocaleDateString()}</span>
                    )}
                    {lead.demoSent && <Badge variant="success" size="sm">Demo Sent</Badge>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
