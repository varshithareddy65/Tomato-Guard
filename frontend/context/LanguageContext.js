import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "../utils/translations";

const LANG_KEY = "tomato_guard_lang";

const LanguageContext = createContext({
  lang: "en",
  setLang: async () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LANG_KEY);
        if (stored && translations[stored]) {
          setLangState(stored);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const setLang = useCallback(async (code) => {
    if (!translations[code]) return;
    setLangState(code);
    try {
      await AsyncStorage.setItem(LANG_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key, vars) => {
      const table = translations[lang] || translations.en;
      let s = table[key] ?? translations.en[key] ?? key;
      if (vars && typeof s === "string") {
        Object.keys(vars).forEach((k) => {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]));
        });
      }
      return s;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
