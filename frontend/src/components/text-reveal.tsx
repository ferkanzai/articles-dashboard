"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion"; // Import AnimatePresence
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils"; // Assuming you have this utility

interface TextRevealProps {
  /** The text displayed when loading is false. */
  initialText: string;
  /** The text displayed and animated with the reveal effect when loading is true. */
  loadingText: string;
  /** Controls which text is displayed and whether the animation runs. */
  loading: boolean;
  /** Optional className for the main container div. */
  className?: string;
  /** Optional className applied to both text elements for consistent styling (e.g., font size, weight). */
  textClassName?: string;
  /** Optional className for the base color of the loading text (underneath the wipe). Defaults to a muted color. */
  loadingBaseTextClassName?: string;
  /** Optional className for the revealed color/gradient of the loading text. */
  loadingRevealTextClassName?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  initialText,
  loadingText,
  loading,
  className,
  textClassName,
  loadingBaseTextClassName = "text-neutral-500",
  loadingRevealTextClassName = "text-white",
}) => {
  const defaultTextStyles =
    "font-bold text-base py-2 whitespace-nowrap select-none";

  const loadingContainerVariants = {
    hidden: { opacity: 0, transition: { duration: 0.1 } },
    visible: { opacity: 1, transition: { duration: 0.2, delay: 0.1 } },
  };

  const initialTextVariants = {
    hidden: { opacity: 0, transition: { duration: 0.1 } },
    visible: { opacity: 1, transition: { duration: 0.2, delay: 0.1 } },
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center align-bottom overflow-hidden",
        className,
      )}
    >
      <span
        className={twMerge(
          "opacity-0 pointer-events-none",
          defaultTextStyles,
          textClassName,
        )}
        aria-hidden="true"
      >
        {initialText.length > loadingText.length ? initialText : loadingText}
      </span>

      <AnimatePresence initial={false} mode="wait">
        {!loading && (
          <motion.p
            key="initial"
            variants={initialTextVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={twMerge(
              "absolute top-0 left-0 w-full h-full",
              defaultTextStyles,
              textClassName,
            )}
          >
            {initialText}
          </motion.p>
        )}
        {loading && (
          <motion.div
            key="loading"
            variants={loadingContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-0 left-0 w-full h-full"
          >
            <div className="relative w-full h-full">
              <p
                className={twMerge(
                  "absolute top-0 left-0 w-full h-full",
                  defaultTextStyles,
                  textClassName,
                  loadingBaseTextClassName,
                )}
              >
                {loadingText}
              </p>

              <motion.div
                style={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{
                  clipPath: [
                    "inset(0 100% 0 0)",
                    "inset(0 0% 0 0)",
                    "inset(0 0% 0 0)",
                    "inset(0 100% 0 0)",
                  ],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  times: [0, 0.45, 0.55, 1],
                }}
                className="absolute top-0 left-0 w-full h-full z-10 text-black"
              >
                <p
                  className={twMerge(
                    defaultTextStyles,
                    textClassName,
                    loadingRevealTextClassName,
                  )}
                >
                  {loadingText}
                </p>
              </motion.div>

              <motion.div
                style={{ left: "0%", opacity: 0 }}
                animate={{
                  left: ["0%", "100%", "100%", "0%"],
                  opacity: [0, 1, 0.5, 0],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  times: [0, 0.45, 0.55, 1],
                }}
                className="absolute top-0 h-full w-[2px] bg-white/50 z-20"
              ></motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
