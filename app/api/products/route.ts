import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    const query: any = {};
    if (active !== null) {
      query.active = active === 'true';
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      stock,
      imageUrl,
      active,
    } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Name, price, and stock are required' },
        { status: 400 }
      );
    }

    if (price < 0 || stock < 0) {
      return NextResponse.json(
        { error: 'Price and stock must be non-negative' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      nameAr,
      description,
      descriptionAr,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl,
      active: active !== undefined ? active : true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
