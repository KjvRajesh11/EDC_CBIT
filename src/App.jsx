
import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   GLOBAL STYLES  (injected once into <head>)
───────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --black: #000000; --white: #ffffff;
  --off-white: #f0ede8; --dim: rgba(255,255,255,0.08); --line: rgba(255,255,255,0.12);
}
html { scroll-behavior: smooth; }
body { background:#000; color:#fff; font-family:'Barlow',sans-serif; overflow-x:hidden; cursor:none; }

/* CURSOR */
.edc-cursor { position:fixed; width:10px; height:10px; background:#fff; border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:width .15s,height .15s; mix-blend-mode:difference; }
.edc-cursor.big { width:40px; height:40px; }
.edc-cursor-ring { position:fixed; width:36px; height:36px; border:1px solid rgba(255,255,255,0.4); border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:width .35s cubic-bezier(.23,1,.32,1),height .35s,opacity .2s; }

/* NAV */
.edc-nav { position:fixed; top:0; left:0; right:0; z-index:200; display:flex; align-items:center; justify-content:space-between; padding:20px 40px; border-bottom:1px solid var(--line); background:rgba(0,0,0,0.85); backdrop-filter:blur(12px); }
.edc-nav-logo { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:18px; letter-spacing:0.15em; text-transform:uppercase; }
.edc-nav-links { display:flex; gap:32px; list-style:none; }
.edc-nav-links a { font-family:'Barlow Condensed',sans-serif; font-size:13px; letter-spacing:0.2em; text-transform:uppercase; text-decoration:none; color:rgba(255,255,255,0.55); transition:color .2s; cursor:none; }
.edc-nav-links a:hover, .edc-nav-links a.active { color:#fff; }
.edc-nav-links a.active { border-bottom:1px solid #fff; padding-bottom:2px; }
.edc-nav-btn { font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:600; letter-spacing:0.25em; text-transform:uppercase; padding:10px 22px; border:1.5px solid #fff; background:#fff; color:#000; cursor:none; transition:background .2s,color .2s; }
.edc-nav-btn:hover { background:transparent; color:#fff; }

/* HERO */
.edc-hero { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 40px 100px; position:relative; overflow:hidden; }
.edc-hero-pill { display:inline-flex; align-items:center; gap:8px; border:1.5px solid rgba(255,255,255,0.25); border-radius:100px; padding:7px 18px; font-family:'Barlow Condensed',sans-serif; font-size:11px; letter-spacing:0.35em; text-transform:uppercase; color:rgba(255,255,255,0.6); margin-bottom:36px; opacity:0; animation:fadeUp .7s .2s ease forwards; }
.edc-hero-pill-dot { width:6px; height:6px; background:#fff; border-radius:50%; animation:pulse 2s infinite; }
.edc-hero-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(80px,14vw,192px); line-height:0.87; letter-spacing:0.01em; margin-bottom:0; }
.edc-hero-title-line { display:block; overflow:hidden; }
.edc-hero-title-word { display:inline-block; transform:translateY(110%); animation:wordRise .9s cubic-bezier(.77,0,.175,1) forwards; }
.edc-hero-title-line:nth-child(1) .edc-hero-title-word { animation-delay:.4s; }
.edc-hero-title-line:nth-child(2) .edc-hero-title-word { animation-delay:.58s; }
.edc-hero-sub { font-size:clamp(13px,1.4vw,16px); font-weight:300; color:rgba(255,255,255,0.42); letter-spacing:0.03em; line-height:1.7; margin-top:32px; margin-bottom:44px; opacity:0; animation:fadeUp .8s .85s ease forwards; }
.edc-hero-btns { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; opacity:0; animation:fadeUp .8s 1s ease forwards; }
.edc-btn-outline { font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; padding:14px 28px; border:1.5px solid rgba(255,255,255,0.7); color:#fff; background:transparent; cursor:none; display:flex; align-items:center; gap:10px; position:relative; overflow:hidden; transition:color .25s; }
.edc-btn-outline::after { content:''; position:absolute; inset:0; background:#fff; transform:translateX(-101%); transition:transform .32s cubic-bezier(.77,0,.175,1); z-index:-1; }
.edc-btn-outline:hover::after { transform:translateX(0); }
.edc-btn-outline:hover { color:#000; }
.edc-btn-filled { font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; padding:14px 28px; background:#fff; color:#000; border:1.5px solid #fff; cursor:none; position:relative; overflow:hidden; }
.edc-btn-filled::after { content:''; position:absolute; inset:0; background:#000; transform:translateX(-101%); transition:transform .32s cubic-bezier(.77,0,.175,1); z-index:0; }
.edc-btn-filled span { position:relative; z-index:1; }
.edc-btn-filled:hover::after { transform:translateX(0); }
.edc-btn-filled:hover { color:#fff; }
.edc-scroll-hint { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:14px; font-family:'Barlow Condensed',sans-serif; font-size:9px; letter-spacing:0.55em; text-transform:uppercase; color:rgba(255,255,255,0.2); opacity:0; animation:fadeUp .8s 1.3s ease forwards; white-space:nowrap; }
.edc-scroll-hint::before, .edc-scroll-hint::after { content:''; width:44px; height:1px; background:rgba(255,255,255,0.15); }

/* REVEAL */
.edc-reveal { opacity:0; transform:translateY(36px); transition:opacity .8s cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1); }
.edc-reveal.in-view { opacity:1; transform:translateY(0); }
.edc-reveal-d1 { transition-delay:.1s; }
.edc-reveal-d2 { transition-delay:.2s; }
.edc-reveal-d3 { transition-delay:.3s; }

/* MARQUEE */
.edc-marquee-wrap { overflow:hidden; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:16px 0; }
.edc-marquee-track { display:flex; animation:marquee 22s linear infinite; white-space:nowrap; }
.edc-marquee-item { font-family:'Bebas Neue',sans-serif; font-size:clamp(18px,2.5vw,28px); letter-spacing:0.2em; padding:0 40px; color:rgba(255,255,255,0.2); flex-shrink:0; }
.edc-marquee-item span { color:rgba(255,255,255,0.6); margin-right:40px; }

/* STATS */
.edc-stats-strip { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid var(--line); border-bottom:1px solid var(--line); margin:80px 60px; }
.edc-stat-item { padding:40px 30px; border-right:1px solid var(--line); }
.edc-stat-item:last-child { border-right:none; }
.edc-stat-num { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,6vw,80px); line-height:1; letter-spacing:0.02em; }
.edc-stat-label { font-family:'Barlow Condensed',sans-serif; font-size:11px; letter-spacing:0.35em; text-transform:uppercase; color:rgba(255,255,255,0.35); margin-top:6px; }

/* SECTION HEADER */
.edc-section-header { display:flex; align-items:baseline; justify-content:space-between; padding:60px 60px 0; margin-bottom:60px; }
.edc-section-tag { font-family:'Barlow Condensed',sans-serif; font-size:11px; letter-spacing:0.4em; text-transform:uppercase; color:rgba(255,255,255,0.35); display:flex; align-items:center; gap:12px; }
.edc-section-tag::before { content:''; width:30px; height:1px; background:rgba(255,255,255,0.35); }
.edc-section-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(42px,7vw,96px); line-height:1; letter-spacing:0.02em; }

/* CENTER REVEAL */
.edc-center-reveal { position:fixed; inset:0; pointer-events:none; z-index:150; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.edc-center-reveal-name { font-family:'Bebas Neue',sans-serif; font-size:clamp(70px,12vw,180px); letter-spacing:0.04em; color:#fff; line-height:0.9; opacity:0; transform:translateY(14px) scale(0.96); transition:opacity .22s ease,transform .3s cubic-bezier(.23,1,.32,1); text-align:center; }
.edc-center-reveal-role { font-family:'Barlow Condensed',sans-serif; font-size:clamp(11px,1.4vw,16px); letter-spacing:0.5em; text-transform:uppercase; color:rgba(255,255,255,0.5); opacity:0; transform:translateY(8px); transition:opacity .22s ease .06s,transform .3s cubic-bezier(.23,1,.32,1) .06s; margin-top:10px; }
.edc-center-reveal.visible .edc-center-reveal-name,
.edc-center-reveal.visible .edc-center-reveal-role { opacity:1; transform:translateY(0) scale(1); }

/* TEAM */
.edc-team-section { padding:0 0 120px; position:relative; }
.edc-leadership-row { display:grid; gap:2px; padding:0 60px; margin-bottom:2px; }
.edc-core-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; padding:0 60px; margin-bottom:2px; }
.edc-members-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:2px; padding:0 60px; }

/* ROW LABELS */
.edc-row-label { font-family:'Barlow Condensed',sans-serif; font-size:18px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.85); padding:0 60px; margin-bottom:10px; margin-top:48px; display:flex; align-items:center; gap:16px; }
.edc-row-label::after { content:''; flex:1; height:1px; background:var(--line); }

/* MEMBER CARD */
.edc-member-card { position:relative; overflow:hidden; cursor:none; background:#111; }
.edc-member-card.large { aspect-ratio:3/4; }
.edc-member-card.medium { aspect-ratio:4/5; }
.edc-member-card.small { aspect-ratio:1/1; }
.edc-member-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:clamp(28px,4vw,60px); letter-spacing:0.05em; color:rgba(255,255,255,0.15); background:linear-gradient(160deg,#1a1a1a 0%,#0a0a0a 100%); transition:transform .5s cubic-bezier(.23,1,.32,1); user-select:none; }
.edc-member-card:hover .edc-member-placeholder { transform:scale(1.04); }
.edc-member-label { position:absolute; bottom:0; left:0; right:0; padding:20px 16px 14px; background:linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%); transform:translateY(100%); transition:transform .3s cubic-bezier(.23,1,.32,1); }
.edc-member-card:hover .edc-member-label { transform:translateY(0); }
.edc-member-label-name { font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; }
.edc-member-label-role { font-family:'Barlow Condensed',sans-serif; font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-top:2px; }
.edc-corner-tl, .edc-corner-tr, .edc-corner-bl, .edc-corner-br-el { position:absolute; width:0; height:0; border-color:#fff; border-style:solid; z-index:5; transition:width .25s,height .25s,opacity .2s; opacity:0; }
.edc-corner-tl { top:8px; left:8px; border-width:1.5px 0 0 1.5px; }
.edc-corner-tr { top:8px; right:8px; border-width:1.5px 1.5px 0 0; }
.edc-corner-bl { bottom:8px; left:8px; border-width:0 0 1.5px 1.5px; }
.edc-corner-br-el { bottom:8px; right:8px; border-width:0 1.5px 1.5px 0; }
.edc-member-card:hover .edc-corner-tl,
.edc-member-card:hover .edc-corner-tr,
.edc-member-card:hover .edc-corner-bl,
.edc-member-card:hover .edc-corner-br-el { width:18px; height:18px; opacity:1; }
.edc-team-section.any-hovered .edc-member-card:not(:hover) .edc-member-placeholder { filter:grayscale(100%) brightness(0.3); }

/* FOOTER */
.edc-footer { border-top:1px solid var(--line); padding:60px 60px 40px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:40px; }
.edc-footer-brand { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:700; letter-spacing:0.12em; margin-bottom:12px; }
.edc-footer-tagline { font-size:13px; color:rgba(255,255,255,0.35); line-height:1.6; }
.edc-footer-copy { font-size:11px; color:rgba(255,255,255,0.2); letter-spacing:0.1em; margin-top:20px; }
.edc-footer-col-title { font-family:'Barlow Condensed',sans-serif; font-size:11px; letter-spacing:0.4em; text-transform:uppercase; color:rgba(255,255,255,0.35); margin-bottom:20px; }
.edc-footer-links { list-style:none; }
.edc-footer-links li { font-family:'Barlow Condensed',sans-serif; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-bottom:10px; cursor:none; transition:color .2s; }
.edc-footer-links li:hover { color:#fff; }
.edc-footer-icons { display:flex; gap:12px; margin-top:16px; }
.edc-footer-icon { width:34px; height:34px; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:14px; color:rgba(255,255,255,0.4); cursor:none; transition:border-color .2s,color .2s; }
.edc-footer-icon:hover { border-color:#fff; color:#fff; }

/* KEYFRAMES */
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes wordRise { to { transform:translateY(0); } }
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.6); } }
@keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }

/* RESPONSIVE */
@media (max-width:900px) {
  .edc-nav { padding:16px 20px; }
  .edc-nav-links { display:none; }
  .edc-hero { padding:100px 24px 80px; }
  .edc-section-header { padding:40px 24px 0; }
  .edc-leadership-row { padding:0 24px; }
  .edc-core-grid { grid-template-columns:repeat(2,1fr); padding:0 24px; }
  .edc-members-grid { grid-template-columns:repeat(3,1fr); padding:0 24px; }
  .edc-stats-strip { grid-template-columns:repeat(2,1fr); margin:60px 24px; }
  .edc-stat-item:nth-child(2) { border-right:none; }
  .edc-row-label { padding:0 24px; }
  .edc-footer { grid-template-columns:1fr; padding:40px 24px; }
}
@media (max-width:600px) {
  .edc-hero-title { font-size:clamp(56px,17vw,96px); }
  .edc-core-grid { grid-template-columns:repeat(2,1fr); }
  .edc-members-grid { grid-template-columns:repeat(2,1fr); }
  .edc-stats-strip { grid-template-columns:1fr 1fr; margin:40px 16px; }
  .edc-leadership-row,.edc-core-grid,.edc-members-grid { padding:0 16px; }
  .edc-row-label { padding:0 16px; font-size:14px; }
  .edc-hero-btns { flex-direction:column; align-items:center; width:100%; }
  .edc-btn-outline,.edc-btn-filled { width:100%; justify-content:center; }
  .edc-nav-btn { display:none; }
}
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const LEADERSHIP = [
  { name: "Arjun Reddy", role: "President", initials: "AR" },
  { name: "Priya Sharma", role: "President", initials: "PS" },
  { name: "Karan Mehta", role: "Vice President", initials: "KM" },
  { name: "Ananya Singh", role: "Vice President", initials: "AS" },
];
const CORE = [
  { name: "Rohit Verma", role: "Head of Events", initials: "RV" },
  { name: "Divya Nair", role: "Head of Marketing", initials: "DN" },
  { name: "Aditya Rao", role: "Head of Design", initials: "AR" },
  { name: "Meera Joshi", role: "Head of Tech", initials: "MJ" },
  { name: "Siddharth K", role: "Head of Operations", initials: "SK" },
  { name: "Lakshmi Devi", role: "Head of Finance", initials: "LD" },
  { name: "Vikram Chand", role: "Lead — Outreach", initials: "VC" },
  { name: "Sneha Pillai", role: "Lead — Content", initials: "SP" },
];
const MEMBERS = [
  { name: "Rahul T", role: "Events", initials: "RT" },
  { name: "Nisha M", role: "Design", initials: "NM" },
  { name: "Kabir S", role: "Tech", initials: "KS" },
  { name: "Pooja R", role: "Marketing", initials: "PR" },
  { name: "Dev Anand", role: "Finance", initials: "DA" },
  { name: "Tanvi G", role: "Content", initials: "TG" },
  { name: "Aman K", role: "Outreach", initials: "AK" },
  { name: "Riya P", role: "Events", initials: "RP" },
  { name: "Saurav B", role: "Tech", initials: "SB" },
  { name: "Kritika L", role: "Design", initials: "KL" },
  { name: "Yash J", role: "Marketing", initials: "YJ" },
  { name: "Preethi C", role: "Finance", initials: "PC" },
];
const NAV_LINKS = ["Home", "About", "Initiatives", "Events", "Team", "Resources"];
const MARQUEE_WORDS = ["INNOVATE", "BUILD", "LEAD", "CREATE", "DISRUPT", "HUSTLE", "LAUNCH", "SCALE", "INSPIRE", "EXECUTE"];
const STATS = [
  { num: "120+", label: "Active Members" },
  { num: "34", label: "Events Hosted" },
  { num: "12", label: "Core Leaders" },
  { num: "2019", label: "Founded" },
];

/* ─────────────────────────────────────────
   HOOK — custom cursor
───────────────────────────────────────── */
function useCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const rxRef = useRef(window.innerWidth / 2);
  const ryRef = useRef(window.innerHeight / 2);
  const mxRef = useRef(window.innerWidth / 2);
  const myRef = useRef(window.innerHeight / 2);

  useEffect(() => {
    const onMove = (e) => {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", onMove);
    let raf;
    const animate = () => {
      rxRef.current += (mxRef.current - rxRef.current) * 0.12;
      ryRef.current += (myRef.current - ryRef.current) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rxRef.current + "px";
        ringRef.current.style.top = ryRef.current + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return { cursorRef, ringRef };
}

/* ─────────────────────────────────────────
   HOOK — IntersectionObserver reveal
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".edc-reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   COMPONENT — Cursor
───────────────────────────────────────── */
function Cursor({ cursorRef, ringRef }) {
  return (
    <>
      <div className="edc-cursor" ref={cursorRef} />
      <div className="edc-cursor-ring" ref={ringRef} />
    </>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Navbar
───────────────────────────────────────── */
function Navbar() {
  const [active, setActive] = useState("Team");
  return (
    <nav className="edc-nav">
      <div className="edc-nav-logo">EDC CBIT</div>
      <ul className="edc-nav-links">
        {NAV_LINKS.map((l) => (
          <li key={l}>
            <a
              href={l === "Team" ? "#team" : "#"}
              className={active === l ? "active" : ""}
              onClick={() => setActive(l)}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
      <button className="edc-nav-btn">Join Us</button>
    </nav>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Hero
───────────────────────────────────────── */
function Hero() {
  return (
    <section className="edc-hero" id="hero">
      <div className="edc-hero-pill">
        <span className="edc-hero-pill-dot" />
        The Minimalist Edition
      </div>

      <h1 className="edc-hero-title">
        <span className="edc-hero-title-line">
          <span className="edc-hero-title-word">MEET THE</span>
        </span>
        <span className="edc-hero-title-line">
          <span className="edc-hero-title-word">CORE TEAM.</span>
        </span>
      </h1>

      <p className="edc-hero-sub">
        Entrepreneurship Development Cell | CBIT<br />
        — The minds building from Campus to Unicorn.
      </p>

      <div className="edc-hero-btns">
        <button className="edc-btn-outline">EXPLORE EVENTS &nbsp;→</button>
        <button className="edc-btn-filled"><span>JOIN THE CORE</span></button>
      </div>

      <div className="edc-scroll-hint">SCROLL TO DISCOVER</div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Marquee
───────────────────────────────────────── */
function Marquee() {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="edc-marquee-wrap">
      <div className="edc-marquee-track">
        {items.map((w, i) => (
          <span className="edc-marquee-item" key={i}>
            {i % 3 === 0 ? <span>{w}</span> : w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Stats Strip
───────────────────────────────────────── */
function StatsStrip() {
  return (
    <div className="edc-stats-strip edc-reveal">
      {STATS.map((s, i) => (
        <div className={`edc-stat-item edc-reveal edc-reveal-d${Math.min(i + 1, 3)}`} key={s.label}>
          <div className="edc-stat-num">{s.num}</div>
          <div className="edc-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Center Name Reveal
───────────────────────────────────────── */
function CenterReveal({ name, role, visible }) {
  return (
    <div className={`edc-center-reveal${visible ? " visible" : ""}`}>
      <div className="edc-center-reveal-name">{name}</div>
      <div className="edc-center-reveal-role">{role}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Member Card
───────────────────────────────────────── */
function MemberCard({ person, size, onEnter, onLeave }) {
  return (
    <div
      className={`edc-member-card ${size}`}
      onMouseEnter={() => onEnter(person)}
      onMouseLeave={onLeave}
    >
      <div className="edc-member-placeholder">{person.initials}</div>
      <div className="edc-member-label">
        <div className="edc-member-label-name">{person.name}</div>
        <div className="edc-member-label-role">{person.role}</div>
      </div>
      <div className="edc-corner-tl" />
      <div className="edc-corner-tr" />
      <div className="edc-corner-bl" />
      <div className="edc-corner-br-el" />
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Team Section
───────────────────────────────────────── */
function TeamSection({ onEnter, onLeave, anyHovered }) {
  return (
    <section
      className={`edc-team-section${anyHovered ? " any-hovered" : ""}`}
      id="team"
    >
      <div className="edc-section-header edc-reveal">
        <span className="edc-section-tag">Core Leadership</span>
        <h2 className="edc-section-title">THE CORE.</h2>
      </div>

      {/* Presidents & VPs */}
      <div className="edc-row-label edc-reveal">Presidents &amp; Vice Presidents</div>
      <div
        className="edc-leadership-row edc-reveal edc-reveal-d1"
        style={{ gridTemplateColumns: `repeat(${LEADERSHIP.length}, 1fr)` }}
      >
        {LEADERSHIP.map((p) => (
          <MemberCard key={p.name} person={p} size="large" onEnter={onEnter} onLeave={onLeave} />
        ))}
      </div>

      {/* Directors & Leads */}
      <div className="edc-row-label edc-reveal">Directors &amp; Leads</div>
      <div className="edc-core-grid edc-reveal edc-reveal-d1">
        {CORE.map((p) => (
          <MemberCard key={p.name} person={p} size="medium" onEnter={onEnter} onLeave={onLeave} />
        ))}
      </div>

      {/* Core Members */}
      <div className="edc-row-label edc-reveal">Core Members</div>
      <div className="edc-members-grid edc-reveal edc-reveal-d1">
        {MEMBERS.map((p) => (
          <MemberCard key={p.name} person={p} size="small" onEnter={onEnter} onLeave={onLeave} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT — Footer
───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="edc-footer">
      <div>
        <div className="edc-footer-brand">EDC CBIT</div>
        <p className="edc-footer-tagline">
          Entrepreneurship Development Cell<br />
          Chaitanya Bharathi Institute of Technology
        </p>
        <p className="edc-footer-copy">© 2024 EDC CBIT. THE MINIMALIST EDITION.</p>
      </div>
      <div>
        <div className="edc-footer-col-title">Legal</div>
        <ul className="edc-footer-links">
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
        </ul>
      </div>
      <div>
        <div className="edc-footer-col-title">Connect</div>
        <ul className="edc-footer-links">
          <li>Contact Us</li>
          <li>Instagram</li>
          <li>LinkedIn</li>
        </ul>
        <div className="edc-footer-icons">
          <div className="edc-footer-icon">🌐</div>
          <div className="edc-footer-icon">@</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   ROOT COMPONENT — App
───────────────────────────────────────── */
export default function App() {
  const { cursorRef, ringRef } = useCursor();
  useReveal();

  const [reveal, setReveal] = useState({ name: "", role: "", visible: false });
  const [anyHovered, setAnyHovered] = useState(false);

  const handleEnter = useCallback((person) => {
    setReveal({ name: person.name.toUpperCase(), role: person.role.toUpperCase(), visible: true });
    setAnyHovered(true);
    if (cursorRef.current) cursorRef.current.classList.add("big");
    if (ringRef.current) ringRef.current.style.opacity = "0";
  }, [cursorRef, ringRef]);

  const handleLeave = useCallback(() => {
    setReveal((r) => ({ ...r, visible: false }));
    setAnyHovered(false);
    if (cursorRef.current) cursorRef.current.classList.remove("big");
    if (ringRef.current) ringRef.current.style.opacity = "1";
  }, [cursorRef, ringRef]);

  // Inject global CSS once
  useEffect(() => {
    const id = "edc-global-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = GLOBAL_CSS;
      document.head.appendChild(tag);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <>
      <Cursor cursorRef={cursorRef} ringRef={ringRef} />
      <CenterReveal name={reveal.name} role={reveal.role} visible={reveal.visible} />
      <Navbar />
      <Hero />
      <Marquee />
      <StatsStrip />
      <TeamSection onEnter={handleEnter} onLeave={handleLeave} anyHovered={anyHovered} />
      <Footer />
    </>
  );
}
