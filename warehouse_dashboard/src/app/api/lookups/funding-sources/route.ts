import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readCategoryData } from '@/lib/serverDataStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'funding_sources.json');
    let sources: any[] = [];
    if (fs.existsSync(filePath)) {
      sources = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    // Also collect distinct funding sources from existing research projects
    const researchItems = readCategoryData('research');
    const existingNames = new Set(sources.map((s) => s.name));

    researchItems.forEach((r: any) => {
      if (r.fund_source) {
        const clean = String(r.fund_source).replace(/\r?\n/g, ' ').trim();
        if (clean && !existingNames.has(clean)) {
          existingNames.add(clean);
          sources.push({
            id: `fund_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: clean,
            type: r.fund_type || 'ภายนอก',
          });
        }
      }
    });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase();

    if (q) {
      sources = sources.filter(
        (s) => s.name.toLowerCase().includes(q) || (s.type && s.type.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      status: 'success',
      total: sources.length,
      data: sources,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch funding sources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    if (!name) {
      return NextResponse.json({ status: 'error', message: 'Name is required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'funding_sources.json');
    let sources: any[] = [];
    if (fs.existsSync(filePath)) {
      sources = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    const exists = sources.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return NextResponse.json({
        status: 'success',
        message: 'Funding source already exists',
        data: sources.find((s) => s.name.toLowerCase() === name.toLowerCase()),
      });
    }

    const newSource = {
      id: `fund_${Date.now()}`,
      name,
      type: body.type || 'ภายนอก',
    };
    sources.push(newSource);
    fs.writeFileSync(filePath, JSON.stringify(sources, null, 2), 'utf-8');

    return NextResponse.json({
      status: 'success',
      message: 'Funding source added successfully',
      data: newSource,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save funding source' },
      { status: 500 }
    );
  }
}
