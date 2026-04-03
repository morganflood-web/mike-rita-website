import { getReleases } from '@/lib/data';
import { addRelease, updateRelease, deleteRelease } from '@/lib/actions/releases';
import ReleasesClient from './ReleasesClient';

export default async function ReleasesPage() {
  const releases = await getReleases();
  return (
    <ReleasesClient
      releases={releases}
      addRelease={addRelease}
      updateRelease={updateRelease}
      deleteRelease={deleteRelease}
    />
  );
}
