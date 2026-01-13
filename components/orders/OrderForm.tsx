'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
}

interface OrderFormProps {
  order?: any;
}

export default function OrderForm({ order }: OrderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    customerName: order?.customerName || '',
    customerPhone: order?.customerPhone || '',
    customerAddress: order?.customerAddress || '',
    notes: order?.notes || '',
  });
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{ productId: string; quantity: number; price: number }>
  >(
    order?.products?.map((p: any) => ({
      productId: typeof p.productId === 'object' ? p.productId._id?.toString() : p.productId?.toString(),
      quantity: p.quantity,
      price: p.price,
    })) || []
  );

  useEffect(() => {
    fetch('/api/products?active=true')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const handleAddProduct = () => {
    const availableProducts = products.filter(p => p.active && p.stock > 0);
    if (availableProducts.length > 0) {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: availableProducts[0]._id,
          quantity: 1,
          price: availableProducts[0].price,
        },
      ]);
    }
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...selectedProducts];
    if (field === 'productId') {
      const product = products.find((p) => p._id === value);
      updated[index] = {
        ...updated[index],
        productId: value,
        price: product?.price || 0,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setSelectedProducts(updated);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedProducts.length === 0) {
      setError('Please add at least one product');
      return;
    }

    setLoading(true);

    try {
      const url = order?._id ? `/api/orders/${order._id}` : '/api/orders';
      const method = order?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          products: selectedProducts,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save order');
      }

      router.push('/dashboard/orders');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const availableProducts = products.filter(p => p.active && p.stock > 0);

  return (
    <Card title={order?._id ? 'Edit Order' : 'New Order'} subtitle="Fill in the order details">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-fadeIn">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Customer Info */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="customerName" className="label">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="input"
              placeholder="e.g., Ahmed Mohamed"
            />
          </div>

          <div>
            <label htmlFor="customerPhone" className="label">
              Customer Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="customerPhone"
              required
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="input"
              placeholder="+216 XX XXX XXX"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="customerAddress" className="label">
              Customer Address
            </label>
            <input
              type="text"
              id="customerAddress"
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              className="input"
              placeholder="Full delivery address"
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Products</h3>
              <p className="text-xs text-gray-500">Add products to this order</p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddProduct}
              disabled={availableProducts.length === 0}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Product
            </Button>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-500">No products added yet.</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Product" to start.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedProducts.map((item, index) => {
                const product = products.find((p) => p._id === item.productId);
                const itemTotal = item.price * item.quantity;
                return (
                  <div 
                    key={index} 
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Product</label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                          className="select text-sm"
                          required
                        >
                          <option value="">Select product</option>
                          {products
                            .filter((p) => p.active && p.stock > 0)
                            .map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name} ({p.price.toFixed(2)})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          max={product?.stock || 1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="input text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Subtotal</label>
                        <div className="input bg-gray-100 font-semibold">
                          {itemTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 self-end sm:self-center"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
                <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-primary-600">{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="label">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="textarea"
            placeholder="Add any notes about this order..."
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/orders')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={loading}
            disabled={selectedProducts.length === 0}
          >
            {order?._id ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
