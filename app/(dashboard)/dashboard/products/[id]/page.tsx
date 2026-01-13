import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import ProductForm from '@/components/products/ProductForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ToggleProductButton from '@/components/products/ToggleProductButton';
import DeleteProductButton from '@/components/products/DeleteProductButton';
import { serializeDocument } from '@/lib/utils/serialize';
import { IProduct } from '@/types';

interface SerializedProduct extends Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'> {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

async function getProduct(id: string): Promise<SerializedProduct | null> {
  await connectDB();
  const product = await Product.findById(id).lean();
  return product ? serializeDocument<SerializedProduct>(product) : null;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Type assertion after null check
  const productData = product as SerializedProduct;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
          <p className="mt-2 text-sm text-gray-600">Product details and management</p>
        </div>
        <Link href="/dashboard/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductForm product={productData} />
        </div>
        <div className="space-y-6">
          <Card title="Quick Info">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  {productData.active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="default">Inactive</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {productData.price.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Stock</label>
                <p className={`mt-1 text-lg font-semibold ${productData.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {productData.stock}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(productData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Actions">
            <div className="space-y-3">
              <ToggleProductButton productId={productData._id.toString()} active={productData.active} />
              <DeleteProductButton productId={productData._id.toString()} productName={productData.name} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
