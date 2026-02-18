import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherByCoords } from '../services/weatherService';

const FAVORITE_CITIES = [
  { label: '🇺🇸 뉴욕', name: 'New York', lat: 40.7128, lon: -74.0060 },
  { label: '🇨🇦 토론토', name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { label: '🇨🇦 밴쿠버', name: 'Vancouver', lat: 49.2827, lon: -123.1207 },
  { label: '🇺🇸 LA', name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { label: '🇺🇸 샌프란시스코', name: 'San Francisco', lat: 37.7749, lon: -122.4194 }, // 추가
  { label: '🇺🇸 하와이', name: 'Honolulu', lat: 21.3069, lon: -157.8583 },       // 추가
  { label: '🇦🇺 시드니', name: 'Sydney', lat: -33.8688, lon: 151.2093 },      // 추가
  { label: '🇨🇳 상하이', name: 'Shanghai', lat: 31.2304, lon: 121.4737 },    // 추가
  { label: '🇻🇳 다낭', name: 'Da Nang', lat: 16.0544, lon: 108.2022 },       // 추가
  { label: '🇸🇬 싱가포르', name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { label: '🇫🇷 파리', name: 'Paris', lat: 48.8566, lon: 2.3522 },           // 추가
  { label: '🇬🇧 런던', name: 'London', lat: 51.5074, lon: -0.1278 },         // 추가
  { label: '🇧🇷 상파울루', name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 }, // 추가
];

export default function WeatherScreen() {
  const [localWeather, setLocalWeather] = useState<any>(null);
  const [targetCity, setTargetCity] = useState<any>(FAVORITE_CITIES[0]);
  const [targetWeather, setTargetWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const saveCity = async (city: any) => {
    try {
      await AsyncStorage.setItem('lastCity', JSON.stringify(city));
    } catch (e) { console.error(e); }
  };

  const loadCity = async () => {
    try {
      const saved = await AsyncStorage.getItem('lastCity');
      return saved ? JSON.parse(saved) : FAVORITE_CITIES[0];
    } catch (e) { return FAVORITE_CITIES[0]; }
  };

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
        setLoading(true);

        // A. 저장된 도시가 있는지 먼저 확인
        const savedCity = await loadCity();
        setTargetCity(savedCity);

        // B. 내 위치 권한 확인
        let { status } = await Location.requestForegroundPermissionsAsync();
        let location = await Location.getCurrentPositionAsync({});

        // C. 내 위치 날씨 + 내가 선택한 도시 날씨 가져오기
        // 이제 VANCOUVER_COORDS 대신 savedCity의 좌표를 사용합니다.
        const [localData, targetData] = await Promise.all([
          fetchWeatherByCoords(location.coords.latitude, location.coords.longitude),
          fetchWeatherByCoords(savedCity.lat, savedCity.lon)
        ]);

        setLocalWeather(localData);
        setTargetWeather(targetData);
      } catch (error) {
        console.error("날씨 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAllWeather();
  }, [targetCity.name]); // 처음 앱 켤 때 실행


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>다른 도시 날씨를 가져오는 중...</Text>
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
          <Pressable
            style={[styles.weatherBox, styles.vancouverBox]}
            onPress={() => setModalVisible(true)} // 누르면 메뉴가 뜹니다
          >
            <Text style={styles.locationTag}>{targetCity.label} (터치하여 변경)</Text>
            <Text style={[styles.timeTag, { color: '#1976D2' }]}>
              {getLocalTime(targetWeather?.timezone)}
            </Text>
            <Text style={styles.vancouverTemp}>{targetWeather?.temp ?? '--'}°</Text>
            <Text style={styles.vancouverDesc}>{targetWeather?.description}</Text>
          </Pressable>
        </View>

        {/* ScrollView 안의 View가 끝나는 지점 근처에 넣어보세요 */}
        {/* 수정된 모달 부분 */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>확인할 도시를 선택하세요</Text>
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={true} // 스크롤 바를 보이게 해서 더 있다는 걸 알려줍니다
              >

                {FAVORITE_CITIES.map((city) => (
                  <Pressable
                    key={city.name}
                    style={styles.cityItem}
                    onPress={() => {
                      saveCity(city);      // 도시 저장
                      setTargetCity(city); // 도시 변경
                      setModalVisible(false); // 창 닫기
                    }}
                  >
                    <Text style={styles.cityText}>{city.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView >
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
  // ... 기존 스타일 아래에 추가
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // 메뉴가 아래에서 위로 올라오게 함
    backgroundColor: 'rgba(0,0,0,0.5)', // 배경을 반투명하게
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
    maxHeight: '80%', // 도시가 많아도 화면을 넘지 않게 조절
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
    fontSize: 22, // 사모님을 위해 글씨를 큼직하게!
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
}); // 마지막 중괄호 확인!