import { useState } from "react";
import { skills } from "@/data";
import { useInView } from "@/hooks";
import { revealStyle } from "@/utils";
import SkillBar from "./SkillBar";

export default function Skills() {
  const [ref, inView] = useInView(0.08);
  const [active, setActive] = useState(0);

  return (
    <section id="skills" style={{ background: "var(--bg1)" }}>
      <div className="section-wrap" ref={ref}>
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            03 / Skills
          </div>
          <h2 className="display-lg">
            Technical
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text2)" }}>
              expertise
            </span>
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          {skills.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.08em",
                padding: "7px 16px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: active === i ? cat.color : "var(--border)",
                background: active === i ? `${cat.color}15` : "transparent",
                color: active === i ? cat.color : "var(--text2)",
                transition: "all 0.2s",
              }}
            >
              {cat.category.toUpperCase()}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {skills.map((cat, ci) => (
            <div
              key={ci}
              className="glass"
              style={{
                ...revealStyle(inView, ci * 0.08),
                padding: 28,
                borderRadius: 14,
                borderColor: active === ci ? `${cat.color}30` : "var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    flexShrink: 0,
                    background: `${cat.color}12`,
                    border: `1px solid ${cat.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}
                  >
                    {cat.category}
                  </div>
                  <div
                    className="f-mono"
                    style={{ fontSize: 10, color: "var(--text3)" }}
                  >
                    {cat.items.length} technologies
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: cat.color,
                    boxShadow: `0 0 10px ${cat.color}`,
                  }}
                />
              </div>
              {cat.items.map((item, ii) => (
                <SkillBar
                  key={ii}
                  item={item}
                  color={cat.color}
                  inView={inView}
                  delay={200 + ii * 100}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
