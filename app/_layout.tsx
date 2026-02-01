import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#4A90E2', // 활성화된 메뉴는 파란색
        tabBarStyle: {
          // 안드로이드 하단 버튼과 겹치지 않게 높이를 조절합니다
          height: Platform.OS === 'android' ? 70 : 90,
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        }
      }}>
      
      {/* 1. 홈/날씨 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '날씨',
          tabBarIcon: () => <text style={{fontSize: 20}}>☀️</text>,
        }}
      />

      {/* 2. 정치 */}
      <Tabs.Screen
        name="정치"
        options={{
          title: '정치',
          tabBarIcon: () => <text style={{fontSize: 20}}>⚖️</text>,
        }}
      />

      {/* 3. 세금 */}
      <Tabs.Screen
        name="세금"
        options={{
          title: '세금',
          tabBarIcon: () => <text style={{fontSize: 20}}>💸</text>,
        }}
      />

      {/* 4. 투자 */}
      <Tabs.Screen
        name="투자"
        options={{
          title: '투자',
          tabBarIcon: () => <text style={{fontSize: 22}}>📈</text>,
        }}
      />

      {/* 5. 건강 */}
      <Tabs.Screen
        name="건강"
        options={{
          title: '건강',
          tabBarIcon: () => <text style={{fontSize: 22}}>🏥</text>,
        }}
      />
    </Tabs>
  );
}