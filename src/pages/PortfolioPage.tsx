// PortfolioPage.tsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "../components/ThemeProvider";
import { Header } from "../components/shared/Header";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { ContactForm } from "../components/ContactForm";
import { Footer } from "../components/shared/Footer";
import { PORTFOLIO_INFO } from "../config/portfolioData";
import { About } from "../components/About";
import { AppleHelloEnglishEffect } from "../components/HelloEffects";
import type { Project } from "../types/portfolio";
import { ProjectModal } from "../components/ProjectModal";
import { ScrollProgressBar } from "../components/shared/ScrollProgressBar";
import { ScrollToTop } from "../components/shared/ScrollToTop";
import CLIResume from "../components/CLIResume";
import { BackgroundBeams } from "../components/BackgroundBeams";
import * as SiIcons from "react-icons/si";
import { HiUserGroup } from "react-icons/hi";

const PortfolioPage: React.FC = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [showCLI, setShowCLI] = useState(false);
  const [showHello, setShowHello] = useState(true);

  return (
    <ThemeProvider>
      <ScrollProgressBar />
      <Header
        links={[
          { href: "#about", label: "About" },
          { href: "#experience", label: "Experience" },
          { href: "#projects", label: "Projects" },
          { href: "#skills", label: "Skills" },
          { href: "#organization", label: "Organization" },
          { href: "#contact", label: "Contact" },
        ]}
      />
      {/* CLI panel (docked / overlay) */}
      <CLIResume open={showCLI} onClose={() => setShowCLI(false)} />

      {/* About / hero: hidden while hello animation plays */}
      <AnimatePresence>
        {showHello && (
          <motion.div
            key="hello-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AppleHelloEnglishEffect
              className="text-white"
              onAnimationComplete={() => setShowHello(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        id="about"
        className="relative w-full flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 pb-0"
        style={{ minHeight: "100vh" }}
        initial={{ opacity: 0, y: 8 }}
        animate={showHello ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 z-0" style={{ height: "140vh" }}>
          <BackgroundBeams />
        </div>
        <div className="relative z-10 w-full max-w-6xl 2xl:max-w-7xl mx-auto py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="grid items-center">
            <About />
          </div>
        </div>
      </motion.section>
      
      <main className="max-w-6xl 2xl:max-w-9xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative z-20">
        {/* Work Experience Section */}
        <section id="experience" className="py-6 sm:py-8 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brand)] mb-2">Work Experience</h2>
          <p className="mb-6 sm:mb-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            My professional journey and internship experiences
          </p>
          <div className="space-y-6 sm:space-y-8">
            {PORTFOLIO_INFO.experience?.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="relative pl-6 sm:pl-8 pb-6 sm:pb-8 border-l-2 border-[var(--border)] last:pb-0 group hover:border-[var(--brand)] transition-colors"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[7px] sm:-left-[9px] top-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[var(--brand)] border-2 sm:border-4 border-[var(--background)] group-hover:scale-125 transition-transform" />
                
                <div className="bg-[var(--surface)] rounded-xl p-4 sm:p-6 border border-[var(--border)] hover:border-[var(--brand)] transition-all duration-300 hover:shadow-lg">
                  {/* Header */}
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--text)] mb-1">
                      {exp.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--muted)]">
                      <span className="font-medium text-[var(--brand)]">{exp.company}</span>
                      {exp.location && (
                        <>
                          <span>•</span>
                          <span>{exp.location}</span>
                        </>
                      )}
                      {exp.date && (
                        <>
                          <span>•</span>
                          <span>
                            {typeof exp.date === 'string'
                              ? exp.date
                              : `${exp.date.start} - ${exp.date.end || 'Present'}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {exp.summary && (
                    <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                      {exp.summary}
                    </p>
                  )}

                  {/* Bullets */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-[var(--text)] flex items-start">
                          <span className="text-[var(--brand)] mr-2 mt-1">▸</span>
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech tags */}
                  {exp.tech && exp.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="py-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brand)]">Projects</h2>
          <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selected work — click a card for details.
          </p>
          <ProjectsGrid
            projects={PORTFOLIO_INFO.projects}
            onOpen={setSelected}
          />
        </section>

        <section id="skills" className="py-6 sm:py-8 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brand)] mb-2">Skills</h2>
          <p className="mb-6 sm:mb-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Technical expertise and professional capabilities
          </p>
          <div className="grid gap-4 sm:gap-6">
            {PORTFOLIO_INFO.skills?.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="bg-[var(--surface)] rounded-xl p-4 sm:p-6 border border-[var(--border)] hover:border-[var(--brand)] transition-all duration-300"
              >
                {/* Group Header */}
                <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 pb-2 border-b border-[var(--border)]">
                  {group.title}
                </h3>
                
                {/* Skills Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {group.skills?.map((skill, skillIdx) => {
                    // Dynamically import icon if available
                    const IconComponent = skill.icon
                      ? (SiIcons as any)[skill.icon]
                      : null;
                    
                    return (
                      <div
                        key={skillIdx}
                        className="group relative bg-[var(--background)] rounded-lg p-3 sm:p-4 border border-[var(--border)] hover:border-[var(--brand)]/50 transition-all duration-300 hover:shadow-md"
                      >
                        {/* Skill header with icon and name */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          {IconComponent && (
                            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                              <IconComponent className="text-xl sm:text-2xl text-[var(--brand)] group-hover:scale-110 transition-transform" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text)] text-xs sm:text-sm truncate">
                              {skill.name}
                            </div>
                            {skill.years && (
                              <div className="text-[10px] sm:text-xs text-[var(--muted)] mt-0.5">
                                {skill.years} {skill.years === 1 ? 'year' : 'years'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress bar */}
                        {skill.level && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                              <span className="text-[10px] sm:text-xs text-[var(--muted)]">Proficiency</span>
                              <span className="text-[10px] sm:text-xs font-medium text-[var(--brand)]">{skill.level}%</span>
                            </div>
                            <div className="h-1 sm:h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--brand)] rounded-full transition-all duration-500 group-hover:bg-[var(--brand)]/80"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Note */}
                        {skill.note && (
                          <p className="text-[10px] sm:text-xs text-[var(--muted)] mt-2 line-clamp-2">
                            {skill.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Soft Skills Section */}
        <section className="py-6 sm:py-8 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brand)] mb-2">Soft Skills</h2>
          <p className="mb-6 sm:mb-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Professional competencies and interpersonal abilities
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {PORTFOLIO_INFO.extras?.softSkills?.map((skill, idx) => (
              <div
                key={idx}
                className="group relative bg-[var(--surface)] rounded-xl p-4 sm:p-5 border border-[var(--border)] hover:border-[var(--brand)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Icon and Title */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  {skill.icon && (
                    <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                      {skill.icon}
                    </div>
                  )}
                  <h3 className="text-sm sm:text-base font-semibold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                    {skill.name}
                  </h3>
                </div>
                
                {/* Description */}
                {skill.description && (
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {skill.description}
                  </p>
                )}

                {/* Decorative gradient */}
                <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tl from-[var(--brand)]/5 to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>

        {/* Organization Section */}
        <section id="organization" className="py-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brand)] mb-2">Organization</h2>
          <p className="mb-6 sm:mb-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Leadership and community involvement activities
          </p>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {PORTFOLIO_INFO.extras?.organizations?.map((org, idx) => (
              <div
                key={idx}
                className="group relative bg-[var(--surface)] rounded-xl p-4 sm:p-6 border border-[var(--border)] hover:border-[var(--brand)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Icon header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center group-hover:bg-[var(--brand)]/20 transition-colors">
                    <HiUserGroup className="text-xl sm:text-2xl text-[var(--brand)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-1 group-hover:text-[var(--brand)] transition-colors">
                      {org.name}
                    </h3>
                    {org.role && (
                      <p className="text-xs sm:text-sm font-medium text-[var(--brand)]">
                        {org.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date */}
                {org.date && (
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs text-[var(--muted)]">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{org.date}</span>
                  </div>
                )}

                {/* Description */}
                {org.description && (
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {org.description}
                  </p>
                )}

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl from-[var(--brand)]/5 to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brand)]">Contact</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tell me about your project, or just say hi.
          </p>
          <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Contact Form - Takes 3 columns on large screens */}
            <div className="lg:col-span-3 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <ContactForm />
            </div>

            {/* Contact Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-4">
              {/* Collaboration Card */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-[var(--text)]">Let's collaborate</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      I'm available for freelance and contract work. My inbox is open.
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Available for work</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Card */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="font-semibold text-sm sm:text-base text-[var(--text)] mb-3">Quick contact</div>
                <div className="space-y-2">
                  <a 
                    href="mailto:rachelnababan0509@gmail.com"
                    className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--brand)] transition-colors group"
                  >
                    <svg className="w-4 h-4 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">rachelnababan0509@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Medan, Indonesia</span>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="font-semibold text-sm sm:text-base text-[var(--text)] mb-3">Connect with me</div>
                <div className="flex flex-wrap gap-2">
                  {PORTFOLIO_INFO.personal.contact?.socials?.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg)] hover:bg-[var(--border)]/30 border border-[var(--border)] transition-all hover:scale-105 text-xs sm:text-sm"
                      title={social.label}
                    >
                      <span className="text-[var(--brand)]">
                        {social.icon === "SiLinkedin" && "💼"}
                        {social.icon === "SiGithub" && "🔗"}
                      </span>
                      <span className="text-[var(--muted)]">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Resume Download Card */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--brand)]/20">
                <div className="font-semibold text-sm sm:text-base text-[var(--text)] mb-2">Resume</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Download my full CV for more details about my experience and skills.
                </p>
                <a
                  href="/RachelNababan_CV.pdf"
                  download="RachelNababan_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white transition-all hover:scale-[1.02] text-xs sm:text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ScrollToTop />
      <Footer />

      <ProjectModal
        project={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </ThemeProvider>
  );
};

export default PortfolioPage;
