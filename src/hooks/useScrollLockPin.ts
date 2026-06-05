/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, MotionValue } from 'motion/react';

interface UseScrollLockPinProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollLockPin({ containerRef }: UseScrollLockPinProps): {
  progress: MotionValue<number>;
  isLocked: boolean;
} {
  const progress = useMotionValue(0);
  const [isLocked, setIsLocked] = useState(false);
  const isLockedRef = useRef(false);

  const progressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    const unsubscribe = progress.on('change', (val) => {
      progressRef.current = val;
    });
    return () => unsubscribe();
  }, [progress]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
  }, []);

  // Total scroll distance (in pixels) required to complete the fade animation
  const SENSITIVITY = 800;

  const getTargetScrollY = () => {
    if (!containerRef.current) return 0;

    let offsetTop = 0;
    let el: HTMLElement | null = containerRef.current;
    while (el) {
      offsetTop += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }

    // Sticky offset calculation matching App.tsx classes:
    // top-[10vh] (mobile) or top-[12vh] (lg)
    const isLg = window.innerWidth >= 1024;
    const stickyOffset = window.innerHeight * (isLg ? 0.12 : 0.10);

    return Math.max(0, offsetTop - stickyOffset);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (isProgrammaticScrollRef.current) return;

      const targetScrollY = getTargetScrollY();
      const goingDown = currentScrollY > lastScrollY;
      const goingUp = currentScrollY < lastScrollY;

      // If we are currently locked, enforce the scroll position (e.g. against scrollbar drag)
      if (isLockedRef.current) {
        if (Math.abs(currentScrollY - targetScrollY) > 1) {
          isProgrammaticScrollRef.current = true;
          window.scrollTo(0, targetScrollY);
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 50);
        }
        return;
      }

      // 1. Lock when scrolling DOWN and crossing the threshold
      if (goingDown && progressRef.current < 1) {
        if (currentScrollY >= targetScrollY && lastScrollY < targetScrollY) {
          isProgrammaticScrollRef.current = true;
          window.scrollTo(0, targetScrollY);
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 50);
          setIsLocked(true);
          isLockedRef.current = true;
        }
      }

      // 2. Lock when scrolling UP and crossing the threshold
      if (goingUp && progressRef.current > 0) {
        if (currentScrollY <= targetScrollY && lastScrollY > targetScrollY) {
          isProgrammaticScrollRef.current = true;
          window.scrollTo(0, targetScrollY);
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 50);
          setIsLocked(true);
          isLockedRef.current = true;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isLockedRef.current) return;

      // Intercept and prevent page scrolling
      e.preventDefault();

      const delta = e.deltaY;
      const currentVal = progressRef.current;
      const step = delta / SENSITIVITY;
      const newVal = Math.min(Math.max(currentVal + step, 0), 1);

      progress.set(newVal);

      // Release lock if scroll boundaries are met
      if (newVal >= 1 && delta > 0) {
        setIsLocked(false);
        isLockedRef.current = false;
      } else if (newVal <= 0 && delta < 0) {
        setIsLocked(false);
        isLockedRef.current = false;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLockedRef.current) return;

      // Intercept and prevent page scrolling
      e.preventDefault();

      if (e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        const delta = touchStartYRef.current - touchY; // Positive delta: scroll down
        touchStartYRef.current = touchY;

        const currentVal = progressRef.current;
        const step = delta / SENSITIVITY;
        const newVal = Math.min(Math.max(currentVal + step, 0), 1);

        progress.set(newVal);

        if (newVal >= 1 && delta > 0) {
          setIsLocked(false);
          isLockedRef.current = false;
        } else if (newVal <= 0 && delta < 0) {
          setIsLocked(false);
          isLockedRef.current = false;
        }
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

        const currentVal = progressRef.current;
        const step = delta / SENSITIVITY;
        const newVal = Math.min(Math.max(currentVal + step, 0), 1);

        progress.set(newVal);

        if (newVal >= 1 && delta > 0) {
          setIsLocked(false);
          isLockedRef.current = false;
        } else if (newVal <= 0 && delta < 0) {
          setIsLocked(false);
          isLockedRef.current = false;
        }
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
