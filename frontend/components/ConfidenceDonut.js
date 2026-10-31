import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const PRIMARY = "#2ecc71";

/**
 * Donut chart: confidence % in the center using react-native-svg arcs via stroke dash.
 */
export default function ConfidenceDonut({ percent = 0, size = 140, strokeWidth = 14, confidenceLabel = "confidence" }) {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (p / 100) * circumference;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="#e8e8e8"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={PRIMARY}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.pct}>{Math.round(p)}%</Text>
        <Text style={styles.sub}>{confidenceLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pct: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
  },
  sub: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
});
