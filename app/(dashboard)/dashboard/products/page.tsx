import Link from 'next/link';
import Card from '@/components/ui/Card';
import Table, { TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import ToggleProductButton from '@/components/products/ToggleProductButton';
import DeleteProductButton from '@/components/products/DeleteProductButton';
import { PlusIcon, CubeIcon } from '@heroicons/react/24/outline';

async function getProducts() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).limit(50).lean();
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Content */}
      <Card noPadding>
        {products.length === 0 ? (
          <div className="empty-state">
            <CubeIcon className="empty-state-icon" />
            <h3 className="empty-state-title">No products yet</h3>
            <p className="empty-state-text">Get started by adding your first product.</p>
            <div className="mt-6">
              <Link href="/dashboard/products/new">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add First Product
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
                    <TableHeader>Product</TableHeader>
                    <TableHeader>Price</TableHeader>
                    <TableHeader>Stock</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Created</TableHeader>
                    <TableHeader></TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product: any) => (
                    <TableRow key={product._id.toString()}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.nameAr && (
                            <div className="text-xs text-gray-500" dir="rtl">{product.nameAr}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">{product.price.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-amber-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="default">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/products/${product._id}`}>
                            <Button variant="ghost" size="xs">Edit</Button>
                          </Link>
                          <ToggleProductButton productId={product._id.toString()} active={product.active} />
                          <DeleteProductButton productId={product._id.toString()} productName={product.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {products.map((product: any) => (
                <div key={product._id.toString()} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </p>
                      {product.nameAr && (
                        <p className="text-xs text-gray-500 mt-0.5" dir="rtl">{product.nameAr}</p>
                      )}
                    </div>
                    {product.active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="default">Inactive</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Price:</span>{' '}
                      <span className="font-semibold">{product.price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span>{' '}
                      <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : ''}`}>
                        {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Link href={`/dashboard/products/${product._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Edit</Button>
                    </Link>
                    <ToggleProductButton productId={product._id.toString()} active={product.active} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
