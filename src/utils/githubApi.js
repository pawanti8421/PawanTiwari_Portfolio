export async function fetchGitHubData() {
  const res = await fetch(`https://api.github.com/users/pawanti8421`);
  const user = await res.json();

  const repoRes = await fetch(user.repos_url);
  const repos = await repoRes.json();

  return { user, repos };
}
