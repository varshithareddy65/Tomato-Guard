import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../utils/api";

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function HistoryScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.phone) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getHistory(user.phone);
      setItems(data.history || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.phone]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.muted}>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← {t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("history")}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item._id || index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2ecc71"]} />}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>{t("no_history")}</Text>
            <Text style={styles.emptySub}>{t("history_empty")}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.disease}>{String(item.disease_name || "").replace(/_/g, " ")}</Text>
            <Text style={styles.meta}>
              {t("confidence")}: {item.confidence ?? "—"}
              {t("percent_unit")}
            </Text>
            {item.severity ? (
              <Text style={styles.meta}>
                {t("severity")}: {item.severity}
              </Text>
            ) : null}
            <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  muted: { marginTop: 10, color: "#666", fontSize: 14 },
  header: { paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: "#fff", elevation: 2 },
  back: { color: "#3498db", fontWeight: "700", marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "900", color: "#333" },
  list: { padding: 18, paddingBottom: 40 },
  emptyContainer: { flexGrow: 1 },
  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#333", marginBottom: 8 },
  emptySub: { fontSize: 14, color: "#666", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  disease: { fontSize: 17, fontWeight: "800", color: "#333", marginBottom: 6 },
  meta: { fontSize: 14, color: "#666", marginBottom: 4 },
  date: { fontSize: 12, color: "#999", marginTop: 6 },
});
