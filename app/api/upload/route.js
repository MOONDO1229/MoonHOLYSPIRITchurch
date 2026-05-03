import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: '파일이 선택되지 않았습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Validation
    const originalName = file.name || 'unnamed_file';
    const ext = path.extname(originalName).toLowerCase();
    const fileSizeMB = buffer.length / (1024 * 1024);

    const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico'];
    const ALLOWED_DOC_EXTS = ['.pdf'];

    if (ALLOWED_IMAGE_EXTS.includes(ext)) {
      if (fileSizeMB > 10) { // 이미지 제한을 10MB로 완화
        return NextResponse.json({ success: false, message: '이미지 파일은 10MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else if (ALLOWED_DOC_EXTS.includes(ext)) {
      if (fileSizeMB > 30) { // PDF 제한을 30MB로 완화
        return NextResponse.json({ success: false, message: 'PDF 파일은 30MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: '허용되지 않는 파일 형식입니다. (이미지 또는 PDF만 가능)' }, { status: 400 });
    }

    // 2. Sanitize filename
    // 한글 파일명을 지원하며 확장자는 유지
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')).replace(/[^\w\s\uac00-\ud7af]/gi, '_').replace(/\s+/g, '_');
    const filename = `${Date.now()}_${nameWithoutExt}${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists using promises
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    console.log(`File uploaded successfully: ${filename}`);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}`,
      name: originalName
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: '업로드 중 오류가 발생했습니다: ' + error.message 
    }, { status: 500 });
  }
}
