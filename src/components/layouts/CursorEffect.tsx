"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateDevice = () => setIsDesktop(media.matches);

    updateDevice();
    media.addEventListener("change", updateDevice);

    let lastX = 0;
    let lastY = 0;
    let particleId = 0;

    const addParticle = (x: number, y: number, size = 12) => {
      const id = ++particleId;

      setParticles((current) => [...current.slice(-25), { id, x, y, size }]);

      window.setTimeout(() => {
        setParticles((current) =>
          current.filter((particle) => particle.id !== id),
        );
      }, 750);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      setPosition({ x: event.clientX, y: event.clientY });

      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);

      if (distance > 35) {
        addParticle(event.clientX, event.clientY, 10);
        lastX = event.clientX;
        lastY = event.clientY;
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const { clientX: x, clientY: y } = event;

      const offsets = [
        [-18, -18],
        [18, -18],
        [-18, 18],
        [18, 18],
        [0, -28],
        [0, 28],
      ];

      offsets.forEach(([offsetX, offsetY], index) => {
        window.setTimeout(() => {
          addParticle(x + offsetX, y + offsetY, index % 2 === 0 ? 15 : 10);
        }, index * 35);
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      media.removeEventListener("change", updateDevice);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <>
      {/* CUSTOM STAR CURSOR */}
      {isDesktop && (
        <div
          className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 text-[#8ECAE6]"
          style={{
            left: position.x,
            top: position.y,
            filter: "drop-shadow(0 0 8px #8ECAE6)",
          }}
        >
          <Star size={19} fill="currentColor" strokeWidth={1.5} />
        </div>
      )}

      {/* STAR PARTICLES */}
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute animate-ping text-[#8ECAE6]"
            style={{
              left: particle.x,
              top: particle.y,
              fontSize: particle.size,
              transform: "translate(-50%, -50%)",
              opacity: 0.8,
            }}
          >
            <Star size={particle.size} fill="currentColor" strokeWidth={1} />
          </span>
        ))}
      </div>
    </>
  );
}
