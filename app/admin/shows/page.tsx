import { getShows } from '@/lib/data';
import { addShow, updateShow, deleteShow } from '@/lib/actions/shows';
import ShowsClient from './ShowsClient';

export default async function ShowsPage() {
  const shows = await getShows();
  return <ShowsClient shows={shows} addShow={addShow} updateShow={updateShow} deleteShow={deleteShow} />;
}
