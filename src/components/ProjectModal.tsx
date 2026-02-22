import React, { useEffect, useState } from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import remarkGfm from "remark-gfm";
import type { Project } from "../types/portfolio";
import { tagColors } from "../config/portfolioData";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Spinner } from "./shared/Spinner";

const ReactMarkdown = React.lazy(() => import("react-markdown"));

import "github-markdown-css/github-markdown-light.css";

export const ProjectModal: React.FC<{
  project: Project | null;
  open: boolean;
  onClose: () => void;
}> = ({ project, open, onClose }) => {
  const { dark } = useTheme();
  const [readme, setReadme] = useState<string | null>(null);
  const [iframeAllowed, setIframeAllowed] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "playground">(
    "details",
  );
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: bodyRef });

  const FaLink = FaIcons["FaLink" as keyof typeof FaIcons];

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab("details");
      setIframeLoaded(false);
      setIframeReady(false);
    }
  }, [open]);

  // Check if href can be embedded in iframe
  useEffect(() => {
    if (!project?.href) {
      setIframeAllowed(false);
      return;
    }
    if (
      project.href.includes("github.io") ||
      project.href.includes("vercel.app") ||
      project.href.includes("netlify.app")
    ) {
      setIframeAllowed(true);
    } else {
      setIframeAllowed(false);
    }
  }, [project]);

  // Fetch GitHub README
  useEffect(() => {
    async function fetchReadme() {
      if (!project) return;
      const githubLink = project.links?.find(
        (l) => l.label.toLowerCase() === "github",
      );
      if (!githubLink) {
        setReadme(null);
        return;
      }

      try {
        const regex = /github\.com\/([^/]+)\/([^/]+)/;
        const match = regex.exec(githubLink.url);
        if (!match) return;

        const [, owner, repo] = match;
        const res = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
        );

        if (res.ok) {
          setReadme(await res.text());
        } else {
          setReadme(null);
        }
      } catch {
        setReadme(null);
      }
    }
    if (open) fetchReadme();
  }, [open, project]);

  return (
    <div
      ref={bodyRef}
      className="flex-1 overflow-y-auto mt-2 pr-1 custom-scroll relative"
    >
      {/* progress bar lives *inside* the scroll container */}
      <motion.div
        className="sticky top-0 left-0 right-0 h-1 bg-[var(--border)]/50 z-10"
        style={{ transformOrigin: "left", scaleX: scrollYProgress }}
      />
      <AnimatePresence>
        {open && project && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              onClick={onClose}
              className="absolute inset-0 bg-[color:var(--bg)/0.6] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.dialog
              open={open}
              aria-modal="true"
              className="relative z-10 w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-lg flex flex-col"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 cursor-pointer text-[var(--muted)] hover:text-[var(--text)] p-2 rounded-full hover:bg-[var(--border)]/30 transition-colors z-20"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[var(--brand)] mb-3 sm:mb-2 pr-8">
                {project.title}
              </h3>

              {/* Tabs (only if iframe allowed) */}
              {iframeAllowed && (
                <div className="flex border-b border-[var(--border)] mb-3 sm:mb-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap ${
                      activeTab === "details"
                        ? "text-[var(--brand)] border-b-2 border-[var(--brand)]"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("playground");
                      setIframeLoaded(true);
                      setIframeReady(false);
                    }}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap ${
                      activeTab === "playground"
                        ? "text-[var(--brand)] border-b-2 border-[var(--brand)]"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    Playground
                  </button>
                </div>
              )}

              {/* Body (scroll only here) */}
              <div className="flex-1 overflow-y-auto pr-1 max-h-[60vh] sm:max-h-[500px] custom-scroll">
                <AnimatePresence mode="wait">
                  {activeTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Project image */}
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="rounded-lg border border-[var(--border)] mb-4 w-full h-auto object-cover max-h-60"
                        />
                      )}

                      {/* Date */}
                      {project.date && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-[var(--muted)]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {typeof project.date === 'string'
                              ? project.date
                              : `${project.date.start} - ${project.date.end || 'Present'}`}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-[var(--text)] mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Bullets/Achievements */}
                      {project.bullets && project.bullets.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-[var(--brand)] mb-2">Key Contributions</h4>
                          <ul className="space-y-2">
                            {project.bullets.map((bullet, i) => (
                              <li key={i} className="text-sm text-[var(--text)] flex items-start">
                                <span className="text-[var(--brand)] mr-2 mt-1">▸</span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tech Stack - Prominent Display */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-[var(--brand)] mb-2">Technologies Used</h4>
                          <div className="flex gap-2 flex-wrap">
                            {project.tags.map((t) => (
                              <span
                                key={t}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                                  tagColors[t] || "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      {(project.links || project.href) && (
                        <div className="mb-4 pb-4 border-b border-[var(--border)]">
                          <h4 className="text-xs sm:text-sm font-semibold text-[var(--brand)] mb-2">Project Links</h4>
                          <div className="flex gap-2 sm:gap-3 flex-wrap">
                            {project.href && (
                              <a
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border-2 border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-all"
                              >
                                {FaLink && <FaLink className="w-3 h-3 sm:w-4 sm:h-4" />} 
                                Live Demo
                              </a>
                            )}
                            {project.links?.map((link) => {
                              const Icon =
                                SiIcons[link.icon as keyof typeof SiIcons] ??
                                FaIcons[link.icon as keyof typeof FaIcons];
                              return (
                                <a
                                  key={link.label}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 transition-all"
                                >
                                  {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                                  {link.label}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* README */}
                      {readme && (
                        <div className="h-full overflow-auto rounded-md border border-[var(--border)] bg-[var(--surface)] mt-4">
                          <div
                            className="p-4 markdown-body"
                            style={{
                              backgroundColor: dark ? "#0d1117" : "white",
                              color: dark ? "white" : "black",
                            }}
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {readme}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "playground" &&
                    iframeAllowed &&
                    iframeLoaded && (
                      <motion.div
                        key="playground"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <AnimatePresence>
                          {!iframeReady && (
                            <motion.div
                              key="spinner"
                              className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/60 rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <Spinner size={40} color="var(--brand)" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="text-right">
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--brand)] hover:underline"
                          >
                            Open Fullscreen ↗
                          </a>
                        </div>

                        <iframe
                          src={project.href}
                          title={project.title}
                          className="w-full h-100 rounded-lg border border-[var(--border)]"
                          loading="lazy"
                          onLoad={() => setIframeReady(true)}
                        />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
