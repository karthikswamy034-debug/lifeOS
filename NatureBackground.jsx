import React, { useEffect, useRef, useState } from 'react';

export default function NatureBackground({ theme = 'twilight', windSpeed = 1.0 }) {
  const canvasRef = useRef(null);
  const [motesCount] = useState(45);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrass();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // --- GRASS BLADE SIMULATION ---
    let grassBlades = [];
    const numBlades = Math.floor(width / 4.5);

    function initGrass() {
      grassBlades = [];
      const baseY = height;
      for (let i = 0; i < numBlades; i++) {
        const x = (i / numBlades) * width + (Math.random() * 4 - 2);
        const bladeHeight = 55 + Math.random() * 65;
        const widthBase = 2.5 + Math.random() * 2;
        const lean = (Math.random() - 0.5) * 15;
        const phase = Math.random() * Math.PI * 2;
        const speed = 0.02 + Math.random() * 0.015;
        // Natural green palette variations
        const greenShade = Math.floor(130 + Math.random() * 70);
        const color = `rgba(${Math.floor(greenShade * 0.2)}, ${greenShade}, ${Math.floor(greenShade * 0.45)}, ${0.7 + Math.random() * 0.3})`;
        
        grassBlades.push({
          x,
          baseY,
          height: bladeHeight,
          widthBase,
          lean,
          phase,
          speed,
          color
        });
      }
    }

    // --- PARTICLES (FIREFLIES / WIND SPORES) ---
    let particles = [];
    function initParticles() {
      particles = [];
      for (let i = 0; i < motesCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: height * 0.5 + Math.random() * (height * 0.45),
          radius: 1.2 + Math.random() * 2.2,
          alpha: 0.1 + Math.random() * 0.8,
          alphaSpeed: 0.01 + Math.random() * 0.02,
          vx: (0.4 + Math.random() * 0.8) * windSpeed,
          vy: (Math.random() - 0.5) * 0.3,
          glow: Math.random() > 0.4 // Glowing firefly
        });
      }
    }

    initGrass();
    initParticles();

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // --- 1. PARTICLES (WIND SPORES & FIREFLIES) ---
      particles.forEach(p => {
        p.x += p.vx * windSpeed;
        p.y += p.vy + Math.sin(time + p.x * 0.01) * 0.2;
        p.alpha += Math.sin(time * 2 + p.x) * p.alphaSpeed;
        if (p.alpha > 0.9) p.alpha = 0.9;
        if (p.alpha < 0.15) p.alpha = 0.15;

        // Wrap around screen
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.glow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(74, 222, 128, 0.9)';
          ctx.fillStyle = `rgba(167, 243, 208, ${p.alpha})`;
        } else {
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.fillStyle = `rgba(220, 252, 231, ${p.alpha * 0.6})`;
        }
        ctx.fill();
        ctx.restore();
      });

      // --- 2. SWAYING FOREGROUND GRASS ---
      const windForce = Math.sin(time * 0.7) * 18 * windSpeed + Math.sin(time * 1.5) * 6;

      grassBlades.forEach(blade => {
        const sway = Math.sin(time * blade.speed * 60 + blade.phase) * 12 + windForce;
        const tipX = blade.x + blade.lean + sway;
        const tipY = blade.baseY - blade.height;
        const cpX = blade.x + (blade.lean + sway) * 0.4;
        const cpY = blade.baseY - blade.height * 0.55;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(blade.x - blade.widthBase / 2, blade.baseY);
        ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
        ctx.quadraticCurveTo(cpX + blade.widthBase * 0.4, cpY, blade.x + blade.widthBase / 2, blade.baseY);
        ctx.closePath();

        ctx.fillStyle = blade.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [motesCount, windSpeed]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Gradient Layer */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: theme === 'aurora'
            ? 'radial-gradient(ellipse at 50% 15%, rgba(6, 182, 212, 0.18) 0%, rgba(16, 185, 129, 0.14) 35%, rgba(15, 23, 42, 0.95) 75%), linear-gradient(to bottom, #020617 0%, #061928 45%, #05241b 100%)'
            : theme === 'sunset'
            ? 'radial-gradient(ellipse at 50% 30%, rgba(249, 115, 22, 0.18) 0%, rgba(168, 85, 247, 0.12) 40%, rgba(15, 23, 42, 0.95) 80%), linear-gradient(to bottom, #09081f 0%, #1c0e2b 45%, #071f16 100%)'
            : 'radial-gradient(ellipse at 50% 20%, rgba(52, 211, 153, 0.12) 0%, rgba(14, 165, 233, 0.08) 40%, rgba(15, 23, 42, 0.95) 80%), linear-gradient(to bottom, #030712 0%, #0a192f 40%, #032015 100%)'
        }}
      />

      {/* Realistic Distant Moon / Celestial Glow */}
      <div 
        className="absolute top-12 right-1/4 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(200, 230, 255, 0.4) 30%, rgba(56, 189, 248, 0.1) 60%, transparent 80%)',
          filter: 'blur(8px)',
          boxShadow: '0 0 60px 15px rgba(56, 189, 248, 0.25)'
        }}
      />

      {/* Realistic Drifting Clouds Layer 1 */}
      <div 
        className="absolute top-8 -left-40 w-[200vw] h-64 opacity-25 animate-wind"
        style={{
          background: 'radial-gradient(ellipse 40% 50% at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%), radial-gradient(ellipse 35% 45% at 65% 40%, rgba(200, 230, 255, 0.25) 0%, transparent 65%)',
          filter: 'blur(35px)',
          animationDuration: '90s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      />

      {/* Layer 2 Clouds - Lower and Slower */}
      <div 
        className="absolute top-36 -left-60 w-[220vw] h-80 opacity-20 animate-wind"
        style={{
          background: 'radial-gradient(ellipse 45% 55% at 35% 50%, rgba(167, 243, 208, 0.2) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 60%, rgba(147, 197, 253, 0.25) 0%, transparent 65%)',
          filter: 'blur(45px)',
          animationDuration: '140s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      />

      {/* Realistic Distant Mountain Ranges (SVG Multi-Layer) */}
      <svg 
        className="absolute bottom-0 w-full h-[55vh] min-h-[380px] object-cover pointer-events-none" 
        viewBox="0 0 1440 450" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mountainsBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="mountainsMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="hillsFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#065f46" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#044733" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#022218" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mistGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Far Jagged Mountains */}
        <path 
          d="M0 320 L90 260 L180 290 L280 210 L380 270 L480 180 L590 250 L710 160 L830 240 L940 170 L1060 230 L1180 190 L1300 250 L1440 210 L1440 450 L0 450 Z" 
          fill="url(#mountainsBack)" 
        />

        {/* Valley Mist */}
        <rect x="0" y="240" width="1440" height="90" fill="url(#mistGradient)" filter="blur(8px)" />

        {/* Mid-range Ridge with Tree Silhouettes */}
        <path 
          d="M0 350 Q220 280 440 330 T880 300 Q1160 270 1440 340 L1440 450 L0 450 Z" 
          fill="url(#mountainsMid)" 
        />

        {/* Tree Silhouettes on Mid Ridge */}
        <g fill="#032b1d" opacity="0.8">
          <polygon points="120,310 128,275 136,310" />
          <polygon points="124,285 128,265 132,285" />
          <polygon points="140,320 147,288 154,320" />
          <polygon points="410,315 417,270 424,315" />
          <polygon points="426,325 432,285 438,325" />
          <polygon points="760,295 768,255 776,295" />
          <polygon points="778,305 784,272 790,305" />
          <polygon points="1080,285 1088,245 1096,285" />
          <polygon points="1102,298 1108,260 1114,298" />
        </g>

        {/* Rolling Foreground Meadow Hills */}
        <path 
          d="M0 380 Q320 330 720 375 T1440 360 L1440 450 L0 450 Z" 
          fill="url(#hillsFront)" 
        />
        <path 
          d="M0 405 Q450 365 960 410 T1440 395 L1440 450 L0 450 Z" 
          fill="#022117" 
        />
      </svg>

      {/* Interactive HTML5 Canvas for Swaying Grass Blades & Fireflies */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle Bottom Vignette to give ultra-clean contrast for UI cards */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
    </div>
  );
}
