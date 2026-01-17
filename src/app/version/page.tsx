"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Code2,
  Database,
  Layout,
  Server,
  ShieldCheck,
  GitBranch,
  Terminal,
  Cpu,
  Github,
  Linkedin,
  Mail,
  Globe,
  CheckCircle2,
  MessageCircleMore,
  Instagram,
} from "lucide-react";

export default function TechnicalPage() {
  // --- 1. DEVELOPER DETAILS (EDIT THIS) ---
  const developer = {
    name: "Muhammed Salih KC", // Replace with your actual name
    role: "Full Stack Developer",
    // Replace with your actual image path (e.g., /images/me.jpg) or keep null for initials
    image: "/images/profile_image.jpg",
    location: "Kerala, India",
    email: "mskc9539@gmail.com",
    github: "https://github.com/msalihkc",
    whatsapp: "https://wa.me/+919745524214",
    instagram: "https://www.instagram.com/m.salih.kc/",
    linkedin: "https://linkedin.com/in/sinan",
    portfolio: "/version",
    bio: "I am a passionate developer focused on building scalable, user-centric applications. With a strong foundation in modern web technologies, I built the Nora Foods platform to bridge the gap between authentic homemade products and digital convenience. I specialize in Next.js ecosystems and database architecture.",
    skills: [
      "React & Next.js",
      "TypeScript",
      "Database Design",
      "UI/UX Architecture",
      "System Security",
    ],
  };

  // --- 2. TECH STACK DATA ---
  const techStack = [
    {
      name: "Next.js 14",
      icon: <Layout className="w-5 h-5" />,
      desc: "App Router Framework",
    },
    {
      name: "Supabase",
      icon: <Database className="w-5 h-5" />,
      desc: "Backend & Auth",
    },
    {
      name: "Tailwind CSS",
      icon: <Code2 className="w-5 h-5" />,
      desc: "Styling Engine",
    },
    {
      name: "Zustand",
      icon: <Cpu className="w-5 h-5" />,
      desc: "State Management",
    },
    {
      name: "Vercel",
      icon: <Server className="w-5 h-5" />,
      desc: "Cloud Deployment",
    },
    {
      name: "TypeScript",
      icon: <Terminal className="w-5 h-5" />,
      desc: "Type Safety",
    },
  ];

  // --- 3. VERSION DATA ---
  const currentVersion = "v1.2.0";
  const changelog = [
    {
      version: "v1.2.0",
      date: "Oct 2023",
      desc: "WhatsApp Order Integration & UI Polish",
    },
    {
      version: "v1.1.0",
      date: "Sep 2023",
      desc: "Admin Dashboard & Product Management",
    },
    {
      version: "v1.0.0",
      date: "Aug 2023",
      desc: "Initial Launch & Core Architecture",
    },
  ];

  return (
    <div className="min-h-screen bg-nora-beige font-sans text-stone-800 flex flex-col">
      <Navbar type="customer" />

      <main className="flex-grow pb-20">
        {/* --- HEADER --- */}
        <div className="bg-primary pt-20 pb-32 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-nora-beige mb-4">
            Technical Documentation
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-lg">
            Engineering credits, system architecture, and release notes for the
            Nora Foods Platform.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* --- MAIN SECTION: DEVELOPER SPOTLIGHT --- */}
          {/* This card overlaps the header for a modern look */}
          <div className="relative -mt-20 bg-white rounded-3xl shadow-xl border border-primary/10 overflow-hidden mb-16">
            <div className="flex flex-col md:flex-row">
              {/* Left: Image & Socials */}
              <div className="md:w-2/5 bg-stone-50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-stone-100">
                <div className="w-48 h-48 rounded-full bg-white p-1.5 shadow-lg mb-6 relative">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-stone-200 flex items-center justify-center">
                    {developer.image ? (
                      <Image
                        src={developer.image}
                        alt={developer.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-serif font-bold text-secondary">
                        {developer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div
                    className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"
                    title="Available to Hire"
                  ></div>
                </div>

                <h2 className="text-2xl font-serif font-bold text-stone-800">
                  {developer.name}
                </h2>
                <p className="text-primary font-medium mb-1">
                  {developer.role}
                </p>
                <p className="text-stone-400 text-sm mb-6 flex items-center gap-1 justify-center">
                  <Globe size={12} /> {developer.location}
                </p>

                <div className="flex gap-3">
                  <Link
                    href={developer.github}
                    target="_blank"
                    className="p-3 bg-white border border-stone-200 rounded-full text-stone-600 hover:text-primary hover:border-primary transition-all shadow-sm"
                  >
                    <Github size={20} />
                  </Link>
                  <Link
                    href={developer.whatsapp}
                    target="_blank"
                    className="p-3 bg-white border border-stone-200 rounded-full text-stone-600 hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm"
                  >
                    <MessageCircleMore size={20} />
                  </Link>
                  <Link
                    href={developer.instagram}
                    target="_blank"
                    className="p-3 bg-white border border-stone-200 rounded-full text-stone-600 hover:text-[#C13584] hover:border-[#C13584] transition-all shadow-sm"
                  >
                    <Instagram size={20} />
                  </Link>
                  {/* <Link
                    href={developer.linkedin}
                    target="_blank"
                    className="p-3 bg-white border border-stone-200 rounded-full text-stone-600 hover:text-[#0077b5] hover:border-[#0077b5] transition-all shadow-sm"
                  >
                    <Linkedin size={20} />
                  </Link> */}
                  <Link
                    href={`mailto:${developer.email}`}
                    className="p-3 bg-white border border-stone-200 rounded-full text-stone-600 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                  >
                    <Mail size={20} />
                  </Link>
                </div>
              </div>

              {/* Right: Bio & Skills */}
              <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">
                    About the Architect
                  </h3>
                  <p className="text-lg text-stone-600 leading-relaxed">
                    {developer.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">
                    Core Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {developer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-nora-beige rounded-lg text-stone-700 font-medium text-sm border border-stone-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-stone-400 uppercase">
                      Status
                    </span>
                    <span className="text-green-600 font-bold flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Open to Work
                    </span>
                  </div>
                  <Link
                    href={developer.portfolio}
                    target="_blank"
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-stone-800 transition-colors"
                  >
                    View Portfolio
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* --- SECONDARY: TECH STACK & INFO --- */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tech Stack Grid */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-secondary mb-6 flex items-center gap-2">
                  <Terminal className="text-primary" /> Technologies Used
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {techStack.map((tech, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-stone-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-nora-beige rounded-lg flex items-center justify-center text-stone-700">
                        {tech.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800">
                          {tech.name}
                        </h4>
                        <p className="text-xs text-stone-500">{tech.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health / Misc */}
              {/* <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-200 text-green-800 rounded-full">
                    <ShieldCheck />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900">System Secure</h4>
                    <p className="text-sm text-green-700">
                      Protected by Supabase RLS Policies
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold uppercase text-green-600">
                    Uptime
                  </p>
                  <p className="font-mono font-bold text-green-900">99.9%</p>
                </div>
              </div> */}
            </div>

            {/* Version History (Timeline) */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-secondary">
                  Version History
                </h3>
                <span className="px-2 py-1 bg-stone-100 text-stone-500 text-xs font-mono rounded">
                  {currentVersion}
                </span>
              </div>

              <div className="relative border-l-2 border-stone-100 ml-2 space-y-8">
                {changelog.map((log, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div
                      className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        idx === 0 ? "bg-primary" : "bg-stone-300"
                      }`}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-stone-800 flex items-center gap-2">
                        {log.version}
                        {idx === 0 && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded uppercase">
                            Latest
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-stone-400 mb-1">
                        {log.date}
                      </span>
                      <p className="text-sm text-stone-600 leading-snug">
                        {log.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
