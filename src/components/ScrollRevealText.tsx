/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className = '' }: ScrollRevealTextProps): React.JSX.Element | null {
  // Defensive check to avoid runtime crashes if text is undefined/null or not a string
  if (typeof text !== 'string' || !text.trim()) {
    return null;
  }

  const tokens = text.split(/(\s+)/).filter(Boolean);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.025,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0.15,
      y: 2,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.215, 0.610, 0.355, 1.0], // easeOutCubic
      }
    }
  };

  return (
    <motion.span 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={containerVariants}
      className={`inline ${className}`}
    >
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          if (token.includes('\n')) {
            return <br key={i} />;
          }
          return <span key={i} className="inline">&nbsp;</span>;
        }

        return (
          <span key={i} className="relative inline-block select-none">
            {/* Ghost background word for the scroll-reveal style */}
            <span className="absolute opacity-15" aria-hidden="true">
              {token}
            </span>
            <motion.span 
              variants={wordVariants} 
              className="relative z-10 inline-block"
            >
              {token}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
