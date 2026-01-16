import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

// GET - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const order = await Order.findById(params.id)
      .populate('products.productId', 'name price imageUrl')
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      products,
      status,
      notes,
    } = body;

    // Get existing order
    const existingOrder = await Order.findById(params.id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
    if (customerAddress !== undefined) updateData.customerAddress = customerAddress;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // Handle products update
    if (products !== undefined && products.length > 0) {
      // Restore stock from old products
      for (const item of existingOrder.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }

      // Validate new products and calculate total
      let totalAmount = 0;
      const orderProducts = [];

      for (const item of products) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          // Rollback stock restoration
          for (const oldItem of existingOrder.products) {
            await Product.findByIdAndUpdate(oldItem.productId, {
              $inc: { stock: -oldItem.quantity },
            });
          }
          return NextResponse.json(
            { error: `Product ${item.productId} not found` },
            { status: 400 }
          );
        }

        if (item.quantity <= 0) {
          // Rollback stock restoration
          for (const oldItem of existingOrder.products) {
            await Product.findByIdAndUpdate(oldItem.productId, {
              $inc: { stock: -oldItem.quantity },
            });
          }
          return NextResponse.json(
            { error: 'Product quantity must be greater than 0' },
            { status: 400 }
          );
        }

        if (product.stock < item.quantity) {
          // Rollback stock restoration
          for (const oldItem of existingOrder.products) {
            await Product.findByIdAndUpdate(oldItem.productId, {
              $inc: { stock: -oldItem.quantity },
            });
          }
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
            { status: 400 }
          );
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderProducts.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Deduct stock for new products
      for (const item of orderProducts) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      updateData.products = orderProducts;
      updateData.totalAmount = totalAmount;
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('products.productId', 'name price')
      .lean();

    const response = NextResponse.json(order);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order (restore stock if needed)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Restore stock if order is not delivered or cancelled
    if (order.status !== 'delivered' && order.status !== 'cancelled') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await Order.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
