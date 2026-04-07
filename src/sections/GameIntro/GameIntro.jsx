import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "@/hooks";

/* ─────────────────────────────────────────
   RESPONSIVE CSS
   Key fix: on mobile force 4:3 canvas area
   so overlays actually have room to breathe
───────────────────────────────────────── */
const GAME_CSS = `
  /* ── Section wrapper ── */
  .game-section { width: 100%; }
  .game-section .section-wrap { padding-bottom: 118px; }

  /* ── Outer window ── */
  .game-window {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(245,158,11,0.15);
    box-shadow: 0 0 60px rgba(245,158,11,0.07), 0 30px 80px rgba(0,0,0,0.7);
  }

  /* ── Titlebar ── */
  .game-titlebar {
    background: #0f0f0f;
    border-bottom: 1px solid rgba(245,158,11,0.1);
    padding: 9px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .game-tb-dots { display: flex; gap: 6px; flex-shrink: 0; }
  .game-tb-dot  { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
  .game-tb-title {
    font-size: 11px; color: var(--text3);
    margin-left: 8px; flex: 1; min-width: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .game-tb-right { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  /* ── Canvas wrapper ── */
  .game-canvas-wrap {
    position: relative;
    line-height: 0;
    /* natural aspect from canvas attrs on desktop */
  }
  .game-canvas {
    display: block;
    width: 100% !important;
    height: auto !important;
  }

  /* ── Overlay: covers canvas, no scroll ── */
  .game-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-family: var(--font-mono);
    z-index: 10;
    overflow: hidden; /* never scroll */
  }

  /* ── Idle ── */
  .game-idle-inner { text-align: center; width: 100%; max-width: 440px; padding: 0 20px; }
  .game-logo { font-size: clamp(30px,7vw,58px); font-weight: 900; letter-spacing: -0.03em; line-height: 1; }
  .game-subtitle { color: var(--emerald); font-size: 10px; letter-spacing: 0.2em; margin: 8px 0 16px; }
  .game-rules { background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.18); border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; text-align: left; }
  .game-rule-row { display: flex; gap: 8px; margin-bottom: 7px; align-items: flex-start; }
  .game-rule-k { color: var(--amber); font-size: 10px; min-width: 76px; flex-shrink: 0; line-height: 1.4; }
  .game-rule-v { color: var(--text2); font-size: 10px; line-height: 1.4; flex: 1; }

  /* ── Reveal ── */
  .game-reveal-inner { width: 90%; max-width: 520px; }
  .game-reveal-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; min-width: 0; }
  .game-reveal-icon { width: 40px; height: 40px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .game-reveal-meta { flex: 1; min-width: 0; }
  .game-reveal-stage-label { font-size: 10px; letter-spacing: 0.12em; margin-bottom: 2px; }
  .game-reveal-title { font-size: clamp(13px,2vw,19px); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .game-reveal-badge { font-size: 10px; padding: 3px 9px; border-radius: 5px; flex-shrink: 0; }
  .game-reveal-body { border-radius: 9px; padding: 12px 14px; }
  .game-reveal-row { display: flex; gap: 10px; margin-bottom: 7px; align-items: flex-start; animation: fadeIn 0.25s ease; }
  .game-reveal-key { font-size: 10px; font-weight: 600; letter-spacing: 0.07em; font-family: monospace; line-height: 1.5; flex-shrink: 0; min-width: 88px; }
  .game-reveal-val { color: var(--text); font-size: 11px; line-height: 1.5; word-break: break-word; flex: 1; }

  /* ── Game Over ── */
  .game-over-inner { text-align: center; width: 90%; max-width: 360px; }
  .game-over-title { font-size: clamp(22px,5vw,42px); font-weight: 900; color: #f43f5e; margin-bottom: 6px; }

  /* ── Complete ── */
  .game-complete-inner { text-align: center; width: 92%; max-width: 500px; }
  .game-complete-title { font-size: clamp(18px,4vw,34px); font-weight: 900; margin-bottom: 8px; }
  .game-contact-box { background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.2); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; text-align: left; }
  .game-contact-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-start; }
  .game-contact-key { color: var(--amber); font-size: 10px; min-width: 72px; flex-shrink: 0; }
  .game-contact-val { color: var(--text); font-size: 10px; word-break: break-all; flex: 1; min-width: 0; line-height: 1.4; }

  /* ── Stage pills ── */
  .game-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
  .game-pill  { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; transition: all 0.4s; }
  .game-pill-label { font-size: 9px; letter-spacing: 0.05em; }

  /* ── Footer ── */
  .game-footer { background: #0a0a0a; border-top: 1px solid rgba(245,158,11,0.08); padding: 7px 14px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

  /* ══════════════════════════════════
     MOBILE — ≤600px
     Force 4:3 canvas area so overlays
     have ~280px height to work with
  ══════════════════════════════════ */
  @media (max-width: 600px) {
    /* Make canvas area taller (4:3 instead of natural 2.5:1) */
    .game-canvas-wrap {
      aspect-ratio: 4 / 3;
      overflow: hidden;
    }
    /* Stretch canvas to fill the taller box */
    .game-canvas {
      width: 100% !important;
      height: 100% !important;  /* fills the 4:3 container */
      object-fit: fill;
    }

    /* Titlebar: hide long label */
    .game-tb-title { display: none; }
    .game-titlebar  { padding: 8px 12px; }

    /* Section: tighter top/bottom spacing */
    .game-section .section-wrap { padding: 48px 14px 36px; }

    /* Pills: smaller */
    .game-pill       { padding: 3px 8px; }
    .game-pill-label { font-size: 8px; }

    /* ── Idle overlay ── */
    .game-idle-inner { padding: 0 12px; }
    .game-logo       { font-size: clamp(26px,8vw,44px); }
    .game-subtitle   { font-size: 9px; margin: 6px 0 12px; }
    .game-rules      { padding: 9px 12px; margin-bottom: 12px; }
    .game-rule-row   { margin-bottom: 5px; }
    .game-rule-k     { font-size: 9px; min-width: 66px; }
    .game-rule-v     { font-size: 9px; }

    /* ── Reveal overlay ── */
    .game-reveal-inner  { width: 94%; }
    .game-reveal-icon   { width: 34px; height: 34px; font-size: 17px; }
    .game-reveal-title  { font-size: 13px; }
    .game-reveal-body   { padding: 9px 12px; }
    .game-reveal-row    { margin-bottom: 5px; gap: 8px; }
    .game-reveal-key    { font-size: 9px; min-width: 72px; }
    .game-reveal-val    { font-size: 10px; }

    /* ── Game over overlay ── */
    .game-over-inner  { width: 94%; }
    .game-over-title  { font-size: clamp(20px,6vw,34px); }

    /* ── Complete overlay ── */
    .game-complete-inner { width: 94%; }
    .game-complete-title { font-size: clamp(16px,5vw,26px); margin-bottom: 6px; }
    .game-contact-box    { padding: 10px 12px; margin-bottom: 10px; }
    .game-contact-key    { font-size: 9px; min-width: 62px; }
    .game-contact-val    { font-size: 9px; }

    /* Footer: tighter */
    .game-footer { padding: 6px 12px; gap: 8px; }
  }

  /* ── Very small phones ≤380px ── */
  @media (max-width: 380px) {
    .game-logo { font-size: 24px; }
    .game-rules { padding: 8px 10px; }
    .game-reveal-key { min-width: 62px; }
    .game-contact-key { min-width: 52px; }
  }
`;

