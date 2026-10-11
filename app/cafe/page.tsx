import type { Metadata } from "next";
import CafeShell from "@/components/cafe/cafe-shell";
import QuickOrderMenu from "@/components/menu/quick-order";
import { projectsData } from "@/data/portfolio";
import { drinkRepoNames, selectSpecials } from "@/lib/cafe/specials";
import { getGithubRepos } from "@/lib/github";

// Hidden preview of the café until launch (spec: built at /cafe, noindex).
export const metadata: Metadata = {
  title: "The Café (preview)",
  robots: { index: false, follow: false },
};

export default async function CafePage() {
  const repos = await getGithubRepos();
  // getGithubRepos already drops githubExclude; here we only hide drinks.
  const specials = selectSpecials(repos, drinkRepoNames(projectsData));
  return (
    <CafeShell specials={specials.map((r) => ({ id: r.id, name: r.displayName, language: r.language }))}>
      <QuickOrderMenu specials={specials} />
    </CafeShell>
  );
}
