import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const ALLOWED_IMAGE_TYPES = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.gif': ['image/gif'],
  '.webp': ['image/webp'],
  '.ico': ['image/x-icon', 'image/vnd.microsoft.icon'],
};
const ALLOWED_DOC_TYPES = {
  '.pdf': ['application/pdf'],
};

function hasAsciiPrefix(buffer, prefix, offset = 0) {
  return buffer.subarray(offset, offset + prefix.length).toString('ascii') === prefix;
}

function hasAllowedSignature(ext, buffer) {
  if (ext === '.jpg' || ext === '.jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (ext === '.png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (ext === '.gif') return hasAsciiPrefix(buffer, 'GIF87a') || hasAsciiPrefix(buffer, 'GIF89a');
  if (ext === '.webp') return hasAsciiPrefix(buffer, 'RIFF') && hasAsciiPrefix(buffer, 'WEBP', 8);
  if (ext === '.ico') return buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x01 && buffer[3] === 0x00;
  if (ext === '.pdf') return hasAsciiPrefix(buffer, '%PDF-');
  return false;
}

export async function POST(request) {
  try {
    await requireAdmin();

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
    const originalName = file.name || 'unnamed_file';
    const ext = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    const fileSizeMB = buffer.length / (1024 * 1024);
    const isImage = Object.hasOwn(ALLOWED_IMAGE_TYPES, ext);
    const isDocument = Object.hasOwn(ALLOWED_DOC_TYPES, ext);
    const allowedTypes = ALLOWED_IMAGE_TYPES[ext] || ALLOWED_DOC_TYPES[ext] || [];

    if (isImage) {
      if (fileSizeMB > 10) {
        return NextResponse.json({ success: false, message: '이미지 파일은 10MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else if (isDocument) {
      if (fileSizeMB > 30) {
        return NextResponse.json({ success: false, message: 'PDF 파일은 30MB 이하만 업로드 가능합니다.' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: '허용되지 않는 파일 형식입니다. 이미지 또는 PDF만 가능합니다.' }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type) || !hasAllowedSignature(ext, buffer)) {
      return NextResponse.json({ success: false, message: '파일 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const filename = `${Date.now()}_${crypto.randomUUID()}${ext}`;
    const { error } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return NextResponse.json({ success: false, message: `업로드 실패: ${error.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      name: originalName,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    const status = error.message === 'Unauthorized admin action.' ? 401 : 500;
    return NextResponse.json({
      success: false,
      message: status === 401 ? '관리자 인증이 필요합니다.' : `업로드 중 오류가 발생했습니다: ${error.message}`,
    }, { status });
  }
}
