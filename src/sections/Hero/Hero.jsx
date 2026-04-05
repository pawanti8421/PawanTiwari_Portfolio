import { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Terminal as TermIcon,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
} from "lucide-react";
import { personal } from "@/data";
import { useTypewriter } from "@/hooks";
import { scrollToSection } from "@/utils";
import HeroCanvas from "./HeroCanvas";

const WORDS = ["Engineer.", "Builder.", "Innovator.", "Developer."];

const socialLinks = [
  { href: personal.github, icon: <Github size={17} />, label: "GitHub" },
  { href: personal.linkedin, icon: <Linkedin size={17} />, label: "LinkedIn" },
  {
    href: `mailto:${personal.email}`,
    icon: <Mail size={17} />,
    label: "Email",
  },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { displayed } = useTypewriter({ words: WORDS });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const anim = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateY(28px)",
    transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
  });

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HeroCanvas />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(8,8,8,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "28%",
          background: "linear-gradient(to top, var(--bg), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "120px 32px 80px",
          maxWidth: 900,
        }}
      >
        {/* Status badge */}
        <div style={anim(0.1)}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 100,
              padding: "7px 18px",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--emerald)",
                boxShadow: "0 0 8px var(--emerald)",
                flexShrink: 0,
                animation: "orbitPulse 2s ease infinite",
              }}
            />
            <span
              className="f-mono"
              style={{
                fontSize: 11,
                color: "var(--emerald)",
                letterSpacing: "0.1em",
              }}
            >
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>
        </div>

        {/* Name */}
        <div style={anim(0.25)}>
          <h1
            className="display-xl"
            style={{ color: "var(--text)", marginBottom: 4 }}
          >
            Pawan
          </h1>
          <h1 className="display-xl grad-text">Tiwari</h1>
        </div>

        {/* Typewriter */}
        <div
          style={{
            ...anim(0.4),
            marginTop: 28,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="f-mono"
            style={{
              fontSize: "clamp(16px,2.5vw,22px)",
              color: "var(--text2)",
            }}
          >
            {"< "}
          </span>
          <span
            className="f-mono grad-text-cool"
            style={{
              fontSize: "clamp(16px,2.5vw,22px)",
              fontWeight: 600,
              minWidth: 220,
              textAlign: "left",
            }}
          >
            {displayed}
          </span>
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              background: "var(--emerald)",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              animation: "blink 0.9s step-end infinite",
            }}
          />
          <span
            className="f-mono"
            style={{
              fontSize: "clamp(16px,2.5vw,22px)",
              color: "var(--text2)",
            }}
          >
            {" />"}
          </span>
        </div>

        {/* Bio */}
        <p
          style={{
            ...anim(0.5),
            color: "var(--text2)",
            fontSize: "clamp(14px,1.8vw,17px)",
            lineHeight: 1.85,
            maxWidth: 540,
            margin: "0 auto 44px",
          }}
        >
          {personal.bio}
        </p>

        {/* CTAs */}
        <div
          style={{
            ...anim(0.6),
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 52,
          }}
        >
          <button
            className="btn-amber"
            onClick={() => scrollToSection("projects")}
          >
            <Eye size={15} /> View Work
          </button>
          <a
            href="/Pawan_Tiwari.pdf"
            download="Pawan_Tiwari_Resume.pdf"
            className="btn-ghost"
          >
            <Download size={14} /> Resume
          </a>
          <button
            className="btn-ghost"
            onClick={() => scrollToSection("terminal")}
          >
            <TermIcon size={15} /> Terminal
          </button>
        </div>

        {/* Socials */}
        <div
          style={{
            ...anim(0.7),
            display: "flex",
            gap: 14,
            justifyContent: "center",
          }}
        >
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text2)",
                textDecoration: "none",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "var(--amber)";
                el.style.borderColor = "rgba(245,158,11,0.3)";
                el.style.background = "rgba(245,158,11,0.06)";
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "var(--text2)";
                el.style.borderColor = "var(--border)";
                el.style.background = "var(--surface)";
                el.style.transform = "none";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollToSection("about")}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          color: "var(--text3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          animation: "float 2.5s ease-in-out infinite",
        }}
        aria-label="Scroll down"
      >
        <span
          className="f-mono"
          style={{ fontSize: 10, letterSpacing: "0.2em" }}
        >
          SCROLL
        </span>
        <ChevronDown size={16} />
      </button>
    </section>
  );
}
