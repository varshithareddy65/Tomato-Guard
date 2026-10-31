import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import { predictDisease, saveHistory } from '../utils/api';
import TopPredictionsChart from '../components/TopPredictionsChart';
import DiagnosisCard from '../components/DiagnosisCard';
import StorageTipsCard from '../components/StorageTipsCard';
import FarmingTipsCard from '../components/FarmingTipsCard';
export default function ResultScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    analyzeImage();
  }, []);

  const analyzeImage = async () => {
    try {
      const response = await predictDisease(imageUri);
      console.log('Prediction response:', response);
      setResult(response);

      if (response.valid && !response.rejected) {
        const rawUser = await AsyncStorage.getItem('tomato_guard_user');
        const user = rawUser ? JSON.parse(rawUser) : null;

        if (!user?.phone) {
          throw new Error("User session not found");
        }

        const phone = user.phone;
        await saveHistory({
          phone,
          disease_name: response.disease_name,
          confidence: response.confidence,
          severity: response.severity,
          image: imageUri
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', error.error || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const speakResult = () => {
    if (!result || result.rejected) return;
    const diseaseName = result.disease_display || result.disease_name || 'Unknown disease';
    const text = `${diseaseName}. Confidence ${result.confidence} percent. ${result.storage_tips || ''}. ${result.treatment_solution || ''}`;
    Speech.speak(text, { language: 'en' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>{t('analyzing') || 'Analyzing...'}</Text>
      </View>
    );
  }

  if (result?.rejected || !result?.valid) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>Not a Tomato Leaf!</Text>
        <Text style={styles.errorMessage}>{result?.message || 'Please upload a clear tomato leaf image'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const diseaseDisplay = result.disease_display || result.disease_name || 'Unknown';
  const shelfColor = result.shelf_status === 'CRITICAL' ? '#e74c3c' :
    result.shelf_status === 'WARNING' ? '#f39c12' :
      result.shelf_status === 'EXCELLENT' ? '#2ecc71' : '#3498db';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('results') || 'Results'}</Text>
        <TouchableOpacity onPress={speakResult} style={styles.speakButton}>
          <Text style={styles.speakText}>{t('speak') || '🔊'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
        <View style={[styles.badge, { backgroundColor: shelfColor }]}>
          <Text style={styles.badgeText}>{result.shelf_status || 'GOOD'}</Text>
        </View>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.leftColumn}>
          <TopPredictionsChart
            items={(result.top_predictions || []).map(p => ({ label: p.name.replace(/_/g, ' '), value: p.confidence }))}
            title={t('top_predictions') || 'Top 5 predictions'}
          />
        </View>
        <View style={styles.rightColumn}>
          <DiagnosisCard
            disease={result.disease_display || result.disease_name}
            confidence={result.confidence}
            severity={result.severity}
            urgency={result.urgency}
            labels={{
              diagnosis: t('diagnosis') || 'Diagnosis',
              disease: t('disease') || 'Disease',
              confidence: t('confidence') || 'Confidence',
              severity: t('severity') || 'Severity',
              urgency: t('urgency') || 'Urgency'
            }}
          />
          <StorageTipsCard
            storageTips={result.storage_tips}
            treatment={result.treatment_solution}
            labels={{
              storage_and_treatment: t('storage_and_treatment') || 'Storage & Treatment',
              storage_tips: t('storage_tips') || 'Storage Tips',
              solution: t('solution') || 'Treatment Solution'
            }}
          />
        </View>
      </View>

      <FarmingTipsCard result={result} t={t} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f0' },
  loadingText: { marginTop: 20, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorIcon: { fontSize: 80, marginBottom: 20 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: '#e74c3c', marginBottom: 10 },
  errorMessage: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  retryButton: { backgroundColor: '#2ecc71', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  retryButtonText: { color: '#fff', fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: '#2ecc71' },
  backButton: { width: 40 },
  backText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  speakButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff', borderRadius: 20 },
  speakText: { fontSize: 12, fontWeight: 'bold', color: '#2ecc71' },
  imageContainer: { margin: 16, position: 'relative', overflow: 'hidden', borderRadius: 24 },
  previewImage: { width: '100%', height: 300, backgroundColor: '#ddd' },
  badge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  dashboard: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  leftColumn: { flex: 1, gap: 12 },
  rightColumn: { flex: 1, gap: 12 },
  shelfCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  shelfLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  shelfDays: { fontSize: 40, fontWeight: 'bold' },
  shelfNote: { fontSize: 11, color: '#999', marginTop: 5 }
});