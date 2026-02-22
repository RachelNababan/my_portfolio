import { animate, motion } from "framer-motion";
import { useMemo } from "react";
import { PORTFOLIO_INFO } from "../config/portfolioData";
import type { AvatarItem } from "../types/portfolio";

// Senior-level hero: polished two-column layout with staggered entrances,
// animated feature bullets, strong CTAs, and a floating avatar emblem.
export const About: React.FC = () => {
  const personal = PORTFOLIO_INFO.personal;
  const name = personal.name ?? "Your Name";
  const avatar = personal.avatar;

  const features = useMemo(() => PORTFOLIO_INFO.highlights ?? [], []);
  const heroSummary =
    personal.hero?.summary ??
    personal.summary ??
    "I design and build production-grade frontends and APIs, focusing on performance, accessibility, and delightful UX.";

  const container = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Support avatar being:
  // - a single string URL
  // - a single object { url, label }
  // - an array of the above
  // Normalize AvatarItem (string | {url,label}) into a consistent object shape
  const normalizeAvatar = (a: AvatarItem) =>
    typeof a === "string" ? { url: a } : { url: a.url, label: a.label };

  let avatarItems: { url: string; label?: string }[] = [];
  if (Array.isArray(avatar)) {
    avatarItems = avatar.map((a) => normalizeAvatar(a));
  } else if (avatar) {
    avatarItems = [normalizeAvatar(avatar)];
  }

  const carouselItems =
    avatarItems.length > 0
      ? avatarItems.map((it, idx) => ({
          id: idx,
          image: it.url || "/placeholder-1.jpg",
          label: it.label ?? `Image ${idx + 1}`,
        }))
      : [{ id: 1, image: "/placeholder-1.jpg", label: "Profile" }];

  const springScrollTo = (y: number) => {
    const controls = animate(window.scrollY, y, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
    return () => controls.stop();
  };

  const navigateTo = (href: string) => {
    if (!href.startsWith("#")) {
      // external or file link — use location assign
      globalThis.location.href = href;
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    const headerEl = document.querySelector("header");
    const headerH = headerEl?.offsetHeight ?? 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH;
    springScrollTo(y);
  };

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return; // allow default for external links
    e.preventDefault();
    navigateTo(href);
  };

  const handleKeyActivation = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // support Enter and Space activating the anchor for keyboard users
    if (e.key === "Enter") {
      // for internal anchors, prevent default and animate scroll
      if (href.startsWith("#")) {
        e.preventDefault();
        navigateTo(href);
      }
      // else allow default (Enter will follow the link)
    } else if (e.key === " " || e.key === "Spacebar") {
      // Space should activate links like a button; prevent page scroll
      e.preventDefault();
      navigateTo(href);
    }
  };

  return (
    <section className="md:col-span-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch"
        >
          {/* Left: Headline + features + CTAs */}
          <motion.div variants={item} className="md:col-span-7 order-2 md:order-1 flex">
            <div className="panel-translucent relative overflow-hidden p-4 sm:p-6 md:p-8 rounded-2xl border border-[var(--border)] w-full">
              {/* Modern gradient border glow animation */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-0"
                style={{
                  background: "linear-gradient(90deg, #18CCFC, #6344F5, #AE48FF, #18CCFC)",
                  backgroundSize: "300% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              
              {/* Subtle glow effect */}
              <motion.div
                className="absolute -inset-[1px] rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(24, 204, 252, 0.1), rgba(174, 72, 255, 0.1))",
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight flex items-center gap-3">
                  {name}
                </h1>

                {personal.title && (
                  <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
                    {personal.title}
                  </div>
                )}

                <motion.p
                  variants={item}
                  className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl"
                >
                  {heroSummary}
                </motion.p>

                <motion.ul
                  variants={item}
                  className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
                >
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 sm:gap-3">
                      <svg
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-foreground/80 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M5 12l4 4L19 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm">{f}</span>
                    </li>
                  ))}
                </motion.ul>

                <motion.div
                  variants={item}
                  className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3"
                >
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold shadow-lg hover:opacity-95 transition-opacity"
                    onClick={(e) => onNavClick(e, "#projects")}
                    onKeyDown={(e) => handleKeyActivation(e, "#projects")}
                  >
                    See my work
                  </a>

                  <a
                    href="/RachelNababan_CV.pdf"
                    download="RachelNababan_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 sm:py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download resume
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Single Profile Frame */}
          <motion.div
            variants={item}
            className="md:col-span-5 flex items-stretch justify-center order-1 md:order-2"
          >
            <motion.div
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md h-auto md:h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Profile frame with modern styling - now matches height of left panel */}
              <div className="relative w-full h-full min-h-[400px] md:min-h-0 rounded-2xl overflow-hidden shadow-2xl">
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #18CCFC, #6344F5, #AE48FF)",
                    padding: "3px",
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <div className="w-full h-full bg-background rounded-2xl" />
                </motion.div>
                
                {/* Profile image */}
                <div className="absolute inset-[3px] rounded-2xl overflow-hidden">
                  {carouselItems[0]?.image && !carouselItems[0].image.includes("/placeholder") ? (
                    <img
                      src={carouselItems[0].image}
                      alt={carouselItems[0].label || "Profile"}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 text-white">
                      <div className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
                        {name?.[0] ?? "R"}
                      </div>
                      <div className="text-base sm:text-lg font-medium opacity-90 px-4 text-center">
                        {name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-2 rounded-2xl pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(24, 204, 252, 0.3), rgba(174, 72, 255, 0.3))",
                    filter: "blur(20px)",
                    zIndex: -1,
                  }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
