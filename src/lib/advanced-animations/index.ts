// Scroll Animations
export { useSmoothScroll } from "./scroll/useSmoothScroll";
export type { SmoothScrollOptions } from "./scroll/useSmoothScroll";

export { useScrollMorph, createMorphSteps } from "./scroll/useScrollMorph";
export type { MorphStep, UseScrollMorphOptions } from "./scroll/useScrollMorph";

// Three.js
export { useThreeScene } from "./three/useThreeScene";
export type { ThreeSceneOptions, ThreeSceneReturn } from "./three/useThreeScene";

export { useParticleSystem } from "./three/useParticleSystem";
export type { ParticleSystemOptions, Particle } from "./three/useParticleSystem";

// Storytelling
export { useSequentialReveal, useRevealElements, REVEAL_PRESETS } from "./storytelling/useSequentialReveal";
export type { RevealElement, SequentialRevealOptions } from "./storytelling/useSequentialReveal";
