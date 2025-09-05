import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { ThreeSceneReturn } from "./useThreeScene";

export interface ParticleSystemOptions {
  count?: number;
  size?: number;
  sizeVariation?: number;
  color?: string | number;
  colorVariation?: number;
  opacity?: number;
  speed?: number;
  windForce?: number;
  gravity?: number;
  bounce?: number;
  bounds?: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
  texture?: string;
  blending?: THREE.Blending;
  responsive?: boolean;
}

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
}

export function useParticleSystem(
  scene: ThreeSceneReturn | null,
  options: ParticleSystemOptions = {}
) {
  const systemRef = useRef<THREE.Points>();
  const particlesRef = useRef<Particle[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry>();
  const materialRef = useRef<THREE.PointsMaterial>();
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const clockRef = useRef(new THREE.Clock());

  const config = useMemo(() => ({
    count: options.count || 1000,
    size: options.size || 1,
    sizeVariation: options.sizeVariation || 0.5,
    color: typeof options.color === "string"
      ? new THREE.Color(options.color)
      : new THREE.Color(options.color || 0xffffff),
    colorVariation: options.colorVariation || 0.2,
    opacity: options.opacity || 0.8,
    speed: options.speed || 1,
    windForce: options.windForce || 0.1,
    gravity: options.gravity || -0.01,
    bounce: options.bounce || 0.3,
    bounds: options.bounds || {
      x: [-10, 10],
      y: [-10, 10],
      z: [-10, 10]
    },
    blending: options.blending || THREE.AdditiveBlending,
    texture: options.texture
  }), [options]);

  // Initialize particles
  useEffect(() => {
    if (!scene?.scene) return;

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometryRef.current = geometry;

    // Create material
    const material = new THREE.PointsMaterial({
      size: config.size,
      color: config.color,
      transparent: true,
      opacity: config.opacity,
      blending: config.blending,
      vertexColors: true,
      sizeAttenuation: true
    });

    materialRef.current = material;

    // Load texture if provided
    if (config.texture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(config.texture, (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      });
    }

    // Initialize particle data
    const particles: Particle[] = [];
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);
    const sizes = new Float32Array(config.count);

    for (let i = 0; i < config.count; i++) {
      const particle: Particle = {
        position: new THREE.Vector3(
          Math.random() * (config.bounds.x[1] - config.bounds.x[0]) + config.bounds.x[0],
          Math.random() * (config.bounds.y[1] - config.bounds.y[0]) + config.bounds.y[0],
          Math.random() * (config.bounds.z[1] - config.bounds.z[0]) + config.bounds.z[0]
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * config.speed,
          (Math.random() - 0.5) * config.speed,
          (Math.random() - 0.5) * config.speed
        ),
        life: Math.random(),
        maxLife: 1 + Math.random() * 2,
        size: config.size * (1 + (Math.random() - 0.5) * config.sizeVariation),
        alpha: Math.random() * config.opacity
      };

      particles.push(particle);

      // Set initial positions
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      // Set colors with variation
      const colorVar = 1 + (Math.random() - 0.5) * config.colorVariation;
      colors[i * 3] = config.color.r * colorVar;
      colors[i * 3 + 1] = config.color.g * colorVar;
      colors[i * 3 + 2] = config.color.b * colorVar;

      // Set sizes
      sizes[i] = particle.size;
    }

    particlesRef.current = particles;

    // Set geometry attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create points system
    const points = new THREE.Points(geometry, material);
    systemRef.current = points;
    scene.addToScene(points);

    return () => {
      if (systemRef.current) {
        scene.removeFromScene(systemRef.current);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [scene, config]);

  // Animation loop
  useEffect(() => {
    if (!scene || !geometryRef.current || !particlesRef.current) return;

    const animate = () => {
      const delta = clockRef.current.getDelta();
      timeRef.current += delta;

      const particles = particlesRef.current;
      const geometry = geometryRef.current!;
      const positions = geometry.attributes.position.array as Float32Array;
      const colors = geometry.attributes.color.array as Float32Array;
      const sizes = geometry.attributes.size.array as Float32Array;

      // Wind effect (sine wave)
      const windX = Math.sin(timeRef.current * 0.5) * config.windForce;
      const windZ = Math.cos(timeRef.current * 0.3) * config.windForce;

      particles.forEach((particle, i) => {
        // Apply forces
        particle.velocity.x += windX * delta;
        particle.velocity.y += config.gravity * delta;
        particle.velocity.z += windZ * delta;

        // Update position
        particle.position.add(particle.velocity.clone().multiplyScalar(delta));

        // Boundary collision and bounce
        if (particle.position.x < config.bounds.x[0] || particle.position.x > config.bounds.x[1]) {
          particle.velocity.x *= -config.bounce;
          particle.position.x = THREE.MathUtils.clamp(particle.position.x, config.bounds.x[0], config.bounds.x[1]);
        }

        if (particle.position.y < config.bounds.y[0] || particle.position.y > config.bounds.y[1]) {
          particle.velocity.y *= -config.bounce;
          particle.position.y = THREE.MathUtils.clamp(particle.position.y, config.bounds.y[0], config.bounds.y[1]);
        }

        if (particle.position.z < config.bounds.z[0] || particle.position.z > config.bounds.z[1]) {
          particle.velocity.z *= -config.bounce;
          particle.position.z = THREE.MathUtils.clamp(particle.position.z, config.bounds.z[0], config.bounds.z[1]);
        }

        // Update life
        particle.life += delta / particle.maxLife;

        // Reset particle if dead
        if (particle.life > 1) {
          particle.position.set(
            Math.random() * (config.bounds.x[1] - config.bounds.x[0]) + config.bounds.x[0],
            config.bounds.y[1],
            Math.random() * (config.bounds.z[1] - config.bounds.z[0]) + config.bounds.z[0]
          );
          particle.velocity.set(
            (Math.random() - 0.5) * config.speed,
            (Math.random() - 0.5) * config.speed,
            (Math.random() - 0.5) * config.speed
          );
          particle.life = 0;
          particle.maxLife = 1 + Math.random() * 2;
        }

        // Update buffer arrays
        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;

        // Fade based on life
        const lifeAlpha = 1 - Math.pow(particle.life, 2);
        colors[i * 3] = config.color.r * lifeAlpha;
        colors[i * 3 + 1] = config.color.g * lifeAlpha;
        colors[i * 3 + 2] = config.color.b * lifeAlpha;

        // Size based on life
        sizes[i] = particle.size * lifeAlpha;
      });

      // Update geometry
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scene, config]);

  const updateWind = (windX: number, windZ: number) => {
    if (particlesRef.current) {
      particlesRef.current.forEach(particle => {
        particle.velocity.x += windX;
        particle.velocity.z += windZ;
      });
    }
  };

  const burst = (position: THREE.Vector3, force: number = 5) => {
    if (particlesRef.current) {
      particlesRef.current.forEach(particle => {
        const distance = particle.position.distanceTo(position);
        if (distance < 5) {
          const direction = particle.position.clone().sub(position).normalize();
          particle.velocity.add(direction.multiplyScalar(force / (distance + 1)));
        }
      });
    }
  };

  const setColor = (color: string | number) => {
    const newColor = typeof color === "string" ? new THREE.Color(color) : new THREE.Color(color);
    if (materialRef.current) {
      materialRef.current.color = newColor;
    }
  };

  return {
    system: systemRef.current,
    updateWind,
    burst,
    setColor,
    particleCount: config.count
  };
}
