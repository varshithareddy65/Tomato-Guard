import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StorageTipsCard({ storageTips, treatment, labels }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{labels.storage_and_treatment}</Text>
      <Text style={styles.section}>{labels.storage_tips}</Text>
      <Text style={styles.body}>{storageTips}</Text>
      <Text style={[styles.section, { marginTop: 12 }]}>{labels.solution}</Text>
      <Text style={styles.body}>{treatment}</Text>
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
    marginBottom: 10,
  },
  section: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2ecc71",
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
