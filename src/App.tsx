import { useRef } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./index.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Replace this with your real Crewcom email address.
const EMAIL = "yourreal@email.com";

const LETTERS = "CREWCOM".split("");

const STATEMENT =
  "We help businesses turn ideas into a strong online presence with thoughtful design, powerful development and technology built to scale.".split(
    " "
  );

const ROW_ONE = ["Design", "Frontend", "Backend", "Launch"];
const ROW_TWO = ["Strategy", "Build", "Ship", "Grow"];

function MarqueeRow({ words, className }: { words: string[]; className: string }) {
  const tripled = [...words, ...words, ...words];
  return (
    <div className={`marquee-row ${className}`}>
      {tripled.map((word, index) => (
        <span key={`${word}-${index}`} className="marquee-item">
          <span>{word}</span>
          <b>✦</b>
        </span>
      ))}
    </div>
  );
}

const SERVICES = [
  {
    cls: "service-blue",
    number: "01",
    eyebrow: "Make a strong first impression",
    title: "UI/UX Design",
    text: "Clean, thoughtful interfaces that make your brand feel clear, credible and easy to use.",
    icon: "✳",
  },
  {
    cls: "service-orange",
    number: "02",
    eyebrow: "Turn visitors into customers",
    title: "Frontend Development",
    text: "Fast, responsive websites and web applications built for every screen and interaction.",
    icon: "⌘",
  },
  {
    cls: "service-pink",
    number: "03",
    eyebrow: "Power what happens behind the scenes",
    title: "Backend Development",
    text: "Reliable APIs, databases, authentication and integrations that keep your product running.",
    icon: "〈〉",
  },
  {
    cls: "service-green",
    number: "04",
    eyebrow: "Ready for the real world",
    title: "Launch & Scale",
    text: "Deployment, performance improvements and scalable foundations as your business grows.",
    icon: "↗",
  },
];

const STEPS = [
  { number: "01", title: "Discover", text: "We learn about your business, your audience and what success should look like." },
  { number: "02", title: "Design", text: "We shape the experience and agree on a clear direction before development." },
  { number: "03", title: "Develop", text: "We build the frontend and backend, sharing progress with you along the way." },
  { number: "04", title: "Launch", text: "We test, deploy and help you move forward with confidence." },
];

