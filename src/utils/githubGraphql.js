export async function fetchContributionData() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      {
        user(login: "pawanti8421") {
          contributionsCollection {
            totalCommitContributions
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }
      `,
    }),
  });

  const data = await res.json();

  const contributions =
    data.data.user.contributionsCollection.totalCommitContributions;

  const weeks =
    data.data.user.contributionsCollection.contributionCalendar.weeks;

  
  const grid = weeks.flatMap((week) =>
    week.contributionDays.map((day) => day.contributionCount),
  );

  return { contributions, grid };
}
