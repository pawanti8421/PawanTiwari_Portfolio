import { useMemo, useEffect, useState } from "react";
import {
  Github,
  ExternalLink,
  GitBranch,
  Star,
  Users,
  Code,
  ArrowUpRight,
} from "lucide-react";
import { personal } from "@/data";
import {
  getGithubStats,
  getGithubRepos,
  getContributionGrid,
} from "@/data/github";
import { useInView } from "@/hooks";
import { revealStyle } from "@/utils";

const CONTRIB_COLORS = [
  "rgba(255,255,255,0.05)",
  "rgba(245,158,11,0.2)",
  "rgba(245,158,11,0.42)",
  "rgba(245,158,11,0.7)",
  "rgba(245,158,11,0.95)",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
];

const STAT_ICONS = {
  "Contributions (1Y)": <GitBranch size={18} />,
  Repositories: <Github size={18} />,
  Stars: <Star size={18} />,
  Followers: <Users size={18} />,
};

export default function GitHub() {
  const [ref, inView] = useInView(0.12);
  const [stats, setStats] = useState([]);
  const [repos, setRepos] = useState([]);
  const [contrib, setContrib] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const statsData = await getGithubStats();
        const reposData = await getGithubRepos();
        const gridData = await getContributionGrid();

        setStats(statsData || []);
        setRepos(reposData || []);
        setContrib(gridData || []);
      } catch (err) {
        console.error("GitHub error:", err);
      }
    }

    load();
  }, []);

  return (
    <section id="github">
      <div className="section-wrap" ref={ref}>
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            08 / GitHub
          </div>
          <h2 className="display-lg">
            Open source
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text2)" }}>
              contributions
            </span>
          </h2>
        </div>

        {/* Stats */}
        <div
          style={{
            ...revealStyle(inView, 0.1),
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 36,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: "22px 24px",
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                }}
              >
                {STAT_ICONS[s.label] ?? <Star size={18} />}
              </div>
              <div>
                <div
                  className="f-display grad-text"
                  style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contribution graph */}
        <div
          className="glass"
          style={{
            ...revealStyle(inView, 0.25),
            padding: 32,
            borderRadius: 14,
            marginBottom: 28,
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              Contribution Activity
            </div>
            <span className="chip chip-green">Last 12 months</span>
          </div>
          <div style={{ minWidth: 600 }}>
            <div style={{ display: "flex", marginBottom: 4, marginLeft: 26 }}>
              {MONTHS.map((m, i) => (
                <div
                  key={i}
                  className="f-mono"
                  style={{ flex: 1, fontSize: 9, color: "var(--text3)" }}
                >
                  {m}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  marginRight: 4,
                }}
              >
                {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                  <div
                    key={i}
                    className="f-mono"
                    style={{ fontSize: 8, color: "var(--text3)", height: 11 }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              {Array.from({ length: 53 }, (_, w) => (
                <div
                  key={w}
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  {Array.from({ length: 7 }, (_, d) => {
                    const v = contrib[w * 7 + d];
                    return (
                      <div
                        key={d}
                        className="contrib-cell"
                        title={`${v} contributions`}
                        style={{
                          background: CONTRIB_COLORS[v],
                          boxShadow:
                            v >= 3 ? "0 0 6px rgba(245,158,11,0.4)" : "none",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 12,
                justifyContent: "flex-end",
              }}
            >
              <span
                className="f-mono"
                style={{ fontSize: 9, color: "var(--text3)" }}
              >
                Less
              </span>
              {CONTRIB_COLORS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    background: c,
                  }}
                />
              ))}
              <span
                className="f-mono"
                style={{ fontSize: 9, color: "var(--text3)" }}
              >
                More
              </span>
            </div>
          </div>
        </div>

        {/* Repo cards */}
        <div
          style={{
            ...revealStyle(inView, 0.4),
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {repos.map((r, i) => (
            <a
              key={i}
              href={`${personal.github}/${r.name}`}
              target="_blank"
              rel="noreferrer"
              className="glass"
              style={{
                padding: 22,
                borderRadius: 12,
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = `${r.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Code size={16} strokeWidth={2.2} />

                <ExternalLink size={12} color="var(--text3)" />
              </div>
              <div>
                <div
                  className="f-mono"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: r.color,
                    marginBottom: 4,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {r.desc}
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: "auto" }}>
                {/* LANGUAGES */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  {r.languages?.slice(0, 2).map((lang, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: "var(--text2)",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: lang.color,
                        }}
                      />
                      {lang.name}
                      <span style={{ color: "var(--text3)" }}>
                        {lang.percent}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* STARS */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "var(--text2)",
                  }}
                >
                  <Star size={10} /> {r.stars}
                </span>

                {/* FORKS */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "var(--text2)",
                  }}
                >
                  <GitBranch size={10} /> {r.forks}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
