import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { scrollToSection } from "@/utils";

const NAV_ITEMS = [
  "About",
  "Education",
  "Skills",
  "Experience",
  "Projects",
  "Terminal",
  "Contact",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [mobileOpen, setMobile] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 80);
      const ids = NAV_ITEMS.map((n) =>
        document.getElementById(n.toLowerCase()),
      ).filter(Boolean);
      for (const el of [...ids].reverse()) {
        if (el.getBoundingClientRect().top <= 120) {
          setActive(el.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const go = (id) => {
    scrollToSection(id);
    setMobile(false);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        padding: "0 32px",
        background: scrolled ? "rgba(8,8,8,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <span
            className="f-display"
            style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em" }}
          >
            <span className="grad-text">Pawan</span>
            <span style={{ color: "var(--text3)", fontStyle: "italic" }}>
              .dev
            </span>
          </span>
        </button>

        <nav
          className="hide-sm"
          style={{ display: "flex", gap: 32, alignItems: "center" }}
        >
          {NAV_ITEMS.map((n) => (
            <button
              key={n}
              className={`nav-pill${active === n.toLowerCase() ? " active" : ""}`}
              onClick={() => go(n.toLowerCase())}
            >
              {n}
            </button>
          ))}
          <button
            className="btn-amber"
            onClick={() =>
              (window.location.href = `mailto:pawantiwari8421@gmail.com?subject=${encodeURIComponent(
                "Opportunity to Work Together",
              )}&body=${encodeURIComponent(
                `Hi Pawan,

I came across your portfolio and would like to discuss a potential opportunity with you.

[Please add details about the role here]

----------------------------------------
📎 You can also attach the job description (JD) if available.
----------------------------------------

Looking forward to connecting.

Best regards,`,
              )}`)
            }
          >
            Hire Me ↗
          </button>
        </nav>

        <button
          className="show-sm btn-ghost"
          style={{ padding: "8px 12px", borderRadius: 8 }}
          onClick={() => setMobile((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            background: "var(--bg1)",
            borderTop: "1px solid var(--border)",
            padding: "20px 20px 28px",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {NAV_ITEMS.map((n) => (
            <button
              key={n}
              onClick={() => go(n.toLowerCase())}
              style={{
                display: "block",
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "13px 0",
                fontFamily: "var(--font-body)",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--text2)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {n}
            </button>
          ))}
          <button
            className="btn-amber"
            style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
          >
            <Download size={14} /> Download Resume
          </button>
        </div>
      )}
    </header>
  );
}
