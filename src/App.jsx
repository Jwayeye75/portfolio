import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050508;
    --surface: #0c0c12;
    --surface2: #12121a;
    --border: #1c1c28;
    --accent: #e8ff47;
    --accent2: #ff4757;
    --text: #f0f0f5;
    --muted: #52526e;
    --muted2: #2a2a3e;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; cursor: none; }

  /* Custom cursor */
  .cursor { position: fixed; width: 10px; height: 10px; background: var(--accent); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); transition: transform 0.1s; mix-blend-mode: difference; }
  .cursor-ring { position: fixed; width: 36px; height: 36px; border: 1px solid var(--accent); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); transition: all 0.15s ease; mix-blend-mode: difference; opacity: 0.5; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  @keyframes glitch1 { 0%, 100% { clip-path: inset(0 0 100% 0); } 20% { clip-path: inset(20% 0 50% 0); transform: translate(-4px); } 40% { clip-path: inset(60% 0 20% 0); transform: translate(4px); } 60% { clip-path: inset(40% 0 40% 0); transform: translate(-2px); } 80% { clip-path: inset(80% 0 5% 0); transform: translate(2px); } }
  @keyndef scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  /* NAV */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; }
  .nav::after { content: ''; position: absolute; bottom: 0; left: 48px; right: 48px; height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); }
  .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: var(--text); text-decoration: none; }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); text-decoration: none; letter-spacing: 2px; text-transform: uppercase; transition: color 0.2s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: var(--accent); transition: width 0.3s; }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; background: var(--accent); color: var(--bg); padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 500; transition: all 0.2s; }
  .nav-cta:hover { background: #f5ff6e; box-shadow: 0 0 30px rgba(232,255,71,0.3); }

  /* HERO */
  .hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 48px 80px; position: relative; overflow: hidden; }
  .hero-bg-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 80px 80px; opacity: 0.4; }
  .hero-bg-glow { position: absolute; top: 20%; right: -100px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(232,255,71,0.04) 0%, transparent 70%); }
  .hero-bg-glow2 { position: absolute; bottom: 10%; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,71,87,0.04) 0%, transparent 70%); }
  .hero-content { position: relative; max-width: 1200px; margin: 0 auto; width: 100%; }
  .hero-tag { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; animation: fadeUp 0.6s 0.1s ease both; }
  .hero-tag::before { content: ''; width: 32px; height: 1px; background: var(--accent); }
  .hero-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(56px, 9vw, 120px); line-height: 0.9; letter-spacing: -3px; margin-bottom: 8px; animation: fadeUp 0.6s 0.2s ease both; }
  .hero-name .line2 { color: transparent; -webkit-text-stroke: 1px var(--muted); display: block; }
  .hero-role { font-family: 'DM Mono', monospace; font-size: 16px; color: var(--muted); letter-spacing: 2px; margin-bottom: 32px; animation: fadeUp 0.6s 0.3s ease both; display: flex; align-items: center; gap: 8px; }
  .role-text { color: var(--accent); }
  .cursor-blink { display: inline-block; width: 2px; height: 18px; background: var(--accent); animation: blink 1s infinite; vertical-align: middle; }
  .hero-bio { font-size: 16px; color: var(--muted); line-height: 1.8; max-width: 520px; margin-bottom: 48px; animation: fadeUp 0.6s 0.4s ease both; }
  .hero-ctas { display: flex; gap: 16px; animation: fadeUp 0.6s 0.5s ease both; }
  .btn-primary { font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; background: var(--accent); color: var(--bg); padding: 14px 28px; border-radius: 4px; text-decoration: none; font-weight: 500; transition: all 0.2s; border: none; cursor: none; }
  .btn-primary:hover { background: #f5ff6e; box-shadow: 0 0 40px rgba(232,255,71,0.25); transform: translateY(-2px); }
  .btn-outline { font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; background: transparent; color: var(--text); padding: 14px 28px; border-radius: 4px; text-decoration: none; border: 1px solid var(--border); transition: all 0.2s; cursor: none; }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

  /* HERO STATS */
  .hero-stats { position: absolute; right: 0; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 24px; animation: fadeUp 0.6s 0.6s ease both; }
  .stat-item { text-align: right; }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }

  /* MARQUEE */
  .marquee-section { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 16px 0; overflow: hidden; background: var(--surface); }
  .marquee-track { display: flex; gap: 0; animation: marquee 20s linear infinite; width: max-content; }
  .marquee-item { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); letter-spacing: 3px; text-transform: uppercase; padding: 0 32px; white-space: nowrap; display: flex; align-items: center; gap: 16px; }
  .marquee-item::after { content: '✦'; color: var(--accent); font-size: 10px; }

  /* SECTIONS */
  .section { padding: 100px 48px; max-width: 1200px; margin: 0 auto; }
  .section-header { margin-bottom: 64px; }
  .section-num { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--accent); letter-spacing: 3px; margin-bottom: 12px; }
  .section-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 56px); letter-spacing: -2px; line-height: 1; }
  .section-title span { color: transparent; -webkit-text-stroke: 1px var(--muted); }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .about-text p { color: var(--muted); line-height: 1.9; font-size: 15px; margin-bottom: 20px; }
  .about-text p strong { color: var(--text); font-weight: 600; }
  .about-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; position: relative; overflow: hidden; }
  .about-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .about-card-title { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px; }
  .skill-list { display: flex; flex-direction: column; gap: 14px; }
  .skill-item { display: flex; justify-content: space-between; align-items: center; }
  .skill-name { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text); letter-spacing: 1px; }
  .skill-bar { width: 120px; height: 3px; background: var(--muted2); border-radius: 2px; overflow: hidden; }
  .skill-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; transition: width 1s ease; }

  /* PROJECTS */
  .projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .project-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; cursor: none; }
  .project-card:hover { border-color: var(--accent); transform: translateY(-8px); box-shadow: 0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,255,71,0.1); }
  .project-card:hover .project-img { transform: scale(1.05); }
  .project-card:hover .project-arrow { transform: translate(4px, -4px); opacity: 1; }
  .project-img-wrap { height: 220px; overflow: hidden; position: relative; background: var(--surface2); }
  .project-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .project-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; background: linear-gradient(135deg, var(--surface2), var(--muted2)); }
  .project-tag-wrap { position: absolute; top: 16px; left: 16px; display: flex; gap: 8px; }
  .project-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
  .project-body { padding: 24px; }
  .project-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .project-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.5px; }
  .project-arrow { font-size: 20px; opacity: 0.3; transition: all 0.3s; }
  .project-desc { color: var(--muted); font-size: 13px; line-height: 1.7; margin-bottom: 20px; }
  .project-stack { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .stack-tag { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); background: var(--muted2); padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; }
  .project-links { display: flex; gap: 12px; }
  .project-link { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); text-decoration: none; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; transition: gap 0.2s; }
  .project-link:hover { gap: 10px; }

  /* FOOTER */
  .footer { border-top: 1px solid var(--border); padding: 48px; display: flex; justify-content: space-between; align-items: center; max-width: 100%; }
  .footer-left { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); letter-spacing: 1px; }
  .footer-left span { color: var(--accent); }
  .footer-right { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }

  /* AVAILABLE BADGE */
  .available { display: inline-flex; align-items: center; gap: 8px; background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.2); border-radius: 30px; padding: 6px 14px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: 1px; margin-bottom: 24px; animation: fadeUp 0.6s ease both; }
  .available-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }

  @media (max-width: 768px) {
    .nav { padding: 20px 24px; }
    .nav-links { display: none; }
    .hero { padding: 100px 24px 60px; }
    .hero-stats { display: none; }
    .section { padding: 60px 24px; }
    .about-grid { grid-template-columns: 1fr; gap: 40px; }
    .projects-grid { grid-template-columns: 1fr; }
    .footer { padding: 32px 24px; flex-direction: column; gap: 16px; text-align: center; }
  }
