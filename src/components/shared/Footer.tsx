import React from "react";
import { SiGithub, SiLinkedin } from "react-icons/si";

export const Footer: React.FC = () => {
  return (
    <footer className="text-xs sm:text-sm text-[var(--muted)] border-t border-[var(--border)] py-4 sm:py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6">
        {/* Left: message */}
        <div className="text-center md:text-left">
          ❤️ by{" "}
          <span className="font-medium text-[var(--text)]">rachel</span>
        </div>

        {/* Right: social icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* <a
            href="https://www.kaggle.com/satyasubudhi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kaggle"
            className="hover:text-[var(--text)] transition-colors"
          >
            <SiKaggle size={40} />
          </a> */}
          <a
            href="https://github.com/RachelNababan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-[var(--text)] transition-colors"
          >
            <SiGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/rachel-putri-s-nababan-012a022b9/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[var(--text)] transition-colors"
          >
            <SiLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};
