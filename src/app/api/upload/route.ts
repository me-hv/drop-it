import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = (data.get('file') || data.get('audio')) as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.name.split('.').pop() || 'webm';
    const filename = `drop-${uniqueSuffix}.${ext}`;

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public/uploads/drops');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // directory exists, ignore
    }

    // Write file to public directory
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    console.log(`Successfully saved drop: ${filename}`);

    // Return the relative URL path to be stored in the database
    return NextResponse.json({ success: true, url: `/uploads/drops/${filename}` });
  } catch (error) {
    console.error('Error uploading audio:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
