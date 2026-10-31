import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from 'expo-speech';

function weatherEmoji(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return "☔";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("clear") || c.includes("sun")) return "☀️";
  return "🌤️";
}

function riskColor(risk) {
  if (risk === "HIGH") return "#e74c3c";
  if (risk === "MEDIUM") return "#f39c12";
  return "#27ae60";
}

export default function WeatherCard({ weather, loading, error, onRetry, t, lang }) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#2ecc71" size="large" />
        <Text style={styles.muted}>{t("fetching_weather")}</Text>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.card}>
        <Text style={styles.err}>{t("weather_error")}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>{t("retry")}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  const emoji = weatherEmoji(weather.condition);
  const rc = riskColor(weather.disease_risk);
  const riskLabel =
    weather.disease_risk === "HIGH"
      ? t("risk_high")
      : weather.disease_risk === "MEDIUM"
        ? t("risk_medium")
        : t("risk_low");

  const handleSpeak = () => {
    const textToSpeak = `${t("weather")}. ${t("temperature")} ${weather.temperature_c} ${t("celsius")}. ${t("condition")} ${weather.condition}. ${t("farming_advice")}: ${weather.farming_advice}`;
    Speech.speak(textToSpeak, { language: lang || 'en' });
  };

  return (
    <LinearGradient colors={["#64b5f6", "#1976d2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.grad}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View>
            <Text style={styles.title}>{t("weather")}</Text>
            {weather.is_mock ? <Text style={styles.mock}>{t("mock_weather")}</Text> : null}
          </View>
        </View>
        <TouchableOpacity onPress={handleSpeak} style={styles.speakBtn}>
          <Text style={styles.speakIcon}>🔊</Text>
          <Text style={styles.speakText}>{t("speak_weather")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t("temperature")}</Text>
            <Text style={styles.statVal}>{weather.temperature_c}{t("celsius")}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t("humidity")}</Text>
            <Text style={styles.statVal}>{weather.humidity}{t("percent_unit")}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t("wind_speed")}</Text>
            <Text style={styles.statVal}>{weather.wind_speed_ms} m/s</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("condition")}:</Text>
          <Text style={styles.infoValue}>{weather.condition}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("risk_level")}:</Text>
          <View style={[styles.riskBadge, { backgroundColor: rc }]}>
            <Text style={styles.riskBadgeText}>{riskLabel}</Text>
          </View>
        </View>

        <View style={styles.adviceContainer}>
          <Text style={styles.adviceTitle}>💡 {t("farming_advice")}</Text>
          <Text style={styles.advice}>{weather.farming_advice}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 16,
    minHeight: 150,
  },
  grad: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 42,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
  },
  mock: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  speakBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  speakIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  speakText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  mainContent: {
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    fontWeight: "600",
  },
  statVal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "800",
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  adviceContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 12,
  },
  adviceTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#a2e2b4",
    marginBottom: 8,
  },
  advice: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 22,
  },
  muted: {
    marginTop: 12,
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
  err: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
