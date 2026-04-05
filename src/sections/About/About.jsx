import { Github, Download, MapPin, Mail, Briefcase, Code2 } from "lucide-react";
import { personal } from "@/data";
import { useInView } from "@/hooks";
import { revealStyle } from "@/utils";
import StatCard from "./StatCard";
import { useState, useEffect } from "react";
import { getStats } from "@/data/personal";

const infoItems = [
  { icon: <MapPin size={14} />, label: "Location", value: personal.location },
  { icon: <Mail size={14} />, label: "Email", value: personal.email },
  { icon: <Briefcase size={14} />, label: "Status", value: "Open to work" },
  { icon: <Code2 size={14} />, label: "Focus", value: "Software Developer" },
];

export default function About() {
  const [ref, inView] = useInView(0.15);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getStats();
      setStats(data);
    }
    load();
  }, []);

  return (
    <section id="about" style={{ background: "var(--bg1)" }}>
      <div className="section-wrap" ref={ref}>
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            01 / About
          </div>
          <h2 className="display-lg">
            The developer
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text2)" }}>
              behind the code
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 56,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div style={revealStyle(inView, 0.1)}>
            <blockquote
              style={{
                borderLeft: "3px solid var(--amber)",
                paddingLeft: 20,
                marginBottom: 32,
              }}
            >
              <p
                className="f-display"
                style={{
                  fontSize: "clamp(17px,2vw,22px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.55,
                }}
              >
                "Clean code is not written by following rules — it's written by
                a craftsman who cares."
              </p>
            </blockquote>
            <p
              style={{
                color: "var(--text2)",
                fontSize: 15,
                lineHeight: 1.9,
                marginBottom: 20,
              }}
            >
              I'm a{" "}
              <strong style={{ color: "var(--text)" }}>
                Software Developer
              </strong>{" "}
              specializing in the MERN stack with a strong foundation in Java
              and Python. I care deeply about code quality, scalable
              architecture, and experiences that feel truly engineered.
            </p>
            <p
              style={{
                color: "var(--text2)",
                fontSize: 15,
                lineHeight: 1.9,
                marginBottom: 32,
              }}
            >
              From building Java desktop tools with JDBC to real-time Socket.IO
              chat platforms, I bring first-principles thinking to every
              problem.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 32,
              }}
            >
              {[
                "Clean Architecture",
                "Problem Solver",
                "Fast Learner",
                "Team Player",
                "Detail-Oriented",
              ].map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="/Pawan_Tiwari.pdf"
                download="Pawan_Tiwari_Resume.pdf"
                className="btn-amber"
              >
                <Download size={14} /> Resume
              </a>
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <Github size={14} /> GitHub
              </a>
            </div>
          </div>

          {/* Right */}
          <div style={revealStyle(inView, 0.25)}>
            <div
              style={{
                position: "relative",
                marginBottom: 32,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(56,189,248,0.08))",
                  border: "1px solid rgba(245,158,11,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -24,
                    borderRadius: "50%",
                    border: "1px dashed rgba(245,158,11,0.15)",
                    animation: "spin-slow 20s linear infinite",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--amber)",
                      boxShadow: "0 0 10px var(--amber)",
                      transform: "translateX(-50%) translateY(-50%)",
                    }}
                  />
                </div>
                <div style={{ fontSize: 72 }}>👨‍💻</div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: "calc(50% - 140px)",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="f-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--emerald)",
                    marginBottom: 3,
                  }}
                >
                  ● AVAILABLE
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  Open to Work
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {infoItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                >
                  <div style={{ color: "var(--amber)", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text3)",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            ...revealStyle(inView, 0.4),
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginTop: 60,
          }}
        >
          {stats.length > 0 ? (
            stats.map((s, i) => <StatCard key={i} stat={s} active={inView} />)
          ) : (
            <p>Loading GitHub data...</p>
          )}
        </div>
      </div>
    </section>
  );
}
