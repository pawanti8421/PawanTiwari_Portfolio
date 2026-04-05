import { experiences } from "@/data";
import { useInView } from "@/hooks";
import { revealStyle } from "@/utils";

export default function Experience() {
  const [ref, inView] = useInView(0.15);

  return (
    <section id="experience">
      <div className="section-wrap" ref={ref}>
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            04 / Experience
          </div>
          <h2 className="display-lg">
            Work
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text2)" }}>
              history
            </span>
          </h2>
        </div>

        {experiences.map((exp, ei) => (
          <div
            key={ei}
            style={{
              ...revealStyle(inView, 0.2),
              display: "flex",
              gap: 40,
              alignItems: "flex-start",
            }}
          >
            <div
              className="hide-sm"
              style={{
                position: "relative",
                width: 1,
                alignSelf: "stretch",
                flexShrink: 0,
              }}
            >
              <div className="timeline-line" />
              <div className="timeline-node" style={{ top: 28 }} />
            </div>

            <div
              className="glass"
              style={{
                flex: 1,
                padding: 40,
                borderRadius: 16,
                marginLeft: 24,
                borderLeft: "3px solid rgba(245,158,11,0.3)",
              }}
            >
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
                <div>
                  <h3
                    className="f-display"
                    style={{
                      fontSize: "clamp(20px,2.5vw,28px)",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {exp.role}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--amber)",
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: 6,
                        padding: "4px 14px",
                      }}
                    >
                      {exp.company}
                    </div>
                    <span className="chip chip-green">{exp.type}</span>
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "8px 18px",
                  }}
                >
                  <span
                    className="f-mono"
                    style={{ fontSize: 12, color: "var(--text2)" }}
                  >
                    {exp.period}
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  marginBottom: 24,
                }}
              />
              <p
                style={{
                  color: "var(--text2)",
                  fontSize: 14,
                  lineHeight: 1.85,
                  marginBottom: 28,
                }}
              >
                {exp.description}
              </p>

              <div style={{ marginBottom: 28 }}>
                <div
                  className="label"
                  style={{ marginBottom: 12, fontSize: 10 }}
                >
                  Key Contributions
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 10,
                  }}
                >
                  {exp.highlights.map((h, hi) => (
                    <div
                      key={hi}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        background: "var(--bg2)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--amber)",
                          fontSize: 12,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        ▸
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--text2)",
                          lineHeight: 1.5,
                        }}
                      >
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {exp.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 36,
            marginLeft: 64,
            opacity: inView ? 1 : 0,
            transition: "opacity 1s 0.7s",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(to bottom, var(--amber), transparent)",
            }}
          />
          <span
            className="f-mono"
            style={{ fontSize: 12, color: "var(--text3)" }}
          >
            More experiences incoming...
          </span>
        </div>
      </div>
    </section>
  );
}
