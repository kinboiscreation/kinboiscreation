import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../styles/tailwind.css";

export const TailwindDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardRotation = interpolate(frame, [0, fps * 5], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardScale = interpolate(
    frame,
    [0, fps * 2.5, fps * 5],
    [0.8, 1.1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill className="bg-gray-950 flex items-center justify-center">
      <div
        className="grid grid-cols-2 gap-8 max-w-2xl"
        style={{
          perspective: "1000px",
        }}
      >
        {/* Card 1 */}
        <div
          className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-lg shadow-lg transform transition-transform"
          style={{
            transform: `rotateY(${cardRotation}deg) scale(${cardScale})`,
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">Tailwind</h3>
          <p className="text-gray-100">CSS Styling</p>
        </div>

        {/* Card 2 */}
        <div
          className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-lg shadow-lg transform transition-transform"
          style={{
            transform: `rotateY(${-cardRotation}deg) scale(${cardScale})`,
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">Responsive</h3>
          <p className="text-gray-100">Design System</p>
        </div>

        {/* Card 3 */}
        <div
          className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-lg shadow-lg transform transition-transform"
          style={{
            transform: `rotateY(${cardRotation}deg) scale(${cardScale})`,
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">Utilities</h3>
          <p className="text-gray-100">First Approach</p>
        </div>

        {/* Card 4 */}
        <div
          className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-lg shadow-lg transform transition-transform"
          style={{
            transform: `rotateY(${-cardRotation}deg) scale(${cardScale})`,
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">Animation</h3>
          <p className="text-gray-100">Ready to Use</p>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-0 right-0 text-center text-cyan-400 text-2xl font-bold"
        style={{
          fontSize: 24,
        }}
      >
        Tailwind Demo - @remotion/tailwind
      </div>
    </AbsoluteFill>
  );
};
