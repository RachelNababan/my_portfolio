// Header.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  animate,
  useMotionTemplate,
} from "framer-motion";
import { PiSunDuotone, PiMoonDuotone } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";

type NavLink = { href: string; label: string };

export const Header: React.FC<{ links?: NavLink[] }> = ({
  links = [],
}) => {
  const { dark, toggle } = useTheme();
  const headerRef = useRef<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [active, setActive] = useState<string>(links[0]?.href ?? "#about");
  useEffect(() => {
    const sections = links
      .map((l) =>
        l.href.startsWith("#") ? document.querySelector(l.href) : null,
      )
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [links]);

  const springScrollTo = (y: number) => {
    const controls = animate(window.scrollY, y, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
    return () => controls.stop();
  };

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // normal navigation for external links
    if (!href.startsWith("#")) return;

    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu on navigation
    const target = document.querySelector(href);
    if (!target) return;

    const headerEl = headerRef.current ?? document.querySelector("header");
    const headerH = headerEl?.offsetHeight ?? 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH;
    springScrollTo(y);
  };

  const { scrollY } = useScroll();
  const blurPx = useTransform(scrollY, [0, 100], [0, 16]);
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const overlayOpacity = useTransform(scrollY, [0, 100], [0, 0.14]);
  const backdrop = useMotionTemplate`blur(${blurPx}px)`;

  // NOTE: previously read PORTFOLIO_INFO.personal and BASE_URL here; removed unused bindings to satisfy TS checks.

  return (
    <motion.header
      ref={headerRef}
      className="fixed top-0 left-0 z-50 w-full"
      style={{
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
      }}
    >
      {/* Background layer */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[var(--surface)]"
        style={{
          opacity: bgOpacity,
        }}
      />
      {/* Border layer */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none bg-[var(--border)]"
        style={{
          opacity: borderOpacity,
        }}
      />
      {/* Dark overlay for depth */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: `rgba(0,0,0,1)`,
          opacity: overlayOpacity,
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Logo/Brand (optional, currently empty) */}
        <div className="flex items-center">
          {/* You can add a logo or brand name here if needed */}
        </div>

        {/* Right: nav + theme + mobile menu button */}
        <nav aria-label="Primary" className="relative flex items-center gap-3">
          {/* Desktop Navigation */}
          <div className="relative hidden md:flex gap-4">
            {links.map((l) => {
              const isActive = active === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => onNavClick(e, l.href)}
                  className="relative px-1 py-0.5 text-sm text-[var(--text)] hover:text-[var(--brand)] transition-colors"
                >
                  {l.label}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-[var(--brand)]"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 40,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </a>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle color theme"
            className="p-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)]/30 transition cursor-pointer"
          >
            {dark ? <PiSunDuotone size={22} /> : <PiMoonDuotone size={22} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)]/30 transition cursor-pointer"
          >
            {mobileMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--border)]"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 bg-[var(--surface)]/95 backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                {links.map((l) => {
                  const isActive = active === l.href;
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => onNavClick(e, l.href)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-[var(--brand)] text-white"
                          : "text-[var(--text)] hover:bg-[var(--border)]/30"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
