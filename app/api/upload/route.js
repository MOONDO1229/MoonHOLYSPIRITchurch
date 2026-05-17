import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, message: 'DB 연결이 설정되지 않았습니다.' }, { status: 500 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: '파일이 선택되지 않았습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Validation
    const originalName = file.name || 'unnamed_file';
    const ext = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    const fileSizeMB = buffer.length / (1024 * 1024);

    const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico'];
    const ALLOWED_DOC_EXTS = ['.pdf'];

    if (ALLOWED_IMAGE_EXTS.includes(ext)) {
      if (fileSizeMB > 10) {
        return NextResponse.json({ success: false, message: '이미지 파일은 10MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else if (ALLOWED_DOC_EXTS.includes(ext)) {
      if (fileSizeMB > 30) {
        return NextResponse.json({ success: false, message: 'PDF 파일은 30MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: '허용되지 않는 파일 형식입니다. (이미지 또는 PDF만 가능)' }, { status: 400 });
    }

    // 2. 파일명 생성 (ASCII 안전하게 변경)
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${Date.now()}_${randomStr}${ext}`;

    // 3. Supabase Storage에 업로드
    const contentType = ALLOWED_IMAGE_EXTS.includes(ext)
      ? `image/${ext.replace('.', '').replace('jpg', 'jpeg')}`
      : 'application/pdf';

    const { data: uploadData, error } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return NextResponse.json({ success: false, message: '업로드 실패: ' + error.message }, { status: 500 });
    }

    // 4. Public URL 생성
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    console.log(`File uploaded to Supabase Storage: ${filename}`);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
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
