import { useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { personal } from "@/data";
import { useInView } from "@/hooks";
import { revealStyle } from "@/utils";
import emailjs from "emailjs-com";

const contactItems = [
  {
    icon: <Mail size={16} />,
    label: "Email",
    value: personal.email,
    color: "var(--amber)",
  },
  {
    icon: <Phone size={16} />,
    label: "Phone",
    value: personal.phone,
    color: "var(--sky)",
  },
  {
    icon: <MapPin size={16} />,
    label: "Location",
    value: personal.location,
    color: "var(--emerald)",
  },
];

const socialLinks = [
  { href: personal.github, icon: <Github size={17} />, label: "GitHub" },
  { href: personal.linkedin, icon: <Linkedin size={17} />, label: "LinkedIn" },
  {
    href: `mailto:${personal.email}`,
    icon: <Mail size={17} />,
    label: "Email",
  },
];

export default function Contact() {
  const [ref, inView] = useInView(0.12);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = (e) => {
    e.preventDefault();
    setState("sending");

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          time: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setState("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setState("idle"), 4000);
      })
      .catch(() => {
        setState("error");
      });
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "13px 16px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(245,158,11,0.4)";
    e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.07)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  return (
    <section id="contact">
      <div className="section-wrap" ref={ref}>
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            10 / Contact
          </div>
          <h2 className="display-lg">
            Let's build
            <br />
            <span className="grad-text">something great</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div style={revealStyle(inView, 0.1)}>
            <p
              style={{
                color: "var(--text2)",
                fontSize: 15,
                lineHeight: 1.85,
                marginBottom: 36,
              }}
            >
              Have a project in mind? Need a developer for your team? Or just
              want to talk tech? Drop me a message — I read every one.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 40,
              }}
            >
              {contactItems.map((c, i) => (
                <div
                  key={i}
                  className="glass"
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    borderRadius: 10,
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9,
                      flexShrink: 0,
                      background: "rgba(245,158,11,0.08)",
                      border: "1px solid rgba(245,158,11,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: c.color,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text3)",
                        fontWeight: 600,
                        marginBottom: 3,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {c.label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
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
                    background: "var(--bg2)",
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
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.color = "var(--text2)";
                    el.style.borderColor = "var(--border)";
                    el.style.background = "var(--bg2)";
                    el.style.transform = "none";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            className="glass"
            style={{
              ...revealStyle(inView, 0.25),
              padding: 36,
              borderRadius: 16,
            }}
          >
            {state === "sent" ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                <h3
                  className="f-display"
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--emerald)",
                    marginBottom: 8,
                  }}
                >
                  Message received!
                </h3>
                <p style={{ color: "var(--text2)", fontSize: 14 }}>
                  I'll reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  className="f-display"
                  style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}
                >
                  Send a message
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  {[
                    {
                      key: "name",
                      label: "Name",
                      placeholder: "Your name",
                      type: "text",
                    },
                    {
                      key: "email",
                      label: "Email",
                      placeholder: "your@email.com",
                      type: "email",
                    },
                  ].map((f) => (
                    <div key={f.key}>
                      <label
                        style={{
                          fontSize: 11,
                          color: "var(--text2)",
                          display: "block",
                          marginBottom: 7,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {f.label.toUpperCase()}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        style={inputStyle}
                        value={form[f.key]}
                        onChange={(e) =>
                          setForm({ ...form, [f.key]: e.target.value })
                        }
                        onFocus={onFocus}
                        onBlur={onBlur}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label
                    style={{
                      fontSize: 11,
                      color: "var(--text2)",
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    MESSAGE
                  </label>
                  <textarea
                    placeholder="Tell me about your project or idea..."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: 120,
                      lineHeight: 1.7,
                    }}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-amber"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: 14,
                    fontSize: 14,
                    opacity: state === "sending" ? 0.7 : 1,
                  }}
                >
                  {state === "sending" ? (
                    <>
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid rgba(0,0,0,0.4)",
                          borderTop: "2px solid #000",
                          borderRadius: "50%",
                          animation: "spin-slow 0.7s linear infinite",
                        }}
                      />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={15} /> Send Message
                    </>
                  )}
                </button>
                <p
                  style={{
                    textAlign: "center",
                    marginTop: 12,
                    fontSize: 11,
                    color: "var(--text3)",
                  }}
                >
                  Powered by EmailJS · Responds within 24h
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
