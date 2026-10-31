import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "tomato_guard_user";

const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUserState(JSON.parse(raw));
        }
      } catch {
        setUserState(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setUser = useCallback(async (next) => {
    setUserState(next);
    try {
      if (next) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore storage errors — UI still updates */
    }
  }, []);

  const logout = useCallback(async () => {
    await setUser(null);
  }, [setUser]);

  const value = useMemo(
    () => ({ user, loading, setUser, logout }),
    [user, loading, setUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
