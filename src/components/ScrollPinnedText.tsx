import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface ScrollPinnedTextProps {
  text: string;
  scrollYProgress: MotionValue<number>;
  className?: string;
}

interface LineProps {
  line: string;
  lineIndex: number;
  totalLines: number;
  scrollYProgress: MotionValue<number>;
}

function Line({ line, lineIndex, totalLines, scrollYProgress }: LineProps): React.JSX.Element {
  // Stagger lines across progress
  // Distribute start positions from 5% to 85% of scroll progress
  const startProgress = 0.05 + (lineIndex / totalLines) * 0.78;
  const endProgress = startProgress + 0.16; // overlap fade duration per line
  
  const clampedStart = Math.min(Math.max(startProgress, 0), 0.99);
  const clampedEnd = Math.min(Math.max(endProgress, clampedStart + 0.01), 1.0);

  const opacity = useTransform(
    scrollYProgress,
    [clampedStart, clampedEnd],
    [0.12, 1.0]
  );

  const y = useTransform(
    scrollYProgress,
    [clampedStart, clampedEnd],
    [10, 0]
  );

  return (
    <motion.span
      style={{ opacity, y }}
      className="block w-full transition-all duration-75 origin-left"
    >
      {line}
    </motion.span>
  );
}

export default function ScrollPinnedText({ text, scrollYProgress, className = '' }: ScrollPinnedTextProps): React.JSX.Element | null {
  if (typeof text !== 'string' || !text.trim()) {
    return null;
  }

  // Split into paragraphs by double newline
  const paragraphs = text.split('\n\n').filter(Boolean);
  
  // Count total lines to calculate stagger steps
  let totalLines = 0;
  const structuredParagraphs = paragraphs.map((para) => {
    const lines = para.split('\n').filter(Boolean);
    const startIndex = totalLines;
    totalLines += lines.length;
    return { lines, startIndex };
  });

  return (
    <span className={`${className} flex flex-col gap-5`}>
      {structuredParagraphs.map((para, paraIndex) => (
        <span key={paraIndex} className="block">
          {para.lines.map((line, lineIndex) => {
            const globalLineIndex = para.startIndex + lineIndex;
            return (
              <Line
                key={lineIndex}
                line={line}
                lineIndex={globalLineIndex}
                totalLines={totalLines}
                scrollYProgress={scrollYProgress}
              />
            );
          })}
        </span>
      ))}
    </span>
  );
}
