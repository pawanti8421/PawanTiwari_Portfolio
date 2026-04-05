import { fetchGitHubData } from "@/utils/githubApi";
import { fetchContributionData } from "@/utils/githubGraphql";

function setCache(key, data) {
  const payload = {
    data,
    expiry: Date.now() + 1000 * 60 * 60,
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

function getCache(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const parsed = JSON.parse(cached);

  if (Date.now() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
}

export const personal = {
  name: "Pawan Tiwari",
  title: "Software Developer",
  tagline: "MERN Stack · Java · Full-Stack Development",
  bio: "I build scalable web applications and desktop tools with a focus on clean architecture, developer experience, and purposeful design. Currently based in India — open to remote opportunities worldwide.",
  location: "India",
  email: "pawantiwari8421@gmail.com",
  phone: "+91 74993 73180",
  github: "https://github.com/pawanti8421",
  linkedin: "https://www.linkedin.com/in/pawan-umesh-tiwari-a614b3259",
};

export const education = [
  {
    degree: "Bachelor of Technology (B.Tech)",
    field: "Information Technology",
    institution: "Shah & Anchor Kutchhi Engineering College, Mumbai",
    period: "2022 – 2026",
    cgpa: "8.49",
    icon: "🎓",
  },
];

export async function getStats() {
  const cached = getCache("githubStats");
  if (cached) return cached;

  const { user, repos } = await fetchGitHubData();
  const { contributions } = await fetchContributionData();

  const totalRepos = repos.length;

  const languagesSet = new Set();
  repos.forEach((repo) => {
    if (repo.language) languagesSet.add(repo.language);
  });

  // const totalTechnologies = languagesSet.size;
  const totalTechnologies = 7;

  const result = [
    {
      value: totalRepos,
      suffix: "+",
      label: "Projects Shipped",
      icon: "projects",
    },
    {
      value: totalTechnologies,
      suffix: "+",
      label: "Technologies",
      icon: "tech",
    },
    {
      value: 1,
      suffix: "",
      label: "Internship",
      icon: "work",
    },
    {
      value: contributions,
      suffix: "+",
      label: "Contributions (1Y)",
      icon: "commit",
    },
  ];

  setCache("githubStats", result);

  return result;
}
