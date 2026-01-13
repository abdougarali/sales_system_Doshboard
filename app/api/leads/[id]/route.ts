import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Lead from '@/lib/models/Lead';

// GET - Get single lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const lead = await Lead.findById(params.id).lean();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PUT - Update lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updateData: any = {};
    const unsetData: any = {};
    
    if (brandName !== undefined) updateData.brandName = brandName;
    if (instagramHandle !== undefined) updateData.instagramHandle = instagramHandle || undefined;
    if (platform !== undefined) updateData.platform = platform;
    if (dateContacted !== undefined) updateData.dateContacted = dateContacted ? new Date(dateContacted) : null;
    
    // Handle enum fields - empty string means unset
    if (replyStatus !== undefined) {
      if (replyStatus === '') {
        unsetData.replyStatus = 1;
      } else {
        updateData.replyStatus = replyStatus;
      }
    }
    if (interestLevel !== undefined) {
      if (interestLevel === '') {
        unsetData.interestLevel = 1;
      } else {
        updateData.interestLevel = interestLevel;
      }
    }
    
    if (demoSent !== undefined) updateData.demoSent = demoSent;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updateQuery: any = {};
    if (Object.keys(updateData).length > 0) updateQuery.$set = updateData;
    if (Object.keys(unsetData).length > 0) updateQuery.$unset = unsetData;

    const lead = await Lead.findByIdAndUpdate(
      params.id,
      updateQuery,
      { new: true, runValidators: true }
    ).lean();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const lead = await Lead.findByIdAndDelete(params.id);

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
