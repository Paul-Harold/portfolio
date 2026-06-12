import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, useSpring, useScroll, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

import profilePhoto from './img/harry.png';

// --- Reveal-on-scroll wrapper ---
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </Motion.div>
  );
}

// --- Editorial section heading ---
function SectionHeading({ number, title }) {
  return (
    <Reveal className="flex items-baseline gap-4 mb-12">
      <span className="font-serif italic text-accent text-xl md:text-2xl">{number}</span>
      <h3 className="font-serif text-3xl md:text-5xl text-ink tracking-tight">{title}</h3>
      <div className="h-px bg-ink/10 flex-1 self-center hidden sm:block" />
    </Reveal>
  );
}

// --- Project card (light) ---
function ProjectCard({ title, description, tech, live, repo, delay = 0 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group h-full bg-white border border-ink/10 rounded-2xl p-7 flex flex-col shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-5">
          <h4 className="font-serif text-2xl text-ink group-hover:text-accent transition-colors">{title}</h4>
          <div className="flex gap-3">
            {repo && (
              <a href={repo} target="_blank" rel="noopener noreferrer" aria-label={`${title} GitHub repository`} className="text-ink/40 hover:text-accent transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
              </a>
            )}
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" aria-label={`${title} live site`} className="text-ink/40 hover:text-accent transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            )}
          </div>
        </div>
        <p className="text-ink/60 text-sm leading-relaxed flex-1 mb-6">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span key={t} className="text-xs font-medium text-ink/50 bg-ink/[0.04] border border-ink/[0.06] rounded-full px-3 py-1">{t}</span>
          ))}
        </div>
      </Motion.div>
    </Reveal>
  );
}

const NAVIGATION = ['home', 'about', 'projects', 'experience', 'skills', 'education', 'contact'];
const MARQUEE_TECH = ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Supabase', 'Tailwind CSS', 'React Native', 'Firebase'];