function GameStyles() {
  useEffect(() => {
    const id = "pawan-game-css";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GAME_CSS;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════════════
   STAGES
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
  { key: "GITHUB", val: "github.com/pawanti8421" },
  { key: "LINKEDIN", val: "linkedin.com/in/pawan-umesh-tiwari-a614b3259" },
  { key: "HIRE ME", val: "✅ Open to new opportunities!" },
];

/* ═══════════════════════════════════════
   GAME CONFIG
═══════════════════════════════════════ */
const CW = 860,
  CH = 340;
const GROUND_Y = CH - 65;
const P_X = 100,
  P_W = 26,
  P_H = 30;
const GRAVITY = 0.8;
const JUMP_FORCE = -16;
const INIT_SPEED = 5;
const MAX_SPEED = 9;
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
   CANVAS DRAW FUNCTIONS (unchanged)
═══════════════════════════════════════ */
function drawBg(ctx, g, status) {
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, CW, CH);
  for (let y = 0; y < CH; y += 4) {
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.fillRect(0, y, CW, 1);
  }
  for (const s of g.bgStars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }
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

  const p = g.player;
  const blink = p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0;
  if (!blink) {
    if (!p.dead) {
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = p.jumping ? 22 : 12;
      ctx.fillStyle = "rgba(245,158,11,0.12)";
      ctx.fillRect(P_X - 6, p.y - 6, P_W + 12, P_H + 12);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(P_X, p.y, P_W, P_H);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(P_X, p.y, P_W, 4);
      ctx.fillRect(P_X, p.y, 4, P_H);
      ctx.fillStyle = "#080808";
      ctx.fillRect(P_X + 5, p.y + 8, 5, 5);
      ctx.fillRect(P_X + 16, p.y + 8, 5, 5);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillRect(P_X + 6, p.y + 9, 2, 2);
      ctx.fillRect(P_X + 17, p.y + 9, 2, 2);
      ctx.fillStyle = "#080808";
      ctx.fillRect(P_X + 8, p.y + 20, 10, 3);
      const leg = Math.sin(g.frameCount * 0.28) * 5;
      ctx.fillStyle = "#d97706";
      ctx.fillRect(P_X + 3, p.y + P_H, 7, 7 + leg);
      ctx.fillRect(P_X + P_W - 10, p.y + P_H, 7, 7 - leg);
    } else {
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

  for (const pt of g.particles) {
    ctx.globalAlpha = pt.alpha;
    ctx.fillStyle = pt.color;
    ctx.shadowColor = pt.color;
    ctx.shadowBlur = 5;
    ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;

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
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "9px monospace";
  ctx.fillText(`SPD ×${(g.speed / INIT_SPEED).toFixed(1)}`, CW / 2 - 28, 24);
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

  const jump = useCallback(() => {
    const g = gRef.current;
    if (g.status !== "playing") return;
    if (!g.player.jumping && !g.player.dead && g.player.invincible === 0) {
      g.player.vy = JUMP_FORCE;
      g.player.jumping = true;
      spawnParticles(P_X + P_W / 2, g.player.y + P_H, "#f59e0b", 6);
    }
  }, [spawnParticles]);

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

  const continueGame = useCallback(() => {
    gRef.current.status = "playing";
    setScreen("playing");
    setRevealLines([]);
    setAllRowsShown(false);
  }, []);

  const handleFinalContinue = useCallback(() => setScreen("complete"), []);

  /* Typewriter — stale-closure safe */
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
      if (row && row.key !== undefined)
        setRevealLines((prev) => [...prev, { key: row.key, val: row.val }]);
      idx += 1;
    }, 160);
    return () => clearInterval(iv);
  }, [screen, stageData]);

  /* Input */
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

  /* Game loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const tick = () => {
      const g = gRef.current;
      rafRef.current = requestAnimationFrame(tick);
      if (g.status !== "playing") {
        g.frameCount++;
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
      g.frameCount++;
      g.score += g.speed * 0.05;
      g.speed = Math.min(INIT_SPEED + g.frameCount * 0.0015, MAX_SPEED);
      if (g.frameCount % 6 === 0) setScore(Math.floor(g.score));
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
      for (const s of g.bgStars) {
        s.x -= s.speed * (g.speed / INIT_SPEED);
        if (s.x < 0) {
          s.x = CW;
          s.y = Math.random() * (GROUND_Y - 30);
        }
      }
      for (let i = 0; i < g.groundTiles.length; i++) {
        g.groundTiles[i] -= g.speed;
        if (g.groundTiles[i] < -28) g.groundTiles[i] = CW + 20;
      }
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
      g.player.vy += GRAVITY;
      g.player.y += g.player.vy;
      if (g.player.y >= GROUND_Y - P_H) {
        g.player.y = GROUND_Y - P_H;
        g.player.vy = 0;
        g.player.jumping = false;
      }
      if (g.player.invincible > 0) g.player.invincible--;
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
              g.player.dead = true;
              g.player.vy = -9;
              if (g.score > g.hiScore) g.hiScore = g.score;
              setTimeout(() => {
                g.status = "gameover";
                setScreen("gameover");
              }, 900);
            } else {
              g.player.invincible = 60;
              g.player.vy = -8;
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

  const isLastReveal = stageData?.id === STAGES.length;

  const HeartBar = ({ count, total = MAX_HEARTS }) => (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: 16,
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

  /* Shared overlay bg */
  const solidBg = { background: "rgba(8,8,8,0.92)" };
  const solidBg2 = { background: "rgba(8,8,8,0.95)" };
  const solidBg3 = { background: "rgba(8,8,8,0.97)" };

  return (
    <section id="game" style={{ background: "var(--bg1)" }}>
      <GameStyles />

      <div
        ref={sectionRef}
        className="section-wrap game-section"
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

        {/* Stage pills */}
        <div className="game-pills">
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              className="game-pill"
              style={{
                border: `1px solid ${i < stagesCleared ? s.color : "var(--border)"}`,
                background: i < stagesCleared ? `${s.color}18` : "transparent",
              }}
            >
              <span style={{ fontSize: 10 }}>
                {i < stagesCleared ? "✓" : i === stagesCleared ? "▶" : "○"}
              </span>
              <span
                className="f-mono game-pill-label"
                style={{ color: i < stagesCleared ? s.color : "var(--text3)" }}
              >
                {s.id}. {s.title.split(".")[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Game window */}
        <div className="game-window">
          {/* Titlebar */}
          <div className="game-titlebar">
            <div className="game-tb-dots">
              <div className="game-tb-dot" style={{ background: "#ff5f57" }} />
              <div className="game-tb-dot" style={{ background: "#febc2e" }} />
              <div className="game-tb-dot" style={{ background: "#28c840" }} />
            </div>
            <span className="f-mono game-tb-title">
              PAWAN.RUN — arcade edition
            </span>
            <div className="game-tb-right">
              {screen === "playing" && <HeartBar count={hearts} />}
              <span
                className="f-mono"
                style={{ fontSize: 11, color: "var(--amber)" }}
              >
                {screen === "playing"
                  ? String(score).padStart(5, "0")
                  : `SCORE: ${String(score).padStart(5, "0")}`}
              </span>
            </div>
          </div>

          {/* Canvas + overlays */}
          <div className="game-canvas-wrap">
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              className="game-canvas"
            />

            {/* ── IDLE ── */}
            {screen === "idle" && (
              <div className="game-overlay" style={solidBg}>
                <div className="game-idle-inner">
                  <div>
                    <span className="f-display grad-text game-logo">PAWAN</span>
                    <span
                      className="f-display game-logo"
                      style={{ color: "var(--text3)" }}
                    >
                      .RUN
                    </span>
                  </div>
                  <div className="game-subtitle f-mono">— ARCADE EDITION —</div>
                  <div className="game-rules">
                    {[
                      ["LIVES", "❤️ ❤️ ❤️  Three chances"],
                      ["JUMP", "SPACE · ↑ · Click / Tap"],
                      ["HIT BUG", "Lose ❤️ + brief shield"],
                      ["NO HEARTS", "Game over → restart"],
                      ["WIN", "5 stages → complete!"],
                    ].map(([k, v]) => (
                      <div key={k} className="game-rule-row">
                        <span className="f-mono game-rule-k">{k}</span>
                        <span className="game-rule-v">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn-amber"
                    onClick={startGame}
                    style={{
                      fontSize: 13,
                      padding: "11px 0",
                      borderRadius: 8,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    ▶ START GAME
                  </button>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 10,
                      color: "var(--text3)",
                      animation: "blink 1.2s step-end infinite",
                    }}
                  >
                    PRESS SPACE TO BEGIN
                  </div>
                </div>
              </div>
            )}

            {/* ── REVEAL ── */}
            {screen === "reveal" && stageData != null && (
              <div className="game-overlay" style={solidBg2}>
                <div className="game-reveal-inner">
                  <div className="game-reveal-head">
                    <div
                      className="game-reveal-icon"
                      style={{
                        background: `${stageData.color}18`,
                        border: `1px solid ${stageData.color}40`,
                      }}
                    >
                      {stageData.emoji}
                    </div>
                    <div className="game-reveal-meta">
                      <div
                        className="f-mono game-reveal-stage-label"
                        style={{ color: stageData.color }}
                      >
                        STAGE {stageData.id}/{STAGES.length} CLEARED ✓
                      </div>
                      <div className="f-display game-reveal-title">
                        {stageData.title}
                      </div>
                    </div>
                    <span
                      className="f-mono game-reveal-badge"
                      style={{
                        color: stageData.color,
                        background: `${stageData.color}15`,
                        border: `1px solid ${stageData.color}30`,
                      }}
                    >
                      UNLOCKED
                    </span>
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: `linear-gradient(to right, ${stageData.color}60, transparent)`,
                      marginBottom: 12,
                    }}
                  />

                  <div
                    className="game-reveal-body"
                    style={{
                      background: "#0a0a0a",
                      border: `1px solid ${stageData.color}25`,
                    }}
                  >
                    {revealLines.map((row, i) => (
                      <div key={i} className="game-reveal-row">
                        <span
                          className="game-reveal-key f-mono"
                          style={{ color: stageData.color }}
                        >
                          {row.key}
                        </span>
                        <span className="game-reveal-val">{row.val}</span>
                      </div>
                    ))}
                    {!allRowsShown && (
                      <span
                        style={{
                          color: stageData.color,
                          animation: "blink 0.65s step-end infinite",
                          fontSize: 13,
                        }}
                      >
                        ▋
                      </span>
                    )}
                  </div>

                  {allRowsShown && (
                    <div
                      style={{
                        marginTop: 14,
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
                          padding: "10px 32px",
                          fontSize: 12,
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

            {/* ── GAME OVER ── */}
            {screen === "gameover" && (
              <div className="game-overlay" style={solidBg2}>
                <div className="game-over-inner">
                  <div style={{ fontSize: 46, marginBottom: 40 }}>💥</div>
                  <div className="f-display game-over-title">GAME OVER</div>
                  <div
                    className="f-mono"
                    style={{
                      fontSize: 11,
                      color: "var(--text3)",
                      marginBottom: 20,
                      marginTop: 20,
                    }}
                  >
                    all hearts lost · story reset
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
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
                      marginBottom: 20,
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
                            fontSize: 9,
                            color: "var(--text3)",
                            marginBottom: 20,
                          }}
                        >
                          {l}
                        </div>
                        <div
                          className="f-display"
                          style={{
                            fontSize: 24,
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
                  {stagesCleared > 0 && (
                    <div
                      style={{
                        marginBottom: 12,
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {STAGES.map((s, i) => (
                        <div
                          key={s.id}
                          style={{
                            padding: "2px 8px",
                            borderRadius: 10,
                            fontSize: 9,
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
                      fontSize: 13,
                      padding: "11px 0",
                      borderRadius: 8,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    ↺ TRY AGAIN
                  </button>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 10,
                      color: "var(--text3)",
                      animation: "blink 1.2s step-end infinite",
                    }}
                  >
                    PRESS SPACE TO RETRY
                  </div>
                </div>
              </div>
            )}

            {/* ── COMPLETE ── */}
            {screen === "complete" && (
              <div className="game-overlay" style={solidBg3}>
                <div className="game-complete-inner">
                  <div style={{ fontSize: 40, marginBottom: 40 }}>🏆</div>
                  <div className="f-display game-complete-title">
                    <span className="grad-text">MISSION COMPLETE!</span>
                  </div>
                  <div
                    className="f-mono"
                    style={{
                      fontSize: 10,
                      color: "var(--text2)",
                      marginBottom: 20,
                      marginTop: 30,
                      letterSpacing: "0.1em",
                    }}
                  >
                    YOU KNOW EVERYTHING ABOUT PAWAN 🎉
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      justifyContent: "center",
                      flexWrap: "wrap",
                      marginBottom: 12,
                    }}
                  >
                    {STAGES.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          padding: "3px 9px",
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
                  <div className="game-contact-box">
                    <div
                      className="f-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--amber)",
                        letterSpacing: "0.12em",
                        marginBottom: 20,
                      }}
                    >
                      {">"} CONTACT_INFO.JSON
                    </div>
                    {FINAL_ROWS.map((row) => (
                      <div key={row.key} className="game-contact-row">
                        <span className="f-mono game-contact-key">
                          {row.key}
                        </span>
                        <span className="game-contact-val">{row.val}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      onClick={() =>
                        (window.location.href = `mailto:pawantiwari8421@gmail.com?subject=${encodeURIComponent("Opportunity to Work Together")}&body=${encodeURIComponent("Hi Pawan,\n\nI came across your portfolio and would like to discuss an opportunity.\n\nBest regards,")}`)
                      }
                      className="btn-amber"
                      style={{ fontSize: 12, cursor: "pointer" }}
                    >
                      ✉ Hire Me
                    </a>
                    <button
                      className="btn-ghost"
                      onClick={startGame}
                      style={{ fontSize: 12 }}
                    >
                      ↺ Play Again
                    </button>
                  </div>
                  <div
                    className="f-mono"
                    style={{
                      marginTop: 10,
                      fontSize: 10,
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

          {/* Footer */}
          <div className="game-footer">
            <span
              className="f-mono"
              style={{ fontSize: 10, color: "var(--text3)" }}
            >
              <span style={{ color: "var(--amber)" }}>SPACE / ↑ / TAP</span> =
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
              marginTop: 16,
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
