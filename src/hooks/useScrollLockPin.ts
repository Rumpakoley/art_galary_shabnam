/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useMotionValue, MotionValue } from 'motion/react';

interface UseScrollLockPinProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollLockPin({ containerRef }: UseScrollLockPinProps): {
  progress: MotionValue<number>;
  isLocked: boolean;
} {
  const progress = useMotionValue(0);

  const getLayoutPositions = () => {
    if (!containerRef.current) return { startScrollY: 0, lockScrollY: 0 };

    let offsetTop = 0;
    let el: HTMLElement | null = containerRef.current;
    while (el) {
      offsetTop += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }

    const isLg = window.innerWidth >= 1024;
    const stickyOffset = window.innerHeight * (isLg ? 0.12 : 0.10);

    const lockScrollY = Math.max(0, offsetTop - stickyOffset);
    // Start the transition when the section starts entering the viewport
    const startScrollY = Math.max(0, offsetTop - window.innerHeight + 150);

    return {
      startScrollY: Math.min(startScrollY, lockScrollY - 50),
      lockScrollY
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const { startScrollY, lockScrollY } = getLayoutPositions();
      
      // Native sticky scroll distance (matching the parent container height headroom)
      const scrollDistance = 500; 

      if (currentScrollY < startScrollY) {
        progress.set(0);
      } else if (currentScrollY >= startScrollY && currentScrollY < lockScrollY) {
        // Phase 1: Native scroll entry - reveal 30% of text
        const range = lockScrollY - startScrollY;
        const currentDiff = currentScrollY - startScrollY;
        progress.set((currentDiff / range) * 0.3);
      } else if (currentScrollY >= lockScrollY && currentScrollY < lockScrollY + scrollDistance) {
        // Phase 2: Pinned sticky phase - reveal remaining 70% of text
        const currentDiff = currentScrollY - lockScrollY;
        progress.set(0.3 + (currentDiff / scrollDistance) * 0.7);
      } else {
        // Phase 3: Completed and scrolling away
        progress.set(1.0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to set correct state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  // Keep isLocked signature but set to false since we use native sticky scroll
  return { progress, isLocked: false };
}
