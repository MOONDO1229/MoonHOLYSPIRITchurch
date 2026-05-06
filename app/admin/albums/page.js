import AlbumManager from '@/components/admin/AlbumManager';
import { getAllAlbumPosts } from '@/lib/db';

export default async function AdminAlbumsPage() {
  const albums = await getAllAlbumPosts();

  return (
    <div className="admin-page">
      <AlbumManager initialAlbums={albums} />
    </div>
  );
}
