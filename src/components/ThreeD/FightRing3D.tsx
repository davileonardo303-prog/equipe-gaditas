import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, RotateCw, Eye, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface FightRing3DProps {
  className?: string;
  interactive?: boolean;
  intensity?: 'subtle' | 'full';
  showControls?: boolean;
}

export const FightRing3D: React.FC<FightRing3DProps> = ({ 
  className = '', 
  interactive = true,
  intensity = 'full',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [cameraMode, setCameraMode] = useState<'cinematic' | 'ringside' | 'overhead'>('cinematic');
  const [hasWebGLError, setHasWebGLError] = useState(false);

  const isRotatingRef = useRef(isRotating);
  const cameraModeRef = useRef(cameraMode);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationId: number = 0;
    let matTexture: THREE.CanvasTexture | null = null;
    let cleanupListeners: (() => void) | null = null;

    try {
      // Check WebGL availability safely
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
        return;
      }

      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true, 
        powerPreference: 'default' 
      });

      // Dimensions
      const width = container.clientWidth || window.innerWidth || 800;
      const height = container.clientHeight || 600;

      // 1. Scene setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050505, 0.035);

      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 5.5, 9);
      camera.lookAt(0, 1.2, 0);

      // 3. WebGL Renderer configuration
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // 4. Lights: Dramatic Arena & Ring Spotlights
      const ambientLight = new THREE.AmbientLight(0x221111, 1.5);
      scene.add(ambientLight);

      // Central Ring Spotlight (Crisp White with Red Rim)
      const centerSpot = new THREE.SpotLight(0xffffff, 8);
      centerSpot.position.set(0, 12, 0);
      centerSpot.angle = Math.PI / 4.5;
      centerSpot.penumbra = 0.6;
      centerSpot.castShadow = true;
      centerSpot.shadow.mapSize.width = 1024;
      centerSpot.shadow.mapSize.height = 1024;
      scene.add(centerSpot);

      // Red Sweeping Arena Spotlight
      const redSpot = new THREE.SpotLight(0xdc2626, 12);
      redSpot.position.set(-6, 8, -6);
      redSpot.angle = Math.PI / 5;
      redSpot.penumbra = 0.8;
      scene.add(redSpot);

      // White Backlight for dramatic contrast
      const whiteRim = new THREE.DirectionalLight(0xffffff, 2.5);
      whiteRim.position.set(5, 7, -6);
      scene.add(whiteRim);

      // Ring Group to hold all 3D geometry
      const ringGroup = new THREE.Group();
      scene.add(ringGroup);

      // 5. Procedural Canvas Texture for the Ring Mat (Canvas Tatame)
      const matCanvas = document.createElement('canvas');
      matCanvas.width = 1024;
      matCanvas.height = 1024;
      const ctx = matCanvas.getContext('2d');
      if (ctx) {
        // Dark slate/black canvas texture
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, 1024, 1024);

        // Subtle canvas fabric lines
        ctx.strokeStyle = '#141418';
        ctx.lineWidth = 2;
        for (let i = 0; i < 1024; i += 32) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 1024);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(1024, i);
          ctx.stroke();
        }

        // Outer Red Arena Border
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 24;
        ctx.strokeRect(40, 40, 944, 944);

        // Inner White Boundary Line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 10;
        ctx.strokeRect(100, 100, 824, 824);

        // Red Combat Circle in center
        ctx.beginPath();
        ctx.arc(512, 512, 280, 0, Math.PI * 2);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 12;
        ctx.stroke();

        // Inner white dashed ring
        ctx.setLineDash([20, 15]);
        ctx.beginPath();
        ctx.arc(512, 512, 240, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.setLineDash([]);

        // Center Emblem: GADITAS FIGHT TEAM - RIO DE JANEIRO
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 62px "Arial Black", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GADITAS', 512, 440);

        ctx.fillStyle = '#dc2626';
        ctx.font = '900 46px "Arial Black", Impact, sans-serif';
        ctx.fillText('FIGHT TEAM', 512, 495);

        // Lema Oficial da Equipe no Tablado
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 20px "Arial Black", Impact, sans-serif';
        ctx.fillText('"A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"', 512, 555);

        ctx.fillStyle = '#dc2626';
        ctx.font = '800 16px monospace';
        ctx.fillText('LEMA OFICIAL · NOVA IGUAÇU - RJ · DESDE 2017', 512, 590);

        ctx.fillStyle = '#a3a3a3';
        ctx.font = '700 14px monospace';
        ctx.fillText('FAZENDO A DIFERENÇA · 1 CRÔNICAS 12:8', 512, 620);

        // Corner Red Triangle (Corner 1)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(40, 40);
        ctx.lineTo(240, 40);
        ctx.lineTo(40, 240);
        ctx.closePath();
        ctx.fill();

        // Corner White Triangle (Opposite Corner)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(984, 984);
        ctx.lineTo(784, 984);
        ctx.lineTo(984, 784);
        ctx.closePath();
        ctx.fill();
      }

      matTexture = new THREE.CanvasTexture(matCanvas);
      matTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // 6. Ring Platform & Mat
      const ringSize = 6;
      const ringHeight = 0.8;

      // Platform Base (Black Wooden / Steel Elevated Apron)
      const baseGeo = new THREE.BoxGeometry(ringSize + 1.2, ringHeight, ringSize + 1.2);
      const baseMat = new THREE.MeshStandardMaterial({ 
        color: 0x111114, 
        roughness: 0.7, 
        metalness: 0.3 
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = ringHeight / 2;
      baseMesh.receiveShadow = true;
      ringGroup.add(baseMesh);

      // Canvas Mat (Top surface)
      const matGeo = new THREE.BoxGeometry(ringSize, 0.08, ringSize);
      const matMeshMat = new THREE.MeshStandardMaterial({ 
        map: matTexture, 
        roughness: 0.8, 
        metalness: 0.1 
      });
      const matMesh = new THREE.Mesh(matGeo, matMeshMat);
      matMesh.position.y = ringHeight + 0.04;
      matMesh.receiveShadow = true;
      ringGroup.add(matMesh);

      // Skirt Apron (Black Cloth with Red Stripes)
      const skirtGeo = new THREE.BoxGeometry(ringSize + 1.1, ringHeight - 0.05, ringSize + 1.1);
      const skirtMat = new THREE.MeshStandardMaterial({ 
        color: 0x050507, 
        roughness: 0.9 
      });
      const skirtMesh = new THREE.Mesh(skirtGeo, skirtMat);
      skirtMesh.position.y = (ringHeight - 0.05) / 2;
      ringGroup.add(skirtMesh);

      // 7. Corner Posts & Pads (Vermelho, Branco, Preto)
      const postRadius = 0.08;
      const postHeight = 2.4;
      const postHalfDist = ringSize / 2;

      const cornerCoords = [
        { x: -postHalfDist, z: -postHalfDist, color: 0xdc2626, padColor: 0xdc2626, label: 'Red Corner' },
        { x: postHalfDist, z: postHalfDist, color: 0xffffff, padColor: 0xffffff, label: 'White Corner' },
        { x: postHalfDist, z: -postHalfDist, color: 0x222226, padColor: 0x1a1a1f, label: 'Neutral 1' },
        { x: -postHalfDist, z: postHalfDist, color: 0x222226, padColor: 0x1a1a1f, label: 'Neutral 2' },
      ];

      const postMat = new THREE.MeshStandardMaterial({ metalness: 0.85, roughness: 0.2 });

      cornerCoords.forEach(c => {
        // Steel Post Tube
        const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 16);
        const postMesh = new THREE.Mesh(postGeo, postMat.clone());
        (postMesh.material as THREE.MeshStandardMaterial).color.setHex(c.color);
        postMesh.position.set(c.x, ringHeight + postHeight / 2, c.z);
        postMesh.castShadow = true;
        ringGroup.add(postMesh);

        // Corner Protective Pad (Turnbuckle Protector)
        const padGeo = new THREE.BoxGeometry(0.24, postHeight * 0.75, 0.24);
        const padMat = new THREE.MeshStandardMaterial({ 
          color: c.padColor, 
          roughness: 0.4, 
          metalness: 0.2 
        });
        const padMesh = new THREE.Mesh(padGeo, padMat);
        padMesh.position.set(c.x * 0.96, ringHeight + postHeight * 0.5, c.z * 0.96);
        padMesh.rotation.y = Math.PI / 4;
        padMesh.castShadow = true;
        ringGroup.add(padMesh);
      });

      // 8. 4 Horizontal Fight Ropes (Vermelho e Branco)
      const ropeLevels = [0.55, 1.05, 1.55, 2.05];
      const ropeRadius = 0.032;

      ropeLevels.forEach((levelY, levelIndex) => {
        // Alternate rope colors: Top is Red, 2nd is White, 3rd is Red, Bottom is White
        const ropeColor = levelIndex % 2 === 0 ? 0xdc2626 : 0xffffff;
        const ropeMat = new THREE.MeshStandardMaterial({ 
          color: ropeColor, 
          roughness: 0.5, 
          metalness: 0.2 
        });

        // 4 sides for each level
        const sides = [
          { start: [-postHalfDist, -postHalfDist], end: [postHalfDist, -postHalfDist] },
          { start: [postHalfDist, -postHalfDist], end: [postHalfDist, postHalfDist] },
          { start: [postHalfDist, postHalfDist], end: [-postHalfDist, postHalfDist] },
          { start: [-postHalfDist, postHalfDist], end: [-postHalfDist, -postHalfDist] }
        ];

        sides.forEach(s => {
          const length = ringSize;
          const ropeGeo = new THREE.CylinderGeometry(ropeRadius, ropeRadius, length, 12);
          const ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
          
          // Midpoint
          const mx = (s.start[0] + s.end[0]) / 2;
          const mz = (s.start[1] + s.end[1]) / 2;
          ropeMesh.position.set(mx, ringHeight + levelY, mz);

          // Rotation depending on side orientation
          if (s.start[1] === s.end[1]) {
            ropeMesh.rotation.z = Math.PI / 2;
          } else {
            ropeMesh.rotation.x = Math.PI / 2;
          }
          ropeMesh.castShadow = true;
          ringGroup.add(ropeMesh);
        });
      });

      // Vertical Canvas Tension Ribbons holding the ropes together
      [-postHalfDist * 0.45, postHalfDist * 0.45].forEach(offset => {
        const ribbonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const ribbonGeo = new THREE.BoxGeometry(0.04, 1.6, 0.015);
        
        // North & South
        const r1 = new THREE.Mesh(ribbonGeo, ribbonMat);
        r1.position.set(offset, ringHeight + 1.3, -postHalfDist);
        ringGroup.add(r1);

        const r2 = new THREE.Mesh(ribbonGeo, ribbonMat);
        r2.position.set(offset, ringHeight + 1.3, postHalfDist);
        ringGroup.add(r2);

        // East & West
        const ribbonGeoRot = new THREE.BoxGeometry(0.015, 1.6, 0.04);
        const r3 = new THREE.Mesh(ribbonGeoRot, ribbonMat);
        r3.position.set(-postHalfDist, ringHeight + 1.3, offset);
        ringGroup.add(r3);

        const r4 = new THREE.Mesh(ribbonGeoRot, ribbonMat);
        r4.position.set(postHalfDist, ringHeight + 1.3, offset);
        ringGroup.add(r4);
      });

      // 9. Floating 3D Martial Embers & Sparks in Red and White
      const particleCount = intensity === 'full' ? 220 : 100;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);
      const particleVelocities: { y: number; x: number; z: number }[] = [];

      const redColor = new THREE.Color(0xdc2626);
      const whiteColor = new THREE.Color(0xffffff);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 12;
        particlePositions[i3 + 1] = Math.random() * 8;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 12;

        const isRed = Math.random() > 0.4;
        const c = isRed ? redColor : whiteColor;
        particleColors[i3] = c.r;
        particleColors[i3 + 1] = c.g;
        particleColors[i3 + 2] = c.b;

        particleVelocities.push({
          y: 0.008 + Math.random() * 0.015,
          x: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005
        });
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // 10. Overhead Arena Truss Structure (Black steel frame holding the arena lights)
      const trussMat = new THREE.MeshBasicMaterial({ color: 0x1f1f24, wireframe: true });
      const trussGeo = new THREE.BoxGeometry(8, 0.4, 8);
      const trussMesh = new THREE.Mesh(trussGeo, trussMat);
      trussMesh.position.y = 8.5;
      scene.add(trussMesh);

      // 11. Mouse Interactivity / Parallax Controls
      let mouseX = 0;
      let mouseY = 0;
      let isDragging = false;
      let prevMouseX = 0;

      const handleMouseMove = (e: MouseEvent) => {
        if (!interactive) return;
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseX = x;
        mouseY = y;

        if (isDragging) {
          const deltaX = e.clientX - prevMouseX;
          ringGroup.rotation.y += deltaX * 0.01;
          prevMouseX = e.clientX;
        }
      };

      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);

      // Resize Handler
      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || window.innerWidth || 800;
        const h = container.clientHeight || 600;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      cleanupListeners = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        container?.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('resize', handleResize);
      };

      // 12. Main Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Camera preset movement
        const currentCameraMode = cameraModeRef.current;
        const currentIsRotating = isRotatingRef.current;

        if (currentCameraMode === 'cinematic') {
          const baseAngle = elapsedTime * 0.25;
          if (currentIsRotating && !isDragging) {
            ringGroup.rotation.y += 0.003;
          }
          camera.position.x = Math.sin(baseAngle * 0.5) * 3 + mouseX * 0.8;
          camera.position.y = 4.8 + Math.cos(elapsedTime * 0.3) * 0.4 - mouseY * 0.6;
          camera.position.z = 8.5 + Math.cos(baseAngle * 0.5) * 1.5;
          camera.lookAt(0, 1.4, 0);
        } else if (currentCameraMode === 'ringside') {
          camera.position.set(0 + mouseX * 0.5, 2.2 - mouseY * 0.3, 5.2);
          camera.lookAt(0, 1.6, 0);
        } else if (currentCameraMode === 'overhead') {
          camera.position.set(0, 9.5, 0.1);
          camera.lookAt(0, 0, 0);
        }

        // Dynamic light sweeps
        redSpot.position.x = Math.sin(elapsedTime * 0.8) * 7;
        redSpot.position.z = Math.cos(elapsedTime * 0.8) * 7;
        centerSpot.intensity = 7.5 + Math.sin(elapsedTime * 4) * 0.6;

        // Update Particles (Embers ascending)
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3 + 1] += particleVelocities[i].y;
          positions[i3] += particleVelocities[i].x;
          positions[i3 + 2] += particleVelocities[i].z;

          // Reset if too high
          if (positions[i3 + 1] > 9) {
            positions[i3 + 1] = 0.5;
            positions[i3] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;

        try {
          if (renderer) {
            renderer.render(scene, camera);
          }
        } catch (renderErr) {
          console.warn('Three.js render failed, switching to 2D view:', renderErr);
          cancelAnimationFrame(animationId);
          setHasWebGLError(true);
        }
      };

      animate();
    } catch (outerErr) {
      console.warn('Error during Three.js setup, falling back to 2D banner:', outerErr);
      setHasWebGLError(true);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      if (cleanupListeners) {
        cleanupListeners();
      }
      if (renderer) {
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      if (matTexture) {
        matTexture.dispose();
      }
    };
  }, []);

  if (hasWebGLError) {
    return (
      <div className={`relative w-full overflow-hidden select-none bg-gradient-to-b from-neutral-950 via-neutral-900 to-black flex items-center justify-center min-h-[380px] p-6 border-b border-red-950/40 ${className}`}>
        {/* Decorative Arena Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.18)_0%,transparent_70%)]" />
        
        {/* Arena graphic */}
        <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-red-600 bg-black/90 p-3 shadow-2xl shadow-red-950/60 mb-4 flex items-center justify-center">
            <Shield className="w-14 h-14 text-red-600 fill-white" />
          </div>
          <span className="text-xs font-mono font-black text-red-500 uppercase tracking-widest mb-1">
            Arena Oficial de Combate
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white tracking-wide uppercase mb-2">
            Equipe Gaditas Fight Team
          </h2>
          <div className="inline-block px-4 py-1.5 rounded-full bg-red-600 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg">
            A dor é passageira, mas o orgulho é eterno
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* 3D Canvas Mounting Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
          {/* Badge: Arena 3D Interativa */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/80 border border-red-600/40 backdrop-blur-md pointer-events-auto shadow-lg text-[11px] font-mono text-white">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="font-bold text-white uppercase tracking-wider">Ring de Luta 3D Gaditas</span>
            <span className="hidden sm:inline text-neutral-400">· Arraste para girar a arena</span>
          </div>

          {/* Camera & Rotation Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all shadow-md ${
                isRotating 
                  ? 'bg-red-600 text-white border-red-500 shadow-red-950/50' 
                  : 'bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:text-white'
              }`}
              title={isRotating ? 'Pausar Rotação 3D' : 'Girar Arena 3D'}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>

            {/* Camera View Selector */}
            <div className="flex items-center p-1 rounded-xl bg-neutral-950/80 border border-neutral-800 backdrop-blur-md text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setCameraMode('cinematic')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  cameraMode === 'cinematic' ? 'bg-red-600 text-white font-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cinemático
              </button>
              <button
                type="button"
                onClick={() => setCameraMode('ringside')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  cameraMode === 'ringside' ? 'bg-red-600 text-white font-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Ringside
              </button>
              <button
                type="button"
                onClick={() => setCameraMode('overhead')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  cameraMode === 'overhead' ? 'bg-red-600 text-white font-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Superior
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
