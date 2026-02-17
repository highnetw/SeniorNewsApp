import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
// 1. ScrollView를 추가했습니다.
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherByCoords } from '../services/weatherService';

export default function WeatherScreen() {
  const [localWeather, setLocalWeather] = useState<any>(null);
  const [vancouverWeather, setVancouverWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const VANCOUVER_COORDS = { lat: 49.2827, lon: -123.1207 };

  useEffect(() => {
    async function loadAllWeather() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error("위치 권한 거부됨");
        }

        let location = await Location.getCurrentPositionAsync({});
        
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
    // 2. edges 설정을 통해 하단 탭 영역까지 안전하게 보호합니다.
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* 3. ScrollView로 감싸서 내용이 길어져도 위아래로 밀 수 있게 합니다. */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.vancouverTemp}>{vancouverWeather?.temp ?? '--'}°</Text> 
            <Text style={styles.vancouverDesc}>{vancouverWeather?.description}</Text> 
            <Text style={styles.vancouverHumi}>습도 {vancouverWeather?.humidity}%</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F8FF' },
  // 4. 스크롤 내부 여백 설정 (하단 탭에 가려지지 않게 넉넉히 줍니다)
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 60, 
  },
  container: { width: '100%', alignItems: 'center', paddingTop: 30 },
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
  vancouverTemp: { fontSize: 45, fontWeight: 'bold', color: '#1976D2', textAlign: 'center' },
  vancouverDesc: { fontSize: 20, color: '#555', textAlign: 'center' },
  vancouverHumi: { fontSize: 18, color: '#756f6f', textAlign: 'center', marginTop: 5 },
});