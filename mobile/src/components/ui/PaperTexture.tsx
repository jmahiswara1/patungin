import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Filter, FeTurbulence } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export function PaperTexture() {
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Filter id="noise">
        <FeTurbulence
          type="fractalNoise"
          baseFrequency={0.9}
          numOctaves={4}
          stitchTiles="stitch"
        />
      </Filter>
      <Rect width="100%" height="100%" filter="url(#noise)" opacity={0.025} />
    </Svg>
  );
}
