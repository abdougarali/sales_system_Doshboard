import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Lead from '@/lib/models/Lead';

// GET - List all leads
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      leads,
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST - Create new lead
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      brandName,
      instagramHandle,
      platform,
      dateContacted,
      replyStatus,
      interestLevel,
      demoSent,
      status,
      notes,
    } = body;

    if (!brandName || !platform) {
      return NextResponse.json(
        { error: 'Brand name and platform are required' },
        { status: 400 }
      );
    }

    const lead = await Lead.create({
      brandName,
      instagramHandle: instagramHandle || undefined,
      platform,
      dateContacted: dateContacted ? new Date(dateContacted) : undefined,
      replyStatus: replyStatus || undefined,  // Convert empty string to undefined
      interestLevel: interestLevel || undefined,  // Convert empty string to undefined
      demoSent: demoSent || false,
      status: status || 'new',
      notes: notes || undefined,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
