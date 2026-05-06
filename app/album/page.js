import AlbumListClient from '@/components/AlbumListClient';
import { getAlbumPosts } from '@/lib/db';

export default async function AlbumPage() {
  const albums = await getAlbumPosts();

  return (
    <main className="bg-[#fafafa] min-h-screen">
      <section className="album-page-hero">
        <div className="container text-center">
          <span className="album-hero-kicker">CHURCH ALBUM</span>
          <h1>교회 앨범</h1>
          <div className="album-hero-line" />
          <p>
            성령교회의 예배, 행사, 공동체의 모습을 사진으로 전합니다.
          </p>
        </div>
      </section>

      <AlbumListClient initialAlbums={albums} />
    </main>
  );
}
