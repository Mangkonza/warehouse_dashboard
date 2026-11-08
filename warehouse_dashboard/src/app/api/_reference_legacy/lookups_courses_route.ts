import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'course_catalog.json');
    let courses: any[] = [];
    if (fs.existsSync(filePath)) {
      courses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase();

    if (q) {
      courses = courses.filter(
        (c) =>
          c.code.includes(q) ||
          c.nameTh.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          (c.department && c.department.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      status: 'success',
      total: courses.length,
      data: courses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch course catalog' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = body?.code?.trim();
    const nameTh = body?.nameTh?.trim();
    const nameEn = body?.nameEn?.trim() || '';
    const department = body?.department?.trim() || '';

    if (!code || !nameTh) {
      return NextResponse.json(
        { status: 'error', message: 'Course code and Thai name are required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'course_catalog.json');
    let courses: any[] = [];
    if (fs.existsSync(filePath)) {
      courses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    const existingIdx = courses.findIndex((c) => c.code === code);
    const newCourse = { code, nameTh, nameEn, department };

    if (existingIdx >= 0) {
      courses[existingIdx] = { ...courses[existingIdx], ...newCourse };
    } else {
      courses.push(newCourse);
    }

    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2), 'utf-8');

    return NextResponse.json({
      status: 'success',
      message: 'Course saved successfully',
      data: newCourse,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save course' },
      { status: 500 }
    );
  }
}
