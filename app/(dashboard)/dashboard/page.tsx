import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import connectDB from '@/lib/db/mongodb';
import Lead from '@/lib/models/Lead';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import {
  UserGroupIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  CubeIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { OrderStatus } from '@/types';

// Helper to get date ranges
function getDateRanges() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  return { now, startOfMonth, startOfLastMonth, endOfLastMonth };
}

async function getStats() {
  await connectDB();
  const { startOfMonth, startOfLastMonth, endOfLastMonth } = getDateRanges();
  
  // Basic counts
  const [
    totalLeads,
    activeLeads,
    convertedLeads,
    lostLeads,
    totalOrders,
    totalProducts,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: { $in: ['contacted', 'replied', 'demo_sent'] } }),
    Lead.countDocuments({ status: 'converted' }),
    Lead.countDocuments({ status: 'lost' }),
    Order.countDocuments(),
    Product.countDocuments({ active: true }),
  ]);

  // Revenue calculations (only from delivered orders)
  const [revenueResult, thisMonthRevenueResult, lastMonthRevenueResult] = await Promise.all([
    Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;
  const thisMonthRevenue = thisMonthRevenueResult[0]?.total || 0;
  const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Top selling products (by quantity sold in delivered orders)
  const topProducts = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $unwind: '$products' },
    { $group: { 
      _id: '$products.productId', 
      totalQty: { $sum: '$products.quantity' },
      totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
    }},
    { $sort: { totalQty: -1 } },
    { $limit: 5 },
    { $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: '_id',
      as: 'product'
    }},
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
  ]);

  // Leads by platform
  const leadsByPlatform = await Lead.aggregate([
    { $group: { _id: '$platform', count: { $sum: 1 } } }
  ]);

  // Low stock products (stock < 5)
  const lowStockProducts = await Product.find({ 
    active: true, 
    stock: { $lt: 5 } 
  }).sort({ stock: 1 }).limit(5).lean();

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Delivered orders count (for AOV calculation)
  const deliveredOrdersCount = await Order.countDocuments({ status: 'delivered' });

  return {
    totalLeads,
    activeLeads,
    convertedLeads,
    lostLeads,
    totalOrders,
    totalProducts,
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    ordersByStatus,
    topProducts,
    leadsByPlatform,
    lowStockProducts,
    recentOrders,
    deliveredOrdersCount,
  };
}

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-blue-500',
  confirmed: 'bg-purple-500',
  in_progress: 'bg-amber-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusLabels: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const platformColors: Record<string, string> = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  whatsapp: 'bg-green-500',
  messenger: 'bg-blue-500',
};

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  messenger: 'Messenger',
};

