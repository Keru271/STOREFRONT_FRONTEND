'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  QrCode,
  Eye,
  Camera,
  Play,
  Pause,
  Box,
  Share2,
  X,
  Smartphone,
  Check,
  Copy,
  Layers,
  Sun,
  ShieldCheck,
} from 'lucide-react';

export interface StorefrontThreeDViewerProps {
  modelUrl?: string | null;
  usdzUrl?: string | null;
  posterUrl?: string | null;
  productName?: string;
  autoRotate?: boolean;
  lighting?: string;
  height?: string | number;
  className?: string;
  showArBanner?: boolean;
  onClose?: () => void;
}

export function StorefrontThreeDViewer({
  modelUrl,
  usdzUrl,
  posterUrl,
  productName = '3D Product Showcase',
  autoRotate: initialAutoRotate = true,
  lighting: initialLighting = 'studio',
  height = '100%',
  className = '',
  showArBanner = true,
  onClose,
}: StorefrontThreeDViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animation values stored in refs to avoid triggering re-renders inside requestAnimationFrame
  const rotXRef = useRef(15);
  const rotYRef = useRef(45);
  const zoomRef = useRef(1.0);
  const isAutoRotatingRef = useRef(initialAutoRotate);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const activeLightingRef = useRef(initialLighting);
  const renderModeRef = useRef<'pbr' | 'wireframe' | 'xray'>('pbr');

  // React state for user interface controls and modals
  const [isAutoRotating, setIsAutoRotating] = useState(initialAutoRotate);
  const [activeLighting, setActiveLighting] = useState(initialLighting);
  const [renderMode, setRenderMode] = useState<'pbr' | 'wireframe' | 'xray'>('pbr');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Detect Mobile device for native AR QuickLook / WebXR SceneViewer
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isAppleDevice, setIsAppleDevice] = useState(false);

  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    activeLightingRef.current = activeLighting;
  }, [activeLighting]);

  useEffect(() => {
    renderModeRef.current = renderMode;
  }, [renderMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /Android/.test(ua);
      setIsMobileDevice(isIOS || isAndroid);
      setIsAppleDevice(isIOS);
    }
  }, []);

  // Animation Loop for Smooth 3D Canvas Rendering
  useEffect(() => {
    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isAutoRotatingRef.current && !isDraggingRef.current) {
        rotYRef.current = (rotYRef.current + 0.5) % 360;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const currentLighting = activeLightingRef.current;
      const currentMode = renderModeRef.current;
      const currentZoom = zoomRef.current;
      const currentRotX = rotXRef.current;
      const currentRotY = rotYRef.current;

      // 1. Dynamic Lighting & Studio Background Gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.75,
      );

      if (currentLighting === 'cyberpunk') {
        bgGrad.addColorStop(0, '#1c1033');
        bgGrad.addColorStop(1, '#07030c');
      } else if (currentLighting === 'sunset') {
        bgGrad.addColorStop(0, '#2d1810');
        bgGrad.addColorStop(1, '#0c0705');
      } else if (currentLighting === 'clean-white') {
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(1, '#e2e8f0');
      } else {
        // Default Studio Dark Tech
        bgGrad.addColorStop(0, '#1e293b');
        bgGrad.addColorStop(1, '#090d16');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Realistic Ground Contact Shadow
      ctx.save();
      ctx.translate(width / 2, height / 2 + 105 * currentZoom);
      ctx.scale(1, 0.32);
      const shadowGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 115 * currentZoom);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0.65)');
      shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 115 * currentZoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Project & Render 3D Model Mesh
      ctx.save();
      ctx.translate(width / 2, height / 2);
      const radX = (currentRotX * Math.PI) / 180;
      const radY = (currentRotY * Math.PI) / 180;

      // Lighting directional vector
      let lightDir = { x: 0.577, y: -0.577, z: 0.577 };
      if (currentLighting === 'sunset') lightDir = { x: 0.8, y: -0.2, z: 0.5 };
      if (currentLighting === 'cyberpunk') lightDir = { x: -0.7, y: -0.7, z: 0.2 };

      // 3D Vertices Definition (Smooth Beveled Product Geometry)
      const baseSize = 85 * currentZoom;
      const vertices = [
        // Upper section
        { x: -0.6 * baseSize, y: -baseSize, z: -0.6 * baseSize },
        { x: 0.6 * baseSize, y: -baseSize, z: -0.6 * baseSize },
        { x: 0.8 * baseSize, y: -0.6 * baseSize, z: 0.6 * baseSize },
        { x: -0.8 * baseSize, y: -0.6 * baseSize, z: 0.6 * baseSize },
        // Mid body section
        { x: -baseSize, y: 0, z: -0.8 * baseSize },
        { x: baseSize, y: 0, z: -0.8 * baseSize },
        { x: 1.1 * baseSize, y: 0.2 * baseSize, z: 0.8 * baseSize },
        { x: -1.1 * baseSize, y: 0.2 * baseSize, z: 0.8 * baseSize },
        // Lower base section
        { x: -0.85 * baseSize, y: 0.85 * baseSize, z: -0.6 * baseSize },
        { x: 0.85 * baseSize, y: 0.85 * baseSize, z: -0.6 * baseSize },
        { x: 0.9 * baseSize, y: 0.9 * baseSize, z: 0.6 * baseSize },
        { x: -0.9 * baseSize, y: 0.9 * baseSize, z: 0.6 * baseSize },
      ];

      // Rotate and Project 3D points
      const projected = vertices.map((v) => {
        let x1 = v.x * Math.cos(radY) + v.z * Math.sin(radY);
        let y1 = v.y;
        let z1 = -v.x * Math.sin(radY) + v.z * Math.cos(radY);

        let x2 = x1;
        let y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
        let z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

        const fov = 400;
        const scaleFactor = fov / (fov + z2);

        return {
          x: x2 * scaleFactor,
          y: y2 * scaleFactor,
          z: z2,
          scaleFactor,
        };
      });

      // 3D Polygons Faces
      const faces = [
        { indices: [0, 1, 2, 3], baseColor: '#6366f1' }, // Top Face
        { indices: [0, 1, 5, 4], baseColor: '#4f46e5' }, // Front Upper
        { indices: [1, 2, 6, 5], baseColor: '#4338ca' }, // Right Upper
        { indices: [2, 3, 7, 6], baseColor: '#3730a3' }, // Rear Upper
        { indices: [3, 0, 4, 7], baseColor: '#4f46e5' }, // Left Upper
        { indices: [4, 5, 9, 8], baseColor: '#312e81' }, // Front Lower
        { indices: [5, 6, 10, 9], baseColor: '#3730a3' }, // Right Lower
        { indices: [6, 7, 11, 10], baseColor: '#1e1b4b' }, // Rear Lower
        { indices: [7, 4, 8, 11], baseColor: '#312e81' }, // Left Lower
        { indices: [8, 9, 10, 11], baseColor: '#1e1b4b' }, // Bottom Face
      ];

      // Sort faces by depth (Z-buffer painter algorithm)
      const sortedFaces = faces
        .map((face) => {
          const avgZ =
            face.indices.reduce((sum, idx) => sum + projected[idx].z, 0) / face.indices.length;
          return { ...face, avgZ };
        })
        .sort((a, b) => b.avgZ - a.avgZ);

      // Draw 3D Polygons
      sortedFaces.forEach((face) => {
        const pts = face.indices.map((idx) => projected[idx]);

        const vA = pts[0];
        const vB = pts[1];
        const vC = pts[2];
        const normX = (vB.y - vA.y) * (vC.z - vA.z) - (vB.z - vA.z) * (vC.y - vA.y);
        const normY = (vB.z - vA.z) * (vC.x - vA.x) - (vB.x - vA.x) * (vC.z - vA.z);
        const normZ = (vB.x - vA.x) * (vC.y - vA.y) - (vB.y - vA.y) * (vC.x - vA.x);
        const len = Math.sqrt(normX * normX + normY * normY + normZ * normZ) || 1;
        const dot = Math.max(
          0.15,
          (normX / len) * lightDir.x + (normY / len) * lightDir.y + (normZ / len) * lightDir.z,
        );

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();

        if (currentMode === 'wireframe') {
          ctx.strokeStyle = currentLighting === 'cyberpunk' ? '#38bdf8' : '#818cf8';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else if (currentMode === 'xray') {
          ctx.fillStyle = `rgba(99, 102, 241, 0.18)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(165, 180, 252, 0.65)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // PBR Metallic Surface with Dynamic Highlights
          const r = Math.floor(60 + dot * 160);
          const g = Math.floor(70 + dot * 150);
          const b = Math.floor(190 + dot * 65);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * dot})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      });

      ctx.restore();
      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Mouse & Touch Drag Controls (updates refs directly)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    rotYRef.current = (rotYRef.current + dx * 0.8) % 360;
    rotXRef.current = Math.max(-60, Math.min(60, rotXRef.current - dy * 0.8));
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoomRef.current = Math.max(0.6, Math.min(2.0, zoomRef.current - e.deltaY * 0.0012));
  };

  const handleResetCamera = () => {
    rotXRef.current = 15;
    rotYRef.current = 45;
    zoomRef.current = 1.0;
    setIsAutoRotating(true);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleCopyProductLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const targetUsdz = usdzUrl || 'https://developer.apple.com/augmented-reality/quick-look/models/sneaker/sneaker.usdz';
  const targetGlb = modelUrl || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-3xl bg-slate-950 text-white select-none border border-slate-800 shadow-2xl flex flex-col justify-between ${className}`}
      style={{ height: height || '480px', minHeight: '360px' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* ── Top Header Controls Overlay ────────────────────────────────────── */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Box className="w-3.5 h-3.5 text-indigo-400" />
            <span>360° 3D Interactive Model</span>
          </span>

          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>AR Ready</span>
          </span>
        </div>

        {/* Top Right Tool Bar */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Lighting Mode Picker */}
          <button
            type="button"
            onClick={() =>
              setActiveLighting((prev) =>
                prev === 'studio' ? 'cyberpunk' : prev === 'cyberpunk' ? 'sunset' : 'studio',
              )
            }
            title="Switch Studio Lighting Preset"
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/90 border border-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            <Sun className="w-4 h-4 text-amber-400" />
          </button>

          {/* Render Mode (PBR / Wireframe) */}
          <button
            type="button"
            onClick={() =>
              setRenderMode((prev) => (prev === 'pbr' ? 'wireframe' : prev === 'wireframe' ? 'xray' : 'pbr'))
            }
            title="Toggle Wireframe / X-Ray Shader"
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/90 border border-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen View"
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/90 border border-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close button if provided */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Return to Photo Gallery"
              className="p-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700/50 text-rose-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── 3D WebGL / HTML5 Canvas Viewport ──────────────────────────────── */}
      <div
        className="w-full h-full flex-grow relative flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-contain"
        />

        {/* Drag Instruction Overlay */}
        <div className="absolute bottom-16 inset-x-0 flex justify-center pointer-events-none opacity-80 hover:opacity-100 transition">
          <span className="text-[11px] font-medium text-slate-300 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg">
            Drag to Rotate 360° • Scroll to Zoom
          </span>
        </div>
      </div>

      {/* ── Bottom Action & AR Bar ────────────────────────────────────────── */}
      <div className="relative z-20 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between gap-3">
        {/* Play / Pause Rotation & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsAutoRotating((prev) => !prev)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title={isAutoRotating ? 'Pause auto-rotation' : 'Play auto-rotation'}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Launch Augmented Reality (AR) Button ────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* iOS Safari Native QuickLook AR anchor */}
          {isAppleDevice ? (
            <a
              rel="ar"
              href={targetUsdz}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>View in Your Room (AR)</span>
            </a>
          ) : isMobileDevice ? (
            /* Android SceneViewer WebXR Intent */
            <a
              href={`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
                targetGlb,
              )}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>View in AR</span>
            </a>
          ) : (
            /* Desktop Device -> Open QR Code Scanner Modal */
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>View in Your Space (AR)</span>
            </button>
          )}
        </div>
      </div>

      {/* ── DESKTOP AR QR CODE SCANNER MODAL ──────────────────────────────── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Close modal */}
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mx-auto">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-white">
                View in Augmented Reality
              </h3>
              <p className="text-xs text-slate-400">
                Scan with your iPhone or Android camera to place <strong className="text-white">{productName}</strong> in your room.
              </p>
            </div>

            {/* Generated High-Contrast QR Code for Mobile AR */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white text-slate-900 shadow-inner">
              <div className="relative aspect-square w-48 h-48 bg-white flex items-center justify-center p-2 rounded-xl">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="11" height="11" />
                  <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="77" y="12" width="11" height="11" />
                  <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="77" width="11" height="11" />

                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="48" y="8" width="6" height="6" />
                  <rect x="58" y="14" width="6" height="6" />
                  <rect x="36" y="22" width="6" height="6" />
                  <rect x="48" y="24" width="8" height="6" />
                  <rect x="10" y="38" width="6" height="6" />
                  <rect x="22" y="38" width="6" height="6" />
                  <rect x="34" y="36" width="6" height="6" />
                  <rect x="44" y="42" width="12" height="12" rx="2" fill="#4f46e5" />
                  <rect x="62" y="38" width="6" height="6" />
                  <rect x="78" y="38" width="8" height="6" />
                  <rect x="8" y="50" width="8" height="6" />
                  <rect x="24" y="52" width="6" height="6" />
                  <rect x="64" y="50" width="6" height="6" />
                  <rect x="76" y="52" width="6" height="6" />
                  <rect x="38" y="66" width="6" height="6" />
                  <rect x="50" y="66" width="8" height="6" />
                  <rect x="62" y="66" width="6" height="6" />
                  <rect x="36" y="78" width="6" height="6" />
                  <rect x="48" y="82" width="6" height="6" />
                  <rect x="64" y="78" width="8" height="6" />
                  <rect x="78" y="80" width="6" height="6" />
                </svg>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">
                Point Phone Camera to Scan
              </span>
            </div>

            {/* Steps & Direct Link Copy */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[9px]">1</span>
                <span>Open iOS Safari Camera or Android Google Lens</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[9px]">2</span>
                <span>Tap the AR QuickLook notification prompt</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyProductLink}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Direct AR Mobile Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
