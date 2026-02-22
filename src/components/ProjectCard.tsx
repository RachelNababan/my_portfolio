// ProjectCard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { tagColors } from "../config/portfolioData";
import type { Project } from "../types/portfolio";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { CardContainer } from "./CardContainer";

export const ProjectCard: React.FC<{
  project: Project;
  onOpen?: (p: Project) => void;
}> = ({ project, onOpen }) => {
  const [showAll, setShowAll] = useState(false);

  // how many tags to show before "+x"
  const VISIBLE_COUNT = 3;

  const FaLink = FaIcons["FaLink" as keyof typeof FaIcons];

  const visibleTags = showAll
    ? project?.tags
    : project?.tags?.slice(0, VISIBLE_COUNT);
  const hiddenCount = (project?.tags?.length ?? 0) - VISIBLE_COUNT;

  return (
    <CardContainer
      href={project.href}
      onActivate={() => onOpen?.(project)}
      containerClassName="w-full h-full"
    >
      <motion.article
        layout
        whileHover={{ y: -6 }}
        className="p-3 sm:p-4 group rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow h-full"
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="w-full">
            {/* Arrow overlay */}
            <button
              title="Open project"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(project);
              }}
              className="absolute top-2 right-2 
                    bg-[var(--surface)]/80 backdrop-blur-sm 
                    rounded-full shadow-md cursor-pointer
                    hover:scale-110 transition duration-300
                    opacity-0 group-hover:opacity-100"
            >
              <span className="leading-none text-[var(--brand)]">
                <BsArrowUpRightCircleFill size={28} className="sm:w-8 sm:h-8" />
              </span>
            </button>
            {project.image && (
              <div className="w-full flex justify-center mb-3 sm:mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="rounded-lg border border-[var(--border)] w-full object-cover h-40 sm:h-45"
                />
              </div>
            )}
            {/* Title + Description */}
            <button
              title="Open project"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(project);
              }}
              className="font-bold text-base sm:text-lg md:text-xl text-[var(--brand)] cursor-pointer hover:underline text-left"
            >
              {project.title}
            </button>
            {project.isUnderDevelopment && (
              <span className="text-[10px] sm:text-xs text-[var(--muted)] pl-2">
                Under Development
              </span>
            )}
            
            {/* Date */}
            {project.date && (
              <div className="flex items-center gap-1 sm:gap-1.5 mt-1 text-[10px] sm:text-xs text-[var(--muted)]">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {typeof project.date === 'string'
                    ? project.date
                    : `${project.date.start} - ${project.date.end || 'Present'}`}
                </span>
              </div>
            )}
            
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 line-clamp-2">
              {project.description}
            </p>
            <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 flex-wrap text-[var(--muted)]">
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-[var(--text)] inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--link)] hover:underline"
                >
                  {FaLink && <FaLink className="w-3 h-3 sm:w-4 sm:h-4" />} Demo
                </a>
              )}
              {/* Links (dynamic icons) */}
              {project.links &&
                project.links.length > 0 &&
                project.links.map((link) => {
                  const Icon =
                    SiIcons[link.icon as keyof typeof SiIcons] ??
                    FaIcons[link.icon as keyof typeof FaIcons];
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // prevent triggering onOpen
                      className="hover:text-[var(--text)] inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--link)] hover:underline"
                    >
                      {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                      {link.label}
                    </a>
                  );
                })}
            </div>

            {/* Tags */}
            <div className="mt-2 sm:mt-3 flex gap-1.5 sm:gap-2 flex-wrap">
              {visibleTags?.map((t) => (
                <span
                  key={t}
                  className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full ${
                    tagColors[t] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {t}
                </span>
              ))}

              {!showAll && hiddenCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAll(true);
                  }}
                  className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  +{hiddenCount}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </CardContainer>
  );
};
