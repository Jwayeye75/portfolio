import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #00e5ff;
    --green2: #00c853;
    --dark: #080c10;
    --dark2: #0d1117;
    --surface: #111820;
    --border: rgba(255,255,255,0.07);
    --text: #e8edf5;
    --muted: #5a6a7a;
    --muted2: #8899aa;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--dark); color: var(--text); font-family: 'Raleway', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--green); border-radius: 2px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.1); } }
  @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes rotate { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes rotateReverse { from { transform:rotate(0deg); } to { transform:rotate(-360deg); } }
  @keyframes glowPulse { 0%,100% { box-shadow:0 0 20px rgba(0,229,255,0.2),0 0 40px rgba(0,229,255,0.1); } 50% { box-shadow:0 0 40px rgba(0,229,255,0.4),0 0 80px rgba(0,229,255,0.2); } }
  @keyframes scanline { 0% { top:-2px; } 100% { top:102%; } }
  @keyframes particleFloat { 0%,100% { transform:translateY(0) translateX(0); opacity:0.4; } 50% { transform:translateY(-15px) translateX(8px); opacity:0.8; } }
  @keyframes typewriter { from { width:0; } to { width:100%; } }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
  @keyframes slideRight { from { width:0; } to { width:var(--w); } }

  .fade-in { opacity:0; transform:translateY(24px); transition:opacity 0.8s ease,transform 0.8s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }

  /* ── NAV ── */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    padding:0 48px; height:60px;
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(8,12,16,0.85); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);
  }
  .nav-links { display:flex; gap:32px; list-style:none; }
  .nav-links a { font-size:13px; font-weight:500; color:var(--muted2); text-decoration:none; transition:color 0.2s; letter-spacing:1px; text-transform:uppercase; font-size:11px; }
  .nav-links a:hover, .nav-links a.active { color:var(--green); }
  .nav-phone { font-family:'DM Mono',monospace; font-size:12px; color:var(--muted); letter-spacing:1px; }

  /* ── HERO ── */
  .hero {
    min-height:100vh; position:relative; overflow:hidden;
    display:flex; align-items:center;
    padding:60px 72px;
    background: radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.03) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 80%, rgba(0,200,83,0.02) 0%, transparent 50%),
                var(--dark);
  }

  /* Background grid */
  .hero-grid {
    position:absolute; inset:0; z-index:0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size:60px 60px;
  }

  /* Vignette */
  .hero-vignette {
    position:absolute; inset:0; z-index:1;
    background:radial-gradient(ellipse at center, transparent 40%, rgba(8,12,16,0.8) 100%);
  }

  .hero-content { position:relative; z-index:3; max-width:520px; }
  .hero-tag { font-family:'DM Mono',monospace; font-size:11px; color:var(--green); letter-spacing:3px; text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:10px; animation:fadeUp 0.6s 0.1s ease both; }
  .hero-tag::before { content:''; width:24px; height:1px; background:var(--green); }
  .hero-name { font-weight:300; font-size:clamp(16px,2vw,22px); color:var(--muted2); letter-spacing:4px; text-transform:uppercase; margin-bottom:4px; animation:fadeUp 0.6s 0.2s ease both; }
  .hero-surname { font-weight:900; font-size:clamp(52px,8vw,100px); color:var(--text); letter-spacing:-2px; line-height:0.95; margin-bottom:16px; animation:fadeUp 0.6s 0.3s ease both; }
  .hero-role { font-size:15px; font-weight:400; color:var(--muted2); letter-spacing:3px; text-transform:uppercase; margin-bottom:36px; animation:fadeUp 0.6s 0.4s ease both; font-family:'DM Mono',monospace; }
  .hero-role span { color:var(--green); }

  .hero-btns { display:flex; gap:14px; animation:fadeUp 0.6s 0.5s ease both; flex-wrap:wrap; margin-bottom:60px; }
  .btn-outline-cyan { font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; background:transparent; color:var(--text); padding:12px 28px; border-radius:3px; text-decoration:none; border:1px solid rgba(255,255,255,0.3); transition:all 0.25s; }
  .btn-outline-cyan:hover { border-color:var(--green); color:var(--green); box-shadow:0 0 20px rgba(0,229,255,0.15); }
  .btn-filled-cyan { font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; background:transparent; color:var(--green); padding:12px 28px; border-radius:3px; text-decoration:none; border:1px solid var(--green); transition:all 0.25s; }
  .btn-filled-cyan:hover { background:rgba(0,229,255,0.1); box-shadow:0 0 30px rgba(0,229,255,0.2); transform:translateY(-2px); }

  /* Social links */
  .hero-socials { display:flex; gap:20px; align-items:center; animation:fadeUp 0.6s 0.6s ease both; }
  .social-label { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; margin-right:4px; }
  .social-link { font-family:'DM Mono',monospace; font-size:12px; font-weight:600; color:var(--muted2); text-decoration:none; transition:color 0.2s; letter-spacing:1px; }
  .social-link:hover { color:var(--green); }
  .social-divider { width:1px; height:14px; background:var(--border); }

  /* Hero orb - right side */
  .hero-orb-wrap {
    position:absolute; right:0; top:50%; transform:translateY(-50%);
    width:50%; height:100%; z-index:2;
    display:flex; align-items:center; justify-content:center;
    animation:fadeIn 1s 0.5s ease both;
  }

  /* ── TECH ORB ── */
  .tech-orb { width:380px; height:380px; position:relative; display:flex; align-items:center; justify-content:center; }
  .ring-1 { position:absolute; width:360px; height:360px; border:1px dashed rgba(0,229,255,0.15); border-radius:50%; animation:rotate 25s linear infinite; }
  .ring-1::before { content:''; position:absolute; width:8px; height:8px; background:var(--green); border-radius:50%; top:-4px; left:50%; transform:translateX(-50%); box-shadow:0 0 12px var(--green); }
  .ring-2 { position:absolute; width:270px; height:270px; border:1px dashed rgba(0,229,255,0.1); border-radius:50%; animation:rotateReverse 18s linear infinite; }
  .ring-2::after { content:''; position:absolute; width:6px; height:6px; background:#00c853; border-radius:50%; bottom:-3px; right:30%; box-shadow:0 0 8px #00c853; }
  .ring-3 { position:absolute; width:180px; height:180px; border:1px solid rgba(0,229,255,0.08); border-radius:50%; animation:rotate 12s linear infinite; }
  .orb-core { width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, #0d1117, #111820); border:1px solid rgba(0,229,255,0.3); display:flex; align-items:center; justify-content:center; position:relative; z-index:5; animation:glowPulse 3s ease-in-out infinite; }
  .orb-core-text { font-family:'DM Mono',monospace; font-size:10px; color:var(--green); text-align:center; line-height:1.6; letter-spacing:1px; }
  .orb-badge { position:absolute; z-index:10; background:rgba(13,17,23,0.95); color:var(--text); font-family:'DM Mono',monospace; font-size:10px; font-weight:500; padding:6px 12px; border-radius:20px; border:1px solid rgba(0,229,255,0.2); white-space:nowrap; letter-spacing:1px; transition:border-color 0.3s; }
  .orb-badge:hover { border-color:var(--green); color:var(--green); }
  .ob1 { top:20px; left:40px; animation:float 4s ease-in-out infinite; color:var(--green); border-color:rgba(0,229,255,0.4); }
  .ob2 { top:20px; right:40px; animation:float 5s ease-in-out infinite 0.5s; }
  .ob3 { bottom:60px; left:20px; animation:float 3.5s ease-in-out infinite 1s; }
  .ob4 { bottom:60px; right:20px; animation:float 4.5s ease-in-out infinite 1.5s; }
  .ob5 { top:50%; left:0; transform:translateY(-50%); animation:float 5s ease-in-out infinite 0.8s; }
  .orb-scanline { position:absolute; width:100%; height:1px; background:linear-gradient(90deg,transparent,rgba(0,229,255,0.2),transparent); animation:scanline 4s linear infinite; pointer-events:none; z-index:4; }

  /* ── ABOUT ── */
  .about-section { padding:100px 72px; background:var(--dark2); border-top:1px solid var(--border); position:relative; overflow:hidden; }
  .about-section::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--green),transparent); }
  .about-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .sec-eyebrow { font-family:'DM Mono',monospace; font-size:11px; color:var(--green); letter-spacing:4px; text-transform:uppercase; margin-bottom:14px; }
  .sec-title { font-size:clamp(36px,4vw,52px); font-weight:900; letter-spacing:-2px; line-height:1.05; margin-bottom:8px; }
  .sec-email { font-family:'DM Mono',monospace; font-size:12px; color:var(--muted2); margin-bottom:28px; }
  .about-text { font-size:14px; color:var(--muted2); line-height:1.9; margin-bottom:14px; font-weight:400; }
  .about-text strong { color:var(--text); font-weight:600; }
  .about-location { font-family:'DM Mono',monospace; font-size:12px; color:var(--muted); margin-top:32px; display:flex; align-items:center; gap:8px; }
  .about-location::before { content:''; width:30px; height:1px; background:var(--muted); }

  /* About right - dark visual */
  .about-visual { position:relative; height:420px; border-radius:4px; overflow:hidden; }
  .about-visual-bg { position:absolute; inset:0; background:linear-gradient(135deg, #0d1117 0%, #111820 50%, #0d1117 100%); }
  .about-visual-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px); background-size:40px 40px; }
  .about-visual-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:200px; height:200px; background:radial-gradient(circle,rgba(0,229,255,0.06) 0%,transparent 70%); }
  .about-visual-text { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; }
  .about-code-line { font-family:'DM Mono',monospace; font-size:13px; color:rgba(0,229,255,0.3); letter-spacing:1px; animation:fadeIn 1s ease both; }
  .about-code-line.hl { color:rgba(0,229,255,0.7); }
  .about-code-line span { color:rgba(0,200,83,0.6); }
  .about-border { position:absolute; inset:0; border:1px solid rgba(0,229,255,0.1); border-radius:4px; pointer-events:none; }
  .about-corner { position:absolute; width:16px; height:16px; }
  .ac-tl { top:-1px; left:-1px; border-top:2px solid var(--green); border-left:2px solid var(--green); }
  .ac-tr { top:-1px; right:-1px; border-top:2px solid var(--green); border-right:2px solid var(--green); }
  .ac-bl { bottom:-1px; left:-1px; border-bottom:2px solid var(--green); border-left:2px solid var(--green); }
  .ac-br { bottom:-1px; right:-1px; border-bottom:2px solid var(--green); border-right:2px solid var(--green); }

  /* ── SKILLS ── */
  .skills-section { padding:100px 72px; background:var(--dark); border-top:1px solid var(--border); }
  .skills-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 2fr; gap:80px; align-items:start; }
  .skills-left { position:sticky; top:100px; }
  .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px; }
  .skill-group-title { font-family:'DM Mono',monospace; font-size:10px; color:var(--green); letter-spacing:3px; text-transform:uppercase; margin-bottom:20px; padding-bottom:8px; border-bottom:1px solid var(--border); }
  .sk-item { margin-bottom:16px; }
  .sk-top { display:flex; justify-content:space-between; margin-bottom:6px; }
  .sk-name { font-size:13px; font-weight:600; color:var(--text); letter-spacing:0.5px; }
  .sk-pct { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted2); }
  .sk-bar { height:2px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
  .sk-fill { height:100%; background:linear-gradient(90deg,var(--green),#00c853); border-radius:2px; transition:width 1.4s cubic-bezier(0.4,0,0.2,1); }

  /* ── PROJECTS ── */
  .projects-section { padding:100px 72px; background:var(--dark2); border-top:1px solid var(--border); }
  .projects-inner { max-width:1100px; margin:0 auto; }
  .sec-header { margin-bottom:56px; }
  .projects-list { display:flex; flex-direction:column; gap:1px; border:1px solid var(--border); border-radius:8px; overflow:hidden; }
  .project-row { display:grid; grid-template-columns:auto 1fr auto; gap:32px; align-items:center; padding:28px 32px; background:var(--surface); transition:all 0.3s; cursor:pointer; border-bottom:1px solid var(--border); position:relative; }
  .project-row:last-child { border-bottom:none; }
  .project-row:hover { background:rgba(0,229,255,0.04); transform:translateX(4px); }
  .project-row:hover .pr-arrow { color:var(--green); transform:translate(4px,-4px); }
  .pr-num { font-family:'DM Mono',monospace; font-size:12px; color:var(--muted); letter-spacing:1px; min-width:36px; }
  .pr-title { font-size:18px; font-weight:700; letter-spacing:-0.5px; margin-bottom:6px; color:var(--text); }
  .pr-desc { font-size:13px; color:var(--muted2); line-height:1.6; margin-bottom:10px; }
  .pr-stack { display:flex; gap:8px; flex-wrap:wrap; }
  .pr-tag { font-family:'DM Mono',monospace; font-size:10px; color:var(--green); background:rgba(0,229,255,0.06); padding:3px 10px; border-radius:20px; border:1px solid rgba(0,229,255,0.15); letter-spacing:0.5px; }
  .pr-right { display:flex; flex-direction:column; align-items:flex-end; gap:12px; }
  .pr-arrow { font-size:20px; color:var(--muted); transition:all 0.3s; }
  .pr-links { display:flex; gap:10px; }
  .pr-link { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted2); text-decoration:none; transition:color 0.2s; letter-spacing:1px; border:1px solid var(--border); padding:4px 12px; border-radius:20px; }
  .pr-link:hover { color:var(--green); border-color:var(--green); }
  .pr-preview-btn { font-family:'DM Mono',monospace; font-size:11px; color:var(--green); background:rgba(0,229,255,0.08); border:1px solid rgba(0,229,255,0.25); padding:5px 14px; border-radius:20px; cursor:pointer; letter-spacing:1px; transition:all 0.2s; }
  .pr-preview-btn:hover { background:rgba(0,229,255,0.15); box-shadow:0 0 14px rgba(0,229,255,0.2); }

  /* LIVE PREVIEW MODAL */
  .preview-overlay { position:fixed; inset:0; z-index:999; background:rgba(0,0,0,0.88); backdrop-filter:blur(16px); display:flex; align-items:center; justify-content:center; animation:fadeIn 0.2s ease; padding:20px; }
  .preview-box { width:100%; max-width:1100px; height:85vh; background:var(--dark2); border-radius:12px; overflow:hidden; border:1px solid rgba(0,229,255,0.2); box-shadow:0 0 60px rgba(0,229,255,0.08), 0 40px 80px rgba(0,0,0,0.6); animation:previewIn 0.35s cubic-bezier(0.22,1,0.36,1); display:flex; flex-direction:column; }
  @keyframes previewIn { from { opacity:0; transform:scale(0.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .preview-bar { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; background:var(--surface); border-bottom:1px solid var(--border); flex-shrink:0; }
  .preview-bar-left { display:flex; align-items:center; gap:12px; }
  .preview-dots { display:flex; gap:6px; }
  .preview-dot { width:12px; height:12px; border-radius:50%; }
  .pd-red { background:#ef4444; }
  .pd-yellow { background:#f59e0b; }
  .pd-green { background:#22c55e; }
  .preview-url { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted2); background:rgba(255,255,255,0.04); border:1px solid var(--border); padding:5px 16px; border-radius:20px; letter-spacing:0.5px; }
  .preview-title { font-family:'DM Mono',monospace; font-size:12px; color:var(--green); letter-spacing:1px; }
  .preview-close { width:28px; height:28px; border-radius:6px; background:rgba(255,255,255,0.06); border:1px solid var(--border); color:var(--muted2); cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .preview-close:hover { background:rgba(239,68,68,0.2); color:#ef4444; border-color:#ef4444; }
  .preview-frame { flex:1; position:relative; background:#000; }
  .preview-frame iframe { width:100%; height:100%; border:none; display:block; }
  .preview-no-live { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; color:var(--muted); }
  .preview-no-live span { font-size:2.5rem; }
  .preview-no-live p { font-family:'DM Mono',monospace; font-size:12px; letter-spacing:1px; }
  .preview-actions { display:flex; gap:10px; padding:10px 18px; background:var(--surface); border-top:1px solid var(--border); flex-shrink:0; justify-content:flex-end; }
  .preview-action-btn { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:1px; padding:7px 18px; border-radius:20px; cursor:pointer; transition:all 0.2s; text-decoration:none; display:inline-flex; align-items:center; gap:6px; }
  .pab-outline { color:var(--muted2); border:1px solid var(--border); background:transparent; }
  .pab-outline:hover { color:var(--green); border-color:var(--green); }
  .pab-filled { color:var(--dark); border:1px solid var(--green); background:var(--green); font-weight:700; }
  .pab-filled:hover { box-shadow:0 0 20px rgba(0,229,255,0.3); transform:translateY(-1px); }

  /* MOTIVATIONAL BANNER */
  .motiv-banner { padding:60px 72px; background:var(--dark); border-top:1px solid var(--border); position:relative; overflow:hidden; }
  .motiv-banner::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--green),transparent); }
  .motiv-banner::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,229,255,0.3),transparent); }
  .motiv-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
  .motiv-card { padding:28px; border:1px solid var(--border); border-radius:8px; background:var(--surface); transition:all 0.3s; position:relative; overflow:hidden; }
  .motiv-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,229,255,0.03),transparent); opacity:0; transition:opacity 0.3s; }
  .motiv-card:hover { border-color:rgba(0,229,255,0.3); transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.3); }
  .motiv-card:hover::before { opacity:1; }
  .motiv-icon { font-size:1.6rem; margin-bottom:14px; display:block; }
  .motiv-quote { font-size:14px; font-weight:600; color:var(--text); line-height:1.6; margin-bottom:10px; font-style:italic; }
  .motiv-quote::before { content:'"'; color:var(--green); font-size:1.4rem; line-height:0; vertical-align:-6px; margin-right:3px; }
  .motiv-quote::after { content:'"'; color:var(--green); font-size:1.4rem; line-height:0; vertical-align:-6px; margin-left:3px; }
  .motiv-author { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; }
  .motiv-header { text-align:center; margin-bottom:44px; }
  .motiv-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:500px; height:200px; background:radial-gradient(ellipse,rgba(0,229,255,0.03) 0%,transparent 70%); pointer-events:none; }

  @media (max-width:900px) {
    .motiv-inner { grid-template-columns:1fr; }
    .motiv-banner { padding:60px 24px; }
    .preview-box { height:75vh; }
  }

  /* ── CONTACT ── */
  .contact-section { padding:120px 72px; background:var(--dark); border-top:1px solid var(--border); text-align:center; position:relative; overflow:hidden; }
  .contact-section::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--green),transparent); }
  .contact-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:400px; height:400px; background:radial-gradient(circle,rgba(0,229,255,0.04) 0%,transparent 70%); pointer-events:none; }
  .contact-inner { position:relative; z-index:2; max-width:600px; margin:0 auto; }
  .contact-title { font-size:clamp(40px,6vw,72px); font-weight:900; letter-spacing:-3px; line-height:1; margin-bottom:20px; }
  .contact-title span { color:var(--green); }
  .contact-sub { font-size:15px; color:var(--muted2); line-height:1.8; margin-bottom:48px; }
  .contact-email { font-family:'DM Mono',monospace; font-size:16px; color:var(--green); text-decoration:none; letter-spacing:1px; display:inline-block; margin-bottom:48px; padding-bottom:4px; border-bottom:1px solid rgba(0,229,255,0.3); transition:border-color 0.2s; }
  .contact-email:hover { border-color:var(--green); }
  .contact-socials { display:flex; gap:16px; justify-content:center; }
  .contact-social { font-family:'DM Mono',monospace; font-size:12px; color:var(--muted2); text-decoration:none; letter-spacing:2px; text-transform:uppercase; padding:10px 20px; border:1px solid var(--border); border-radius:3px; transition:all 0.2s; }
  .contact-social:hover { border-color:var(--green); color:var(--green); background:rgba(0,229,255,0.05); }

  /* ── FOOTER ── */
  .footer { padding:20px 72px; background:var(--dark); border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .footer-text { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); letter-spacing:1px; }
  .footer-text span { color:var(--green); }
  .footer-links { display:flex; gap:20px; }
  .footer-link { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); text-decoration:none; letter-spacing:1px; transition:color 0.2s; }
  .footer-link:hover { color:var(--green); }

  /* ── MOBILE ── */
  @media (max-width:900px) {
    .nav { padding:0 20px; }
    .nav-phone { display:none; }
    .hero { padding:80px 24px 60px; }
    .hero-orb-wrap { display:none; }
    .hero-surname { font-size:52px; }
    .about-section,.skills-section,.projects-section,.contact-section { padding:60px 24px; }
    .about-inner { grid-template-columns:1fr; gap:40px; }
    .about-visual { height:260px; }
    .skills-inner { grid-template-columns:1fr; gap:40px; }
    .skills-left { position:static; }
    .skills-grid { grid-template-columns:1fr; gap:20px; }
    .project-row { grid-template-columns:1fr; gap:12px; }
    .pr-num { display:none; }
    .pr-right { align-items:flex-start; flex-direction:row; }
    .footer { padding:20px 24px; flex-direction:column; gap:10px; text-align:center; }
    .footer-links { justify-content:center; }
  }
