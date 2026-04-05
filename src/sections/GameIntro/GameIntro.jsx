import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "@/hooks";

/* ═══════════════════════════════════════
   STAGES — lower score targets, fast unlock
═══════════════════════════════════════ */
const STAGES = [
  {
    id: 1,
    scoreTarget: 60,
    title: "PLAYER_PROFILE",
    color: "#f59e0b",
    emoji: "👤",
    rows: [
      { key: "NAME", val: "Pawan Tiwari" },
      { key: "ROLE", val: "Software Developer" },
      { key: "STACK", val: "MERN · Java · Python" },
      { key: "LOCATION", val: "India 🇮🇳" },
      { key: "STATUS", val: "Open to work ✅" },
    ],
  },
  {
    id: 2,
    scoreTarget: 180,
    title: "EDUCATION",
    color: "#38bdf8",
    emoji: "🎓",
    rows: [
      { key: "DEGREE", val: "B.Tech — Information Technology" },
      { key: "COLLEGE", val: "Shah & Anchor Kutchhi Engg. College, Mumbai" },
      { key: "BATCH", val: "2022 – 2026" },
      { key: "CGPA", val: "8.49 / 10.0 ⭐" },
    ],
  },
  {
    id: 3,
    scoreTarget: 380,
    title: "SKILLS",
    color: "#10b981",
    emoji: "⚙️",
    rows: [
      { key: "LANGUAGES", val: "JavaScript · Java · Python" },
      { key: "FRONTEND", val: "React · HTML5 · CSS3" },
      { key: "BACKEND", val: "Node.js · Express · Django" },
      { key: "DATABASE", val: "MongoDB · SQL" },
    ],
  },
  {
    id: 4,
    scoreTarget: 650,
    title: "EXPERIENCE",
    color: "#a78bfa",
    emoji: "💼",
    rows: [
      { key: "ROLE", val: "Java Developer Intern" },
      { key: "COMPANY", val: "Mindstein" },
      { key: "PERIOD", val: "Aug 2024 – Nov 2024" },
      { key: "BUILT", val: "Java Swing App + JDBC + SQL opt." },
    ],
  },
  {
    id: 5,
    scoreTarget: 1000,
    title: "PROJECTS",
    color: "#f43f5e",
    emoji: "🚀",
    rows: [
      { key: "01", val: "Real-Time Chat App (MERN + Socket.IO)" },
      { key: "02", val: "Dental Clinic Management (Django + SQLite)" },
      { key: "03", val: "Weather Dashboard (JS + OpenWeather)" },
    ],
  },
];

const FINAL_ROWS = [
  { key: "EMAIL", val: "pawantiwari8421@gmail.com" },
  { key: "GITHUB", val: "https://github.com/pawanti8421" },
  {
    key: "LINKEDIN",
    val: "https://www.linkedin.com/in/pawan-umesh-tiwari-a614b3259",
  },
  { key: "HIRE ME", val: "✅ Open to new opportunities!" },
];

/* ═══════════════════════════════════════
   GAME CONFIG — faster base speed
═══════════════════════════════════════ */
const CW = 860,
  CH = 340;
const GROUND_Y = CH - 65;
const P_X = 100,
  P_W = 26,
  P_H = 30;
const GRAVITY = 0.8;
const JUMP_FORCE = -16;
const INIT_SPEED = 5; // ← faster start
const MAX_SPEED = 9; // ← higher ceiling
const MAX_HEARTS = 3;

const OBS_DEFS = [
  { w: 20, h: 48, label: "{}", color: "#f43f5e" },
  { w: 34, h: 34, label: "()", color: "#38bdf8" },
  { w: 22, h: 62, label: "=>", color: "#a78bfa" },
  { w: 38, h: 28, label: "[]", color: "#10b981" },
  { w: 24, h: 54, label: ";;", color: "#f97316" },
  { w: 18, h: 70, label: "///", color: "#fb7185" },
];

function mkGame(hi = 0) {
  return {
    status: "idle",
    player: {
      y: GROUND_Y - P_H,
      vy: 0,
      jumping: false,
      dead: false,
      invincible: 0,
    },
    obstacles: [],
    particles: [],
    bgStars: Array.from({ length: 55 }, () => ({
      x: Math.random() * CW,
      y: Math.random() * (GROUND_Y - 30),
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.4 + 0.15,
    })),
    groundTiles: Array.from({ length: 32 }, (_, i) => i * 28),
    score: 0,
    hiScore: hi,
    speed: INIT_SPEED,
    nextStageIdx: 0,
    frameCount: 0,
    spawnIn: 65,
    shake: 0,
    deathFlash: 0,
    hearts: MAX_HEARTS,
  };
}

