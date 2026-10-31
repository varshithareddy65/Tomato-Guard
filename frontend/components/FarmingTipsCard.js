import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FarmingTipsCard({ result, t }) {
  if (!result || !result.disease) return null;

  const disease = result.disease.toLowerCase();
  
  let tips = [
    "Ensure proper spacing between plants for good air circulation.",
    "Water at the base of the plant to keep leaves dry.",
    "Remove and destroy infected plant debris."
  ];

  if (disease.includes('blight') || disease.includes('septoria')) {
    tips = [
      "Apply a copper-based fungicide to protect new foliage.",
      "Prune the lower branches to prevent soil splash.",
      "Avoid handling plants when they are wet."
    ];
  } else if (disease.includes('mite') || disease.includes('spider')) {
    tips = [
      "Introduce predatory mites to your garden.",
      "Keep plants well-watered, as mites thrive in hot, dry conditions.",
      "Use insecticidal soap or neem oil sprays."
    ];
  } else if (disease.includes('mold') || disease.includes('mildew')) {
    tips = [
      "Improve air circulation by pruning dense growth.",
      "Water only in the morning.",
      "Apply sulfur-based fungicides at first sign of disease."
    ];
  } else if (disease.includes('healthy')) {
    tips = [
      "Continue your current watering schedule.",
      "Apply balanced fertilizer every 2 weeks.",
      "Monitor daily for early signs of pests."
    ];
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🌱 {t("farming_tips") || "Farming Tips"}</Text>
      {tips.map((tip, index) => (
        <View key={index} style={styles.tipRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#34495e',
    marginRight: 8,
    marginTop: -2,
  },
  tipText: {
    fontSize: 14,
    color: '#34495e',
    flex: 1,
    lineHeight: 20,
  },
});
