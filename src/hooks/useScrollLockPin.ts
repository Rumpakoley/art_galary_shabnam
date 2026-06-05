/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, useMotionValueEvent, MotionValue } from 'motion/react';

interface UseScrollLockPinProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollLockPin({ containerRef }: UseScrollLockPinProps): {
  progress: MotionValue<number>;
  isLocked: boolean;
} {
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, {
    stiffness: 45,
    damping: 22,
    mass: 0.6
  });

  const [isLocked, setIsLocked] = useState(false);
  const isLockedRef = useRef(false);

  const lastScrollYRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);

  // Constants for the transition phases
  const LOCK_START_PROGRESS = 0.3; // 30% of the text is revealed before locking
  const SENSITIVITY = 1200; // Pixels of scroll gestures to complete the remaining 70% of reveal

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
  }, []);

  const getLayoutPositions = () => {
    if (!containerRef.current) return { startScrollY: 0, lockScrollY: 0 };

    let offsetTop = 0;
    let el: HTMLElement | null = containerRef.current;
    while (el) {
      offsetTop += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }

    const isLg = window.innerWidth >= 1024;
    // Target position: when the profile card is near the top of the viewport
    const stickyOffset = window.innerHeight * (isLg ? 0.12 : 0.10);

    const lockScrollY = Math.max(0, offsetTop - stickyOffset);
    // Start the transition when the section is partially visible
    const startScrollY = Math.max(0, offsetTop - window.innerHeight + 150);

    return {
      startScrollY: Math.min(startScrollY, lockScrollY - 50),
      lockScrollY
    };
  };

  // React to spring progress values to unlock the scrollbar only after the animation is finished
  useMotionValueEvent(progress, 'change', (latest) => {
    if (!isLockedRef.current) return;

    const targetVal = rawProgress.get();
    if (targetVal >= 1.0 && latest >= 0.98) {
      setIsLocked(false);
      isLockedRef.current = false;
    } else if (targetVal <= LOCK_START_PROGRESS && latest <= LOCK_START_PROGRESS + 0.02) {
      setIsLocked(false);
      isLockedRef.current = false;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (isProgrammaticScrollRef.current) return;

      const { startScrollY, lockScrollY } = getLayoutPositions();
      const goingDown = currentScrollY > lastScrollY;
      const goingUp = currentScrollY < lastScrollY;

      // 1. Case A: Enforce scroll position if currently locked
      if (isLockedRef.current) {
        if (Math.abs(currentScrollY - lockScrollY) > 1) {
          isProgrammaticScrollRef.current = true;
          window.scrollTo(0, lockScrollY);
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 50);
        }
        return;
      }

      // 2. Case B: Detect and trigger Lock Activation (Checked before native scroll overrides progress)
      // Lock going DOWN
      if (goingDown && rawProgress.get() < 1) {
        if (currentScrollY >= lockScrollY && lastScrollY < lockScrollY) {
          isProgrammaticScrollRef.current = true;
          window.scrollTo(0, lockScrollY);
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 50);
          rawProgress.set(LOCK_START_PROGRESS);
          setIsLocked(true);
          isLockedRef.current = true;
          return; // Stop execution to avoid Case C native override
        }
      }

      // Lock going UP
      if (goingUp && rawProgress.get() > LOCK_START_PROGRESS) {
        if (currentScrollY <= lockScrollY && lastScrollY > lockScrollY) {
          isProgrammaticScrollRef.current = true;
          window.scrollTo(0, lockScrollY);
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 50);
          rawProgress.set(1.0);
          setIsLocked(true);
          isLockedRef.current = true;
          return; // Stop execution to avoid Case C native override
        }
      }

      // 3. Case C: Native scroll phase (Only runs when scroll is unlocked and not transitioning lock states)
      if (currentScrollY < startScrollY) {
        rawProgress.set(0);
      } else if (currentScrollY >= startScrollY && currentScrollY < lockScrollY) {
        // Linearly map native scroll to progress [0, LOCK_START_PROGRESS]
        const range = lockScrollY - startScrollY;
        const currentDiff = currentScrollY - startScrollY;
        const calculatedProgress = (currentDiff / range) * LOCK_START_PROGRESS;
        rawProgress.set(calculatedProgress);
      } else {
        // Past the lock point
        rawProgress.set(1.0);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isLockedRef.current) return;

      // Stop page from scrolling
      e.preventDefault();

      const delta = e.deltaY;
      const currentVal = rawProgress.get();
      // Map sensitivity to remaining 70% range of progress
      const step = (delta / SENSITIVITY) * (1 - LOCK_START_PROGRESS);
      const newVal = Math.min(Math.max(currentVal + step, LOCK_START_PROGRESS), 1.0);

      rawProgress.set(newVal);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLockedRef.current) return;

      e.preventDefault();

      if (e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        const delta = touchStartYRef.current - touchY;
        touchStartYRef.current = touchY;

        const currentVal = rawProgress.get();
        const step = (delta / SENSITIVITY) * (1 - LOCK_START_PROGRESS);
        const newVal = Math.min(Math.max(currentVal + step, LOCK_START_PROGRESS), 1.0);

        rawProgress.set(newVal);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLockedRef.current) return;

      const keys = ['ArrowDown', 'ArrowUp', ' ', 'PageDown', 'PageUp', 'End', 'Home'];
      if (keys.includes(e.key)) {
        e.preventDefault();

        let delta = 0;
        if (e.key === 'ArrowDown' || e.key === ' ') {
          delta = 40;
        } else if (e.key === 'ArrowUp') {
          delta = -40;
        } else if (e.key === 'PageDown') {
          delta = 200;
        } else if (e.key === 'PageUp') {
          delta = -200;
        } else if (e.key === 'End') {
          delta = SENSITIVITY;
        } else if (e.key === 'Home') {
          delta = -SENSITIVITY;
        }

        const currentVal = rawProgress.get();
        const step = (delta / SENSITIVITY) * (1 - LOCK_START_PROGRESS);
        const newVal = Math.min(Math.max(currentVal + step, LOCK_START_PROGRESS), 1.0);

        rawProgress.set(newVal);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef]);

  return { progress, isLocked };
}
