import { fetchGitHubData } from "@/utils/githubApi";
import { fetchContributionData } from "@/utils/githubGraphql";

/* =========================
   🔹 Cache Helpers (1 hour)
========================= */
function setCache(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      expiry: Date.now() + 1000 * 60 * 60,
    }),
  );
}

function getCache(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const parsed = JSON.parse(cached);

  // ❗ invalidate old/broken cache
  if (!parsed.data || Date.now() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
}

/* =========================
   🔥 GitHub Stats
========================= */
export async function getGithubStats() {
  const cached = getCache("githubStatsUI");
  if (cached) return cached;

  const { user, repos } = await fetchGitHubData();
  const { contributions } = await fetchContributionData();

  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0,
  );

  const result = [
    {
      label: "Contributions (1Y)",
      value: contributions + "+",
      color: "var(--amber)",
    },
    {
      label: "Repositories",
      value: repos.length + "+",
      color: "var(--sky)",
    },
    {
      label: "Stars",
      value: totalStars + "+",
      color: "var(--emerald)",
    },
    {
      label: "Followers",
      value: user.followers + "+",
      color: "var(--rose)",
    },
  ];

  setCache("githubStatsUI", result);
  return result;
}

/* =========================
   🎨 Language Colors
========================= */
function getLanguageColor(lang) {
  const colors = {
    JavaScript: "#f59e0b",
    Python: "#a78bfa",
    Java: "#f97316",
    TypeScript: "#38bdf8",
    HTML: "#e34c26",
    CSS: "#264de4",
  };

  return colors[lang] || "#94a3b8";
}

/* =========================
   📦 Top Repositories
========================= */
export async function getGithubRepos() {
  const cached = getCache("githubReposUI");
  if (cached) return cached;

  const { repos, user } = await fetchGitHubData();

  async function getRepoLanguages(repoName) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${user.login}/${repoName}/languages`
      );
      const data = await res.json();

      if (data.message) return {};
      return data;
    } catch {
      return {};
    }
  }

  const filtered = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  const result = await Promise.all(
    filtered.map(async (repo) => {
      const langs = await getRepoLanguages(repo.name);

      const total = Object.values(langs).reduce((a, b) => a + b, 0);

      const languages = Object.entries(langs)
        .map(([name, value]) => ({
          name,
          percent: total ? Math.round((value / total) * 100) : 0,
          color: getLanguageColor(name),
        }))
        .sort((a, b) => b.percent - a.percent);

      const topLang = languages[0];

      return {
        name: repo.name,
        desc: repo.description || "No description",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,

        languages,

        // 🔥 THIS CONTROLS TITLE COLOR
        color: topLang?.color || getLanguageColor(repo.language),
      };
    })
  );

  setCache("githubReposUI", result);
  return result;
}

/* =========================
   📊 Contribution Grid
========================= */
export async function getContributionGrid() {
  const cached = getCache("githubGrid");
  if (cached) return cached;

  const { grid } = await fetchContributionData();

  setCache("githubGrid", grid);
  return grid;
}
