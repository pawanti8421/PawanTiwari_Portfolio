import { GraduationCap, Calendar, Award } from "lucide-react";
import { education } from "@/data";
import { useInView } from "@/hooks";
import { revealStyle } from "@/utils";

export default function Education() {
  const [ref, inView] = useInView(0.15);
  const edu = education[0];

  return (
    <section id="education">
      <div className="section-wrap" ref={ref}>
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            02 / Education
          </div>
          <h2 className="display-lg">
            Academic
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text2)" }}>
              background
            </span>
          </h2>
        </div>

        <div style={revealStyle(inView, 0.1)}>
          <div
            className="glass"
            style={{
              padding: 40,
              borderRadius: 16,
              borderLeft: "3px solid rgba(245,158,11,0.4)",
              maxWidth: 860,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div
                style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    flexShrink: 0,
                  }}
                >
                  {edu.icon}
                </div>
                <div>
                  <h3
                    className="f-display"
                    style={{
                      fontSize: "clamp(18px,2.5vw,26px)",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    {edu.degree}
                  </h3>
                  <div
                    style={{
                      color: "var(--amber)",
                      fontWeight: 700,
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    {edu.field}
                  </div>
                  <div style={{ color: "var(--text2)", fontSize: 14 }}>
                    {edu.institution}
                  </div>
                </div>
              </div>

              {/* CGPA badge */}
              <div
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: 12,
                  padding: "16px 24px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                    letterSpacing: "0.12em",
                    marginBottom: 6,
                  }}
                >
                  CGPA
                </div>
                <div
                  className="f-display grad-text"
                  style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}
                >
                  {edu.cgpa}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                    marginTop: 4,
                  }}
                >
                  / 10.0
                </div>
              </div>
            </div>

            <div
              style={{
                height: 1,
                background: "var(--border)",
                marginBottom: 24,
              }}
            />

            {/* Period + status */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 16px",
                }}
              >
                <Calendar size={13} color="var(--amber)" />
                <span
                  className="f-mono"
                  style={{ fontSize: 12, color: "var(--text2)" }}
                >
                  {edu.period}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 8,
                  padding: "8px 16px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--emerald)",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="f-mono"
                  style={{ fontSize: 12, color: "var(--emerald)" }}
                >
                  Currently Pursuing
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 16px",
                }}
              >
                <Award size={13} color="var(--amber)" />
                <span
                  className="f-mono"
                  style={{ fontSize: 12, color: "var(--text2)" }}
                >
                  B.Tech · IT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
