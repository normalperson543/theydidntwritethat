import { getActivityCount, getGlobalAccuracy } from "./lib/data";
import HomeUI from "./ui/home";

export default async function HomePage() {
  const acc = Math.round(await getGlobalAccuracy() * 1000) / 1000;
  const people = Math.floor(await getActivityCount() / 10);
  return <HomeUI acc={acc * 100}  people={people}/>
}