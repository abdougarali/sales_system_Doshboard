'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ProductFormProps {
  product?: any;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: product?.name || '',
    nameAr: product?.nameAr || '',
    description: product?.description || '',
    descriptionAr: product?.descriptionAr || '',
    price: product?.price?.toString() || '0',
    stock: product?.stock?.toString() || '0',
    imageUrl: product?.imageUrl || '',
    active: product?.active !== undefined ? product.active : true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = product?._id ? `/api/products/${product._id}` : '/api/products';
      const method = product?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={product?._id ? 'Edit Product' : 'New Product'} subtitle="Fill in the product details">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-fadeIn">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Product Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g., Pro Dashboard"
            />
          </div>

          <div>
            <label htmlFor="nameAr" className="label">
              Product Name (Arabic)
            </label>
            <input
              type="text"
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              className="input"
              dir="rtl"
              placeholder="مثال: لوحة تحكم"
            />
          </div>

          <div>
            <label htmlFor="price" className="label">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="stock" className="label">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="imageUrl" className="label">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="input"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="checkbox"
            />
            <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
              Active (visible in catalog)
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description (English)
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea"
            placeholder="Product description..."
          />
        </div>

        <div>
          <label htmlFor="descriptionAr" className="label">
            Description (Arabic)
          </label>
          <textarea
            id="descriptionAr"
            rows={3}
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
            className="textarea"
            placeholder="وصف المنتج..."
            dir="rtl"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/products')}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {product?._id ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
