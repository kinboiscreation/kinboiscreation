import React, { useRef } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Geometry, Material, Mesh, OrthographicCamera } from "@remotion/three";
import * as THREE from "three";

const ThreeObject: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = interpolate(frame, [0, fps * 10], [0, Math.PI * 2]);
  const scale = 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.3;

  if (meshRef.current) {
    meshRef.current.rotation.x = rotation * 0.5;
    meshRef.current.rotation.y = rotation;
    meshRef.current.scale.set(scale, scale, scale);
  }

  return (
    <>
      <OrthographicCamera
        args={[-960, 960, 540, -540, 0.1, 1000]}
        position={[0, 0, 500]}
      />

      <Mesh ref={meshRef} position={[0, 0, 0]}>
        <Geometry>
          <boxGeometry args={[200, 200, 200]} />
        </Geometry>
        <Material>
          <meshPhongMaterial
            args={{
              color: new THREE.Color("#00d9ff"),
              shininess: 100,
            }}
          />
        </Material>
      </Mesh>

      {/* Lights */}
      <pointLight position={[500, 500, 500]} intensity={1} />
      <ambientLight intensity={0.5} />
    </>
  );
};

export const ThreePlayground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridOpacity = interpolate(frame, [0, fps * 5], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e27",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Three.js Canvas Area Placeholder */}
      <div
        style={{
          position: "relative",
          width: 1200,
          height: 700,
          backgroundColor: "rgba(26, 31, 58, 0.5)",
          border: "2px solid #00d9ff",
          borderRadius: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Grid Background */}
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: gridOpacity,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${(i + 1) * 5}%`}
              y1="0"
              x2={`${(i + 1) * 5}%`}
              y2="100%"
              stroke="#00d9ff"
              strokeWidth={1}
              opacity={0.2}
            />
          ))}
          {[...Array(14)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${(i + 1) * 7.14}%`}
              x2="100%"
              y2={`${(i + 1) * 7.14}%`}
              stroke="#00d9ff"
              strokeWidth={1}
              opacity={0.2}
            />
          ))}
        </svg>

        {/* 3D Cube Visualization (CSS representation) */}
        <div
          style={{
            position: "relative",
            width: 200,
            height: 200,
            transformStyle: "preserve-3d",
            transform: `rotateX(${interpolate(
              frame,
              [0, fps * 10],
              [0, 360]
            )}deg) rotateY(${interpolate(frame, [0, fps * 8], [0, 360])}deg)`,
            animation: "none",
          }}
        >
          {/* Cube faces */}
          {[
            {
              face: "front",
              color: "#00d9ff",
              transform: "translateZ(100px)",
            },
            {
              face: "back",
              color: "#ff00d9",
              transform: "rotateY(180deg) translateZ(100px)",
            },
            {
              face: "right",
              color: "#00ff88",
              transform: "rotateY(90deg) translateZ(100px)",
            },
            {
              face: "left",
              color: "#ffaa00",
              transform: "rotateY(-90deg) translateZ(100px)",
            },
            {
              face: "top",
              color: "#00d9ff",
              transform: "rotateX(90deg) translateZ(100px)",
            },
            {
              face: "bottom",
              color: "#ff00d9",
              transform: "rotateX(-90deg) translateZ(100px)",
            },
          ].map((side) => (
            <div
              key={side.face}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: side.color,
                opacity: 0.8,
                border: "2px solid #fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "#000",
                transform: side.transform,
              }}
            >
              {side.face}
            </div>
          ))}
        </div>

        {/* Orbiting particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2 + frame / fps;
          const radius = 250;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={`particle-${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: ["#00d9ff", "#ff00d9", "#00ff88", "#ffaa00"][
                  i % 4
                ],
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                boxShadow: `0 0 15px ${["#00d9ff", "#ff00d9", "#00ff88", "#ffaa00"][
                  i % 4
                ]}`,
              }}
            />
          );
        })}
      </div>

      {/* Info Section */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#00d9ff",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          @remotion/three Playground
        </div>
        <div style={{ color: "#888", fontSize: 16 }}>
          3D Graphics & Three.js Integration
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#00d9ff",
          fontSize: 36,
          fontWeight: "bold",
        }}
      >
        3D Visualization & Three.js
      </div>
    </AbsoluteFill>
  );
};
