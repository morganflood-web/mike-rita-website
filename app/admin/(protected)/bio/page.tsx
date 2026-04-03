import { getBio } from '@/lib/data';
import { updateBio } from '@/lib/actions/bio';
import BioClient from './BioClient';

export default async function BioPage() {
  const { bio, awards } = await getBio();
  return <BioClient bio={bio} awards={awards} updateBio={updateBio} />;
}