`;

const SKILLS = [
  { name: "React", level: 75 },
  { name: "JavaScript", level: 70 },
  { name: "HTML & CSS", level: 85 },
  { name: "Git & GitHub", level: 65 },
  { name: "Vite", level: 70 },
  { name: "REST APIs", level: 68 },
];

const PROJECTS = [
  {
    id: 1,
    title: "GameForge",
    desc: "A game discovery web app powered by the RAWG API. Browse 500,000+ games, filter by genre and platform, save favorites, and view detailed game info.",
    stack: ["React", "Vite", "RAWG API", "CSS"],
    emoji: "🎮",
    live: "https://gameforge-blond.vercel.app",
    github: "https://github.com/jwayeye75/gameforge",
    tag: "Featured",
    tagColor: "#e8ff47",
    tagBg: "rgba(232,255,71,0.1)",
  },
  {
    id: 2,
    title: "Coming Soon",
    desc: "Next project is currently in development. Stay tuned for something exciting — another web app built from scratch with real-world features.",
    stack: ["React", "TBD"],
    emoji: "🚧",
    live: null,
    github: null,
    tag: "In Progress",
    tagColor: "#ff4757",
    tagBg: "rgba(255,71,87,0.1)",
  },
];

const MARQUEE_ITEMS = ["React", "JavaScript", "HTML", "CSS", "Git", "Vite", "REST APIs", "Frontend Dev", "React", "JavaScript", "HTML", "CSS", "Git", "Vite", "REST APIs", "Frontend Dev"];

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const skillsRef = useRef(null);
  const [skillsVisible, setSkillsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => setRingPos({ x: e.clientX, y: e.clientY }), 80);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target === skillsRef.current) setSkillsVisible(true);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>

      {/* Custom cursor */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: ringPos.x, top: ringPos.y }} />

      {/* NAV */}
      <nav className="nav" style={{ backdropFilter: "blur(20px)", background: "rgba(5,5,8,0.8)" }}>
        <a href="#" className="nav-logo">J<span>.</span>Ayeye</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
        </ul>
        <a href="mailto:josiahharunaayeye@gmail.com" className="nav-cta">Hire Me</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow2" />
        <div className="hero-content">
          <div className="available">
            <div className="available-dot" />
            Available for opportunities
          </div>
          <div className="hero-tag">Frontend Developer</div>
          <h1 className="hero-name">
            Josiah
            <span className="line2">Ayeye.</span>
          </h1>
          <div className="hero-role">
            <span>I build </span>
            <span className="role-text">modern web apps</span>
            <span className="cursor-blink" />
          </div>
          <p className="hero-bio">
            I'm a 21-year-old Computer Science student with a passion for building modern, interactive web experiences. I love turning ideas into real products that people can actually use.
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn-primary">View My Work →</a>
            <a href="https://github.com/jwayeye75" target="_blank" rel="noreferrer" className="btn-outline">GitHub ↗</a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">1+</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">21</div>
            <div className="stat-label">Years Old</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">CS</div>
            <div className="stat-label">Student</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <div key={i} className="marquee-item">{item}</div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <div id="about" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section">
          <div className="section-header fade-in">
            <div className="section-num">01 — About</div>
            <h2 className="section-title">Who I <span>Am.</span></h2>
          </div>
          <div className="about-grid">
            <div className="about-text fade-in">
              <p>Hey! I'm <strong>Josiah Haruna Ayeye</strong>, a frontend developer and Computer Science student who loves building things for the web.</p>
              <p>I started learning web development because I wanted to turn my ideas into real products. Now I build <strong>fast, modern, interactive</strong> web apps using React and JavaScript.</p>
              <p>I'm currently looking for my <strong>first job or internship</strong> as a frontend developer. I'm a fast learner who loves a challenge.</p>
              <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <a href="https://github.com/jwayeye75" target="_blank" rel="noreferrer" className="btn-outline" style={{ fontSize: 11, padding: "10px 20px" }}>GitHub ↗</a>
                <a href="https://linkedin.com/in/josiahharunaayeye" target="_blank" rel="noreferrer" className="btn-outline" style={{ fontSize: 11, padding: "10px 20px" }}>LinkedIn ↗</a>
                <a href="mailto:josiahharunaayeye@gmail.com" className="btn-primary" style={{ fontSize: 11, padding: "10px 20px" }}>Email Me ↗</a>
              </div>
            </div>
            <div ref={skillsRef} className="about-card fade-in">
              <div className="about-card-title">Tech Stack</div>
              <div className="skill-list">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: skillsVisible ? `${skill.level}%` : "0%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECTS */}
      <div id="projects" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section">
          <div className="section-header fade-in">
            <div className="section-num">02 — Projects</div>
            <h2 className="section-title">What I've <span>Built.</span></h2>
          </div>
          <div className="projects-grid">
            {PROJECTS.map((project, i) => (
              <div key={project.id} className="project-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="project-img-wrap">
                  <div className="project-img-placeholder">{project.emoji}</div>
                  <div className="project-tag-wrap">
                    <span className="project-tag" style={{ color: project.tagColor, background: project.tagBg, border: `1px solid ${project.tagColor}33` }}>{project.tag}</span>
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-title-row">
                    <h3 className="project-title">{project.title}</h3>
                    <span className="project-arrow">↗</span>
                  </div>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-stack">
                    {project.stack.map(s => <span key={s} className="stack-tag">{s}</span>)}
                  </div>
                  <div className="project-links">
                    {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="project-link">Live Demo →</a>}
                    {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="project-link">GitHub →</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-left">
          Built by <span>Josiah Haruna Ayeye</span> · 2025
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="mailto:josiahharunaayeye@gmail.com" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: 2, textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "var(--accent)"} onMouseLeave={e => e.target.style.color = "var(--muted)"}>Email</a>
          <a href="https://linkedin.com/in/josiahharunaayeye" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: 2, textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "var(--accent)"} onMouseLeave={e => e.target.style.color = "var(--muted)"}>LinkedIn</a>
          <a href="https://github.com/jwayeye75" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: 2, textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "var(--accent)"} onMouseLeave={e => e.target.style.color = "var(--muted)"}>GitHub</a>
        </div>
      </footer>
    </>
  );
}
