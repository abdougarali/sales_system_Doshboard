'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ILead, Platform, ReplyStatus, InterestLevel, LeadStatus } from '@/types';

interface LeadFormProps {
  lead?: any;
}

export default function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brandName: lead?.brandName || '',
    instagramHandle: lead?.instagramHandle || '',
    platform: (lead?.platform || 'instagram') as Platform,
    dateContacted: lead?.dateContacted
      ? new Date(lead.dateContacted).toISOString().split('T')[0]
      : '',
    replyStatus: (lead?.replyStatus || '') as ReplyStatus | '',
    interestLevel: (lead?.interestLevel || '') as InterestLevel | '',
    demoSent: lead?.demoSent || false,
    status: (lead?.status || 'new') as LeadStatus,
    notes: lead?.notes || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = lead?._id ? `/api/leads/${lead._id}` : '/api/leads';
      const method = lead?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save lead');
      }

      router.push('/dashboard/leads');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={lead?._id ? 'Edit Lead' : 'New Lead'} subtitle="Fill in the lead details">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-fadeIn">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="brandName" className="label">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="brandName"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="input"
              placeholder="e.g., Perfume House"
            />
          </div>

          <div>
            <label htmlFor="platform" className="label">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              id="platform"
              required
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value as Platform })}
              className="select"
            >
              <option value="instagram">Instagram</option>
              <option value="messenger">Messenger</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <div>
            <label htmlFor="instagramHandle" className="label">
              Instagram Handle
            </label>
            <input
              type="text"
              id="instagramHandle"
              value={formData.instagramHandle}
              onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
              placeholder="@username"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="dateContacted" className="label">
              Date Contacted
            </label>
            <input
              type="date"
              id="dateContacted"
              value={formData.dateContacted}
              onChange={(e) => setFormData({ ...formData, dateContacted: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
              className="select"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="replied">Replied</option>
              <option value="demo_sent">Demo Sent</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label htmlFor="replyStatus" className="label">
              Reply Status
            </label>
            <select
              id="replyStatus"
              value={formData.replyStatus}
              onChange={(e) => setFormData({ ...formData, replyStatus: e.target.value as ReplyStatus | '' })}
              className="select"
            >
              <option value="">Not Set</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="seen">Seen</option>
              <option value="no_reply">No Reply</option>
            </select>
          </div>

          <div>
            <label htmlFor="interestLevel" className="label">
              Interest Level
            </label>
            <select
              id="interestLevel"
              value={formData.interestLevel}
              onChange={(e) => setFormData({ ...formData, interestLevel: e.target.value as InterestLevel | '' })}
              className="select"
            >
              <option value="">Not Set</option>
              <option value="interested">Interested</option>
              <option value="not_interested">Not Interested</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center h-full pt-6">
            <input
              type="checkbox"
              id="demoSent"
              checked={formData.demoSent}
              onChange={(e) => setFormData({ ...formData, demoSent: e.target.checked })}
              className="checkbox"
            />
            <label htmlFor="demoSent" className="ml-2 text-sm font-medium text-gray-700">
              Demo Sent
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="label">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="textarea"
            placeholder="Add any notes about this lead..."
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/leads')}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {lead?._id ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
