import { MediaGallery } from '@widgets/media-gallery';
import { MediaFilters } from '@features/filter-media';

export function MediaPage() {
  return (
    <main className="app">
      <header className="page-header">
        <h1>Media Collection Manager</h1>
        <p>Browse and manage your media collection.</p>
      </header>
      <MediaFilters />
      <MediaGallery />
    </main>
  );
}