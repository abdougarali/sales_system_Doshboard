import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';

// POST - Toggle product active status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    product.active = !product.active;
    await product.save();

    const response = NextResponse.json(product);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Error toggling product:', error);
    return NextResponse.json(
      { error: 'Failed to toggle product status' },
      { status: 500 }
    );
  }
}
