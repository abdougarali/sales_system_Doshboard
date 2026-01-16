import Link from 'next/link';
import Card from '@/components/ui/Card';
import Table, { TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import { OrderStatus } from '@/types';
import { PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const statusColors: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
  new: 'info',
  confirmed: 'purple',
  in_progress: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

const statusLabels: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getOrders() {
  await connectDB();
  const orders = await Order.find()
    .populate('products.productId', 'name')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return orders;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">Manage customer orders</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create New Order
          </Button>
        </Link>
      </div>

      {/* Content */}
      <Card noPadding>
        {orders.length === 0 ? (
          <div className="empty-state">
            <ShoppingCartIcon className="empty-state-icon" />
            <h3 className="empty-state-title">No orders yet</h3>
            <p className="empty-state-text">Get started by creating your first order.</p>
            <div className="mt-6">
              <Link href="/dashboard/orders/new">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create First Order
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
                    <TableHeader>Order</TableHeader>
                    <TableHeader>Customer</TableHeader>
                    <TableHeader>Items</TableHeader>
                    <TableHeader>Total</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader></TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order: any) => {
                    const totalQuantity = order.products.reduce((sum: number, p: any) => sum + p.quantity, 0);
                    return (
                      <TableRow key={order._id.toString()}>
                        <TableCell>
                          <span className="font-mono font-medium text-gray-900">
                            {order.orderNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-xs text-gray-500">{order.customerPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">
                              {order.products
                                .slice(0, 2)
                                .map((p: any) => p.productId?.name || 'Unknown')
                                .join(', ')}
                              {order.products.length > 2 && '...'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gray-900">
                            {order.totalAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[order.status as OrderStatus] || 'default'}>
                            {statusLabels[order.status as OrderStatus] || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/orders/${order._id}`}>
                            <Button variant="ghost" size="xs">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {orders.map((order: any) => {
                const totalQuantity = order.products.reduce((sum: number, p: any) => sum + p.quantity, 0);
                return (
                  <Link 
                    key={order._id.toString()} 
                    href={`/dashboard/orders/${order._id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono font-semibold text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-700 mt-0.5">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </div>
                      <Badge variant={statusColors[order.status as OrderStatus] || 'default'}>
                        {statusLabels[order.status as OrderStatus] || order.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</span>
                      <span className="font-semibold text-gray-900">{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
