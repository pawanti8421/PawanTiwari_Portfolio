import { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { terminalConfig } from "@/data";
import { useInView } from "@/hooks";

const LINE_COLOR = {
  output: "var(--text2)",
  error: "var(--rose)",
  success: "var(--emerald)",
  highlight: "var(--amber)",
  muted: "var(--text3)",
  "prompt-echo": "var(--text)",
};

const QUICK_CMDS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
  "resume",
  "whoami",
];

export default function Terminal() {
  const [history, setHistory] = useState(terminalConfig.welcome);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const [ref, inView] = useInView(0.1);

  const scrollBottom = useCallback(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      60,
    );
  }, []);

  const run = useCallback(
    (raw) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      if (cmd === "clear") {
        setHistory(terminalConfig.welcome);
        return;
      }
      const echo = { type: "prompt-echo", text: raw };
      const output = terminalConfig.commands[cmd] ?? [
        { type: "error", text: `bash: ${cmd}: command not found` },
        { type: "muted", text: "Type 'help' for available commands." },
      ];
      setHistory((h) => [...h, echo, ...output]);
      setCmdHistory((h) => [raw, ...h]);
      scrollBottom();
    },
    [scrollBottom],
  );

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Enter") {
        run(input);
        setInput("");
        setHistIdx(-1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHistIdx((i) => {
          const ni = Math.min(i + 1, cmdHistory.length - 1);
          setInput(cmdHistory[ni] ?? "");
          return ni;
        });
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHistIdx((i) => {
          const ni = Math.max(i - 1, -1);
          setInput(ni === -1 ? "" : (cmdHistory[ni] ?? ""));
          return ni;
        });
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const match = Object.keys(terminalConfig.commands).find((c) =>
          c.startsWith(input),
        );
        if (match) setInput(match);
      }
    },
    [input, cmdHistory, run],
  );

  return (
    <section id="terminal">
      <div className="section-wrap" ref={ref}>
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            06 / Terminal
          </div>
          <h2 className="display-lg">
            Interactive
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text2)" }}>
              dev terminal
            </span>
          </h2>
          <p
            style={{
              color: "var(--text2)",
              fontSize: 14,
              marginTop: 16,
              maxWidth: 460,
            }}
          >
            Explore my portfolio through a real terminal. Type{" "}
            <code
              style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}
            >
              help
            </code>{" "}
            to get started.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 20,
            opacity: inView ? 1 : 0,
            transition: "all 0.6s 0.1s",
          }}
        >
          {QUICK_CMDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                run(cmd);
                inputRef.current?.focus();
              }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid rgba(16,185,129,0.2)",
                background: "rgba(16,185,129,0.05)",
                color: "var(--emerald)",
                transition: "all 0.2s",
                letterSpacing: "0.06em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16,185,129,0.12)";
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(16,185,129,0.05)";
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)";
              }}
            >
              {cmd}
            </button>
          ))}
        </div>

        <div
          className="terminal-wrap"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(28px)",
            transition: "all 0.7s cubic-bezier(0.4,0,0.2,1) 0.2s",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="terminal-titlebar">
            <div className="term-dot" style={{ background: "#ff5f57" }} />
            <div className="term-dot" style={{ background: "#febc2e" }} />
            <div className="term-dot" style={{ background: "#28c840" }} />
            <div style={{ flex: 1, textAlign: "center" }}>
              <span
                className="f-mono"
                style={{ fontSize: 11, color: "var(--text3)" }}
              >
                pawan@portfolio ~ /dev/terminal
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHistory(terminalConfig.welcome);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text3)",
                padding: 4,
              }}
              aria-label="Reset"
            >
              <X size={13} />
            </button>
          </div>

          <div className="terminal-body">
            {history.map((line, i) => (
              <div
                key={i}
                style={{ color: LINE_COLOR[line.type] ?? "var(--text2)" }}
              >
                {line.type === "prompt-echo" ? (
                  <span>
                    <span style={{ color: "var(--amber)" }}>pawan</span>
                    <span style={{ color: "var(--emerald)" }}>@</span>
                    <span style={{ color: "var(--sky)" }}>portfolio</span>
                    <span style={{ color: "var(--emerald)" }}> $ </span>
                    <span style={{ color: "var(--text)" }}>{line.text}</span>
                  </span>
                ) : (
                  <span style={{ whiteSpace: "pre" }}>{line.text}</span>
                )}
              </div>
            ))}
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 4 }}
            >
              <span style={{ color: "var(--amber)" }}>pawan</span>
              <span style={{ color: "var(--emerald)" }}>@</span>
              <span style={{ color: "var(--sky)" }}>portfolio</span>
              <span style={{ color: "var(--emerald)" }}> $ </span>
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Terminal input"
              />
              {!focused && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: "1em",
                    background: "var(--emerald)",
                    marginLeft: 1,
                    borderRadius: 1,
                    verticalAlign: "text-bottom",
                    animation: "blink 1s step-end infinite",
                  }}
                />
              )}
            </div>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