/* ═══════════════════════════════════════
   CANVAS — only draws the game world
   Overlays are pure HTML on top
═══════════════════════════════════════ */
function drawBg(ctx, g, status) {
  // Clear
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, CW, CH);

  // Scanlines
  for (let y = 0; y < CH; y += 4) {
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.fillRect(0, y, CW, 1);
  }

  // Stars
  for (const s of g.bgStars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }

  // Grid
  if (status === "playing") {
    ctx.strokeStyle = "rgba(245,158,11,0.04)";
    ctx.lineWidth = 1;
    for (let x = (g.frameCount * 0.6) % 60; x < CW; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GROUND_Y);
      ctx.stroke();
    }
  }

  // Ground
  const grd = ctx.createLinearGradient(0, GROUND_Y, 0, CH);
  grd.addColorStop(0, "rgba(245,158,11,0.4)");
  grd.addColorStop(0.06, "rgba(245,158,11,0.1)");
  grd.addColorStop(1, "rgba(245,158,11,0.02)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);
  ctx.fillStyle = "rgba(245,158,11,0.65)";
  ctx.fillRect(0, GROUND_Y, CW, 2);
  ctx.fillStyle = "rgba(245,158,11,0.1)";
  for (const tx of g.groundTiles) ctx.fillRect(tx, GROUND_Y + 4, 22, 4);
}

