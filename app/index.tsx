import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherByCoords } from '../services/weatherService';

const FAVORITE_CITIES = [
  { label: '🇺🇸 뉴욕', name: 'New York', lat: 40.7128, lon: -74.0060 },
  { label: '🇨🇦 토론토', name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { label: '🇨🇦 밴쿠버', name: 'Target', lat: 49.2827, lon: -123.1207 },
  { label: '🇺🇸 LA', name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { label: '🇺🇸 샌프란시스코', name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { label: '🇺🇸 하와이', name: 'Honolulu', lat: 21.3069, lon: -157.8583 },
  { label: '🇦🇺 시드니', name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { label: '🇨🇳 상하이', name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
  { label: '🇻🇳 다낭', name: 'Da Nang', lat: 16.0544, lon: 108.2022 },
  { label: '🇸🇬 싱가포르', name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { label: '🇫🇷 파리', name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { label: '🇬🇧 런던', name: 'London', lat: 51.5074, lon: -0.1278 },
  { label: '🇧🇷 상파울루', name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 },
];

export default function WeatherScreen() {
  const [localWeather, setLocalWeather] = useState<any>(null);
  const [targetCity, setTargetCity] = useState<any>(null);
  const [targetWeather, setTargetWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // 저장된 도시 불러오기
  const loadCity = async () => {
    try {
      const saved = await AsyncStorage.getItem('lastCity');
      return saved ? JSON.parse(saved) : FAVORITE_CITIES[0];
    } catch (e) { return FAVORITE_CITIES[0]; }
  };

  // 선택 도시 저장하기
  const saveCity = async (city: any) => {
    try {
      await AsyncStorage.setItem('lastCity', JSON.stringify(city));
    } catch (e) { console.error(e); }
  };

  // 현지 시간 날짜 요일 계산 함수
// [v3.1 업그레이드] 날짜, 요일, 시간까지 한 번에 계산하는 함수
  const getLocalTime = (timezoneOffset: number) => {
    if (timezoneOffset === undefined || timezoneOffset === null) return "시간 확인 중...";
    
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityDate = new Date(utc + (timezoneOffset * 1000));
    
    // 월, 일, 요일 추출
    const month = cityDate.getMonth() + 1;
    const date = cityDate.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = weekDays[cityDate.getDay()];
    
    const hours = cityDate.getHours();
    const minutes = cityDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;

    // 따님이 요청하신 형식: xx월 xx일 요일 오전/오후 hh:mm
    return `${month}월 ${date}일 ${dayName} ${ampm} ${displayHours}:${minutes}`;
  };
  // 🌟 핵심 로직: 날씨와 위치를 가져오는 메인 함수
  const loadAllData = async () => {
    try {
      setLoading(true);

      // 1. 저장된 도시 확인 (없으면 첫 번째 도시)
      const savedCity = await loadCity();
      setTargetCity(savedCity);

      // 2. 내 위치 GPS 정보 가져오기 (최고 정밀도 설정)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.BestForNavigation 
      });

      // 3. 지오역코딩: 좌표를 한글 주소(구/시 단위)로 변환
      let address = await Location.reverseGeocodeAsync(location.coords);
      const addr = address[0];
      const myLocationName = addr 
        ? `${addr.district || addr.city} (${addr.city || addr.region})`
        : "내 위치";

      // 4. 날씨 데이터 가져오기 (내 위치 + 선택 도시)
      const [localData, targetData] = await Promise.all([
        fetchWeatherByCoords(location.coords.latitude, location.coords.longitude),
        fetchWeatherByCoords(savedCity.lat, savedCity.lon)
      ]);

      if (localData) {
        setLocalWeather({ ...localData, displayCity: myLocationName });
      }
      setTargetWeather(targetData);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 앱이 처음 켜질 때 실행
  useEffect(() => {
    loadAllData();
  }, []);

  // 🌟 도시를 변경할 때마다 GPS를 포함한 모든 데이터를 다시 갱신 (배터리 절약 안함!)
  useEffect(() => {
    if (targetCity) {
      loadAllData();
    }
  }, [targetCity?.name]);

  if (loading && !localWeather) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>실시간 정보를 가져오고 있습니다...</Text>
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
            <Text style={styles.locationTag}>📍 내 위치 ({localWeather?.displayCity})</Text>
            <Text style={styles.timeTag}>{getLocalTime(localWeather?.timezone)}</Text>
            <Text style={styles.temp}>{localWeather?.temp ?? '--'}°</Text>
            <Text style={styles.description}>{localWeather?.description}</Text>
          </View>

          {/* 하단: 선택한 도시 (터치 시 변경) */}
          {targetCity && (
            <Pressable
              style={[styles.weatherBox, styles.targetBox]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.locationTag}>{targetCity.label} (터치하여 변경)</Text>
              <Text style={[styles.timeTag, { color: '#1976D2' }]}>
                {getLocalTime(targetWeather?.timezone)}
              </Text>
              <Text style={styles.targetTemp}>{targetWeather?.temp ?? '--'}°</Text>
              <Text style={styles.targetDesc}>{targetWeather?.description}</Text>
            </Pressable>
          )}
        </View>

        {/* 도시 선택 모달 */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>확인할 도시를 선택하세요</Text>
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={true}
              >
                {FAVORITE_CITIES.map((city) => (
                  <Pressable
                    key={city.name}
                    style={styles.cityItem}
                    onPress={() => {
                      saveCity(city);
                      setTargetCity(city);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.cityText}>{city.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  targetBox: { marginTop: 20, backgroundColor: '#E3F2FD' },
  targetTemp: { fontSize: 60, fontWeight: 'bold', color: '#333' },
  targetDesc: { fontSize: 20, color: '#555' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cityItem: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cityText: {
    fontSize: 22,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
});