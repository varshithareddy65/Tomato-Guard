import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { fetchWeather } from "../utils/api";
import WeatherCard from "../components/WeatherCard";
import LanguageSelector from "../components/LanguageSelector";
import Footer from "../components/Footer";

const { width } = Dimensions.get('window');

const TIPS = [
  { id: '01', title: 'Water in the morning', desc: 'Morning watering lets leaves dry during the day, greatly reducing the risk of fungal disease.' },
  { id: '02', title: 'Inspect weekly', desc: 'Check the undersides of leaves every 7 days. Early detection saves the entire crop.' },
  { id: '03', title: 'Remove dead leaves', desc: 'Infected leaves spread spores. Remove them immediately and dispose far from the field.' },
  { id: '04', title: 'Spray neem oil', desc: 'Weekly neem oil spray acts as a natural pesticide against most insects and fungal threats.' },
  { id: '05', title: 'Ensure 6-8 hrs sunlight', desc: 'Poor light weakens plant immunity. Position plants where they get full morning sun.' },
  { id: '06', title: 'Test soil nutrients', desc: 'Low calcium or magnesium causes physiological disorders. Test soil monthly in growing season.' },
];

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [weather, setWeather] = useState(null);
  const [wLoading, setWLoading] = useState(true);
  const [wError, setWError] = useState(false);

  const loadWeather = useCallback(async () => {
    setWLoading(true);
    setWError(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setWeather(null);
        setWError(true);
        setWLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const data = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
      setWeather(data);
    } catch {
      setWError(true);
      setWeather(null);
    } finally {
      setWLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWeather();
    }, [loadWeather])
  );

  function confirmLogout() {
    Alert.alert(t("logout_confirm_title"), t("logout_confirm_message"), [
      { text: t("no"), style: "cancel" },
      { text: t("yes"), style: "destructive", onPress: () => logout() },
    ]);
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#163c26", "#0f2c1b"]} style={styles.heroSection}>
          <View style={styles.headerTop}>
            <Text style={styles.logoText}>● Tomato Guard</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <LanguageSelector />
              <TouchableOpacity onPress={confirmLogout} style={styles.logoutChip}>
                <Text style={styles.logoutText}>{t("logout")}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.greet}>
            {user?.name ? t("home_greeting", { name: user.name }) : t("welcome_back")}
          </Text>

          <View style={styles.actionRow}>
             <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate("Camera", { mode: "camera" })}>
                <Text style={styles.scanBtnText}>Scan a Leaf</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("History")}>
                <Text style={styles.viewBtnText}>View History →</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
               <Text style={styles.statValue}>11</Text>
               <Text style={styles.statLabel}>Diseases Detected</Text>
            </View>
            <View style={styles.statBox}>
               <Text style={styles.statValue}>&lt;2s</Text>
               <Text style={styles.statLabel}>Analysis Time</Text>
            </View>
            <View style={styles.statBox}>
               <Text style={styles.statValue}>AI</Text>
               <Text style={styles.statLabel}>MobileNetV2 Model</Text>
            </View>
            <View style={styles.statBox}>
               <Text style={styles.statValue}>తె</Text>
               <Text style={styles.statLabel}>Telugu Support</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentSection}>
          <WeatherCard
            weather={weather}
            loading={wLoading}
            error={wError}
            onRetry={loadWeather}
            t={t}
          />
          
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Simple habits that prevent most tomato diseases before they start.</Text>
            <View style={styles.tipsGrid}>
               {TIPS.map((tip, index) => (
                 <View key={tip.id} style={styles.tipCard}>
                   <Text style={styles.tipNumber}>{tip.id}</Text>
                   <Text style={styles.tipTitle}>{tip.title}</Text>
                   <Text style={styles.tipDesc}>{tip.desc}</Text>
                 </View>
               ))}
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fdfbf7" },
  scroll: { paddingBottom: 40 },
  heroSection: {
    paddingTop: 52,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 350,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: { color: '#a2e2b4', fontSize: 18, fontWeight: 'bold' },
  logoutChip: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10
  },
  logoutText: { color: "#a2e2b4", fontWeight: "600", fontSize: 13 },
  greet: { fontSize: 28, fontWeight: "800", color: "#fdfbf7", textAlign: 'center', marginBottom: 30 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40
  },
  scanBtn: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2
  },
  scanBtnText: { color: '#0f2c1b', fontWeight: 'bold', fontSize: 16 },
  viewBtn: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  viewBtnText: { color: '#fdfbf7', fontWeight: 'bold', fontSize: 16 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 20
  },
  statBox: {
    width: '23%',
    alignItems: 'center'
  },
  statValue: {
    color: '#fdfbf7',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4
  },
  statLabel: {
    color: '#8da897',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600'
  },
  contentSection: {
    padding: 20,
    marginTop: -20,
  },
  tipsSection: {
    marginTop: 30,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f2c1b',
    marginBottom: 20,
    lineHeight: 28
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  tipCard: {
    width: '48%',
    backgroundColor: '#163c26',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipNumber: {
    color: '#2d6a43',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8
  },
  tipTitle: {
    color: '#fdfbf7',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6
  },
  tipDesc: {
    color: '#8da897',
    fontSize: 12,
    lineHeight: 18
  }
});
