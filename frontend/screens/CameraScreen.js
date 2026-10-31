import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../context/LanguageContext';

export default function CameraScreen({ route, navigation }) {
  const { mode } = route.params;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Directly open gallery since camera is removed
    pickFromGallery();
  }, []);

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Gallery access required to select images');
        navigation.goBack();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery');
      navigation.goBack();
    }
  };

  const analyzeImage = () => {
    if (image) {
      navigation.replace('Result', { imageUri: image });
    }
  };

  // Show preview after selecting image
  if (image) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.preview} />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={() => setImage(null)}>
            <Text style={styles.buttonText}>{t('retake') || 'Choose Different'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.analyzeButton]} onPress={analyzeImage}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('analyze') || 'Analyze'}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Loading state while opening gallery
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2ecc71" />
      <Text style={styles.loadingText}>Opening gallery...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f4f0' 
  },
  loadingText: { 
    marginTop: 20, 
    fontSize: 16, 
    color: '#666' 
  },
  preview: { 
    flex: 1, 
    resizeMode: 'contain', 
    backgroundColor: '#000' 
  },
  buttonRow: { 
    flexDirection: 'row', 
    padding: 20, 
    gap: 15, 
    backgroundColor: '#000', 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0 
  },
  button: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  retakeButton: { 
    backgroundColor: '#e74c3c' 
  },
  analyzeButton: { 
    backgroundColor: '#2ecc71' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});