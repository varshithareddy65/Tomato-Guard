import React, { useState } from "react";
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
import { signupUser } from "../utils/api";

export default function SignupScreen({ navigation }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSignup() {
    if (!name.trim() || !phone.trim() || password.length < 6) {
      Alert.alert(t("error"), t("fill_form"));
      return;
    }
    if (password !== confirm) {
      Alert.alert(t("error"), t("password_mismatch"));
      return;
    }
    setBusy(true);
    try {
      await signupUser({ name: name.trim(), phone: phone.trim(), password });
      Alert.alert(t("signup"), t("signup_complete"), [
        { text: t("login"), onPress: () => navigation.navigate("Login") },
      ]);
    } catch (e) {
      const msg = e.response?.data?.error || t("network_error");
      Alert.alert(t("error"), msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <LinearGradient colors={["#163c26", "#0f2c1b"]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← {t("back")}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t("signup_subtitle")}</Text>
          <Text style={styles.sub}>{t("create_account")}</Text>

          <View style={styles.field}>
            <Text style={styles.icon}>{t("login_emoji_user")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("name_placeholder")}
              placeholderTextColor="#8da897"
              value={name}
              onChangeText={setName}
            />
          </View>
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
          <View style={styles.field}>
            <Text style={styles.icon}>{t("login_emoji_lock")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("confirm_password")}
              placeholderTextColor="#8da897"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, busy && { opacity: 0.7 }]}
            onPress={onSignup}
            disabled={busy}
            activeOpacity={0.9}
          >
            {busy ? (
              <ActivityIndicator color="#0f2c1b" />
            ) : (
              <Text style={styles.primaryBtnText}>{t("signup")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>{t("have_account")} </Text>
            <Text style={styles.linkBold}>{t("login")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: { marginBottom: 16 },
  backText: { color: "#a2e2b4", fontSize: 16, fontWeight: "700" },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fdfbf7",
    marginBottom: 6,
  },
  sub: {
    fontSize: 15,
    color: "#8da897",
    marginBottom: 22,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
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
    elevation: 4,
  },
  primaryBtnText: {
    color: "#0f2c1b",
    fontSize: 17,
    fontWeight: "800",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
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
