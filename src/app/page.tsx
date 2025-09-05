"use client";

import { useRef, type RefObject } from "react";
import Image from "next/image";
import * as THREE from "three";
import { useGsapParallax, useGsapReveal } from "@/lib/gsap";
import {
  useSmoothScroll,
  useScrollMorph,
  useThreeScene,
  useParticleSystem,
  useSequentialReveal,
  REVEAL_PRESETS
} from "@/lib/advanced-animations";

export default function Home() {
  // Basic refs
  const heroRef = useRef<HTMLDivElement | null>(null);
  const hillTopRef: RefObject<HTMLImageElement> = useRef(null);
  const hillGreenRef: RefObject<HTMLImageElement> = useRef(null);
  const hillBottomRef: RefObject<HTMLImageElement> = useRef(null);

  // Advanced animation refs
  const smoothScrollContainerRef = useRef<HTMLDivElement>(null);
  const smoothScrollContentRef = useRef<HTMLDivElement>(null);
  const threeSceneRef = useRef<HTMLDivElement>(null);
  const morphSvgRef = useRef<SVGPathElement>(null);

  // Sequential reveal refs
  const storyTitle1Ref = useRef<HTMLHeadingElement>(null);
  const storyTitle2Ref = useRef<HTMLHeadingElement>(null);
  const storyText1Ref = useRef<HTMLParagraphElement>(null);
  const storyText2Ref = useRef<HTMLParagraphElement>(null);

  // Smooth scroll setup
  const { scrollTo } = useSmoothScroll({
    ease: 0.08,
    speed: 1.2,
    direction: "vertical",
    skew: true,
    onScroll: (progress, direction) => {
      // Update based on scroll progress
      console.log(`Scroll: ${(progress * 100).toFixed(1)}% - ${direction}`);
    }
  });

  // Three.js scene setup
  const threeScene = useThreeScene(threeSceneRef, {
    antialias: true,
    alpha: true,
    camera: {
      fov: 75,
      position: [0, 0, 10]
    },
    responsive: true
  });

  // Particle system
  const particleSystem = useParticleSystem(threeScene, {
    count: 800,
    size: 2,
    color: 0x4ade80,
    windForce: 0.05,
    gravity: -0.008,
    bounds: {
      x: [-15, 15],
      y: [-10, 10],
      z: [-15, 15]
    }
  });

  // SVG morphing paths
  const morphSteps = [
    { progress: 0, path: "M0,50 Q25,0 50,50 T100,50" },
    { progress: 0.33, path: "M0,50 Q25,25 50,0 T100,50" },
    { progress: 0.66, path: "M0,25 Q25,0 50,25 T100,25" },
    { progress: 1, path: "M0,0 Q25,25 50,0 T100,0" }
  ];

  useScrollMorph(morphSvgRef, {
    steps: morphSteps,
    trigger: heroRef,
    start: "top top",
    end: "bottom center",
    scrub: true
  });

  // Sequential storytelling
  useSequentialReveal([
    { ref: storyTitle1Ref, ...REVEAL_PRESETS.fadeUp, delay: 0 },
    { ref: storyText1Ref, ...REVEAL_PRESETS.fadeLeft, delay: 0.2 },
    { ref: storyTitle2Ref, ...REVEAL_PRESETS.scaleIn, delay: 0.4 },
    { ref: storyText2Ref, ...REVEAL_PRESETS.fadeRight, delay: 0.6 }
  ], {
    trigger: storyTitle1Ref,
    start: "top 70%",
    stagger: 0.1
  });

  // Original parallax effect for hero hills
  useGsapParallax([
    { ref: hillTopRef, speed: -20 },
    { ref: hillGreenRef, speed: -35 },
    { ref: hillBottomRef, speed: -10 }
  ], {
    trigger: heroRef,
    start: "top top",
    end: "+=120%",
    scrub: 1.2
  });

  // Original reveal animations
  useGsapReveal();

  return (
    <div ref={smoothScrollContainerRef} className="overflow-hidden">
      <div ref={smoothScrollContentRef}>
        <main className="min-h-screen bg-[#0b0f0d] text-white">

          {/* Hero Section with Advanced Animations */}
          <section
            ref={heroRef}
            className="relative h-[120vh] overflow-hidden flex items-end justify-center"
          >
            <div className="absolute top-24 w-full flex justify-center" data-reveal>
              <Image
                src="https://ext.same-assets.com/2469063344/3219190834.webp"
                alt="Yalamps Hero Title"
                width={1400}
                height={400}
                priority
              />
            </div>

            {/* Animated SVG Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <svg width="200" height="100" viewBox="0 0 100 50" className="text-green-400">
                <path
                  ref={morphSvgRef}
                  d="M0,50 Q25,0 50,50 T100,50"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="drop-shadow-lg"
                />
              </svg>
            </div>

            <Image
              ref={hillTopRef}
              src="https://ext.same-assets.com/2469063344/1335275036.webp"
              alt="Hill Top"
              width={1800}
              height={800}
              className="absolute top-0"
            />
            <Image
              ref={hillGreenRef}
              src="https://ext.same-assets.com/2469063344/883882197.webp"
              alt="Hill Green"
              width={1800}
              height={800}
              className="absolute top-16 opacity-70"
            />
            <Image
              ref={hillBottomRef}
              src="https://ext.same-assets.com/2469063344/2194518210.webp"
              alt="Hill Bottom"
              width={1800}
              height={900}
              className="absolute bottom-[-10%]"
            />
          </section>

          {/* Three.js Particle Scene */}
          <section className="relative h-screen">
            <div
              ref={threeSceneRef}
              className="absolute inset-0 z-0"
            />
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-6xl font-bold mb-6" data-reveal>
                  Organic Particles
                </h2>
                <p className="text-xl text-neutral-300 max-w-2xl" data-reveal>
                  Interactive particle system with wind physics and organic movement patterns
                </p>
                <button
                  onClick={() => particleSystem?.burst({ x: 0, y: 0, z: 0 } as THREE.Vector3, 10)}
                  className="mt-8 px-8 py-4 bg-green-500 hover:bg-green-400 rounded-lg transition-colors"
                  data-reveal
                >
                  Create Burst Effect
                </button>
              </div>
            </div>
          </section>

          {/* Sequential Storytelling Section */}
          <section className="py-32 px-6 md:px-12 relative">
            <div className="max-w-4xl mx-auto space-y-16">
              <div>
                <h2
                  ref={storyTitle1Ref}
                  className="text-5xl md:text-7xl font-semibold tracking-tight"
                >
                  The Story Unfolds
                </h2>
                <p
                  ref={storyText1Ref}
                  className="mt-6 max-w-2xl text-lg text-neutral-300"
                >
                  Each animation tells a part of our story, revealing the connection
                  between nature and design through carefully orchestrated sequences.
                </p>
              </div>

              <div>
                <h3
                  ref={storyTitle2Ref}
                  className="text-4xl md:text-6xl font-semibold tracking-tight text-green-400"
                >
                  Technical Excellence
                </h3>
                <p
                  ref={storyText2Ref}
                  className="mt-6 max-w-2xl text-lg text-neutral-300"
                >
                  Advanced GSAP techniques, Three.js integration, and smooth scroll
                  create an immersive experience that pushes the boundaries of web animation.
                </p>
              </div>
            </div>
          </section>

          {/* Original Content Sections */}
          <section id="container_wdwd" className="py-28 px-6 md:px-12">
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight" data-reveal>
              Lamps inspired by nature
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-neutral-300" data-reveal>
              Inspired by organic shapes, each piece recreates textures and lines
              that evoke mountains and valleys.
            </p>
          </section>

          <section id="container_wwa" className="py-28 px-6 md:px-12">
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight" data-reveal>
              Made in
            </h2>
            <div className="mt-10 relative" data-reveal>
              <Image
                src="https://ext.same-assets.com/2469063344/2357200185.webp"
                alt="Lines background"
                width={1600}
                height={800}
                className="rounded-xl"
              />
            </div>
          </section>

          <section id="container_op" className="py-28 px-6 md:px-12">
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight" data-reveal>
              Our Products
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-reveal>
                <Image
                  src="https://ext.same-assets.com/2469063344/4019573972.webp"
                  alt="Card top"
                  width={800}
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <div data-reveal>
                <Image
                  src="https://ext.same-assets.com/2469063344/4190982990.webp"
                  alt="Card bottom"
                  width={800}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            </div>
          </section>

          <section id="container_waitlist" className="py-28 px-6 md:px-12">
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight" data-reveal>
              Be the first to know about our launch
            </h2>
            <div className="mt-6" data-reveal>
              <Image
                src="https://ext.same-assets.com/2469063344/3557698934.svg"
                alt="Waitlist"
                width={320}
                height={80}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
