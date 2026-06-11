import HomeContent from "./_content";
import { fetchLandingData } from "./lib/server-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialData = await fetchLandingData();

  return <HomeContent initialData={initialData} />;
}