export default async function DashboardPage() {
  const stats = await getStats();
  
  const conversionRate = stats.totalLeads > 0 
    ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1) 
    : '0';
  
  const avgOrderValue = stats.deliveredOrdersCount > 0 
    ? (stats.totalRevenue / stats.deliveredOrdersCount).toFixed(2) 
    : '0.00';

  const revenueChange = stats.lastMonthRevenue > 0 
    ? (((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100).toFixed(1)
    : stats.thisMonthRevenue > 0 ? '100' : '0';

  const revenueIncreased = parseFloat(revenueChange) >= 0;

  // Process orders by status into a usable format
  const orderStatusMap = stats.ordersByStatus.reduce((acc: Record<string, number>, item: any) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  // Process leads by platform
  const platformMap = stats.leadsByPlatform.reduce((acc: Record<string, number>, item: any) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const maxPlatformCount = Math.max(...Object.values(platformMap as Record<string, number>), 1);

  return (
    <div className="space-y-3 sm:space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-[10px] sm:text-sm text-gray-500">Business overview & analytics</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button size="sm" className="text-xs sm:text-sm">
            <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Order</span>
            <span className="sm:hidden">Order</span>
          </Button>
        </Link>
      </div>

      {/* Revenue Stats - Top Row (Micro on mobile) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-3 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-sm font-medium text-emerald-100">Total Revenue</p>
              <p className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-bold">{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20">
              <BanknotesIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-sm text-emerald-100">
            <span>From {stats.deliveredOrdersCount} delivered</span>
          </div>
        </div>

        {/* This Month Revenue */}
        <div className="bg-white rounded-xl p-3 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-sm font-medium text-gray-500">This Month</p>
              <p className="mt-0.5 sm:mt-1 text-lg sm:text-3xl font-bold text-gray-900">{stats.thisMonthRevenue.toFixed(2)}</p>
            </div>
            <div className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${revenueIncreased ? 'bg-green-100' : 'bg-red-100'}`}>
              {revenueIncreased ? (
                <ArrowTrendingUpIcon className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
              )}
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-sm">
            <span className={`font-medium ${revenueIncreased ? 'text-green-600' : 'text-red-600'}`}>
              {revenueIncreased ? '+' : ''}{revenueChange}%
            </span>
            <span className="text-gray-500 ml-1 hidden sm:inline">vs last month</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-xl p-3 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-sm font-medium text-gray-500">Avg Order</p>
              <p className="mt-0.5 sm:mt-1 text-lg sm:text-3xl font-bold text-gray-900">{avgOrderValue}</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-100">
              <ShoppingCartIcon className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-sm text-gray-500">
            <span className="hidden sm:inline">Per delivered order</span>
            <span className="sm:hidden">Per order</span>
          </div>
        </div>

        {/* Conversion Rate - Full width on mobile like Total Revenue */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-xl p-3 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-bold text-gray-900">{conversionRate}%</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100">
              <CheckCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-sm text-gray-500">
            <span>{stats.convertedLeads} of {stats.totalLeads} leads converted</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row (Micro cards) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-blue-50 mb-1 sm:mb-0">
              <UserGroupIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              <p className="text-[9px] sm:text-xs text-gray-500">Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-amber-50 mb-1 sm:mb-0">
              <ClockIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{stats.activeLeads}</p>
              <p className="text-[9px] sm:text-xs text-gray-500">Pipeline</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-purple-50 mb-1 sm:mb-0">
              <ShoppingCartIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-[9px] sm:text-xs text-gray-500">Orders</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-green-50 mb-1 sm:mb-0">
              <CubeIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-[9px] sm:text-xs text-gray-500">Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-3">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 border-b border-gray-50">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Orders by Status</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Distribution of all orders</p>
          </div>
          <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-4">
            {(['new', 'confirmed', 'in_progress', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => {
              const count = orderStatusMap[status] || 0;
              const percentage = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{statusLabels[status]}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{count}</span>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${statusColors[status]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-2 sm:p-3 border-t border-gray-50">
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm">
                View all orders →
              </Button>
            </Link>
          </div>
        </div>

        {/* Leads by Platform */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 border-b border-gray-50">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Leads by Platform</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Where your leads come from</p>
          </div>
          <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-4">
            {(['instagram', 'whatsapp', 'messenger'] as const).map((platform) => {
              const count = platformMap[platform] || 0;
              const percentage = (count / maxPlatformCount) * 100;
              return (
                <div key={platform}>
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{platformLabels[platform]}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${platformColors[platform]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-2 sm:p-3 border-t border-gray-50">
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm">
                View all leads →
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 border-b border-gray-50">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Create new items</p>
          </div>
          <div className="p-2 sm:p-5 space-y-1.5 sm:space-y-3">
            <Link href="/dashboard/leads/new" className="block">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-blue-100">
                  <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Add New Lead</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Track a potential client</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/products/new" className="block">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-purple-100">
                  <CubeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Add New Product</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Expand your catalog</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/orders/new" className="block">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-green-100">
                  <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Create New Order</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Process a new sale</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 border-b border-gray-50">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Top Selling Products</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Best performers by quantity sold</p>
          </div>
          <div className="p-2 sm:p-5">
            {stats.topProducts.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <CubeIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-500">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-1.5 sm:space-y-3">
                {stats.topProducts.map((item: any, index: number) => (
                  <div 
                    key={item._id?.toString() || index} 
                    className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg font-bold text-[10px] sm:text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {item.product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {item.totalQty} sold • {item.totalRevenue?.toFixed(2)}
                      </p>
                    </div>
                    {index === 0 && (
                      <Badge variant="warning" size="sm" className="text-[10px] sm:text-xs">Top</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 sm:p-3 border-t border-gray-50">
            <Link href="/dashboard/products">
              <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm">
                View all products →
              </Button>
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Low Stock Alerts</h3>
              {stats.lowStockProducts.length > 0 && (
                <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs font-bold text-white bg-red-500 rounded-full">
                  {stats.lowStockProducts.length}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Products running low</p>
          </div>
          <div className="p-2 sm:p-5">
            {stats.lowStockProducts.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <CheckCircleIcon className="w-8 h-8 sm:w-12 sm:h-12 text-green-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-green-600 font-medium">All products well stocked!</p>
              </div>
            ) : (
              <div className="space-y-1.5 sm:space-y-3">
                {stats.lowStockProducts.map((product: any) => (
                  <Link 
                    key={product._id.toString()} 
                    href={`/dashboard/products/${product._id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-100">
                      <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-red-100">
                        <ExclamationTriangleIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-[10px] sm:text-xs text-red-600">
                          Only {product.stock} left
                        </p>
                      </div>
                      <Badge 
                        variant={product.stock === 0 ? 'danger' : 'warning'} 
                        size="sm"
                        className="text-[10px] sm:text-xs"
                      >
                        {product.stock === 0 ? 'Out' : 'Low'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-3 sm:p-5 border-b border-gray-50">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">Recent Orders</h3>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Latest order activity</p>
        </div>
        <div className="p-2 sm:p-5">
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <ShoppingCartIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500">No orders yet</p>
              <Link href="/dashboard/orders/new" className="mt-2 sm:mt-3 inline-block">
                <Button size="sm" className="text-xs sm:text-sm">Create First Order</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-right py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentOrders.map((order: any) => (
                      <tr key={order._id.toString()} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-3">
                          <span className="font-mono text-sm font-medium text-gray-900">{order.orderNumber}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-sm text-gray-700">{order.customerName}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-sm font-semibold text-gray-900">{order.totalAmount.toFixed(2)}</span>
                        </td>
                        <td className="py-2 px-3">
                          <Badge variant={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'cancelled' ? 'danger' :
                            order.status === 'in_progress' ? 'warning' :
                            order.status === 'confirmed' ? 'purple' :
                            'info'
                          }>
                            {statusLabels[order.status as OrderStatus] || order.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <Link href={`/dashboard/orders/${order._id}`}>
                            <Button variant="ghost" size="xs">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile view - Micro cards */}
              <div className="md:hidden space-y-1.5">
                {stats.recentOrders.map((order: any) => (
                  <Link 
                    key={order._id.toString()} 
                    href={`/dashboard/orders/${order._id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] font-medium text-gray-900 truncate">{order.orderNumber}</p>
                        <p className="text-[10px] text-gray-500 truncate">{order.customerName}</p>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-xs font-semibold text-gray-900">{order.totalAmount.toFixed(2)}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'cancelled' ? 'danger' :
                          order.status === 'in_progress' ? 'warning' :
                          'info'
                        } size="sm" className="text-[9px]">
                          {statusLabels[order.status as OrderStatus] || order.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-2 sm:p-3 border-t border-gray-50">
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm">
              View all orders →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