function drawGame(ctx, g) {
  const sx = g.shake > 0 ? (Math.random() - 0.5) * g.shake * 4 : 0;
  const sy = g.shake > 0 ? (Math.random() - 0.5) * g.shake * 2 : 0;
  ctx.save();
  ctx.translate(sx, sy);

  drawBg(ctx, g, "playing");

  // Obstacles
  for (const obs of g.obstacles) {
    ctx.shadowColor = obs.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = obs.color + "28";
    ctx.fillRect(obs.x - 4, GROUND_Y - obs.h - 4, obs.w + 8, obs.h + 8);
    ctx.shadowBlur = 0;
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, GROUND_Y - obs.h, obs.w, obs.h);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(obs.x, GROUND_Y - obs.h, obs.w, 3);
    ctx.fillRect(obs.x, GROUND_Y - obs.h, 3, obs.h);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.fillText(obs.label, obs.x + obs.w / 2, GROUND_Y - obs.h / 2 + 3);
  }
  ctx.textAlign = "left";

  // Player — blink when invincible
  const p = g.player;
  const blink = p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0;

  if (!blink) {
    if (!p.dead) {
      // Glow
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = p.jumping ? 22 : 12;
      ctx.fillStyle = "rgba(245,158,11,0.12)";
      ctx.fillRect(P_X - 6, p.y - 6, P_W + 12, P_H + 12);
      ctx.shadowBlur = 0;

      // Body
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(P_X, p.y, P_W, P_H);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(P_X, p.y, P_W, 4);
      ctx.fillRect(P_X, p.y, 4, P_H);

      // Face
      ctx.fillStyle = "#080808";
      ctx.fillRect(P_X + 5, p.y + 8, 5, 5);
      ctx.fillRect(P_X + 16, p.y + 8, 5, 5);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillRect(P_X + 6, p.y + 9, 2, 2);
      ctx.fillRect(P_X + 17, p.y + 9, 2, 2);
      ctx.fillStyle = "#080808";
      ctx.fillRect(P_X + 8, p.y + 20, 10, 3);

      // Legs
      const leg = Math.sin(g.frameCount * 0.28) * 5;
      ctx.fillStyle = "#d97706";
      ctx.fillRect(P_X + 3, p.y + P_H, 7, 7 + leg);
      ctx.fillRect(P_X + P_W - 10, p.y + P_H, 7, 7 - leg);
    } else {
      // Dead X
      ctx.fillStyle = "rgba(244,63,94,0.25)";
      ctx.fillRect(P_X - 4, p.y - 4, P_W + 8, P_H + 8);
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#f43f5e";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(P_X + 4, p.y + 4);
      ctx.lineTo(P_X + P_W - 4, p.y + P_H - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(P_X + P_W - 4, p.y + 4);
      ctx.lineTo(P_X + 4, p.y + P_H - 4);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
    }
  }

  // Particles
  for (const pt of g.particles) {
    ctx.globalAlpha = pt.alpha;
    ctx.fillStyle = pt.color;
    ctx.shadowColor = pt.color;
    ctx.shadowBlur = 5;
    ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;

  // HUD — score
  ctx.fillStyle = "rgba(245,158,11,0.9)";
  ctx.font = "bold 13px monospace";
  ctx.fillText(
    `SCORE  ${String(Math.floor(g.score)).padStart(5, "0")}`,
    14,
    26,
  );
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "10px monospace";
  ctx.fillText(
    `BEST  ${String(Math.floor(g.hiScore)).padStart(5, "0")}`,
    14,
    42,
  );

  // HUD — stage bar
  const stage = STAGES[g.nextStageIdx];
  if (stage) {
    const barW = 200,
      barX = CW - barW - 14;
    const prev =
      g.nextStageIdx === 0 ? 0 : STAGES[g.nextStageIdx - 1].scoreTarget;
    const pct = Math.min((g.score - prev) / (stage.scoreTarget - prev), 1);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(barX, 14, barW, 7);
    const gb = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    gb.addColorStop(0, stage.color);
    gb.addColorStop(1, stage.color + "aa");
    ctx.fillStyle = gb;
    ctx.shadowColor = stage.color;
    ctx.shadowBlur = 7;
    ctx.fillRect(barX, 14, barW * pct, 7);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stage.color;
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    ctx.fillText(stage.title, CW - 14, 38);
    ctx.textAlign = "left";
  }

  // HUD — speed
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "9px monospace";
  ctx.fillText(`SPD ×${(g.speed / INIT_SPEED).toFixed(1)}`, CW / 2 - 28, 24);

  // Death flash
  if (g.deathFlash > 0) {
    ctx.fillStyle = `rgba(244,63,94,${g.deathFlash * 0.28})`;
    ctx.fillRect(0, 0, CW, CH);
  }

  ctx.restore();
}

/* ═══════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */
export default function GameIntro() {
  const [sectionRef, inView] = useInView(0.1);
  const canvasRef = useRef(null);
  const gRef = useRef(mkGame());
  const rafRef = useRef(null);

  const [screen, setScreen] = useState("idle");
  const [stageData, setStageData] = useState(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [stagesCleared, setStagesCleared] = useState(0);
  const [revealLines, setRevealLines] = useState([]);
  const [allRowsShown, setAllRowsShown] = useState(false);

  /* ── Particles ── */
  const spawnParticles = useCallback((x, y, color, count = 10) => {
    for (let i = 0; i < count; i++) {
      gRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.9) * 8,
        size: Math.random() * 5 + 2,
        alpha: 1,
        color,
        decay: Math.random() * 0.04 + 0.03,
      });
    }
  }, []);

  /* ── Jump ── */
  const jump = useCallback(() => {
    const g = gRef.current;
    if (g.status !== "playing") return;
    if (!g.player.jumping && !g.player.dead && g.player.invincible === 0) {
      g.player.vy = JUMP_FORCE;
      g.player.jumping = true;
      spawnParticles(P_X + P_W / 2, g.player.y + P_H, "#f59e0b", 6);
    }
  }, [spawnParticles]);

  /* ── Start ── */
  const startGame = useCallback(() => {
    const hi = gRef.current.hiScore;
    const g = mkGame(hi);
    g.status = "playing";
    gRef.current = g;
    setScreen("playing");
    setScore(0);
    setHearts(MAX_HEARTS);
    setStagesCleared(0);
    setStageData(null);
    setRevealLines([]);
    setAllRowsShown(false);
  }, []);

  /* ── Continue after reveal ── */
  const continueGame = useCallback(() => {
    gRef.current.status = "playing";
    setScreen("playing");
    setRevealLines([]);
    setAllRowsShown(false);
  }, []);

  const handleFinalContinue = useCallback(() => setScreen("complete"), []);

  /* ── Typewriter — fixed stale-closure ── */
  useEffect(() => {
    if (screen !== "reveal" || !stageData) return;
    const rows = stageData.rows;
    if (!Array.isArray(rows) || rows.length === 0) return;
    setRevealLines([]);
    setAllRowsShown(false);
    let idx = 0;
    const iv = setInterval(() => {
      const cur = idx;
      if (cur >= rows.length) {
        clearInterval(iv);
        setAllRowsShown(true);
        return;
      }
      const row = rows[cur];
      if (row && row.key !== undefined) {
        setRevealLines((prev) => [...prev, { key: row.key, val: row.val }]);
      }
      idx += 1;
    }, 160);
    return () => clearInterval(iv);
  }, [screen, stageData]);

  /* ── Input ── */
  useEffect(() => {
    const handle = () => {
      if (screen === "idle" || screen === "gameover") {
        startGame();
        return;
      }
      if (screen === "reveal" && allRowsShown) {
        continueGame();
        return;
      }
      if (screen === "playing") jump();
    };
    const onKey = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handle();
      }
    };
    window.addEventListener("keydown", onKey);
    canvasRef.current?.addEventListener("click", handle);
    return () => {
      window.removeEventListener("keydown", onKey);
      canvasRef.current?.removeEventListener("click", handle);
    };
  }, [screen, allRowsShown, jump, startGame, continueGame]);

  /* ── Canvas draw — idle shows static bg only, no player overlap ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const tick = () => {
      const g = gRef.current;
      rafRef.current = requestAnimationFrame(tick);

      // Non-playing: draw static background only — keeps canvas alive but clean
      if (g.status !== "playing") {
        g.frameCount++;
        // Scroll stars slowly for atmosphere
        for (const s of g.bgStars) {
          s.x -= s.speed * 0.3;
          if (s.x < 0) {
            s.x = CW;
            s.y = Math.random() * (GROUND_Y - 30);
          }
        }
        drawBg(ctx, g, "idle");
        return;
      }

      // Playing — full game render
      g.frameCount++;
      g.score += g.speed * 0.05; // ← faster score accumulation
      g.speed = Math.min(INIT_SPEED + g.frameCount * 0.0015, MAX_SPEED);
      if (g.frameCount % 6 === 0) setScore(Math.floor(g.score));

      // Stage unlock
      const nextStage = STAGES[g.nextStageIdx];
      if (nextStage && g.score >= nextStage.scoreTarget) {
        g.status = "reveal";
        g.nextStageIdx++;
        setStagesCleared(g.nextStageIdx);
        setStageData({ ...nextStage });
        setScreen("reveal");
        drawGame(ctx, g);
        return;
      }

      // Parallax stars
      for (const s of g.bgStars) {
        s.x -= s.speed * (g.speed / INIT_SPEED);
        if (s.x < 0) {
          s.x = CW;
          s.y = Math.random() * (GROUND_Y - 30);
        }
      }

      // Ground tiles
      for (let i = 0; i < g.groundTiles.length; i++) {
        g.groundTiles[i] -= g.speed;
        if (g.groundTiles[i] < -28) g.groundTiles[i] = CW + 20;
      }

      // Spawn
      g.spawnIn--;
      if (g.spawnIn <= 0) {
        const def = OBS_DEFS[Math.floor(Math.random() * OBS_DEFS.length)];
        g.obstacles.push({ x: CW + 10, ...def });
        const minGap = Math.max(50, 90 - g.speed * 2);
        const maxGap = Math.max(80, 140 - g.speed * 2);
        g.spawnIn = Math.floor(Math.random() * (maxGap - minGap) + minGap);
      }
      for (const o of g.obstacles) o.x -= g.speed;
      g.obstacles = g.obstacles.filter((o) => o.x + o.w > -20);

      // Physics
      g.player.vy += GRAVITY;
      g.player.y += g.player.vy;
      if (g.player.y >= GROUND_Y - P_H) {
        g.player.y = GROUND_Y - P_H;
        g.player.vy = 0;
        g.player.jumping = false;
      }

      // Invincibility cooldown
      if (g.player.invincible > 0) g.player.invincible--;

      // Collision — 3-heart system
      if (!g.player.dead && g.player.invincible === 0) {
        for (const obs of g.obstacles) {
          const ox = obs.x,
            oy = GROUND_Y - obs.h;
          const px = P_X + 5,
            py = g.player.y + 5;
          if (
            px < ox + obs.w - 5 &&
            px + P_W - 10 > ox &&
            py < oy + obs.h &&
            py + P_H - 10 > oy
          ) {
            g.hearts--;
            setHearts(g.hearts);
            spawnParticles(
              P_X + P_W / 2,
              g.player.y + P_H / 2,
              g.hearts > 0 ? "#f59e0b" : "#f43f5e",
              14,
            );
            g.shake = 5;
            g.deathFlash = 1;

            if (g.hearts <= 0) {
              // Game over
              g.player.dead = true;
              g.player.vy = -9;
              if (g.score > g.hiScore) g.hiScore = g.score;
              setTimeout(() => {
                g.status = "gameover";
                setScreen("gameover");
              }, 900);
            } else {
              // Lost a heart — brief invincibility + knockback
              g.player.invincible = 60; // 1 second of invincibility
              g.player.vy = -8;
              // Push obstacle away to avoid instant double-hit
              obs.x = CW + 40;
            }
            break;
          }
        }
      }

      if (g.shake > 0) g.shake *= 0.8;
      if (g.deathFlash > 0) g.deathFlash *= 0.83;
      for (const pt of g.particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.28;
        pt.alpha -= pt.decay;
      }
      g.particles = g.particles.filter((p) => p.alpha > 0);

      drawGame(ctx, g);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnParticles]);

  /* ── Overlay base style ── */
  const overlay = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-mono)",
    zIndex: 10,
  };

  const isLastReveal = stageData?.id === STAGES.length;

  /* ── Heart renderer ── */
  const HeartBar = ({ count, total = MAX_HEARTS }) => (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: 18,
            filter: i < count ? "none" : "grayscale(1) opacity(0.25)",
            transition: "filter 0.3s",
            display: "inline-block",
            transform: i < count ? "scale(1)" : "scale(0.8)",
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );

  return (
    <section id="game" style={{ background: "var(--bg1)" }}>
      <div
        ref={sectionRef}
        className="section-wrap"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(32px)",
          transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div className="section-header">
          <div className="label" style={{ marginBottom: 14 }}>
            07 / Game
          </div>
          <h2 className="display-lg">
            Play to
            <br />
            <span className="grad-text">know me</span>
          </h2>
          <p
            style={{
              color: "var(--text2)",
              fontSize: 14,
              marginTop: 16,
              maxWidth: 480,
            }}
          >
            Jump over code obstacles to unlock Pawan's story. You have{" "}
            <span style={{ color: "#f43f5e" }}>3 lives</span> — use them wisely.{" "}
            <span style={{ color: "var(--amber)" }}>Space / ↑ / Tap</span> to
            jump.
          </p>
        </div>

        {/* Stage progress pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 20,
                border: `1px solid ${i < stagesCleared ? s.color : "var(--border)"}`,
                background: i < stagesCleared ? `${s.color}18` : "transparent",
                transition: "all 0.4s",
              }}
            >
              <span style={{ fontSize: 11 }}>
                {i < stagesCleared ? "✓" : i === stagesCleared ? "▶" : "○"}
              </span>
              <span
                className="f-mono"
                style={{
                  fontSize: 10,
                  color: i < stagesCleared ? s.color : "var(--text3)",
                  letterSpacing: "0.06em",
                }}
              >
                {s.id}. {s.title.split(".")[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Game window */}
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(245,158,11,0.15)",
            boxShadow:
              "0 0 60px rgba(245,158,11,0.07), 0 30px 80px rgba(0,0,0,0.7)",
          }}
        >
          {/* Titlebar */}
          <div
            style={{
              background: "#0f0f0f",
              borderBottom: "1px solid rgba(245,158,11,0.1)",
              padding: "9px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#ff5f57",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#febc2e",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#28c840",
              }}
            />
            <span
              className="f-mono"
              style={{ fontSize: 11, color: "var(--text3)", marginLeft: 8 }}
            >
              PAWAN.RUN — arcade edition
            </span>

            {/* Live hearts in titlebar during game */}
            {screen === "playing" && (
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <HeartBar count={hearts} />
                <span
                  className="f-mono"
                  style={{ fontSize: 11, color: "var(--amber)" }}
                >
                  {String(score).padStart(5, "0")}
                </span>
              </div>
            )}
            {screen !== "playing" && (
              <span
                className="f-mono"
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  color: "var(--amber)",
                }}
              >
                SCORE: {String(score).padStart(5, "0")}
              </span>
            )}
          </div>

          {/* Canvas area */}
          <div style={{ position: "relative", lineHeight: 0 }}>
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              style={{
                display: "block",
                width: "100%",

                height: "auto",
              }}
            />

            {/* ── IDLE overlay — solid bg so canvas doesn't bleed through ── */}
            {screen === "idle" && (
              <div style={{ ...overlay, background: "rgba(8,8,8,0.92)" }}>
                <div
                  style={{
                    textAlign: "center",
                    maxWidth: 440,
                    padding: "0 24px",
                  }}
                >
                  {/* Logo */}
                  <div style={{ marginBottom: 4 }}>
                    <span
                      className="f-display grad-text"
                      style={{
                        fontSize: "clamp(36px,6vw,60px)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      PAWAN
                    </span>
                    <span
                      className="f-display"
                      style={{
                        fontSize: "clamp(36px,6vw,60px)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        color: "var(--text3)",
                      }}
                    >
                      .RUN
                    </span>
                  </div>
                  <div
                    style={{
                      color: "var(--emerald)",
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      marginBottom: 28,
                      marginTop: 20,
                    }}
                  >
                    — ARCADE EDITION —
                  </div>

                  {/* Rules table */}
                  <div
                    style={{
                      background: "rgba(245,158,11,0.05)",
                      border: "1px solid rgba(245,158,11,0.18)",
                      borderRadius: 12,
                      padding: "16px 20px",
                      marginBottom: 28,
                      textAlign: "left",
                      gridTemplateColumns: "120px 1fr",
                    }}
                  >
                    {[
                      ["LIVES", "❤️ ❤️ ❤️  Three chances"],
                      ["JUMP", "SPACE · ↑ · Click"],
                      ["HIT BUG", "Lose ❤️ + invincibility flash"],
                      ["NO HEARTS", "Game over — restart from zero"],
                      ["WIN", "5 stages cleared → complete!"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          gap: 5,
                          marginBottom: 20,
                          fontSize: 12,
                        }}
                      >
                        <span
                          style={{
                            color: "var(--amber)",
                            minWidth: 82,
                            flexShrink: 0,
                          }}
                        >
                          {k}
                        </span>
                        <span style={{ color: "var(--text2)" }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-amber"
                    onClick={startGame}
                    style={{
                      fontSize: 14,
                      padding: "13px 44px",
                      borderRadius: 8,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    ▶ START GAME
                  </button>
                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 11,
                      color: "var(--text3)",
                      animation: "blink 1.2s step-end infinite",
                    }}
                  >
                    PRESS SPACE TO BEGIN
                  </div>
                </div>
              </div>
            )}

            {/* ── STAGE REVEAL — solid bg ── */}
            {screen === "reveal" && stageData != null && (
              <div style={{ ...overlay, background: "rgba(8,8,8,0.95)" }}>
                <div style={{ width: "88%", maxWidth: 520 }}>
                  {/* Stage badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: `${stageData.color}18`,
                        border: `1px solid ${stageData.color}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {stageData.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        className="f-mono"
                        style={{
                          fontSize: 10,
                          color: stageData.color,
                          letterSpacing: "0.14em",
                          marginBottom: 3,
                        }}
                      >
                        STAGE {stageData.id}/{STAGES.length} CLEARED ✓
                      </div>
                      <div
                        className="f-display"
                        style={{
                          fontSize: "clamp(15px,2vw,20px)",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {stageData.title}
                      </div>
                    </div>
                    <span
                      className="f-mono"
                      style={{
                        fontSize: 11,
                        color: stageData.color,
                        background: `${stageData.color}15`,
                        border: `1px solid ${stageData.color}30`,
                        padding: "4px 10px",
                        borderRadius: 6,
                        flexShrink: 0,
                      }}
                    >
                      UNLOCKED
                    </span>
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: `linear-gradient(to right, ${stageData.color}60, transparent)`,
                      marginBottom: 16,
                    }}
                  />

                  {/* Typewriter output */}
                  <div
                    style={{
                      background: "#0a0a0a",
                      border: `1px solid ${stageData.color}25`,
                      borderRadius: 10,
                      padding: "16px 20px",
                      minHeight: 100,
                    }}
                  >
                    {revealLines.map((row, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 14,
                          marginBottom: 5,
                          alignItems: "flex-start", // ✅ fixes overlap for multiline
                          animation: "fadeIn 0.25s ease",
                        }}
                      >
                        {/* KEY */}
                        <span
                          style={{
                            color: stageData.color,
                            minWidth: 120, // ✅ fixed alignment width
                            flexShrink: 0, // ✅ prevents collapsing
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            fontFamily: "monospace",
                            lineHeight: "15px",
                          }}
                        >
                          {row.key}
                        </span>

                        {/* VALUE */}
                        <span
                          style={{
                            color: "var(--text)",
                            fontSize: 12,
                            lineHeight: "15px", // ✅ proper vertical spacing
                            wordBreak: "break-word", // ✅ prevents overflow
                            whiteSpace: "normal", // ✅ allows wrapping
                            flex: 1, // ✅ takes remaining space
                          }}
                        >
                          {row.val}
                        </span>
                      </div>
                    ))}

                    {/* CURSOR */}
                    {!allRowsShown && (
                      <span
                        style={{
                          color: stageData.color,
                          animation: "blink 0.7s step-end infinite",
                          fontSize: 14,
                        }}
                      >
                        ▋
                      </span>
                    )}
                  </div>

                  {allRowsShown && (
                    <div
                      style={{
                        marginTop: 18,
                        display: "flex",
                        justifyContent: "center",
                        animation: "fadeIn 0.4s ease",
                      }}
                    >
                      <button
                        className="btn-amber"
                        onClick={
                          isLastReveal ? handleFinalContinue : continueGame
                        }
                        style={{
                          padding: "11px 36px",
                          fontSize: 13,
                          borderRadius: 8,
                        }}
                      >
                        {isLastReveal
                          ? "🏆 CLAIM VICTORY"
                          : "▶ CONTINUE  [SPACE]"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── GAME OVER — solid bg ── */}
            {screen === "gameover" && (
              <div style={{ ...overlay, background: "rgba(8,8,8,0.95)" }}>
                <div style={{ textAlign: "center", maxWidth: 380 }}>
                  <div style={{ fontSize: 56, marginBottom: 8 }}>💥</div>
                  <div
                    className="f-display"
                    style={{
                      fontSize: "clamp(28px,5vw,44px)",
                      fontWeight: 900,
                      color: "#f43f5e",
                      marginBottom: 6,
                      marginTop: 50,
                    }}
                  >
                    GAME OVER
                  </div>
                  <div
                    className="f-mono"
                    style={{
                      fontSize: 12,
                      color: "var(--text3)",
                      marginBottom: 20,
                      marginTop: 30,
                    }}
                  >
                    all hearts lost · story reset to zero
                  </div>

                  {/* Dead hearts */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      marginBottom: 20,
                    }}
                  >
                    <HeartBar count={0} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 28,
                      marginBottom: 24,
                    }}
                  >
                    {[
                      ["SCORE", Math.floor(gRef.current.score)],
                      ["BEST", Math.floor(gRef.current.hiScore)],
                    ].map(([l, v]) => (
                      <div key={l} style={{ textAlign: "center" }}>
                        <div
                          className="f-mono"
                          style={{
                            fontSize: 10,
                            color: "var(--text3)",
                            marginBottom: 20,
                          }}
                        >
                          {l}
                        </div>
                        <div
                          className="f-display"
                          style={{
                            fontSize: 26,
                            fontWeight: 900,
                            color:
                              l === "BEST" ? "var(--amber)" : "var(--text)",
                          }}
                        >
                          {String(v).padStart(5, "0")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cleared stages recap */}
                  {stagesCleared > 0 && (
                    <div
                      style={{
                        marginBottom: 20,
                        display: "flex",
                        gap: 7,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {STAGES.map((s, i) => (
                        <div
                          key={s.id}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 12,
                            fontSize: 10,
                            fontFamily: "var(--font-mono)",
                            background:
                              i < stagesCleared
                                ? `${s.color}18`
                                : "rgba(255,255,255,0.04)",
                            border: `1px solid ${i < stagesCleared ? s.color : "var(--border)"}`,
                            color: i < stagesCleared ? s.color : "var(--text3)",
                          }}
                        >
                          {i < stagesCleared ? `✓ ${s.emoji}` : `○ ${s.id}`}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn-amber"
                    onClick={startGame}
                    style={{
                      fontSize: 14,
                      padding: "12px 40px",
                      borderRadius: 8,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    ↺ TRY AGAIN
                  </button>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 11,
                      color: "var(--text3)",
                      animation: "blink 1.2s step-end infinite",
                    }}
                  >
                    PRESS SPACE TO RETRY
                  </div>
                </div>
              </div>
            )}

            {/* ── COMPLETE — solid bg ── */}
            {screen === "complete" && (
              <div
                style={{
                  ...overlay,
                  background: "rgba(8,8,8,0.97)",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    width: "90%",
                    maxWidth: 500,
                    padding: "16px 0",
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
                  <div
                    className="f-display"
                    style={{
                      fontSize: "clamp(22px,4vw,36px)",
                      fontWeight: 900,
                      marginBottom: 25,
                      marginTop: 54,
                    }}
                  >
                    <span className="grad-text">MISSION COMPLETE!</span>
                  </div>
                  <div
                    className="f-mono"
                    style={{
                      fontSize: 11,
                      color: "var(--text2)",
                      marginBottom: 20,
                      letterSpacing: "0.1em",
                    }}
                  >
                    YOU KNOW EVERYTHING ABOUT PAWAN 🎉
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      justifyContent: "center",
                      flexWrap: "wrap",
                      marginBottom: 20,
                    }}
                  >
                    {STAGES.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          background: `${s.color}18`,
                          border: `1px solid ${s.color}40`,
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          color: s.color,
                        }}
                      >
                        {s.emoji} {s.title.split(".")[0]}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      background: "rgba(245,158,11,0.05)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: 12,
                      padding: "18px 22px",
                      marginBottom: 20,
                      textAlign: "left",
                    }}
                  >
                    <div
                      className="f-mono"
                      style={{
                        fontSize: 10,
                        color: "var(--amber)",
                        letterSpacing: "0.14em",
                        marginBottom: 15,
                      }}
                    >
                      {">"} CONTACT_INFO.JSON
                    </div>
                    {FINAL_ROWS.map((row) => (
                      <div
                        key={row.key}
                        style={{
                          display: "flex",
                          gap: 12,
                          marginBottom: 14,
                          fontSize: 12,
                          lineHeight: "12px",
                        }}
                      >
                        <span
                          className="f-mono"
                          style={{
                            color: "var(--amber)",
                            minWidth: 82,
                            flexShrink: 0,
                          }}
                        >
                          {row.key}
                        </span>
                        <span style={{ color: "var(--text)" }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <a
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
                      className="btn-amber"
                      style={{ fontSize: 13 }}
                    >
                      ✉ Hire Me
                    </a>
                    <button
                      className="btn-ghost"
                      onClick={startGame}
                      style={{ fontSize: 13 }}
                    >
                      ↺ Play Again
                    </button>
                  </div>
                  <div
                    className="f-mono"
                    style={{
                      marginTop: 14,
                      fontSize: 11,
                      color: "var(--text3)",
                    }}
                  >
                    FINAL SCORE:{" "}
                    <span style={{ color: "var(--amber)" }}>
                      {String(Math.floor(gRef.current.score)).padStart(5, "0")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer bar */}
          <div
            style={{
              background: "#0a0a0a",
              borderTop: "1px solid rgba(245,158,11,0.08)",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span
              className="f-mono"
              style={{ fontSize: 10, color: "var(--text3)" }}
            >
              <span style={{ color: "var(--amber)" }}>SPACE / ↑ / CLICK</span> =
              jump
            </span>
            <span
              className="f-mono"
              style={{ fontSize: 10, color: "var(--text3)" }}
            >
              {stagesCleared}/{STAGES.length} stages
            </span>
            {screen === "playing" && (
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <HeartBar count={hearts} />
              </div>
            )}
            {stagesCleared > 0 && screen !== "playing" && (
              <span
                className="f-mono"
                style={{
                  fontSize: 10,
                  color: "var(--emerald)",
                  marginLeft: "auto",
                }}
              >
                ✓{" "}
                {STAGES.slice(0, stagesCleared)
                  .map((s) => s.emoji)
                  .join(" ")}
              </span>
            )}
          </div>
        </div>

        {screen === "playing" && (
          <p
            className="f-mono"
            style={{
              textAlign: "center",
              marginTop: 18,
              fontSize: 11,
              color: "var(--text3)",
              animation: "fadeIn 0.6s ease",
            }}
          >
            keep running to reveal more about Pawan →
          </p>
        )}
      </div>
    </section>
  );
}
