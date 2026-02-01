import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { fetchCurrentWeather } from './weatherService'; // 언더바 지운 이름 확인!

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchCurrentWeather();
        setWeather(data);
      } catch (error) {
        console.error("날씨 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>기상청 정보를 연결 중입니다...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>오늘의 날씨</Text>
        
        {weather ? (
          <View style={styles.weatherBox}>
            {/* 기상청 데이터는 weather.temp에 바로 담겨 있습니다! */}
            <Text style={styles.temp}>{weather?.temp ?? '--'}°</Text>
            <Text style={styles.description}>현재 습도는 {weather?.humidity ?? '--'}% 입니다.</Text>
            <Text style={styles.city}>서울 강남구 기준</Text>
          </View>
        ) : (
          <View style={styles.weatherBox}>
            <Text>날씨 정보를 가져올 수 없습니다.</Text>
            <Text style={{ fontSize: 12, marginTop: 10, color: '#999' }}>기상청 점검 중이거나 자정 업데이트 중일 수 있습니다.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  weatherBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '85%',
    padding: 40,
    borderRadius: 30,
    // 그림자 효과
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 8 },
    }),
  },
  temp: {
    fontSize: 90,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: '#555',
    fontWeight: '500',
  },
  city: {
    fontSize: 16,
    marginTop: 20,
    color: '#aaa',
  },
});