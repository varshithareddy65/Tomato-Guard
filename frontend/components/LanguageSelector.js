import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { SUPPORTED_LANGS } from "../utils/translations";

/**
 * Opens a modal to pick app language; persists via LanguageContext.
 */
export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = SUPPORTED_LANGS.find((l) => l.code === lang)?.label || "English";

  return (
    <>
      <TouchableOpacity style={styles.btn} onPress={() => setOpen(true)} activeOpacity={0.85}>
        <Text style={styles.btnText}>
          {t("language")}: {current}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.sheetTitle}>{t("select_language")}</Text>
            <FlatList
              data={SUPPORTED_LANGS}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item.code === lang && styles.itemActive]}
                  onPress={async () => {
                    await setLang(item.code);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.close} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    maxHeight: "70%",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginBottom: 12,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  itemActive: {
    backgroundColor: "rgba(46, 204, 113, 0.2)",
    borderWidth: 1,
    borderColor: "#2ecc71",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  close: {
    marginTop: 8,
    alignItems: "center",
    padding: 12,
  },
  closeText: {
    color: "#3498db",
    fontWeight: "700",
    fontSize: 15,
  },
});
