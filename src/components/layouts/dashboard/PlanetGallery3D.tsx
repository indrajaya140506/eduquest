"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

type PlanetData = {
  name: string;
  texture: string;
  size: number;
};

const planets: PlanetData[] = [
  { name: "Merkurius", texture: "/textures/mercury.jpg", size: 0.48 },
  { name: "Venus", texture: "/textures/venus.jpg", size: 0.65 },
  { name: "Bumi", texture: "/textures/bumi.jpg", size: 0.7 },
  { name: "Mars", texture: "/textures/mars.jpg", size: 0.58 },
  { name: "Jupiter", texture: "/textures/jupiter.jpg", size: 1.05 },
  { name: "Saturnus", texture: "/textures/saturnus.jpg", size: 0.95 },
  { name: "Uranus", texture: "/textures/uranus.jpg", size: 0.78 },
  { name: "Neptunus", texture: "/textures/nepturnus.jpg", size: 0.78 },
];

function Sun() {
  return (
    <group position={[-8.5, 0, 0]}>
      {/* Permukaan Matahari */}
      <mesh>
        <sphereGeometry args={[1.15, 48, 48]} />
        <meshBasicMaterial color="#FFB52E" />
      </mesh>

      {/* Lapisan cahaya luar */}
      <mesh>
        <sphereGeometry args={[1.3, 48, 48]} />
        <meshBasicMaterial
          color="#FF8C24"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Cahaya Matahari */}
      <pointLight color="#FFB84D" intensity={25} distance={18} decay={2} />

      <Html position={[0, -1.55, 0]} center>
        <p className="whitespace-nowrap text-xs font-medium text-amber-200">
          Matahari
        </p>
      </Html>
    </group>
  );
}

function Planet({ planet }: { planet: PlanetData }) {
  const texture = useTexture(planet.texture);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh>
        <sphereGeometry args={[planet.size, 48, 48]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>

      {planet.name === "Saturnus" && (
        <mesh rotation={[Math.PI / 2.3, 0, -0.2]}>
          <ringGeometry args={[planet.size * 1.3, planet.size * 1.9, 96]} />
          <meshStandardMaterial
            color="#C9B89A"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      )}

      <Html
        position={[0, -planet.size - 0.3, 0]}
        center
        style={{ pointerEvents: "none" }}
      >
        <p className="whitespace-nowrap text-xs font-medium tracking-wide text-slate-200">
          {planet.name}
        </p>
      </Html>
    </group>
  );
}

function PlanetScene() {
  const positions: [number, number, number][] = [
    [-5.8, 0.5, 0],
    [-4.1, -0.4, 0],
    [-2.4, 0.5, 0],
    [-0.7, -0.4, 0],
    [1.3, 0.5, 0],
    [3.4, -0.4, 0],
    [5.4, 0.5, 0],
    [7.3, -0.4, 0],
  ];

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Stars
        radius={70}
        depth={40}
        count={900}
        factor={2.5}
        saturation={0}
        fade
        speed={0.2}
      />

      <Sun />

      {planets.map((planet, index) => (
        <group key={planet.name} position={positions[index]}>
          <Planet planet={planet} />
        </group>
      ))}
    </>
  );
}

export default function PlanetGallery3D() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-[#080F1D]">
      <div className="pointer-events-none absolute left-6 top-6 z-10">
        <p className="mt-1 text-xs text-slate-400">
          Putar dan geser untuk melihat planet
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 19], fov: 48 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#080F1D"]} />

        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[0.6, 24, 24]} />
              <meshStandardMaterial color="#8ECAE6" wireframe />
            </mesh>
          }
        >
          <PlanetScene />

          <OrbitControls
            enablePan={false}
            enableZoom
            enableRotate
            minDistance={12}
            maxDistance={25}
            minPolarAngle={1.1}
            maxPolarAngle={2}
            rotateSpeed={0.5}
            zoomSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </section>
  );
}
