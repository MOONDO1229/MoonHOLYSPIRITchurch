import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

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
    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const fileSizeMB = buffer.length / (1024 * 1024);

    const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ALLOWED_DOC_EXTS = ['.pdf'];

    if (ALLOWED_IMAGE_EXTS.includes(ext)) {
      if (fileSizeMB > 5) {
        return NextResponse.json({ success: false, message: '이미지 파일은 5MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else if (ALLOWED_DOC_EXTS.includes(ext)) {
      if (fileSizeMB > 20) {
        return NextResponse.json({ success: false, message: 'PDF 파일은 20MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: '허용되지 않는 파일 형식입니다. (이미지 또는 PDF만 가능)' }, { status: 400 });
    }

    // 2. Sanitize filename and add timestamp
    const nameWithoutExt = path.basename(originalName, ext).replace(/[^a-z0-9가-힣]/gi, '_');
    const filename = `${Date.now()}_${nameWithoutExt}${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);
    console.log(`File uploaded: ${filename} (${fileSizeMB.toFixed(2)}MB)`);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}`,
      name: originalName
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: '업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
