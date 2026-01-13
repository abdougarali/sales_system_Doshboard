'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface ToggleProductButtonProps {
  productId: string;
  active: boolean;
}

export default function ToggleProductButton({ productId, active }: ToggleProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}/toggle`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle product status');
      }

      router.refresh();
    } catch (error) {
      console.error('Toggle error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={active ? 'outline' : 'primary'}
      size="xs"
      onClick={handleToggle}
      isLoading={loading}
    >
      {active ? 'Deactivate' : 'Activate'}
    </Button>
  );
}
