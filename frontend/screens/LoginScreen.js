import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/api";
import { SUPPORTED_LANGS } from "../utils/translations";

export default function LoginScreen({ navigation }) {
  const { t, lang, setLang } = useLanguage();
  const { setUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    if (!phone.trim() || !password) {
      Alert.alert(t("error"), t("login_fill"));
      return;
    }
    setBusy(true);
    try {
      const data = await loginUser({ phone: phone.trim(), password });
      await setUser({ name: data.name, phone: data.phone });
    } catch (e) {
      const msg = e.response?.data?.error || t("network_error");
      Alert.alert(t("error"), msg);
    } finally {
      setBusy(false);
    }
  }

  async function onGuestLogin() {
    try {
      let guestId = await AsyncStorage.getItem("tomato_guard_guest_id");

      if (!guestId) {
        guestId = `guest_${Crypto.randomUUID()}`;
        await AsyncStorage.setItem("tomato_guard_guest_id", guestId);
      }

      await setUser({
        name: "Guest",
        phone: guestId,
        isGuest: true
      });
    } catch (error) {
      console.error("Guest login error:", error);
      Alert.alert("Error", "Unable to continue as Guest.");
    }
  }

  return (
    <LinearGradient colors={["#163c26", "#0f2c1b"]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.langContainer}>
          {SUPPORTED_LANGS.map((l) => (
            <TouchableOpacity
              key={l.code}
              onPress={() => setLang(l.code)}
              style={[styles.langBtn, lang === l.code && styles.langBtnActive]}
            >
              <Text style={[styles.langText, lang === l.code && styles.langTextActive]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inner}>
          <Text style={styles.logoText}>● Tomato Guard</Text>

          <View style={styles.loginBox}>
            <Text style={styles.welcome}>{t("welcome_back")}</Text>
            <Text style={styles.sub}>{t("login_subtitle")}</Text>

            <View style={styles.field}>
              <Text style={styles.icon}>{t("login_emoji_phone")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("phone_placeholder")}
                placeholderTextColor="#8da897"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.icon}>{t("login_emoji_lock")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("password_placeholder")}
                placeholderTextColor="#8da897"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, busy && { opacity: 0.7 }]}
              onPress={onLogin}
              disabled={busy}
              activeOpacity={0.9}
            >
              {busy ? (
                <ActivityIndicator color="#0f2c1b" />
              ) : (
                <Text style={styles.primaryBtnText}>{t("login")}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestBtn}
              onPress={onGuestLogin}
              disabled={busy}
            >
              <Text style={styles.guestBtnText}>{t("continue_guest")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}>{t("no_account")} </Text>
              <Text style={styles.linkBold}>{t("signup")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  langContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  langBtnActive: {
    backgroundColor: '#a2e2b4',
  },
  langText: {
    color: '#a2e2b4',
    fontSize: 14,
    fontWeight: '600',
  },
  langTextActive: {
    color: '#0f2c1b',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoText: { color: '#a2e2b4', fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  loginBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  welcome: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fdfbf7",
    marginBottom: 6,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: "#8da897",
    marginBottom: 24,
    textAlign: 'center',
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#fdfbf7",
  },
  primaryBtn: {
    backgroundColor: "#a2e2b4",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#0f2c1b",
    fontSize: 17,
    fontWeight: "800",
  },
  guestBtn: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#a2e2b4",
  },
  guestBtnText: {
    color: "#a2e2b4",
    fontSize: 16,
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  link: {
    color: "#8da897",
    fontSize: 15,
  },
  linkBold: {
    color: "#a2e2b4",
    fontSize: 15,
    fontWeight: "800",
  },
});
