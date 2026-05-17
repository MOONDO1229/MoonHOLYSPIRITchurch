import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_COMPRESSED_BYTES = 5 * 1024 * 1024;

function safeSegment(value, fallback = 'image') {
  return String(value || fallback)
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80) || fallback;
}

function hasAllowedImageSignature(type, buffer) {
  if (type === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === 'image/webp') {
    return buffer.subarray(0, 4).toString('ascii') === 'RIFF'
      && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return false;
}

export async function POST(request) {
  try {
    await requireAdmin();

    if (!supabase) {
      return NextResponse.json({ success: false, message: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }

    const data = await request.formData();
    const file = data.get('file');
    const albumPostId = data.get('albumPostId');
    const variant = data.get('variant') === 'thumb' ? 'thumb' : 'main';

    if (!file) {
      return NextResponse.json({ success: false, message: '업로드할 이미지가 없습니다.' }, { status: 400 });
    }

    const postId = Number(albumPostId);
    if (!Number.isFinite(postId) || postId <= 0) {
      return NextResponse.json({ success: false, message: '앨범 게시글 ID가 올바르지 않습니다.' }, { status: 400 });
    }

    const { data: albumPost, error: albumPostError } = await supabase
      .from('album_posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (albumPostError || !albumPost) {
      return NextResponse.json({ success: false, message: '앨범 게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: 'JPG, PNG, WebP 이미지만 업로드할 수 있습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (buffer.length > MAX_COMPRESSED_BYTES) {
      return NextResponse.json({ success: false, message: '압축된 이미지가 5MB를 넘습니다. 더 작은 사진을 사용해 주세요.' }, { status: 400 });
    }

    if (!hasAllowedImageSignature(file.type, buffer)) {
      return NextResponse.json({ success: false, message: '이미지 파일 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp';
    const baseName = safeSegment(file.name?.replace(/\.[^.]+$/, ''), variant);
    const filename = `${Date.now()}_${crypto.randomUUID()}_${baseName}.${extension}`;
    const path = `${postId}/${variant}/${filename}`;

    const { error } = await supabase.storage
      .from('album-images')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Album upload error:', error);
      return NextResponse.json({ success: false, message: `이미지 업로드 실패: ${error.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('album-images')
      .getPublicUrl(path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path,
      size: buffer.length,
      name: file.name,
    });
  } catch (error) {
    console.error('Album upload fatal error:', error);
    const status = error.message === 'Unauthorized admin action.' ? 401 : 500;
    return NextResponse.json({
      success: false,
      message: status === 401 ? '관리자 인증이 필요합니다.' : `이미지 업로드 중 오류가 발생했습니다: ${error.message}`,
    }, { status });
  }
}
