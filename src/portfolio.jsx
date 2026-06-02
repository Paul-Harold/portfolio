import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll } from 'framer-motion';
import emailjs from '@emailjs/browser';

import profilePhoto from './img/harry.png';

// --- ADVANCED DESIGN: Mouse-Tracking Spotlight Card ---
function SpotlightCard({ children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useSpring(0, { stiffness: 200, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    radius.set(300);
  }

  function handleMouseLeave() {
    radius.set(0);
  }

  return (
    <div
      className="relative group bg-[#0f1115]/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 overflow-hidden h-full shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useSpring(
            useMotionValue(`radial-gradient(circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(34, 211, 238, 0.1) 0%, transparent 80%)`),
            { stiffness: 50, damping: 10 }
          ),
        }}
      />
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(34, 211, 238, 0.3) 0%, transparent ${radius.get()}px)`,
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='2' rx='12' ry='12'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}

// --- MAIN PORTFOLIO COMPONENT ---
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  
  const form = useRef();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const navigation = ['home', 'about', 'projects', 'experience', 'skills', 'education', 'contact'];
  const marqueeTech = ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Supabase', 'Tailwind CSS'];

  const scrollToSection = (section) => {
    setActiveSection(section);
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
    .then((result) => {
        setFormStatus('success');
        e.target.reset();
        setTimeout(() => setFormStatus('idle'), 3000);
    }, (error) => {
        console.log(error.text);
        setFormStatus('idle');
        alert("Message not sent. Please try again or use the copy email button.");
    });
  };

  const containerReveal = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" } }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-gray-300 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-400 origin-left z-[60]" 
        style={{ scaleX }} 
      />

      {/* Dynamic Background Ambient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1], x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05], x: [0, -30, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900 rounded-full blur-[150px]"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#050608]/80 backdrop-blur-md border-b border-gray-800 z-50 mt-1">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-white font-black text-xl tracking-widest uppercase">PH<span className="text-cyan-400">.</span></span>
          <div className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeSection === item ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 space-y-32 relative z-10">
        
        {/* HERO SECTION */}
        <motion.section id="home" className="min-h-[75vh] flex flex-col justify-center" initial="hidden" animate="visible" variants={containerReveal}>
          <motion.p variants={itemReveal} className="text-cyan-400 font-mono text-sm md:text-base mb-4 tracking-widest">
            Hi, my name is
          </motion.p>
          <motion.h1 variants={itemReveal} className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            Paul Harold Batiles.
          </motion.h1>
          <motion.h2 variants={itemReveal} className="text-4xl md:text-6xl font-bold text-gray-500 mb-8 tracking-tight">
            Full Stack Developer
          </motion.h2>
          <motion.p variants={itemReveal} className="max-w-2xl text-gray-400 text-lg leading-relaxed mb-10">
            I'm a Full-Stack Developer (MERN) and Information Technology graduate. I focus on building responsive, accessible, and highly interactive user interfaces, ensuring peak system performance from the UI down to the database.
          </motion.p>
          <motion.div variants={itemReveal} className="flex flex-wrap gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(34, 211, 238, 0.4)" }}
              onClick={() => scrollToSection('projects')} 
              className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest rounded hover:bg-cyan-400/10 transition-all duration-300"
            >
              View My Work
            </motion.button>
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="/Resume-Batiles_Paulharold (2).pdf" 
              download="Resume-Batiles_Paulharold (2).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800/50 border-2 border-transparent text-white font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download Resume
            </motion.a>
          </motion.div>
        </motion.section>

        {/* SCROLLING TECH STACK MARQUEE */}
        <div className="w-full overflow-hidden flex whitespace-nowrap py-4 opacity-30 border-y border-gray-800/50">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
            className="flex gap-16 font-mono text-xl text-gray-500 uppercase tracking-widest"
          >
            {marqueeTech.concat(marqueeTech).map((tech, i) => (
              <span key={i}>{tech}</span>
            ))}
          </motion.div>
        </div>

        {/* ABOUT SECTION */}
        <section id="about" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">01. About Me</h3>
            <div className="h-px bg-gray-800 flex-1 max-w-xs"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 space-y-4 text-gray-400 leading-relaxed text-lg">
              <p>
                As an Information Technology graduate, I possess a solid understanding of the complete software development life cycle, including rigorous testing and troubleshooting protocols. 
              </p>
              <p>
                I’m still learning and picking up new things as I go, but I’ve already worked on a few different projects, including a MERN stack anime tracker, a PC hardware store using Supabase, and a note-taking tool built with Next.js. I also have experience with mobile development using React Native and Firebase. I just focus on writing clean, organized code so that my projects actually work and stay easy to manage.
              </p>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} className="relative group w-full max-w-[280px] mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative aspect-square bg-gray-900 border border-gray-800 rounded-xl overflow-hidden z-10 flex items-center justify-center">
                <img 
                  src={profilePhoto}
                  alt="Paul Harold Batiles" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">02. Projects</h3>
            <div className="h-px bg-gray-800 flex-1 max-w-xs"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            <SpotlightCard>
              <div className="flex justify-between items-center mb-6">
                <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <a href="https://anivie.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors transform hover:scale-110 z-20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
              <a href="https://anivie.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block mb-3 w-max z-20">
                <h4 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Anivie</h4>
              </a>
              <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                Anivie is a comprehensive anime/movie discovery and tracking platform designed for fans to explore, organize, and manage their personal watchlists. Built on the MERN stack, the application provides a centralized hub where users can search for titles, view detailed series information, and track their viewing progress in real-time. By leveraging MERN stack, Anivie delivers a fast, responsive interface that simplifies how enthusiasts stay connected with their favorite shows and upcoming releases.
              </p>
              <div className="flex flex-wrap gap-3 font-mono text-xs text-cyan-400/70 pt-4 border-t border-gray-800">
                <span>MongoDB</span><span>Express</span><span>React</span><span>Node.js</span><span>Tailwind</span><span>API</span>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="flex justify-between items-center mb-6">
                <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <a href="https://ecommerce-chi-liard-73.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors transform hover:scale-110 z-20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
              <a href="https://ecommerce-chi-liard-73.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block mb-3 w-max z-20">
                <h4 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Midnight</h4>
              </a>
              <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                An e-commerce platform for PC components. Built with React 18, Vite, and Tailwind CSS. Features custom global state management, LocalStorage persistence, and dynamic Supabase integration for CRUD operations and secure authentication.
              </p>
              <div className="flex flex-wrap gap-3 font-mono text-xs text-cyan-400/70 pt-4 border-t border-gray-800">
                <span>React 18</span><span>Supabase</span><span>Tailwind</span><span>Vite</span><span>Resend</span>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="flex justify-between items-center mb-6">
                <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <a href="https://snypp.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors transform hover:scale-110 z-20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
              <a href="https://snypp.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block mb-3 w-max z-20">
                <h4 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Snypp</h4>
              </a>
              <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                A modern note-taking and snippet management tool designed for productivity and collaboration. Features Kanban-style boards and agile workflows to organize notes, tasks, and ideas efficiently, with support for real-time sharing and editing.
              </p>
              <div className="flex flex-wrap gap-3 font-mono text-xs text-cyan-400/70 pt-4 border-t border-gray-800">
                <span>Next.js</span><span>TypeScript</span><span>Tailwind CSS</span>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="flex justify-between items-center mb-6">
                <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <a href="https://github.com/Paul-Harold/ElderCare" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors transform hover:scale-110 z-20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
              <a href="https://github.com/Paul-Harold/ElderCare" target="_blank" rel="noopener noreferrer" className="inline-block mb-3 w-max z-20">
                <h4 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">ElderCare</h4>
              </a>
              <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                An AI-integrated native Android application for patient care management. Developed with Java and Android Studio, featuring Hugging Face API integration for real-time Sentiment Analysis of caregiver notes. Leverages Firebase Firestore for instant cloud synchronization and Firebase Auth for secure user authentication and data protection.
              </p>
              <div className="flex flex-wrap gap-3 font-mono text-xs text-cyan-400/70 pt-4 border-t border-gray-800">
                <span>Java</span><span>Android Studio</span><span>Hugging Face (NLP)</span><span>Firebase</span>
              </div>
            </SpotlightCard>

          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">03. Experience</h3>
            <div className="h-px bg-gray-800 flex-1 max-w-xs"></div>
          </div>
          
          <SpotlightCard>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">Business Application Developer Intern (OJT)</h4>
              <span className="text-cyan-400 font-mono text-sm mt-2 md:mt-0">Feb 2025 — May 2025</span>
            </div>
            <h5 className="text-lg text-gray-400 mb-6 uppercase tracking-widest font-bold">NOAH Business Application, Makati City</h5>
            <ul className="space-y-3 text-gray-400 list-none relative z-20">
              <li className="flex gap-3"><span className="text-cyan-400">▹</span> Contributed to the development and maintenance of enterprise-level business applications.</li>
              <li className="flex gap-3"><span className="text-cyan-400">▹</span> Engaged in functional testing and Software Quality Assurance to ensure optimal performance.</li>
              <li className="flex gap-3"><span className="text-cyan-400">▹</span> Collaborated with cross-functional teams to diagnose issues and implement scalable solutions.</li>
            </ul>
          </SpotlightCard>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">04. Skills</h3>
            <div className="h-px bg-gray-800 flex-1 max-w-xs"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#0f1115]/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-widest uppercase border-b border-gray-800 pb-2">Front-End</h4>
              <ul className="space-y-2 text-gray-400 font-mono text-sm relative z-20">
                {['React.js', 'Next.js', 'Typescript', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 & CSS3'].map(skill => (
                  <motion.li key={skill} whileHover={{ x: 5, color: "#22d3ee" }} className="cursor-default transition-colors">▹ {skill}</motion.li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-widest uppercase border-b border-gray-800 pb-2">Back-End</h4>
              <ul className="space-y-2 text-gray-400 font-mono text-sm relative z-20">
                {['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Supabase', 'Firebase', 'PHP', 'MySQL','JWT'].map(skill => (
                  <motion.li key={skill} whileHover={{ x: 5, color: "#22d3ee" }} className="cursor-default transition-colors">▹ {skill}</motion.li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-widest uppercase border-b border-gray-800 pb-2">Architecture</h4>
              <ul className="space-y-2 text-gray-400 font-mono text-sm relative z-20">
                {['Vercel', 'Postman','Responsive Design', 'UI/UX Implementation', 'RESTful APIs','State Management', 'Web Accessibility', 'Software QA Testing'].map(skill => (
                  <motion.li key={skill} whileHover={{ x: 5, color: "#22d3ee" }} className="cursor-default transition-colors">▹ {skill}</motion.li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-widest uppercase border-b border-gray-800 pb-2">Tools</h4>
              <ul className="space-y-2 text-gray-400 font-mono text-sm relative z-20">
                {['Git & GitHub', 'Vite', 'Linux / Bash', 'VS Code'].map(skill => (
                  <motion.li key={skill} whileHover={{ x: 5, color: "#22d3ee" }} className="cursor-default transition-colors">▹ {skill}</motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">05. Education & Training</h3>
            <div className="h-px bg-gray-800 flex-1 max-w-xs"></div>
          </div>
          
          <div className="space-y-8 bg-[#0f1115]/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 pb-8 border-b border-gray-800">
              <div className="md:w-1/4 text-cyan-400 font-mono">2021 — 2025</div>
              <div className="md:w-3/4">
                <h4 className="text-xl font-bold text-white">Bachelor of Science in Information Technology</h4>
                <p className="text-gray-400 uppercase tracking-widest text-sm mb-2">Technological Institute of the Philippines, Manila</p>
                <p className="text-gray-500">Consistent Dean's Lister (2021 - 2025).</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-12">
              <div className="md:w-1/4 text-cyan-400 font-mono">Certification</div>
              <div className="md:w-3/4">
                <h4 className="text-xl font-bold text-white">Responsive Web Design Certification</h4>
                <p className="text-gray-400 uppercase tracking-widest text-sm mb-2">FreeCodeCamp</p>
                <p className="text-gray-500">Completed curriculum covering web development theories, workshops, and laboratories focused on modern web standards and accessibility.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- UPGRADED CONTACT SECTION WITH FORM --- */}
        <section id="contact" className="scroll-mt-24 max-w-5xl mx-auto py-20 relative">
          <p className="text-cyan-400 font-mono text-sm tracking-widest mb-4 text-center">06. What's Next?</p>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight text-center">Get In Touch</h3>
          <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl mx-auto">
            I am actively looking for new opportunities to apply my front-end expertise and IT background. Whether you have a question or just want to connect, my inbox is always open.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 bg-[#0f1115]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Left Column: Info */}
            <div className="space-y-8 relative z-10 flex flex-col justify-center">
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Contact Information</h4>
                <p className="text-gray-500">Let's connect and discuss how I can bring value to your team.</p>
              </div>
              
              <div className="space-y-6">
                <button 
                  onClick={handleCopyEmail}
                  className="flex items-center gap-4 text-gray-400 hover:text-cyan-400 transition-colors group relative w-max"
                >
                  <div className="p-3 bg-gray-900 rounded-lg group-hover:bg-cyan-400/10 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="font-mono text-sm">paulharold.batiles@gmail.com</span>
                  <AnimatePresence>
                    {copied && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-10 left-12 bg-cyan-400 text-[#050608] px-3 py-1 rounded text-xs font-bold shadow-lg"
                      >
                        Copied to clipboard!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <div className="flex items-center gap-4 text-gray-400 w-max">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <span className="font-mono text-sm">09205278696</span>
                </div>

                <div className="flex items-center gap-4 text-gray-400 w-max">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className="font-mono text-sm">Sampaloc, Manila</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <form ref={form} onSubmit={handleFormSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Name</label>
                <input 
                  type="text" 
                  name="user_name"
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  name="user_email"
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Message</label>
                <textarea 
                  name="message"
                  required
                  rows="4"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                  placeholder="Hello, I'd like to discuss an opportunity..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formStatus !== 'idle'}
                className="w-full py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest rounded hover:bg-cyan-400 hover:text-[#050608] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {formStatus === 'idle' && (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
                {formStatus === 'submitting' && (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transmitting...
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Message Sent
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

      </main>

      <footer className="text-center py-8 border-t border-gray-900 text-gray-600 font-mono text-sm relative z-10">
        <p>Built by Paul Harold Batiles.</p>
      </footer>
    </div>
  );
}