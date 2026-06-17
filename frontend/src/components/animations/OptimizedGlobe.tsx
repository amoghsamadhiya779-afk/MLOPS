'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TouristLocation, touristLocations } from '@/data/touristLocations';

interface OptimizedGlobeProps {
  selectedLocation?: string;
  onLocationSelect?: (location: TouristLocation) => void;
  showLabels?: boolean;
  rotationSpeed?: number;
  quality?: 'low' | 'medium' | 'high';
}

export function OptimizedGlobe({
  selectedLocation,
  onLocationSelect,
  showLabels = false,
  rotationSpeed = 0.0002,
  quality = 'high',
}: OptimizedGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Quality settings
  const qualitySettings = {
    low: { geometry: 16, particles: 20, textureSize: 512 },
    medium: { geometry: 24, particles: 40, textureSize: 1024 },
    high: { geometry: 32, particles: 60, textureSize: 2048 },
  };

  const settings = qualitySettings[quality];

  useEffect(() => {
    if (!containerRef.current) return;

    // ========== SCENE SETUP ==========
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    // ========== RENDERER WITH OPTIMIZATIONS ==========
    const renderer = new THREE.WebGLRenderer({
      antialias: quality !== 'low',
      alpha: true,
      precision: 'mediump',
      powerPreference: 'high-performance',
    });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Changed to 0 so it integrates transparently
    renderer.shadowMap.enabled = quality === 'high';
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========== CREATE GLOBE WITH TEXTURE ==========
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = settings.textureSize;
    textureCanvas.height = settings.textureSize;
    const ctx = textureCanvas.getContext('2d')!;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
    gradient.addColorStop(0, '#1a4d2e');
    gradient.addColorStop(0.5, '#2d5a2d');
    gradient.addColorStop(1, '#0f3622');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    // Add subtle noise
    const imageData = ctx.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 20;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    // Create globe
    const globeGeometry = new THREE.IcosahedronGeometry(1, settings.geometry);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0x111111,
      shininess: 5,
      wireframe: false,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // ========== CREATE MARKERS ==========
    const markerGroup = new THREE.Group();
    const markerMap = new Map<string, THREE.Object3D>();

    touristLocations.forEach((location) => {
      // Convert coordinates
      const phi = (90 - location.latitude) * (Math.PI / 180);
      const theta = (location.longitude + 180) * (Math.PI / 180);

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      // Main marker
      const markerGeometry = new THREE.SphereGeometry(0.025, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);

      marker.position.set(x, y, z);
      marker.userData = { locationId: location.id, location };
      markerGroup.add(marker);
      markerMap.set(location.id, marker);

      // Glow halo (only in high quality)
      if (quality === 'high') {
        const haloGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b6b,
          transparent: true,
          opacity: 0.15,
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.position.copy(marker.position);
        markerGroup.add(halo);
      }

      // Label text (only if showLabels)
      if (showLabels && quality === 'high') {
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 256;
        labelCanvas.height = 64;
        const labelCtx = labelCanvas.getContext('2d')!;
        labelCtx.font = 'bold 24px Arial';
        labelCtx.fillStyle = '#ff6b6b';
        labelCtx.textAlign = 'center';
        labelCtx.fillText(location.name, 128, 40);

        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelMaterial = new THREE.MeshBasicMaterial({
          map: labelTexture,
          transparent: true,
        });
        const labelGeometry = new THREE.PlaneGeometry(0.5, 0.15);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.copy(marker.position);
        label.position.multiplyScalar(1.3);
        markerGroup.add(label);
      }
    });

    scene.add(markerGroup);

    // ========== LIGHTING ==========
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 3, 5);
    if (quality === 'high') light1.castShadow = true;
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x7c3aed, 0.4);
    light2.position.set(-5, -3, -5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // ========== INTERACTION ==========
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseDownTime = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const markers = Array.from(markerMap.values());
      const intersects = raycaster.intersectObjects(markers);

      // Reset all markers
      markerMap.forEach((marker) => {
        marker.scale.setScalar(1);
        (marker.material as THREE.Material).opacity = 0.6;
      });

      // Highlight hovered marker
      if (intersects.length > 0) {
        const object = intersects[0].object;
        object.scale.setScalar(1.5);
        (object.material as THREE.Material).opacity = 1;
      }
    };

    const onMouseDown = () => {
      mouseDownTime = Date.now();
    };

    const onMouseClick = (event: MouseEvent) => {
      // Only trigger click if not dragging
      if (Date.now() - mouseDownTime > 200) return;

      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const markers = Array.from(markerMap.values());
      const intersects = raycaster.intersectObjects(markers);

      if (intersects.length > 0) {
        const locationId = intersects[0].object.userData.locationId;
        const location = touristLocations.find((l) => l.id === locationId);
        if (location && onLocationSelect) {
          onLocationSelect(location);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('click', onMouseClick);

    // ========== ANIMATION LOOP ==========
    let frameCount = 0;
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      frameCount++;

      // Rotate globe (skip frames for performance)
      if (frameCount % 1 === 0) {
        globe.rotation.y += rotationSpeed;
        markerGroup.rotation.y += rotationSpeed;
      }

      // Update marker visibility based on selection
      markerMap.forEach((marker, locationId) => {
        const isSelected = locationId === selectedLocation;
        const targetScale = isSelected ? 1.8 : 1;
        marker.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      renderer.render(scene, camera);
    };

    const animationId = requestAnimationFrame(animate);
    setLoaded(true);

    // ========== HANDLE RESIZE ==========
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ========== CLEANUP ==========
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('click', onMouseClick);
      cancelAnimationFrame(animationId);
      containerRef.current?.removeChild(renderer.domElement);
      globeGeometry.dispose();
      globeMaterial.dispose();
      renderer.dispose();
    };
  }, [selectedLocation, onLocationSelect, showLabels, rotationSpeed, quality]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading globe...</p>
          </div>
        </div>
      )}
    </div>
  );
}