`;

const SKILLS_LEFT = [
  { name: "React", level: 75 },
  { name: "JavaScript", level: 70 },
  { name: "HTML & CSS", level: 85 },
];
const SKILLS_RIGHT = [
  { name: "Git & GitHub", level: 65 },
  { name: "REST APIs", level: 68 },
  { name: "Vite", level: 70 },
];

const PROJECTS = [
  {
    id: "01", title: "GameForge",
    desc: "A game discovery web app powered by the RAWG API. Browse 500,000+ games, filter by genre and platform, save favorites, and view detailed game info.",
    stack: ["React", "Vite", "RAWG API", "CSS"],
    live: "https://gameforge-blond.vercel.app",
    github: "https://github.com/jwayeye75/gameforge",
  },
  {
    id: "02", title: "Apex Cinema",
    desc: "A full-stack IMDb-style movie & series platform. Browse millions of titles via the TMDB API, watch trailers, save to a personal watchlist, and leave ratings & reviews. Features real user authentication and a live database powered by Supabase with Row Level Security.",
    stack: ["React", "Vite", "TMDB API", "Supabase", "PostgreSQL", "Vercel"],
    live: "https://my-movie-cave.vercel.app",
    github: "https://github.com/jwayeye75/my-movie-cave",
  },
  {
    id: "03", title: "More Projects",
    desc: "More projects coming as I keep building. Check my GitHub for the latest.",
    stack: ["TBD"],
    live: null, github: "https://github.com/jwayeye75",
  },
];

function TechOrb() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 380; canvas.height = 380;
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 380, y: Math.random() * 380,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, 380, 380);
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${p.opacity})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 380) p.vx *= -1;
        if (p.y < 0 || p.y > 380) p.vy *= -1;
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="tech-orb">
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: "50%" }} />
      <div className="ring-1" /><div className="ring-2" /><div className="ring-3" />
      <div className="orb-scanline" />
      <div className="orb-core"><div className="orb-core-text">DEV<br/>MODE</div></div>
      <div className="orb-badge ob1">⚛️ React</div>
      <div className="orb-badge ob2">JS</div>
      <div className="orb-badge ob3">CSS3</div>
      <div className="orb-badge ob4">Git</div>
      <div className="orb-badge ob5">{'</>'}</div>
    </div>
  );
}

export default function Portfolio() {
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

    const skillsEl = document.querySelector(".skills-grid");
    if (skillsEl) {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setSkillsVisible(true); obs.disconnect(); }
      }, { threshold: 0.2 });
      obs.observe(skillsEl);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <ul className="nav-links">
          {[["#", "Home"], ["#about", "About"], ["#skills", "Resume"], ["#projects", "Portfolio"]].map(([href, label]) => (
            <li key={label}><a href={href} className={activeNav === label.toLowerCase() ? "active" : ""} onClick={() => setActiveNav(label.toLowerCase())}>{label}</a></li>
          ))}
        </ul>
        <div className="nav-phone">josiahharunaayeye@gmail.com</div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-vignette" />
        <div className="hero-content">
          <div className="hero-tag">Frontend Developer</div>
          <div className="hero-name">Josiah Haruna</div>
          <div className="hero-surname">AYEYE</div>
          <div className="hero-role"><span>//</span> Frontend Developer</div>
          <div className="hero-btns">
            <a href="https://www.linkedin.com/in/josiah-haruna-ayeye-4a46563b5" target="_blank" rel="noreferrer" className="btn-outline-cyan">LinkedIn</a>
            <a href="#projects" className="btn-filled-cyan">Portfolio</a>
          </div>
          <div className="hero-socials">
            <span className="social-label">Find me on</span>
            <a href="https://www.linkedin.com/in/josiah-haruna-ayeye-4a46563b5" target="_blank" rel="noreferrer" className="social-link">in</a>
            <div className="social-divider" />
            <a href="https://github.com/jwayeye75" target="_blank" rel="noreferrer" className="social-link">gh</a>
            <div className="social-divider" />
            <a href="mailto:josiahharunaayeye@gmail.com" className="social-link">✉</a>
          </div>
        </div>
        <div className="hero-orb-wrap"><TechOrb /></div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-inner">
          <div className="fade-in">
            <div className="sec-eyebrow">About</div>
            <h2 className="sec-title">Josiah Ayeye</h2>
            <div className="sec-email">josiahharunaayeye@gmail.com</div>
            <p className="about-text">Frontend developer and <strong>Computer Science student</strong> with a passion for building modern, interactive web experiences. I turn ideas into real products that people actually use.</p>
            <p className="about-text">I build with <strong>React, JavaScript, HTML & CSS</strong> — focused on clean code, great user experience, and apps that work beautifully across all devices.</p>
            <p className="about-text">Currently looking for my <strong>first internship or junior frontend role</strong>. Fast learner. Problem solver. Love a good challenge.</p>
            <div className="about-location">Nigeria · Open to Remote</div>
          </div>
          <div className="about-visual fade-in">
            <div className="about-visual-bg" />
            <div className="about-visual-grid" />
            <div className="about-visual-glow" />
            <div className="about-visual-text">
              {[
                ["const", " developer", " = {"],
                ["  name:", " 'Josiah Ayeye',", ""],
                ["  role:", " 'Frontend Dev',", ""],
                ["  stack:", " ['React', 'JS'],", ""],
                ["  status:", " 'Open to Work'", ""],
                ["}", "", ""],
              ].map(([a, b, c], i) => (
                <div key={i} className={`about-code-line${i === 0 || i === 5 ? " hl" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <span>{a}</span>{b}{c}
                </div>
              ))}
            </div>
            <div className="about-border" />
            <div className="about-corner ac-tl" /><div className="about-corner ac-tr" />
            <div className="about-corner ac-bl" /><div className="about-corner ac-br" />
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="skills-section">
        <div className="skills-inner">
          <div className="skills-left fade-in">
            <div className="sec-eyebrow">Resume</div>
            <h2 className="sec-title" style={{ fontSize: "clamp(32px,3vw,42px)" }}>Skills &<br />Tech Stack</h2>
          </div>
          <div className="skills-grid fade-in">
            <div>
              <div className="skill-group-title">Frontend</div>
              {SKILLS_LEFT.map(s => (
                <div key={s.name} className="sk-item">
                  <div className="sk-top"><span className="sk-name">{s.name}</span><span className="sk-pct">{s.level}%</span></div>
                  <div className="sk-bar"><div className="sk-fill" style={{ width: skillsVisible ? `${s.level}%` : "0%" }} /></div>
                </div>
              ))}
            </div>
            <div>
              <div className="skill-group-title">Tools</div>
              {SKILLS_RIGHT.map(s => (
                <div key={s.name} className="sk-item">
                  <div className="sk-top"><span className="sk-name">{s.name}</span><span className="sk-pct">{s.level}%</span></div>
                  <div className="sk-bar"><div className="sk-fill" style={{ width: skillsVisible ? `${s.level}%` : "0%" }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects-section">
        <div className="projects-inner">
          <div className="sec-header fade-in">
            <div className="sec-eyebrow">Portfolio</div>
            <h2 className="sec-title">Selected Work</h2>
          </div>
          <div className="projects-list fade-in">
            {PROJECTS.map((p, i) => (
              <div key={p.id} className="project-row" style={{ transitionDelay: `${i * 0.1}s` }} onClick={() => p.live && setPreview(p)}>
                <div className="pr-num">{p.id}</div>
                <div className="pr-info">
                  <div className="pr-title">{p.title}</div>
                  <div className="pr-desc">{p.desc}</div>
                  <div className="pr-stack">{p.stack.map(s => <span key={s} className="pr-tag">{s}</span>)}</div>
                </div>
                <div className="pr-right">
                  <div className="pr-arrow">↗</div>
                  <div className="pr-links">
                    {p.live && <button className="pr-preview-btn" onClick={e => { e.stopPropagation(); setPreview(p); }}>⚡ Preview</button>}
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="pr-link" onClick={e => e.stopPropagation()}>Live</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="pr-link" onClick={e => e.stopPropagation()}>GitHub</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOTIVATIONAL SECTION */}
      <section className="motiv-banner">
        <div className="motiv-glow" />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="motiv-header fade-in">
            <div className="sec-eyebrow" style={{ marginBottom: 10 }}>Mindset</div>
            <h2 className="sec-title" style={{ fontSize: "clamp(28px,3vw,38px)" }}>What Drives Me</h2>
          </div>
          <div className="motiv-inner fade-in">
            {[
              { icon: "🚀", quote: "The best way to predict the future is to build it.", author: "Alan Kay" },
              { icon: "💡", quote: "Every expert was once a beginner. Every pro was once an amateur. Keep going.", author: "Robin Sharma" },
              { icon: "🔥", quote: "Code is like humor. When you have to explain it, it's bad — so I write code that speaks for itself.", author: "Josiah Ayeye" },
              { icon: "🎯", quote: "Don't watch the clock; do what it does — keep going.", author: "Sam Levenson" },
              { icon: "⚡", quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
              { icon: "🌍", quote: "From Nigeria to the world — one line of code at a time.", author: "Josiah Ayeye" },
            ].map((m, i) => (
              <div key={i} className="motiv-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="motiv-icon">{m.icon}</span>
                <div className="motiv-quote">{m.quote}</div>
                <div className="motiv-author">— {m.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-glow" />
        <div className="contact-inner fade-in">
          <div className="sec-eyebrow" style={{ textAlign: "center", marginBottom: 20 }}>Get In Touch</div>
          <h2 className="contact-title">Let's Work <span>Together.</span></h2>
          <p className="contact-sub">I'm open to frontend developer roles, internships, and freelance projects. Let's build something great!</p>
          <a href="mailto:josiahharunaayeye@gmail.com" className="contact-email">josiahharunaayeye@gmail.com</a>
          <div className="contact-socials">
            <a href="https://www.linkedin.com/in/josiah-haruna-ayeye-4a46563b5" target="_blank" rel="noreferrer" className="contact-social">LinkedIn</a>
            <a href="https://github.com/jwayeye75" target="_blank" rel="noreferrer" className="contact-social">GitHub</a>
            <a href="mailto:josiahharunaayeye@gmail.com" className="contact-social">Email</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-text">Built by <span>Josiah Haruna Ayeye</span> · 2026</div>
        <div className="footer-links">
          <a href="mailto:josiahharunaayeye@gmail.com" className="footer-link">Email</a>
          <a href="https://www.linkedin.com/in/josiah-haruna-ayeye-4a46563b5" target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
          <a href="https://github.com/jwayeye75" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
        </div>
      </footer>
      {/* LIVE PREVIEW MODAL */}
      {preview && (
        <div className="preview-overlay" onClick={() => setPreview(null)}>
          <div className="preview-box" onClick={e => e.stopPropagation()}>
            <div className="preview-bar">
              <div className="preview-bar-left">
                <div className="preview-dots">
                  <div className="preview-dot pd-red" />
                  <div className="preview-dot pd-yellow" />
                  <div className="preview-dot pd-green" />
                </div>
                <div className="preview-url">{preview.live}</div>
              </div>
              <div className="preview-title">{preview.title}</div>
              <button className="preview-close" onClick={() => setPreview(null)}>✕</button>
            </div>
            <div className="preview-frame">
              <iframe src={preview.live} title={preview.title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
            </div>
            <div className="preview-actions">
              <a href={preview.github} target="_blank" rel="noreferrer" className="preview-action-btn pab-outline">GitHub ↗</a>
              <a href={preview.live} target="_blank" rel="noreferrer" className="preview-action-btn pab-filled">Open Full Site ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