const PROJECTS = [
  {
    name: "Hire9",
    type: "Collaborative ATS platform",
    description: "A streamlined hiring experience for modern teams.",
    cls: "project-hire9",
    mark: "H9",
  },
  {
    name: "CrewIncentives",
    type: "Community platform",
    description: "A rewards-driven platform built around an active creator community.",
    cls: "project-crew",
    mark: "✦",
  },
  {
    name: "MailFlow",
    type: "Email infrastructure",
    description: "A bulk mailing platform designed around custom SMTP connections.",
    cls: "project-mail",
    mark: "✉",
  },
];

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const select = gsap.utils.selector(root);

      // Reading progress bar works on every screen size.
      gsap.to("#bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
      });

      // Keep motion restrained for visitors who request reduced motion.
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const heroLetters = select(".hero-letter i");
        const track = select(".service-track")[0] as HTMLElement | undefined;

        let removeGlowListener: (() => void) | undefined;
        if (glow.current && window.matchMedia("(pointer: fine)").matches) {
          const moveX = gsap.quickTo(glow.current, "x", { duration: 0.65, ease: "power3" });
          const moveY = gsap.quickTo(glow.current, "y", { duration: 0.65, ease: "power3" });
          const onMove = (event: globalThis.MouseEvent) => {
            moveX(event.clientX);
            moveY(event.clientY);
          };
          window.addEventListener("mousemove", onMove);
          removeGlowListener = () => window.removeEventListener("mousemove", onMove);
        }

        gsap.from(heroLetters, {
          yPercent: 120,
          rotate: 14,
          opacity: 0,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.065,
        });
        gsap.from(select(".hero-copy, .hero-actions, .hero-proof"), {
          opacity: 0,
          y: 22,
          duration: 0.9,
          delay: 0.45,
          stagger: 0.12,
          ease: "power3.out",
        });

        // A restrained hero transition: keep the headline readable and let the page scroll naturally.
        gsap.to(".hero-orb", {
          y: 35,
          scale: 1.08,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(select(".marquee-one"), { xPercent: -33.333, duration: 22, ease: "none", repeat: -1 });
        gsap.fromTo(select(".marquee-two"), { xPercent: -33.333 }, { xPercent: 0, duration: 26, ease: "none", repeat: -1 });

        gsap.set(select(".statement-word"), { opacity: 0.18 });
        gsap.to(select(".statement-word"), {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".statement",
            start: "top 78%",
            end: "bottom 52%",
            scrub: true,
          },
        });

        // Horizontal service gallery on desktop; mobile uses a normal card stack.
        media.add("(min-width: 761px)", () => {
          if (!track) return;
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 24);
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: ".services-section",
              pin: true,
              scrub: 1,
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
            },
          });
          select(".service-card .service-orb").forEach((shape) => {
            gsap.to(shape, {
              rotation: 240,
              scale: 1.45,
              ease: "none",
              scrollTrigger: {
                trigger: ".services-section",
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: true,
              },
            });
          });
        });

        gsap.to(".process-line-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".process-list",
            start: "top 72%",
            end: "bottom 72%",
            scrub: true,
          },
        });
        select(".process-step").forEach((step, index) => {
          gsap.from(step, {
            x: index % 2 ? 70 : -70,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          });
        });

        gsap.from(select(".project-card"), {
          y: 55,
          opacity: 0,
          stagger: 0.16,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".work-section", start: "top 72%" },
        });

        gsap.from(".final-title", {
          scale: 0.72,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".final-section",
            start: "top 86%",
            end: "top 28%",
            scrub: true,
          },
        });

        return () => removeGlowListener?.();
      });

      return () => media.revert();
    },
    { scope: root }
  );

  const magnetMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    gsap.to(element, {
      x: (event.clientX - bounds.left - bounds.width / 2) * 0.18,
      y: (event.clientY - bounds.top - bounds.height / 2) * 0.18,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const magnetLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,.4)" });
  };

  return (
    <div ref={root}>
      <div id="bar" />
      <div id="glow" ref={glow} />

      <nav className="top-nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Crewcom home">Crewcom<span>.</span></a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
        </div>
        <a className="nav-cta" href="#contact">Start a project <span>↗</span></a>
      </nav>

      <main>
        <section className="hero" id="top">
          <div className="hero-grid" />
          <div className="hero-orb" />
          <div className="hero-inner">
            <div className="hero-kicker"><span className="status-dot" /> Digital product & web studio</div>
            <h1 className="hero-title" aria-label="Crewcom">
              {LETTERS.map((letter, index) => (
                <span className="hero-letter" key={`${letter}-${index}`}><i>{letter}</i></span>
              ))}
            </h1>
            <h2 className="hero-headline">Build. <span>Scale.</span> Grow online.</h2>
            <p className="hero-copy">
              We design and develop digital experiences that help businesses move forward — from the first idea to a product ready to grow.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact" onMouseMove={magnetMove} onMouseLeave={magnetLeave}>Start a project <span>↗</span></a>
              <a className="button button-ghost" href="#work">Explore our work <span>↓</span></a>
            </div>
            <div className="hero-proof">
              <div><strong>Design-first</strong><span>Thoughtful experiences</span></div>
              <div><strong>End-to-end</strong><span>From UI to deployment</span></div>
              <div><strong>Built to scale</strong><span>Ready for what’s next</span></div>
            </div>
          </div>
          <a className="scroll-cue" href="#intro"><span /> Scroll to explore</a>
          <div className="hero-side-note">INDEPENDENT DIGITAL STUDIO · EST. 2026</div>
        </section>


        <div className="marquee" aria-hidden="true">
          <MarqueeRow words={ROW_ONE} className="marquee-one" />
          <MarqueeRow words={ROW_TWO} className="marquee-outline marquee-two" />
        </div>

        <section className="statement section-wrap" id="intro">
          <div className="section-kicker">A little about us <span>✳</span></div>
          <p className="statement-copy">
            {STATEMENT.map((word, index) => (
              <span className="statement-word" key={`${word}-${index}`}>{word} </span>
            ))}
          </p>
          <div className="statement-foot"><span>ONE CREW. THE WHOLE BUILD.</span><span>SCROLL TO SEE HOW <b>↓</b></span></div>
        </section>

        <section className="services-section" id="services">
          <div className="services-heading">
            <div className="section-kicker">What we do <span>✳</span></div>
            <h2>Everything you need.<br /><span>One crew.</span></h2>
            <p>Bring us the idea. We’ll help you shape it, build it and put it out into the world.</p>
          </div>
          <div className="service-track">
            {SERVICES.map((service) => (
              <article className={`service-card ${service.cls}`} key={service.title}>
                <div className="service-card-top"><span>{service.number} / 04</span><span className="service-icon">{service.icon}</span></div>
                <div className="service-orb" />
                <div className="service-card-bottom">
                  <span className="service-eyebrow">{service.eyebrow}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <a href="#contact" aria-label={`Discuss ${service.title}`}>Let’s talk <span>↗</span></a>
                </div>
              </article>
            ))}
          </div>
          <div className="services-hint">SCROLL TO EXPLORE SERVICES <span>→</span></div>
        </section>

        <section className="process-section section-wrap" id="process">
          <div className="process-intro">
            <div className="section-kicker">No mystery, just momentum <span>✳</span></div>
            <h2>A simple process.<br /><span>Good work, together.</span></h2>
            <p>Clear communication at every step. You’ll always know what we’re working on and what comes next.</p>
          </div>
          <div className="process-list">
            <div className="process-line"><span className="process-line-fill" /></div>
            {STEPS.map((step) => (
              <article className="process-step" key={step.number}>
                <span className="process-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
                <span className="process-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="work-section section-wrap" id="work">
          <div className="work-heading">
            <div><div className="section-kicker">Selected work <span>✳</span></div><h2>Made with purpose.</h2></div>
            <p>A few things we’ve been building across products, platforms and digital experiences.</p>
          </div>
          <div className="project-grid">
            {PROJECTS.map((project, index) => (
              <article className="project-card" key={project.name}>
                <div className={`project-visual ${project.cls}`}>
                  <div className="project-window">
                    <div className="window-top"><span /><span /><span /><i>{project.name}</i></div>
                    <div className="project-mark">{project.mark}</div>
                    <div className="project-lines"><span /><span /><span /></div>
                    <div className="project-pill">{project.type}</div>
                  </div>
                  <span className="project-index">0{index + 1}</span>
                </div>
                <div className="project-info"><div><h3>{project.name}</h3><span>{project.type}</span></div><p>{project.description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="final-section" id="contact">
          <div className="final-glow" />
          <div className="final-content">
            <div className="section-kicker">Have something in mind? <span>✳</span></div>
            <h2 className="final-title">Let’s build<br /><span>what’s next.</span></h2>
            <p>Tell us where you want to go. We’ll help you figure out how to get there.</p>
            <a
              className="button button-primary final-button"
              href={`mailto:${EMAIL}?subject=Project%20enquiry%20for%20Crewcom`}
              onMouseMove={magnetMove}
              onMouseLeave={magnetLeave}
            >Start a conversation <span>↗</span></a>
            <span className="final-email">OR WRITE TO US AT {EMAIL}</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top">Crewcom<span>.</span></a>
        <span>Design. Develop. Deliver.</span>
        <span>© {new Date().getFullYear()} Crewcom. All rights reserved.</span>
      </footer>
    </div>
  );
}
