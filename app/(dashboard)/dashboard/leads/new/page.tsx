import LeadForm from '@/components/leads/LeadForm';

export default function NewLeadPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
        <p className="mt-2 text-sm text-gray-600">Add a new brand to your outreach list</p>
      </div>
      <LeadForm />
    </div>
  );
}
