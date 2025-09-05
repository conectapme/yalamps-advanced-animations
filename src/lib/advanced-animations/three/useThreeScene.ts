import { useEffect, useRef, RefObject } from "react";
import * as THREE from "three";

export interface ThreeSceneOptions {
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: "default" | "high-performance" | "low-power";
  preserveDrawingBuffer?: boolean;
  camera?: {
    fov?: number;
    near?: number;
    far?: number;
    position?: [number, number, number];
  };
  controls?: boolean;
  responsive?: boolean;
  pixelRatio?: number;
}

export interface ThreeSceneReturn {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  addToScene: (object: THREE.Object3D) => void;
  removeFromScene: (object: THREE.Object3D) => void;
  render: () => void;
  resize: (width?: number, height?: number) => void;
  dispose: () => void;
}

export function useThreeScene(
  containerRef: RefObject<HTMLElement>,
  options: ThreeSceneOptions = {}
): ThreeSceneReturn | null {
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const animationRef = useRef<number>();
  const controlsRef = useRef<{ update: () => void; dispose: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      options.camera?.fov || 75,
      rect.width / rect.height,
      options.camera?.near || 0.1,
      options.camera?.far || 1000
    );

    if (options.camera?.position) {
      camera.position.set(...options.camera.position);
    } else {
      camera.position.set(0, 0, 5);
    }
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: options.antialias ?? true,
      alpha: options.alpha ?? true,
      powerPreference: options.powerPreference || "high-performance",
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
    });

    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, options.pixelRatio || 2)
    );

    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Tone mapping for realistic lighting
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    rendererRef.current = renderer;
    canvasRef.current = renderer.domElement;

    // Add canvas to container
    container.appendChild(renderer.domElement);

    // Controls setup (optional)
    if (options.controls) {
      import("three/addons/controls/OrbitControls.js").then(({ OrbitControls }) => {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 100;
        controls.maxPolarAngle = Math.PI / 2;
        controlsRef.current = controls;
      });
    }

    // Basic lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;

      const newRect = container.getBoundingClientRect();
      camera.aspect = newRect.width / newRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newRect.width, newRect.height);
    };

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    if (options.responsive !== false) {
      window.addEventListener("resize", handleResize);
    }

    animate();

    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (options.responsive !== false) {
        window.removeEventListener("resize", handleResize);
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, options]);

  if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !canvasRef.current) {
    return null;
  }

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    canvas: canvasRef.current,
    addToScene: (object: THREE.Object3D) => {
      sceneRef.current?.add(object);
    },
    removeFromScene: (object: THREE.Object3D) => {
      sceneRef.current?.remove(object);
    },
    render: () => {
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    },
    resize: (width?: number, height?: number) => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = width || rect.width;
      const newHeight = height || rect.height;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    },
    dispose: () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    }
  };
}