const PROJECTS = [
  {
    title: 'Anivie',
    description: 'An anime and movie discovery and tracking platform — a centralized hub to search titles, view detailed series information, and track viewing progress in real time. Built on the MERN stack for a fast, responsive experience.',
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind'],
    live: 'https://anivie.vercel.app/',
    repo: 'https://github.com/Paul-Harold/Anivie',
  },
  {
    title: 'Midnight',
    description: 'An e-commerce platform for PC components built with React 18, Vite, and Tailwind CSS. Features custom global state management, LocalStorage persistence, and Supabase integration for CRUD operations and secure authentication.',
    tech: ['React 18', 'Supabase', 'Tailwind', 'Vite', 'Resend'],
    live: 'https://ecommerce-chi-liard-73.vercel.app/',
    repo: 'https://github.com/Paul-Harold/ecommerce',
  },
  {
    title: 'Snypp',
    description: 'A modern note-taking and snippet management tool designed for productivity and collaboration. Features Kanban-style boards and agile workflows to organize notes, tasks, and ideas, with real-time sharing and editing.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    live: 'https://snypp.vercel.app/',
  },
  {
    title: 'ElderCare',
    description: 'An AI-integrated native Android app for patient care management. Built with Java, featuring Hugging Face sentiment analysis of caregiver notes, Firebase Firestore cloud sync, and Firebase Auth for secure access.',
    tech: ['Java', 'Android Studio', 'Hugging Face', 'Firebase'],
    repo: 'https://github.com/Paul-Harold/ElderCare',
  },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const form = useRef();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Track which section is in view for the nav highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAVIGATION.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (section) => {
    setMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('paulharold.batiles@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setFormStatus('success');
      e.target.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    }, (error) => {
      console.log(error.text);
      setFormStatus('idle');
      alert('Message not sent. Please try again or use the copy email button.');
    });
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased">

      {/* Scroll progress bar */}
      <Motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]" style={{ scaleX }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-paper/85 backdrop-blur-md border-b border-ink/[0.06] z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => scrollToSection('home')} className="font-serif text-xl text-ink tracking-tight">
            Paul Harold<span className="text-accent">.</span>
          </button>
          <div className="hidden md:flex gap-7">
            {NAVIGATION.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-[13px] font-medium capitalize transition-colors duration-300 ${
                  activeSection === item ? 'text-accent' : 'text-ink/50 hover:text-ink'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden text-ink p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-ink/[0.06] bg-paper"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {NAVIGATION.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`text-left text-sm font-medium capitalize ${
                      activeSection === item ? 'text-accent' : 'text-ink/60'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-28 md:space-y-36">

        {/* HERO */}
        <section id="home" className="scroll-mt-32">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-3">
              <Motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="font-serif italic text-accent text-lg mb-5"
              >
                Hello, my name is
              </Motion.p>
              <Motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-5xl md:text-7xl text-ink leading-[1.05] tracking-tight mb-6"
              >
                Paul Harold<br />Batiles<span className="text-accent">.</span>
              </Motion.h1>
              <Motion.h2
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl font-semibold text-ink/40 mb-7"
              >
                Full Stack Developer — MERN
              </Motion.h2>
              <Motion.p
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-xl text-ink/60 text-lg leading-relaxed mb-10"
              >
                I'm a Full-Stack Developer and Information Technology graduate. I focus on building
                responsive, accessible, and highly interactive applications, ensuring peak system
                performance from the UI down to the database.
              </Motion.p>
              <Motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-7 py-3.5 bg-ink text-paper font-semibold text-sm rounded-full hover:bg-accent transition-colors duration-300"
                >
                  View My Work
                </button>
                <a
                  href="/Resume-Batiles_Paulharold (3).pdf"
                  download="Resume-Batiles_Paulharold.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 border border-ink/20 text-ink font-semibold text-sm rounded-full hover:border-ink hover:bg-ink/[0.03] transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download Resume
                </a>
              </Motion.div>
            </div>

            {/* Portrait in a dark bento card — the black background is the design */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-2 max-w-sm mx-auto w-full"
            >
              <div className="relative bg-[#0B0B0D] rounded-3xl overflow-hidden shadow-2xl shadow-ink/20">
                <img
                  src={profilePhoto}
                  alt="Paul Harold Batiles"
                  className="w-full aspect-[4/5] object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-5 px-6 flex items-end justify-between">
                  <div>
                    <p className="text-white font-serif text-lg leading-tight">Paul Harold Batiles</p>
                    <p className="text-white/50 text-xs mt-1">Manila, Philippines</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-accent mb-1.5" />
                </div>
              </div>
            </Motion.div>
          </div>
        </section>

        {/* TECH MARQUEE */}
        <div className="w-full overflow-hidden whitespace-nowrap py-5 border-y border-ink/[0.07]">
          <Motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 22 }}
            className="flex gap-14 text-sm font-medium text-ink/30 uppercase tracking-[0.2em]"
          >
            {MARQUEE_TECH.concat(MARQUEE_TECH).map((tech, i) => (
              <span key={i} className="flex items-center gap-14">
                {tech}<span className="text-accent/40">·</span>
              </span>
            ))}
          </Motion.div>
        </div>

        {/* ABOUT */}
        <section id="about" className="scroll-mt-32">
          <SectionHeading number="01" title="About Me" />
          <div className="grid md:grid-cols-12 gap-10">
            <Reveal className="md:col-span-7 space-y-5 text-ink/65 leading-relaxed text-lg">
              <p>
                As an Information Technology graduate, I have a solid understanding of the complete
                software development life cycle, including rigorous testing and troubleshooting protocols.
              </p>
              <p>
                I'm still learning and picking up new things as I go, but I've already shipped a range of
                projects — a full-stack hotel reservation platform, a MERN anime tracker, a PC hardware
                store using Supabase, and a note-taking tool built with Next.js. I also have experience
                with mobile development using React Native and Firebase. I focus on writing clean,
                organized code so my projects actually work and stay easy to maintain.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="md:col-span-5">
              <div className="bg-white border border-ink/10 rounded-2xl p-7 space-y-5 shadow-sm">
                <h4 className="font-serif text-xl text-ink">Quick Facts</h4>
                <ul className="space-y-3 text-sm text-ink/60">
                  <li className="flex gap-3"><span className="text-accent">—</span> BS Information Technology, T.I.P. Manila</li>
                  <li className="flex gap-3"><span className="text-accent">—</span> Consistent Dean's Lister (2021–2025)</li>
                  <li className="flex gap-3"><span className="text-accent">—</span> Business App Developer Intern @ NOAH</li>
                  <li className="flex gap-3"><span className="text-accent">—</span> Open to full-time opportunities</li>
                  <li className="flex gap-3"><span className="text-accent">—</span> Based in Manila, Philippines</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-32">
          <SectionHeading number="02" title="Projects" />

          {/* Featured: InnFind — dark bento card to echo the portrait */}
          <Reveal className="mb-8">
            <div className="relative bg-[#0B0B0D] rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl shadow-ink/20">
              <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Featured Project</span>
                  <div className="flex gap-4">
                    <a href="https://github.com/Paul-Harold/InnFind" target="_blank" rel="noopener noreferrer" aria-label="InnFind GitHub repository" className="text-white/40 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
                    </a>
                    <a href="https://innfind.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="InnFind live site" className="text-white/40 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                </div>
                <a href="https://innfind.vercel.app" target="_blank" rel="noopener noreferrer">
                  <h4 className="font-serif text-3xl md:text-5xl text-white mb-5 hover:text-accent transition-colors w-max max-w-full">InnFind</h4>
                </a>
                <p className="text-white/60 leading-relaxed max-w-3xl mb-8">
                  A full-stack hotel reservation platform for browsing and booking hotels across the
                  Philippines. Search by destination and filter by price, amenities, and rating; book
                  rooms with live availability checks, date-overlap validation, and server-side pricing;
                  manage upcoming and past stays from a personal dashboard; and leave star-rated reviews
                  gated to completed stays. Includes a full admin panel with stats, hotel and room CRUD,
                  and booking status management — all backed by a REST API with JWT authentication.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React 19', 'React Router v7', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Vercel + Render'].map((t) => (
                    <span key={t} className="text-xs font-medium text-white/60 bg-white/[0.06] border border-white/10 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.title} {...project} delay={i * 0.08} />
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="scroll-mt-32">
          <SectionHeading number="03" title="Experience" />
          <Reveal>
            <div className="bg-white border border-ink/10 rounded-2xl p-8 md:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 gap-2">
                <h4 className="font-serif text-2xl text-ink">Business Application Developer Intern</h4>
                <span className="text-accent font-medium text-sm">Feb 2025 — May 2025</span>
              </div>
              <p className="text-ink/50 font-medium text-sm uppercase tracking-widest mb-7">NOAH Business Applications · Makati City</p>
              <ul className="space-y-3 text-ink/65">
                <li className="flex gap-3"><span className="text-accent">—</span> Contributed to the development and maintenance of enterprise-level business applications.</li>
                <li className="flex gap-3"><span className="text-accent">—</span> Engaged in functional testing and Software Quality Assurance to ensure optimal performance.</li>
                <li className="flex gap-3"><span className="text-accent">—</span> Collaborated with cross-functional teams to diagnose issues and implement scalable solutions.</li>
              </ul>
            </div>
          </Reveal>
        </section>

        {/* SKILLS */}
        <section id="skills" className="scroll-mt-32">
          <SectionHeading number="04" title="Skills" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Front-End & Mobile', skills: ['React.js', 'Next.js', 'React Native', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Framer Motion', 'HTML5 & CSS3'] },
              { label: 'Back-End', skills: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Supabase', 'Firebase', 'Java', 'PHP', 'MySQL', 'JWT'] },
              { label: 'Architecture', skills: ['RESTful APIs', 'AI API Integration', 'State Management', 'Responsive Design', 'UI/UX Implementation', 'Web Accessibility', 'Software QA Testing'] },
              { label: 'Tools', skills: ['Git & GitHub', 'Vite', 'Vercel', 'Render', 'Postman', 'Android Studio', 'Linux / Bash', 'VS Code', 'Claude Code', 'Gemini'] },
            ].map((group, i) => (
              <Reveal key={group.label} delay={i * 0.08}>
                <div className="bg-white border border-ink/10 rounded-2xl p-7 h-full shadow-sm">
                  <h4 className="font-serif text-lg text-ink mb-5 pb-3 border-b border-ink/[0.07]">{group.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span key={skill} className="text-xs font-medium text-ink/55 bg-ink/[0.04] border border-ink/[0.06] rounded-full px-3 py-1.5 hover:border-accent/40 hover:text-accent transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="scroll-mt-32">
          <SectionHeading number="05" title="Education & Training" />
          <div className="space-y-6">
            <Reveal>
              <div className="bg-white border border-ink/10 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-3 md:gap-12">
                <div className="md:w-1/4 text-accent font-medium">2021 — 2025</div>
                <div className="md:w-3/4">
                  <h4 className="font-serif text-xl text-ink mb-1">Bachelor of Science in Information Technology</h4>
                  <p className="text-ink/50 text-sm uppercase tracking-widest mb-2">Technological Institute of the Philippines, Manila</p>
                  <p className="text-ink/55">Consistent Dean's Lister (2021 – 2025).</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-white border border-ink/10 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-3 md:gap-12">
                <div className="md:w-1/4 text-accent font-medium">Certification</div>
                <div className="md:w-3/4">
                  <h4 className="font-serif text-xl text-ink mb-1">Responsive Web Design Certification</h4>
                  <p className="text-ink/50 text-sm uppercase tracking-widest mb-2">FreeCodeCamp</p>
                  <p className="text-ink/55">Completed curriculum covering web development theories, workshops, and laboratories focused on modern web standards and accessibility.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-32">
          <Reveal className="text-center mb-12">
            <p className="font-serif italic text-accent text-lg mb-3">06. What's next?</p>
            <h3 className="font-serif text-4xl md:text-6xl text-ink tracking-tight mb-5">Get In Touch</h3>
            <p className="text-ink/60 text-lg max-w-2xl mx-auto">
              I am actively looking for new opportunities to apply my full-stack expertise and IT
              background. Whether you have a question or just want to connect, my inbox is always open.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-10 md:gap-14 bg-white border border-ink/10 rounded-3xl p-8 md:p-12 shadow-sm">
              {/* Info */}
              <div className="space-y-8 flex flex-col justify-center">
                <div>
                  <h4 className="font-serif text-2xl text-ink mb-2">Contact Information</h4>
                  <p className="text-ink/50">Let's connect and discuss how I can bring value to your team.</p>
                </div>
                <div className="space-y-5">
                  <button onClick={handleCopyEmail} className="flex items-center gap-4 text-ink/60 hover:text-accent transition-colors group relative w-max">
                    <span className="p-3 bg-ink/[0.04] rounded-xl group-hover:bg-accent/10 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <span className="text-sm font-medium">paulharold.batiles@gmail.com</span>
                    <AnimatePresence>
                      {copied && (
                        <Motion.span
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute -top-9 left-12 bg-ink text-paper px-3 py-1 rounded-lg text-xs font-semibold shadow-lg"
                        >
                          Copied!
                        </Motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <div className="flex items-center gap-4 text-ink/60 w-max">
                    <span className="p-3 bg-ink/[0.04] rounded-xl">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </span>
                    <span className="text-sm font-medium">09205278696</span>
                  </div>
                  <div className="flex items-center gap-4 text-ink/60 w-max">
                    <span className="p-3 bg-ink/[0.04] rounded-xl">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <span className="text-sm font-medium">Sampaloc, Manila</span>
                  </div>
                  <a href="https://github.com/Paul-Harold" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-ink/60 hover:text-accent transition-colors group w-max">
                    <span className="p-3 bg-ink/[0.04] rounded-xl group-hover:bg-accent/10 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
                    </span>
                    <span className="text-sm font-medium">github.com/Paul-Harold</span>
                  </a>
                </div>
              </div>

              {/* Form */}
              <form ref={form} onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-ink/40 uppercase tracking-widest mb-2">Name</label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    className="w-full bg-paper border border-ink/15 rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink/40 uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    className="w-full bg-paper border border-ink/15 rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink/40 uppercase tracking-widest mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    className="w-full bg-paper border border-ink/15 rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                    placeholder="Hello, I'd like to discuss an opportunity..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={formStatus !== 'idle'}
                  className="w-full py-4 bg-ink text-paper font-semibold text-sm rounded-xl hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {formStatus === 'idle' && (
                    <>
                      Send Message
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                  {formStatus === 'submitting' && (
                    <>
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  )}
                  {formStatus === 'success' && (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Message Sent
                    </>
                  )}
                </button>
              </form>
            </div>
          </Reveal>
        </section>

      </main>

      <footer className="text-center py-10 border-t border-ink/[0.07] text-ink/40 text-sm">
        <p>Designed & built by <span className="font-serif italic text-ink/60">Paul Harold Batiles</span></p>
      </footer>
    </div>
  );
}
