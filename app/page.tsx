"use client";
import React, { useState, useEffect, FormEvent } from 'react';

export default function UrbanDreamerLanding() {
  const [page, setPage] = useState<'home' | 'about'>('home');
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage("You're on the list. Check your email.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something broke. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Connection failed. Try again.');
    }
  };

  const navLinks: ('home' | 'about')[] = ['home', 'about'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #e8f4fd 0%, #d0e8f7 30%, #c2dff2 60%, #b8d8ef 100%)', color: '#1a2a3a', fontFamily: "'IBM Plex Serif', serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --gold: #c9a84c;
          --gold-light: #e2c97e;
          --gold-dark: #a07d2e;
          --blue-deep: #1e3a5f;
          --blue-mid: #3a6c99;
          --blue-light: #d0e8f7;
          --blue-pale: #eaf3fa;
          --text-primary: #1a2a3a;
          --text-secondary: #3d5a73;
          --text-muted: #6b8da5;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Subtle grain overlay */
        .grain-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 999;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Decorative floating orbs */
        .orb {
          position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
          animation: drift 18s ease-in-out infinite alternate;
        }
        .orb-1 { width: 500px; height: 500px; background: rgba(180, 215, 245, 0.45); top: -120px; left: -100px; }
        .orb-2 { width: 380px; height: 380px; background: rgba(201, 168, 76, 0.12); bottom: -80px; right: -60px; animation-delay: -6s; }
        .orb-3 { width: 260px; height: 260px; background: rgba(160, 200, 235, 0.35); top: 50%; left: 60%; animation-delay: -12s; }
        @keyframes drift { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(40px, -30px) scale(1.08); } }

        /* Nav */
        .nav-bar {
          position: fixed; top: 0; width: 100%; z-index: 100;
          transition: all 0.4s cubic-bezier(.4,0,.2,1);
        }
        .nav-bar.scrolled {
          background: rgba(232, 244, 253, 0.88);
          backdrop-filter: blur(14px);
          box-shadow: 0 1px 0 rgba(30, 58, 95, 0.08);
        }
        .nav-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 22px 28px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 17px; letter-spacing: 2.5px;
          color: var(--blue-deep); text-transform: uppercase;
        }
        .nav-logo span { color: var(--gold-dark); }
        .nav-links { display: flex; gap: 36px; }
        .nav-link {
          font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 2.2px; text-transform: uppercase;
          color: var(--text-secondary); cursor: pointer;
          border: none; background: none;
          position: relative; padding-bottom: 6px;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1.5px; background: var(--gold);
          transition: width 0.35s cubic-bezier(.4,0,.2,1);
        }
        .nav-link:hover, .nav-link.active { color: var(--gold-dark); }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }

        /* Gold divider line */
        .gold-rule {
          width: 56px; height: 2px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          border-radius: 1px;
        }

        /* Section labels */
        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--gold-dark); margin-bottom: 14px;
        }

        /* Hero */
        .hero-wrap {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 120px 28px 80px; position: relative; z-index: 1;
        }
        .hero-grid {
          max-width: 1180px; width: 100%; display: grid;
          grid-template-columns: 5fr 4fr; gap: 72px; align-items: center;
        }
        .hero-text-col { position: relative; z-index: 2; }

        /* large watermark letter behind title */
        .hero-watermark {
          position: absolute;
          top: -30px; left: -28px;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 340px; line-height: 0.85;
          color: rgba(30, 58, 95, 0.04);
          pointer-events: none; user-select: none;
          z-index: 0;
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; gap: 52px; }
          .hero-book-col { order: -1; }
          .hero-watermark { font-size: 220px; top: -18px; left: -14px; }
        }

        /* Book cover */
        .book-shadow-wrap {
          display: flex; justify-content: center; align-items: center;
        }
        .book-cover-frame {
          position: relative; width: 280px;
        }
        .book-cover-frame img {
          width: 100%; border-radius: 6px 12px 12px 6px;
          box-shadow: 10px 16px 56px rgba(30, 58, 95, 0.25), 0 0 60px rgba(201, 168, 76, 0.07);
          position: relative; z-index: 2;
        }
        .book-spine {
          position: absolute; left: -6px; top: 3px; bottom: 3px;
          width: 8px; background: linear-gradient(180deg, #b8cfe0, #8aafcc);
          border-radius: 3px 0 0 3px; z-index: 1;
        }
        .book-glow {
          position: absolute; inset: -24px;
          background: radial-gradient(ellipse, rgba(201, 168, 76, 0.14) 0%, transparent 68%);
          z-index: 0; border-radius: 50%;
        }

        /* Hero text */
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; line-height: 1.0;
          color: var(--blue-deep);
          position: relative; z-index: 1;
        }
        .hero-title .line { display: block; }
        .hero-title .line-the {
          font-size: clamp(28px, 3.2vw, 38px);
          letter-spacing: 12px; text-transform: uppercase;
          color: var(--text-muted); font-weight: 400;
          margin-bottom: 2px;
        }
        .hero-title .line-urban {
          font-size: clamp(72px, 10vw, 108px);
          color: var(--blue-deep); line-height: 0.95;
        }
        .hero-title .line-dreamer {
          font-size: clamp(72px, 10vw, 108px);
          color: var(--gold-dark); font-style: italic; line-height: 0.95;
        }

        .hero-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 500; color: var(--blue-deep);
          line-height: 1.4; margin-top: 28px; position: relative; z-index: 1;
        }
        .hero-subtitle em { color: var(--gold-dark); font-style: italic; font-weight: 600; }

        .hero-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; color: var(--text-secondary);
          line-height: 1.6; margin-top: 18px; position: relative; z-index: 1;
        }
        .hero-tagline strong { color: var(--blue-deep); font-weight: 600; }

        .hero-meta {
          margin-top: 28px; display: flex; align-items: center; gap: 18px;
          position: relative; z-index: 1;
        }
        .hero-meta-author {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; color: var(--text-secondary);
        }
        .hero-meta-author strong { color: var(--blue-deep); font-weight: 600; }

        /* Email form */
        .email-form { margin-top: 36px; }
        .email-input-wrap {
          position: relative;
          border: 1.5px solid rgba(30, 58, 95, 0.2);
          border-radius: 8px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(6px);
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .email-input-wrap:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
        }
        .email-input {
          width: 100%; padding: 15px 18px;
          background: transparent; border: none; outline: none;
          font-family: 'Space Mono', monospace; font-size: 13px;
          color: var(--text-primary);
        }
        .email-input::placeholder { color: var(--text-muted); }
        .email-input:disabled { opacity: 0.5; }

        .btn-primary {
          display: block; width: 100%; margin-top: 12px;
          padding: 15px 24px; border: none; cursor: pointer;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: #fff; font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
          box-shadow: 0 4px 18px rgba(201, 168, 76, 0.35);
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(201, 168, 76, 0.45); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .form-note {
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: var(--text-muted); margin-top: 12px; text-align: center;
          letter-spacing: 0.5px;
        }
        .form-msg {
          font-family: 'Space Mono', monospace;
          font-size: 11px; text-align: center; margin-top: 10px;
        }
        .form-msg.success { color: #2e7d5e; }
        .form-msg.error { color: #c0533a; }

        /* Blockquote strip */
        .quotes-section {
          position: relative; z-index: 1;
          padding: 110px 28px;
          background: linear-gradient(180deg, transparent 0%, rgba(30, 58, 95, 0.035) 100%);
        }
        .quotes-inner { max-width: 860px; margin: 0 auto; }

        /* big opening quotation mark */
        .quote-mark {
          font-family: 'Playfair Display', serif;
          font-size: 160px; line-height: 0.7;
          color: var(--gold); opacity: 0.35;
          margin-bottom: -16px;
        }

        /* lead quote — the one that stops you */
        .quote-lead {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 600; font-style: italic;
          color: var(--blue-deep); line-height: 1.35;
          margin-bottom: 48px;
        }

        /* divider between lead & supporting */
        .quote-divider {
          width: 48px; height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          margin-bottom: 40px;
        }

        /* two supporting quotes stacked */
        .quote-support {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 500; font-style: italic;
          color: var(--text-secondary); line-height: 1.55;
          padding-left: 24px;
          border-left: 2px solid rgba(201, 168, 76, 0.4);
          margin-bottom: 28px;
        }
        .quote-support:last-child { margin-bottom: 0; }

        /* "This book is for you" cards */
        .for-you-section {
          position: relative; z-index: 1;
          padding: 110px 28px;
        }
        .for-you-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: clamp(32px, 4.5vw, 44px); color: var(--blue-deep);
          text-align: center; margin-bottom: 64px; line-height: 1.2;
        }
        .for-you-heading .accent { color: var(--gold-dark); font-style: italic; }
        .for-you-list { max-width: 740px; margin: 0 auto; }

        .for-you-item {
          display: flex; align-items: flex-start; gap: 28px;
          padding: 32px 0;
          border-bottom: 1px solid rgba(30, 58, 95, 0.08);
          transition: transform 0.25s;
        }
        .for-you-item:last-child { border-bottom: none; }
        .for-you-item:hover { transform: translateX(6px); }

        .for-you-num {
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
          font-size: 42px; font-weight: 700; line-height: 1;
          color: var(--gold); opacity: 0.55;
          width: 52px; text-align: right;
          padding-top: 2px;
        }
        .for-you-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 23px; line-height: 1.55; color: var(--text-secondary);
          padding-top: 6px;
        }

        /* What you'll find */
        .find-section {
          position: relative; z-index: 1;
          padding: 110px 28px;
          background: linear-gradient(180deg, transparent, rgba(30, 58, 95, 0.028));
        }
        .find-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: clamp(32px, 4.5vw, 44px); color: var(--blue-deep);
          text-align: center; margin-bottom: 68px;
        }
        .find-list { max-width: 780px; margin: 0 auto; }
        .find-item {
          display: flex; align-items: flex-start; gap: 28px;
          padding: 36px 0; border-bottom: 1px solid rgba(30, 58, 95, 0.08);
        }
        .find-item:last-child { border-bottom: none; }

        .find-num {
          flex-shrink: 0; width: 52px; text-align: right;
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 700; line-height: 1;
          color: var(--gold); opacity: 0.45;
          padding-top: 0;
        }
        .find-item-title {
          font-family: 'Playfair Display', serif;
          font-weight: 600; font-size: 24px; color: var(--blue-deep);
          margin-bottom: 6px;
        }
        .find-item-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; color: var(--text-muted); line-height: 1.5;
        }

        /* Footer CTA */
        .cta-section {
          position: relative; z-index: 1;
          padding: 100px 28px;
        }
        .cta-inner {
          max-width: 620px; margin: 0 auto; text-align: center;
        }
        .cta-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 34px; color: var(--blue-deep);
          line-height: 1.25; margin-bottom: 18px;
        }
        .cta-heading .accent { color: var(--gold-dark); font-style: italic; }
        .cta-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; color: var(--text-secondary); margin-bottom: 36px;
        }

        /* Footer */
        .site-footer {
          position: relative; z-index: 1;
          padding: 48px 28px; text-align: center;
          border-top: 1px solid rgba(30, 58, 95, 0.1);
        }
        .footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 11px; color: var(--text-muted); letter-spacing: 0.8px;
        }
        .footer-trilogy {
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: rgba(30, 58, 95, 0.35);
          letter-spacing: 2px; text-transform: uppercase; margin-top: 8px;
        }

        /* About page */
        .about-hero {
          padding: 160px 28px 60px; position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
        }
        .about-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 52px; color: var(--blue-deep);
          margin-bottom: 12px;
        }
        .about-title .accent { color: var(--gold-dark); font-style: italic; }

        .about-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 320px 1fr; gap: 72px;
          padding: 0 28px;
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .about-book-col { max-width: 280px; margin: 0 auto; }
        }
        .about-content-block {
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(30, 58, 95, 0.1);
          border-radius: 14px; padding: 36px 32px;
          margin-bottom: 28px;
        }
        .about-content-block h3 {
          font-family: 'Playfair Display', serif;
          font-weight: 600; font-size: 22px; color: var(--blue-deep);
          margin-bottom: 18px;
        }
        .about-content-block h3 .accent { color: var(--gold-dark); }

        .journey-row {
          display: flex; align-items: baseline; gap: 14px;
          padding: 10px 0; border-bottom: 1px solid rgba(30, 58, 95, 0.06);
        }
        .journey-row:last-child { border-bottom: none; }
        .journey-num {
          font-family: 'Space Mono', monospace;
          font-size: 11px; color: var(--gold-dark); flex-shrink: 0;
        }
        .journey-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; color: var(--text-secondary);
        }
        .journey-label strong { color: var(--blue-deep); font-weight: 600; }

        .author-block {
          background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03));
          border: 1px solid rgba(201, 168, 76, 0.2);
        }
        .author-block p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; line-height: 1.65; color: var(--text-secondary);
          margin-bottom: 12px;
        }
        .author-block p:last-child { margin-bottom: 0; }
        .author-name {
          font-family: 'Playfair Display', serif;
          font-weight: 600; font-size: 20px; color: var(--gold-dark);
        }

        .trilogy-row {
          display: flex; align-items: center; gap: 16px;
          padding: 12px 0;
        }
        .trilogy-dot {
          width: 10px; height: 10px; border-radius: 50%;
          flex-shrink: 0;
        }
        .trilogy-dot.active { background: var(--gold); box-shadow: 0 0 8px rgba(201,168,76,0.4); }
        .trilogy-dot.upcoming { background: rgba(30, 58, 95, 0.2); }
        .trilogy-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; color: var(--text-secondary);
        }
        .trilogy-text strong { color: var(--blue-deep); font-weight: 600; }
        .trilogy-text .muted { color: var(--text-muted); font-style: italic; }

        .btn-outline {
          display: inline-block;
          padding: 14px 40px; border: 1.5px solid var(--gold);
          border-radius: 8px; cursor: pointer; background: transparent;
          font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase;
          color: var(--gold-dark);
          transition: background 0.25s, color 0.25s, box-shadow 0.25s, transform 0.2s;
        }
        .btn-outline:hover {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: #fff;
          box-shadow: 0 4px 18px rgba(201,168,76,0.35);
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          opacity: 0; animation: fadeUp 0.75s cubic-bezier(.4,0,.2,1) forwards;
        }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.22s; }
        .d3 { animation-delay: 0.34s; }
        .d4 { animation-delay: 0.46s; }
        .d5 { animation-delay: 0.58s; }
        .d6 { animation-delay: 0.7s; }
      `}</style>

      {/* Ambient orbs & grain */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="grain-overlay" />

      {/* Navigation */}
      <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo">THE <span>AFRICAN</span> TRILOGY</div>
          <div className="nav-links">
            {navLinks.map((p) => (
              <button key={p} className={`nav-link ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ━━━ HOME ━━━ */}
      {page === 'home' && (
        <>
          {/* Hero */}
          <section className="hero-wrap">
            <div className="hero-grid">
              {/* Book */}
              <div className="hero-book-col book-shadow-wrap anim-fade-up d1">
                <div className="book-cover-frame">
                  <div className="book-glow" />
                  <div className="book-spine" />
                  <img src="/COVER 1.webp" alt="The Urban Dreamer" />
                </div>
              </div>

              {/* Text */}
              <div className="hero-text-col">
                <div className="hero-watermark">U</div>
                <p className="section-label anim-fade-up d1">Book One of the WeDemo Trilogy</p>
                <h1 className="hero-title anim-fade-up d2">
                  <span className="line line-the">THE</span>
                  <span className="line line-urban">Urban</span>
                  <span className="line line-dreamer">Dreamer</span>
                </h1>
                <div className="gold-rule anim-fade-up d3" style={{ marginTop: 26 }} />
                <p className="hero-subtitle anim-fade-up d3">An Autopsy of a Broken Promise <em>& A Journey to Anew</em></p>
                <p className="hero-tagline anim-fade-up d4">
                  For every disillusioned graduate of a broken promise.<br />
                  This is not a success story. This is <strong>an autopsy.</strong>
                </p>
                <div className="hero-meta anim-fade-up d4">
                  <div className="gold-rule" style={{ width: 28 }} />
                  <span className="hero-meta-author">by <strong>Fred Osege</strong></span>
                </div>

                {/* Email signup */}
                <div className="email-form anim-fade-up d5">
                  <form onSubmit={handleSubmit}>
                    <div className="email-input-wrap">
                      <input className="email-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your.email@reality.ke" required disabled={status === 'loading'} />
                    </div>
                    <button className="btn-primary" type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Submitting…' : 'Get Notified'}
                    </button>
                  </form>
                  {message && <p className={`form-msg ${status === 'success' ? 'success' : 'error'}`}>{message}</p>}
                  <p className="form-note">No spam. No bullshit. Just the truth.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quotes */}
          <section className="quotes-section">
            <div className="quotes-inner">
              <p className="section-label" style={{ textAlign: 'center', marginBottom: 44 }}>From the pages</p>
              <div className="quote-mark">"</div>
              <p className="quote-lead">
                This is not a success story. This is not a motivational book. This is an autopsy of a promise.
              </p>
              <div className="quote-divider" />
              <p className="quote-support">
                The promise that if you study hard, get good grades, secure a degree, and follow the old script handed down to you, you will be safe. You will arrive. You will belong.
              </p>
              <p className="quote-support">
                This book documents what happens when that promise breaks.
              </p>
            </div>
          </section>

          {/* This Book Is For */}
          <section className="for-you-section">
            <div style={{ maxWidth: 740, margin: '0 auto' }}>
              <p className="section-label" style={{ textAlign: 'center' }}>Resonance</p>
              <h2 className="for-you-heading">This book is for you <span className="accent">if…</span></h2>
              <div className="for-you-list">
                {[
                  "You have a certificate that feels like a receipt for time spent, not a ticket to a future.",
                  "You know the specific anxiety of checking your balance before replying to a friend's 'Let's meet.'",
                  "You have performed 'okay' in a room where you were falling apart.",
                  "You're building a life no one in your circle recognizes as success.",
                  "You are tired of being told you are 'still finding yourself' when you are actually building something in the dark.",
                  "You've outgrown the dreams your family still expects you to chase."
                ].map((item, i) => (
                  <div className="for-you-item" key={i}>
                    <span className="for-you-num">{String(i + 1).padStart(2, '0')}</span>
                    <p className="for-you-text">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What You'll Find */}
          <section className="find-section">
            <div style={{ maxWidth: 780, margin: '0 auto' }}>
              <p className="section-label" style={{ textAlign: 'center' }}>Contents</p>
              <h2 className="find-heading">What you will find here</h2>
              <div className="find-list">
                {[
                  { title: "Raw Testimony", desc: "Forensic analysis of broken systems." },
                  { title: "The Mathematics of Survival", desc: "The quiet violence of inherited expectations." },
                  { title: "The Architecture of a Dream", desc: "That had to be dismantled to be rebuilt." },
                  { title: "Uncomfortable Truths", desc: "About yourself, your choices, and the systems you operate within." }
                ].map((item, i) => (
                  <div className="find-item" key={i}>
                    <span className="find-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="find-item-title">{item.title}</p>
                      <p className="find-item-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="cta-section">
            <div className="cta-inner">
              <p className="section-label" style={{ textAlign: 'center' }}>Coming soon</p>
              <h2 className="cta-heading">The building begins<br /><span className="accent">in the next book</span></h2>
              <p className="cta-sub">This ends at a Threshold. <em>The African Dream</em> continues the journey.</p>
              <form onSubmit={handleSubmit}>
                <div className="email-input-wrap">
                  <input className="email-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your.email@reality.ke" required disabled={status === 'loading'} style={{ textAlign: 'center' }} />
                </div>
                <button className="btn-primary" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting…' : 'Join the Waiting List'}
                </button>
              </form>
              {message && <p className={`form-msg ${status === 'success' ? 'success' : 'error'}`}>{message}</p>}
            </div>
          </section>

          {/* Footer */}
          <footer className="site-footer">
            <p className="footer-copy">© 2026 Fred Osege. All rights reserved.</p>
            <p className="footer-trilogy">The Urban Dreamer · Book One of the WeDemo Trilogy</p>
          </footer>
        </>
      )}

      {/* ━━━ ABOUT ━━━ */}
      {page === 'about' && (
        <>
          <div className="about-hero">
            <p className="section-label anim-fade-up d1">The Story Behind the Pages</p>
            <h1 className="about-title anim-fade-up d2">About the <span className="accent">Book</span></h1>
            <div className="gold-rule anim-fade-up d3" style={{ marginTop: 16 }} />
          </div>

          <div className="about-grid">
            {/* Book col */}
            <div className="about-book-col">
              <div className="book-shadow-wrap">
                <div className="book-cover-frame">
                  <div className="book-glow" />
                  <div className="book-spine" />
                  <img src="/COVER 1.webp" alt="The Urban Dreamer" />
                </div>
              </div>
            </div>

            {/* Content col */}
            <div>
              {/* Synopsis */}
              <div className="about-content-block">
                <h3>The <span className="accent">Urban Dreamer</span></h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 14 }}>
                  An Autopsy of a Broken Promise & A Journey to Anew
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, lineHeight: 1.7, color: 'var(--text-muted)' }}>
                  This book documents what happens when the promise breaks. Not in a dramatic, single moment, but slowly, quietly, over years—in the queue for a hostel room that doesn't exist, in the silence after a job interview that never calls back, in the weight of a parent's hope when your pocket holds only receipts.
                </p>
              </div>

              {/* The Journey */}
              <div className="about-content-block">
                <h3>The <span className="accent">Journey</span></h3>
                {[
                  { num: "01", label: "False Arrival", desc: "The promise and immediate disillusionment" },
                  { num: "02", label: "Urban Survival Education", desc: "The city's harsh curriculum outside lecture halls" },
                  { num: "03", label: "The Splitting", desc: "When paths diverge and comparison becomes currency" },
                  { num: "04", label: "The Autopsy", desc: "Forensic examination of inherited vs. lived realities" }
                ].map((j, i) => (
                  <div className="journey-row" key={i}>
                    <span className="journey-num">{j.num}</span>
                    <span className="journey-label"><strong>{j.label}</strong> — {j.desc}</span>
                  </div>
                ))}
              </div>

              {/* Author */}
              <div className="about-content-block author-block">
                <h3>About the <span className="accent">Author</span></h3>
                <p><span className="author-name">Fred Osege</span> is a Kenyan Software Developer and first-generation digital worker from Kisii County, now based in Nairobi.</p>
                <p>His path has been defined by navigating the gap between education and economic reality—working variously as a teacher, Bitcoin trader, academic writer, parcel handler, cyber café owner, and software engineer.</p>
                <p>He is currently building WeDemo Africa, an ecosystem for African freelancers. Whether it works, he's still finding out.</p>
              </div>

              {/* Trilogy */}
              <div className="about-content-block">
                <h3>The <span className="accent">WeDemo Trilogy</span></h3>
                <div className="trilogy-row">
                  <div className="trilogy-dot active" />
                  <span className="trilogy-text"><strong>Book 1: The Urban Dreamer</strong> — The diagnosis</span>
                </div>
                <div className="trilogy-row">
                  <div className="trilogy-dot upcoming" />
                  <span className="trilogy-text"><strong>Book 2: The African Dream</strong> <span className="muted">— The building (Coming)</span></span>
                </div>
                <div className="trilogy-row">
                  <div className="trilogy-dot upcoming" />
                  <span className="trilogy-text"><strong>Book 3: The Short City Stretch</strong> <span className="muted">— The arrival (Coming)</span></span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 32 }}>
                <button className="btn-outline" onClick={() => setPage('home')}>Join the Waiting List</button>
              </div>
            </div>
          </div>

          <footer className="site-footer">
            <p className="footer-copy">© 2026 Fred Osege. All rights reserved.</p>
            <p className="footer-trilogy">The Urban Dreamer · Book One of the WeDemo Trilogy</p>
          </footer>
        </>
      )}
    </div>
  );
}