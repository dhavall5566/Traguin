"use client";

import { Suspense, useRef, useMemo, useState, useCallback } from "react";
import { r3fOnCreated } from "@/lib/r3fClock";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Sphere, Stars, OrbitControls, Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-topology.png";
const LABEL_FONT =
  "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-500-normal.woff";

export interface GlobeMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  packageCount: number;
  region: "domestic" | "international";
  country?: string;
}

export function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function CityTag({
  marker,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}: {
  marker: GlobeMarker;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (marker: GlobeMarker) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const hitRef = useRef<THREE.Mesh>(null);

  const surfacePosition = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, 2.055),
    [marker.lat, marker.lng]
  );

  const surfaceNormal = useMemo(
    () => surfacePosition.clone().normalize(),
    [surfacePosition]
  );

  const surfaceQuaternion = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.copy(surfacePosition);
    obj.lookAt(surfacePosition.clone().multiplyScalar(2));
    return obj.quaternion.clone();
  }, [surfacePosition]);

  const active = isHovered || isSelected;

  // Hide tags on the back side of the globe; keep them pinned to geography on the front
  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    const camDir = camera.position.clone().normalize();
    const facing = surfaceNormal.dot(camDir) > 0.15;
    groupRef.current.visible = facing;

    if (dotRef.current) {
      const pulse = 1 + Math.sin(performance.now() * 0.003 + marker.lat) * 0.12;
      dotRef.current.scale.setScalar(active ? pulse * 1.35 : pulse);
    }
  });

  const pointerHandlers = {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
      onHover(marker.id);
    },
    onPointerOut: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "grab";
      onHover(null);
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(marker);
    },
  };

  return (
    <group ref={groupRef} position={surfacePosition}>
      {/* Orient group so local +Y points outward from globe centre */}
      <group quaternion={surfaceQuaternion}>
        {/* Invisible hit area for easier clicks */}
        <mesh ref={hitRef} {...pointerHandlers}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Pin dot on the surface */}
        <mesh ref={dotRef} {...pointerHandlers}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshStandardMaterial
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={active ? 2.5 : 1.3}
          />
        </mesh>

        {/* 3D label — billboard faces camera but stays at geographic position */}
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <group {...pointerHandlers} position={[0, 0.09, 0]}>
            {/* Background pill */}
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[active ? 0.38 : 0.34, 0.075]} />
              <meshBasicMaterial
                color={active ? "#2a2208" : "#111111"}
                transparent
                opacity={0.92}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0, -0.005]}>
              <planeGeometry args={[active ? 0.385 : 0.345, 0.08]} />
              <meshBasicMaterial
                color="#D4AF37"
                transparent
                opacity={active ? 0.35 : 0.15}
                depthWrite={false}
              />
            </mesh>

            <Text
              font={LABEL_FONT}
              fontSize={active ? 0.038 : 0.034}
              color={active ? "#E8C547" : "#F8F6F1"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.004}
              outlineColor="#0B0B0B"
              maxWidth={0.32}
              textAlign="center"
            >
              {`${marker.name}  ·  ${marker.packageCount} pkg${marker.packageCount !== 1 ? "s" : ""}`}
            </Text>
          </group>
        </Billboard>
      </group>
    </group>
  );
}

function EarthGlobe({
  scale = 1,
  markers = [],
  hoveredId,
  selectedId,
  onHover,
  onSelect,
}: {
  scale?: number;
  markers?: GlobeMarker[];
  hoveredId?: string | null;
  selectedId?: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (marker: GlobeMarker) => void;
}) {
  const cloudsRef = useRef<THREE.Mesh>(null);

  const [earthMap, bumpMap] = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return [loader.load(EARTH_TEXTURE), loader.load(BUMP_TEXTURE)];
  }, []);

  useFrame(({ clock }) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group scale={scale}>
      <Sphere args={[2, 48, 48]}>
        <meshStandardMaterial
          map={earthMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          roughness={0.7}
          metalness={0.08}
        />
      </Sphere>
      <Sphere ref={cloudsRef} args={[2.015, 32, 32]}>
        <meshStandardMaterial
          transparent
          opacity={0.12}
          color="#ffffff"
          depthWrite={false}
        />
      </Sphere>

      {markers.map((marker) => (
        <CityTag
          key={marker.id}
          marker={marker}
          isHovered={hoveredId === marker.id}
          isSelected={selectedId === marker.id}
          onHover={onHover!}
          onSelect={onSelect!}
        />
      ))}
    </group>
  );
}

function GlobeScene({
  markers = [],
  onMarkerClick,
  autoRotate = true,
  scale = 1,
}: {
  markers?: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  autoRotate?: boolean;
  scale?: number;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback(
    (marker: GlobeMarker) => {
      setSelectedId(marker.id);
      onMarkerClick?.(marker);
    },
    [onMarkerClick]
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-4, 2, 4]} intensity={0.4} color="#0A84FF" />
      <pointLight position={[3, -2, 2]} intensity={0.25} color="#D4AF37" />

      <EarthGlobe
        scale={scale}
        markers={markers}
        hoveredId={hoveredId}
        selectedId={selectedId}
        onHover={setHoveredId}
        onSelect={handleSelect}
      />

      <Stars radius={90} depth={45} count={900} factor={2.5} fade speed={0.4} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        rotateSpeed={0.85}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
        onStart={() => {
          document.body.style.cursor = "grabbing";
        }}
        onEnd={() => {
          document.body.style.cursor = "grab";
        }}
      />
    </>
  );
}

interface GlobeProps {
  markers?: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  autoRotate?: boolean;
  interactive?: boolean;
  scale?: number;
  cameraDistance?: number;
}

export function Globe({
  markers = [],
  onMarkerClick,
  autoRotate = true,
  interactive = true,
  scale = 1,
  cameraDistance = 5,
}: GlobeProps) {
  return (
    <div
      className="h-full w-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, cameraDistance], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        style={{ cursor: "inherit" }}
        onCreated={r3fOnCreated}
      >
        <Suspense fallback={null}>
          <GlobeScene
            markers={interactive ? markers : []}
            onMarkerClick={onMarkerClick}
            autoRotate={autoRotate}
            scale={scale}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function LoadingGlobe({ progress }: { progress: number }) {
  const scale = 0.85 + (progress / 100) * 0.35;

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={r3fOnCreated}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.4} />
        <Suspense fallback={null}>
          <EarthGlobe scale={scale} />
          <Stars radius={80} depth={40} count={800} factor={2} fade />
        </Suspense>
      </Canvas>
    </div>
  );
}
