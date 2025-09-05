import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface SmoothScrollOptions {
  ease: number; // 0.05 - 0.2 (lower = smoother, higher = snappier)
  speed: number; // 0.8 - 1.5 (scroll speed multiplier)
  direction: "vertical" | "horizontal" | "both";
  skew: boolean; // Add skew effect during scroll
  onScroll?: (progress: number, direction: "up" | "down") => void;
}

export function useSmoothScroll(options: SmoothScrollOptions = {
  ease: 0.1,
  speed: 1,
  direction: "vertical",
  skew: false
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef({
    current: 0,
    target: 0,
    ease: options.ease,
    speed: options.speed,
    direction: 1,
    isScrolling: false,
    lastDirection: "down" as "up" | "down"
  });

  const updateScroll = useCallback(() => {
    const data = dataRef.current;

    if (!containerRef.current || !scrollRef.current) return;

    // Smooth interpolation
    data.current += (data.target - data.current) * data.ease;

    // Direction detection
    const newDirection = data.target > data.current ? "down" : "up";
    if (newDirection !== data.lastDirection) {
      data.lastDirection = newDirection;
    }

    // Apply transform
    if (options.direction === "vertical") {
      gsap.set(scrollRef.current, {
        y: -data.current,
        skewY: options.skew ? (data.target - data.current) * 0.01 : 0
      });
    } else if (options.direction === "horizontal") {
      gsap.set(scrollRef.current, {
        x: -data.current,
        skewX: options.skew ? (data.target - data.current) * 0.01 : 0
      });
    }

    // Calculate progress
    const maxScroll = options.direction === "vertical"
      ? scrollRef.current.scrollHeight - window.innerHeight
      : scrollRef.current.scrollWidth - window.innerWidth;

    const progress = Math.max(0, Math.min(1, data.current / maxScroll));

    // Callback with progress and direction
    options.onScroll?.(progress, data.lastDirection);

    // Check if still scrolling
    if (Math.abs(data.target - data.current) > 0.1) {
      data.isScrolling = true;
      requestAnimationFrame(updateScroll);
    } else {
      data.isScrolling = false;
      // Reset skew when stopped
      if (options.skew && scrollRef.current) {
        gsap.to(scrollRef.current, {
          skewY: 0,
          skewX: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    }
  }, [options]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const data = dataRef.current;
    const delta = e.deltaY * data.speed;

    if (options.direction === "vertical") {
      data.target += delta;
      const maxScroll = scrollRef.current
        ? scrollRef.current.scrollHeight - window.innerHeight
        : 0;
      data.target = Math.max(0, Math.min(maxScroll, data.target));
    }

    if (!data.isScrolling) {
      updateScroll();
    }
  }, [updateScroll, options.direction]);

  const handleTouchStart = useRef({ y: 0, x: 0 });

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const data = dataRef.current;
    const touch = e.touches[0];

    if (options.direction === "vertical") {
      const deltaY = (handleTouchStart.current.y - touch.clientY) * data.speed;
      data.target += deltaY;

      const maxScroll = scrollRef.current
        ? scrollRef.current.scrollHeight - window.innerHeight
        : 0;
      data.target = Math.max(0, Math.min(maxScroll, data.target));
    }

    handleTouchStart.current = { y: touch.clientY, x: touch.clientX };

    if (!data.isScrolling) {
      updateScroll();
    }
  }, [updateScroll, options.direction]);

  const scrollTo = useCallback((targetValue: number, duration: number = 1) => {
    const data = dataRef.current;

    gsap.to(data, {
      target: targetValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (!data.isScrolling) {
          updateScroll();
        }
      }
    });
  }, [updateScroll]);

  const scrollToElement = useCallback((element: HTMLElement, duration: number = 1) => {
    if (!containerRef.current || !element) return;

    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetValue = dataRef.current.current + rect.top - containerRect.top;

    scrollTo(targetValue, duration);
  }, [scrollTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent default scroll
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      handleTouchStart.current = { y: touch.clientY, x: touch.clientX };
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Set initial styles
    gsap.set(container, { overflow: "hidden" });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleTouchMove]);

  // Update options
  useEffect(() => {
    dataRef.current.ease = options.ease;
    dataRef.current.speed = options.speed;
  }, [options.ease, options.speed]);

  return {
    containerRef,
    scrollRef,
    scrollTo,
    scrollToElement,
    progress: () => {
      const data = dataRef.current;
      const maxScroll = scrollRef.current
        ? scrollRef.current.scrollHeight - window.innerHeight
        : 1;
      return Math.max(0, Math.min(1, data.current / maxScroll));
    }
  };
}
