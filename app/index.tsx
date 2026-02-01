// app/index.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeather({
        temperature: 18,
        description: '맑음',
        humidity: 60,
        wind: '약함',
        rainProbability: 10,
        advice: [
          '아침 저녁으로 일교차가 큽니다. 겉옷을 준비하세요.',
          '미세먼지가 좋아 산책하기 좋은 날입니다.',
          '자외선이 강하니 외출 시 모자를 착용하세요.',
        ],
      });
      
      setLoading(false);
    } catch (error) {
      console.error('날씨 로딩 실패:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>날씨 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.mainWeather}>
        <Text style={styles.temperature}>{weather.temperature}°C</Text>
        <Text style={styles.description}>{weather.description}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          <Text style={styles.detailIcon}>💧</Text>
          <Text style={styles.detailLabel}>습도</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailIcon}>🌬️</Text>
          <Text style={styles.detailLabel}>바람</Text>
          <Text style={styles.detailValue}>{weather.wind}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailIcon}>☔</Text>
          <Text style={styles.detailLabel}>강수확률</Text>
          <Text style={styles.detailValue}>{weather.rainProbability}%</Text>
        </View>
      </View>

      <View style={styles.adviceContainer}>
        <Text style={styles.adviceTitle}>🏥 오늘의 건강 조언</Text>
        {weather.advice.map((item: string, index: number) => (
          <Text key={index} style={styles.adviceText}>
            • {item}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  mainWeather: {
    backgroundColor: '#4A90E2',
    padding: 40,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFF',
  },
  description: {
    fontSize: 28,
    color: '#FFF',
    marginTop: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '28%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  adviceContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  adviceText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 28,
    marginBottom: 10,
  },
});