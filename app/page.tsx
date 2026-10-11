import CafeShell from "@/components/cafe/cafe-shell";
import QuickOrderMenu from "@/components/menu/quick-order";
import { projectsData } from "@/data/portfolio";
import { drinkRepoNames, selectSpecials } from "@/lib/cafe/specials";
import { getGithubRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getGithubRepos();
  // getGithubRepos already drops githubExclude; here we only hide drinks.
  const specials = selectSpecials(repos, drinkRepoNames(projectsData));
  return (
    <CafeShell specials={specials.map((r) => ({ id: r.id, name: r.displayName, language: r.language }))}>
      <QuickOrderMenu specials={specials} />
    </CafeShell>
  );
}
