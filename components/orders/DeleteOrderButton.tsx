'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteOrderButtonProps {
  orderId: string;
  orderNumber: string;
}

export default function DeleteOrderButton({ orderId, orderNumber }: DeleteOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      router.push('/dashboard/orders');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleDelete}
      isLoading={loading}
      className="w-full"
    >
      <TrashIcon className="w-4 h-4 mr-2" />
      Delete Order
    </Button>
  );
}
