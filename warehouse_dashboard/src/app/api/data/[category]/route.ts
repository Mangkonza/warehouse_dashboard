import { NextRequest, NextResponse } from 'next/server';
import {
  readCategoryData,
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory,
  batchSaveCategory,
} from '../../../../lib/serverDataStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ category: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const data = readCategoryData(category);
    return NextResponse.json({
      status: 'success',
      category,
      total: data.length,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const body = await request.json();

    // Check if batch import
    if (body && Array.isArray(body.items)) {
      const mode = body.mode === 'overwrite' ? 'overwrite' : 'append';
      const updated = batchSaveCategory(category, body.items, mode);
      return NextResponse.json({
        status: 'success',
        message: `Imported ${body.items.length} records into ${category}`,
        total: updated.length,
        data: updated,
      });
    }

    // Single item creation
    const created = addItemToCategory(category, body);
    return NextResponse.json({
      status: 'success',
      message: 'Record created successfully and persisted',
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const body = await request.json();
    const updated = updateItemInCategory(category, body);
    if (!updated) {
      return NextResponse.json(
        { status: 'error', message: 'Record ID missing or record not found' },
        { status: 400 }
      );
    }
    return NextResponse.json({
      status: 'success',
      message: 'Record updated successfully and persisted',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to update record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Target record ID is required' },
        { status: 400 }
      );
    }

    const deleted = deleteItemFromCategory(category, id);
    return NextResponse.json({
      status: 'success',
      message: deleted ? `Record ${id} deleted successfully` : 'Record not found, file saved',
      deleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to delete record' },
      { status: 500 }
    );
  }
}
