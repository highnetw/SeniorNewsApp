import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { fetchWeatherByCoords } from '../services/weatherService';

export default function WeatherScreen() {
  const [localWeather, setLocalWeather] = useState<any>(null); // 내 위치
  const [vancouverWeather, setVancouverWeather] = useState<any>(null); // 밴쿠버
  const [loading, setLoading] = useState(true);

  const VANCOUVER_COORDS = { lat: 49.2827, lon: -123.1207 };

  useEffect(() => {
    async function loadAllWeather() {
      try {
        // 1. 위치 권한 요청 및 현재 위치 가져오기
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error("위치 권한 거부됨");
        }

        let location = await Location.getCurrentPositionAsync({});
        
        // 2. 데이터 가져오기 (내 위치 & 밴쿠버)
        const localData = await fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
        const vancouverData = await fetchWeatherByCoords(VANCOUVER_COORDS.lat, VANCOUVER_COORDS.lon);

        setLocalWeather(localData);
        setVancouverWeather(vancouverData);
      } catch (error) {
        console.error("날씨 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAllWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>지금 날씨 정보를 연결 중입니다...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>실시간 날씨</Text>
        
        {/* 상단: 내 현재 위치 날씨 */}
        <View style={styles.weatherBox}>
          <Text style={styles.locationTag}>📍 내 현재 위치 ({localWeather?.city})</Text>
          <Text style={styles.temp}>{localWeather?.temp ?? '--'}°</Text>
          <Text style={styles.description}>{localWeather?.description}</Text>
          <Text style={styles.humidity}>습도 {localWeather?.humidity}%</Text>
        </View>

        {/* 하단: 밴쿠버 날씨 (손주들 동네) */}
        <View style={[styles.weatherBox, styles.vancouverBox]}>
          <Text style={styles.locationTag}>🇨🇦 밴쿠버</Text>
        {/*  <View style={styles.vancouverRow}> */}
            <Text style={styles.vancouverTemp}>{vancouverWeather?.temp ?? '--'}°</Text> 
            <Text style={styles.vancouverDesc}>{vancouverWeather?.description}</Text> 
          <Text style={styles.vancouverHumi}>습도 {vancouverWeather?.humidity}%</Text>
          {/*</View>*/}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F8FF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, alignItems: 'center', paddingTop: 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  weatherBox: {
    alignItems: 'center', backgroundColor: '#fff', width: '90%', padding: 30, borderRadius: 25,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 }, android: { elevation: 5 } }),
  },
  locationTag: { fontSize: 22, color: '#666', marginBottom: 10, fontWeight: '600' },
  temp: { fontSize: 65, fontWeight: 'bold', color: '#4A90E2' },
  description: { fontSize: 20, color: '#555' },
  humidity: { fontSize: 18, color: '#756f6f', marginTop: 5 },
  vancouverBox: { marginTop: 20, backgroundColor: '#E3F2FD', padding: 20 },
  vancouverRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  vancouverTemp: { fontSize: 45, fontWeight: 'bold', color: '#1976D2', textAlign: 'center', marginRight: 0 },
  vancouverDesc: { fontSize: 20, color: '#555' },
  vancouverHumi: { fontSize: 18, color: '#756f6f', textAlign: 'center', marginTop: 5 },
});