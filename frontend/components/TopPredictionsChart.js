import React from "react";
import { View, Text, StyleSheet } from "react-native";

const GREEN = "#2ecc71";
const BLUE = "#3498db";

/**
 * Horizontal bar chart using Views — no external chart library.
 * items: [{ label, value }] where value is 0–100
 */
export default function TopPredictionsChart({ items = [], title }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {items.map((row, idx) => {
        const w = Math.max(4, Math.min(100, row.value));
        const color = idx === 0 ? GREEN : BLUE;
        return (
          <View key={`${row.label}-${idx}`} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {row.label}
            </Text>
            <View style={styles.track}>
              <View style={[styles.bar, { width: `${w}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.val}>{Math.round(row.value)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
    maxWidth: "100%",
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 6,
  },
  val: {
    marginTop: 4,
    fontSize: 11,
    color: "#666",
    textAlign: "right",
  },
});
