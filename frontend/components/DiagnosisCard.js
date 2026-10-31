import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Shows primary diagnosis: disease, confidence, severity, urgency.
 */
export default function DiagnosisCard({ disease, confidence, severity, urgency, labels }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{labels.diagnosis}</Text>
      <View style={styles.grid}>
        <View style={styles.cell}>
          <Text style={styles.k}>{labels.disease}</Text>
          <Text style={styles.v}>{disease}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.k}>{labels.confidence}</Text>
          <Text style={styles.v}>{confidence}%</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.k}>{labels.severity}</Text>
          <Text style={styles.v}>{severity}</Text>
        </View>
        <View style={[styles.cell, styles.full]}>
          <Text style={styles.k}>{labels.urgency}</Text>
          <Text style={styles.vSmall}>{urgency}</Text>
        </View>
      </View>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  cell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  full: {
    width: "100%",
  },
  k: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  v: {
    fontSize: 16,
    fontWeight: "800",
    color: "#163c26",
  },
  vSmall: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
    fontWeight: "600",
  },
});
