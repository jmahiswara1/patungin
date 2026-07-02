import React from "react";
import Svg, { Path, Circle, G } from "react-native-svg";

interface DoodleProps {
  width?: number;
  height?: number;
  color?: string;
  style?: object;
}

export function UnderlineDoodle({
  width = 200,
  height = 12,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 200 12"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M2 8 C20 4, 40 10, 60 6 C80 2, 100 9, 120 5 C140 1, 160 8, 198 4"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function WavyUnderline({
  width = 300,
  height = 14,
  color = "#2F66F4",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 300 14"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M4 8 C40 2, 80 12, 120 6 C160 0, 200 12, 240 6 C270 2, 290 8, 296 5"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function CircleDoodle({
  width = 120,
  height = 120,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 120 120"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M60 8 C85 6, 110 25, 112 55 C114 85, 90 112, 60 114 C30 116, 6 90, 4 60 C2 30, 25 10, 60 8"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function ArrowDoodle({
  width = 60,
  height = 80,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 60 80"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M30 4 C30 4, 28 30, 30 50 C32 70, 30 75, 30 75"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M18 62 C18 62, 30 76, 42 62"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function CurlyArrowDoodle({
  width = 120,
  height = 60,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 120 60"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M8 40 C24 16, 44 56, 64 30 C74 16, 82 24, 86 30"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M74 22 L88 30 L78 38"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function StarburstDoodle({
  width = 60,
  height = 60,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 60 60"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M30 2 L33 18 L48 8 L38 22 L55 25 L40 30 L52 42 L36 35 L38 55 L30 40 L22 55 L24 35 L8 42 L20 30 L5 25 L22 22 L12 8 L27 18 Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function SparkDoodle({
  width = 48,
  height = 48,
  color = "#2F66F4",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 48 48"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M24 4 C25 14, 27 17, 32 19 C27 21, 25 24, 24 34 C23 24, 21 21, 16 19 C21 17, 23 14, 24 4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M38 30 C39 34, 40 35, 42 36 C40 37, 39 38, 38 42 C37 38, 36 37, 34 36 C36 35, 37 34, 38 30"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function CloudDoodle({
  width = 120,
  height = 70,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 120 70"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M20 58 C8 58, 6 44, 16 40 C10 30, 22 22, 32 28 C36 16, 56 14, 60 26 C68 14, 86 18, 84 30 C96 30, 98 44, 92 50 C96 58, 84 62, 76 58 L20 58"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function SquiggleLoopDoodle({
  width = 80,
  height = 40,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 80 40"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M6 28 C18 28, 18 12, 28 20 C38 28, 30 8, 44 16 C56 22, 54 8, 72 12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function DividerDoodle({
  width = 800,
  height = 20,
  color = "#E2E5EE",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 800 20"
      width="100%"
      height={height}
      style={style}
    >
      <Path
        d="M0 10 C50 6, 100 14, 150 10 C200 6, 250 14, 300 10 C350 6, 400 14, 450 10 C500 6, 550 14, 600 10 C650 6, 700 14, 750 10 C775 8, 790 10, 800 10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function ScribbleDoodle({
  width = 80,
  height = 30,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 80 30"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M5 15 L15 10 L25 18 L35 8 L45 20 L55 12 L65 22 L75 15"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M8 18 L18 13 L28 21 L38 11 L48 23 L58 15 L68 25 L72 18"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function CheckmarkDoodle({
  width = 40,
  height = 40,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 40 40"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M8 20 L16 28 L32 10"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function DottedLineDoodle({
  width = 100,
  height = 4,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  const dots = [5, 20, 35, 50, 65, 80, 95];
  return (
    <Svg
      viewBox="0 0 100 4"
      width={width}
      height={height}
      style={style}
    >
      {dots.map((cx, i) => (
        <Circle key={i} cx={cx} cy={2} r={2} fill={color} />
      ))}
    </Svg>
  );
}

export function FrameDoodle({
  width = 200,
  height = 150,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 200 150"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M4 4 C4 2, 6 2, 8 4 L192 4 C194 2, 196 2, 196 4 L196 146 C198 146, 198 148, 196 148 L8 148 C6 148, 4 148, 4 146 Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function QuoteDoodle({
  width = 60,
  height = 45,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 60 45"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M8 12 C8 8, 10 4, 15 4 C18 4, 20 6, 20 10 C20 14, 18 18, 14 22 L8 28"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M33 12 C33 8, 35 4, 40 4 C43 4, 45 6, 45 10 C45 14, 43 18, 39 22 L33 28"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function WavyArrowDoodle({
  width = 120,
  height = 60,
  color = "#0F1B2D",
  style,
}: DoodleProps) {
  return (
    <Svg
      viewBox="0 0 120 60"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M10 30 C30 20, 50 40, 70 28 C80 22, 90 30, 100 30"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M88 22 L100 30 L92 38"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
