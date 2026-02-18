import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
// 1. Text, StyleSheet, Platform, ActivityIndicator가 누락되었었습니다.
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherByCoords } from '../services/weatherService';

export default function WeatherScreen() {
  // 2. 상태(State) 선언부가 누락되었었습니다.
  const [localWeather, setLocalWeather] = useState<any>(null);
  const [vancouverWeather, setVancouverWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const VANCOUVER_COORDS = { lat: 49.2827, lon: -123.1207 };

  // [v3.0 완결판] 타임존 정보를 받아 현지 시간을 계산하는 함수
  const getLocalTime = (timezoneOffset: number) => {
    if (timezoneOffset === undefined || timezoneOffset === null) return "시간 확인 중...";
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityDate = new Date(utc + (timezoneOffset * 1000));
    const hours = cityDate.getHours();
    const minutes = cityDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes}`;
  };

  // 3. 데이터를 가져오는 useEffect 로직이 누락되었었습니다.
  useEffect(() => {
    async function loadAllWeather() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') console.error("위치 권한 거부됨");

        let location = await Location.getCurrentPositionAsync({});
        
        const [localData, vancouverData] = await Promise.all([
          fetchWeatherByCoords(location.coords.latitude, location.coords.longitude),
          fetchWeatherByCoords(VANCOUVER_COORDS.lat, VANCOUVER_COORDS.lon)
        ]);

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
        <Text style={{ marginTop: 10 }}>지구 반대편 소식을 가져오는 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>실시간 날씨와 시간</Text>
          
          {/* 상단: 내 현재 위치 */}
          <View style={styles.weatherBox}>
            <Text style={styles.locationTag}>📍 내 위치 ({localWeather?.city})</Text>
            <Text style={styles.timeTag}>{getLocalTime(localWeather?.timezone)}</Text>
            <Text style={styles.temp}>{localWeather?.temp ?? '--'}°</Text>
            <Text style={styles.description}>{localWeather?.description}</Text>
          </View>

          {/* 하단: 밴쿠버 (손주들 동네) */}
          <View style={[styles.weatherBox, styles.vancouverBox]}>
            <Text style={styles.locationTag}>🇨🇦 밴쿠버 (Vancouver)</Text>
            <Text style={[styles.timeTag, { color: '#1976D2' }]}>
              {getLocalTime(vancouverWeather?.timezone)}
            </Text>
            <Text style={styles.vancouverTemp}>{vancouverWeather?.temp ?? '--'}°</Text> 
            <Text style={styles.vancouverDesc}>{vancouverWeather?.description}</Text> 
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 4. 스타일 시트도 완벽하게 정리했습니다.
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F8FF' },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingBottom: 60 },
  container: { width: '100%', alignItems: 'center', paddingTop: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  weatherBox: {
    alignItems: 'center', backgroundColor: '#fff', width: '90%', padding: 25, borderRadius: 25,
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 }, 
      android: { elevation: 5 } 
    }),
  },
  locationTag: { fontSize: 18, color: '#666', marginBottom: 5, fontWeight: '600' },
  timeTag: { fontSize: 20, fontWeight: 'bold', color: '#4A90E2', marginBottom: 10 },
  temp: { fontSize: 60, fontWeight: 'bold', color: '#333' },
  description: { fontSize: 20, color: '#555' },
  vancouverBox: { marginTop: 20, backgroundColor: '#E3F2FD' },
  vancouverTemp: { fontSize: 50, fontWeight: 'bold', color: '#1976D2' },
  vancouverDesc: { fontSize: 20, color: '#555' },
});