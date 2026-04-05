import { Github, Linkedin, Mail } from "lucide-react";
import { personal } from "@/data";

const links = [
  { href: personal.github, icon: <Github size={15} />, label: "GitHub" },
  { href: personal.linkedin, icon: <Linkedin size={15} />, label: "LinkedIn" },
  {
    href: `mailto:${personal.email}`,
    icon: <Mail size={15} />,
    label: "Email",
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg1)",
        padding: "0 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span
            className="f-display"
            style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.04em" }}
          >
            <span className="grad-text">Pawan</span>
            <span style={{ color: "var(--text3)", fontStyle: "italic" }}>
              .dev
            </span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {links.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              style={{
                color: "var(--text3)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--amber)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text3)")
              }
            >
              {s.icon}
            </a>
          ))}
        </div>
        <div className="f-mono" style={{ fontSize: 11, color: "var(--text3)" }}>
          © {new Date().getFullYear()} Pawan Tiwari. Built with React.
        </div>
      </div>
    </footer>
  );
}
