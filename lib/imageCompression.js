const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_ORIGINAL_BYTES = 20 * 1024 * 1024;

export function formatBytes(bytes = 0) {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function isSupportedImage(file) {
  return Boolean(file && SUPPORTED_IMAGE_TYPES.includes(file.type));
}

export function generateSafeFilename(file, suffix = 'image') {
  const base = String(file?.name || 'album-image')
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 70) || 'album-image';

  return `${base}-${suffix}.webp`;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지 파일을 읽을 수 없습니다.'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('이미지 압축에 실패했습니다.'));
        return;
      }
      resolve(blob);
    }, type, quality);
  });
}

export async function compressImage(file, options = {}) {
  const {
    maxDimension = 1600,
    quality = 0.82,
    suffix = 'main',
  } = options;

  if (!isSupportedImage(file)) {
    throw new Error('JPG, PNG, WebP 이미지만 사용할 수 있습니다.');
  }

  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error('원본 이미지는 20MB 이하만 선택할 수 있습니다.');
  }

  const source = await loadImage(file);
  const originalWidth = source.naturalWidth || source.width;
  const originalHeight = source.naturalHeight || source.height;

  if (!originalWidth || !originalHeight) {
    throw new Error('이미지 크기를 확인할 수 없습니다.');
  }

  const ratio = Math.min(1, maxDimension / Math.max(originalWidth, originalHeight));
  const width = Math.max(1, Math.round(originalWidth * ratio));
  const height = Math.max(1, Math.round(originalHeight * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('브라우저에서 이미지 압축을 지원하지 않습니다.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, 'image/webp', quality);
  const compressedFile = new File([blob], generateSafeFilename(file, suffix), {
    type: 'image/webp',
    lastModified: Date.now(),
  });

  return {
    file: compressedFile,
    width,
    height,
    sizeBytes: compressedFile.size,
    originalWidth,
    originalHeight,
    originalSizeBytes: file.size,
  };
}

export async function createAlbumImageVariants(file) {
  const [main, thumbnail] = await Promise.all([
    compressImage(file, { maxDimension: 1920, quality: 0.82, suffix: 'main' }),
    compressImage(file, { maxDimension: 640, quality: 0.72, suffix: 'thumb' }),
  ]);

  return { main, thumbnail };
}
