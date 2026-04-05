import { Download, Eye } from "lucide-react";
import { personal } from "@/data";
import { useInView } from "@/hooks";
import { revealStyle } from "@/utils";

const RESUME_SECTIONS = [
  { title: "Experience", items: ["Java Developer Intern @ Mindstein (2024)"] },
  { title: "Education", items: ["B.Tech / B.E. — Information Technology"] },
  { title: "Projects", items: ["Chat App", "Dental CMS", "Weather Dashboard"] },
  {
    title: "Skills",
    items: ["JavaScript · React · Node.js · Sql · MongoDB · Java · Python"],
  },
];

export default function Resume() {
  const [ref, inView] = useInView(0.15);

  return (
    <section id="resume" style={{ background: "var(--bg1)" }}>
      <div className="section-wrap" ref={ref}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div style={revealStyle(inView, 0.1)}>
            <div className="label" style={{ marginBottom: 14 }}>
              09 / Resume
            </div>
            <h2 className="display-lg" style={{ marginBottom: 20 }}>
              My full
              <br />
              <span className="grad-text">résumé</span>
            </h2>
            <p
              style={{
                color: "var(--text2)",
                fontSize: 15,
                lineHeight: 1.85,
                marginBottom: 32,
              }}
            >
              A detailed breakdown of my skills, experience, education, and
              projects — formatted for recruiters and engineering teams.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="/Pawan_Tiwari.pdf"
                download="Pawan_Tiwari_Resume.pdf"
                className="btn-amber"
              >
                <Download size={14} /> Resume
              </a>
              <a
                href="/Pawan_Tiwari.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <Eye size={15} /> Preview
              </a>
            </div>
          </div>

          <div
            className="glass"
            style={{
              ...revealStyle(inView, 0.25),
              padding: 32,
              borderRadius: 16,
              borderColor: "rgba(245,158,11,0.15)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background:
                  "linear-gradient(90deg, var(--amber), var(--emerald))",
              }}
            />
            <div
              style={{
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                className="f-display"
                style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}
              >
                Pawan Tiwari
              </div>
              <div
                style={{
                  color: "var(--amber)",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                Software Developer · MERN Stack
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[personal.email, personal.location].map((v) => (
                  <span key={v} style={{ fontSize: 11, color: "var(--text2)" }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
            {RESUME_SECTIONS.map((s) => (
              <div key={s.title} style={{ marginBottom: 16 }}>
                <div
                  className="f-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--amber)",
                    letterSpacing: "0.12em",
                    marginBottom: 8,
                  }}
                >
                  {s.title.toUpperCase()}
                </div>
                {s.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      fontSize: 12,
                      color: "var(--text2)",
                      paddingLeft: 12,
                      borderLeft: "2px solid var(--border)",
                      marginBottom: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
