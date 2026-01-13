import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import OrderForm from '@/components/orders/OrderForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import UpdateOrderStatus from '@/components/orders/UpdateOrderStatus';
import DeleteOrderButton from '@/components/orders/DeleteOrderButton';
import { OrderStatus, IOrder } from '@/types';
import { serializeDocument } from '@/lib/utils/serialize';

const statusColors: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  new: 'info',
  confirmed: 'default',
  in_progress: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

interface SerializedOrder extends Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'> {
  _id: string;
  createdAt: string;
  updatedAt: string;
  products: Array<{
    productId: { _id: string; name: string; price: number; imageUrl?: string } | string;
    quantity: number;
    price: number;
  }>;
}

async function getOrder(id: string): Promise<SerializedOrder | null> {
  await connectDB();
  const order = await Order.findById(id)
    .populate('products.productId', 'name price imageUrl')
    .lean();
  return order ? serializeDocument<SerializedOrder>(order) : null;
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="mt-2 text-sm text-gray-600">Order details and management</p>
        </div>
        <Link href="/dashboard/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderForm order={order} />
        </div>
        <div className="space-y-6">
          <Card title="Order Info">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge variant={statusColors[order.status as OrderStatus] || 'default'}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Order Number</label>
                <p className="mt-1 text-sm font-mono text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Customer Info">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-sm text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{order.customerPhone}</p>
              </div>
              {order.customerAddress && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{order.customerAddress}</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Products">
            <div className="space-y-3">
              {order.products.map((item: any, index: number) => {
                const product = item.productId;
                return (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{product?.name || 'Unknown Product'}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} × {item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Actions">
            <div className="space-y-3">
              <UpdateOrderStatus orderId={order._id.toString()} currentStatus={order.status} />
              <DeleteOrderButton orderId={order._id.toString()} orderNumber={order.orderNumber} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
