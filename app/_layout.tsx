import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          tabBarIcon: () => <Text style={{fontSize: 20}}>☀️</Text>,
        }}
      />

      {/* 2. 정치 */}
      <Tabs.Screen
        name="politics"
        options={{
          title: '정치',
          tabBarIcon: () => <Text style={{fontSize: 20}}>⚖️</Text>,
        }}
      />

      {/* 3. 세금 */}
      <Tabs.Screen
        name="tax"
        options={{
          title: '세금',
          tabBarIcon: () => <Text style={{fontSize: 20}}>💸</Text>,
        }}
      />

      {/* 4. 투자 */}
      <Tabs.Screen
        name="investment"
        options={{
          title: '투자',
          tabBarIcon: () => <Text style={{fontSize: 22}}>📈</Text>,
        }}
      />

      {/* 5. 건강 */}
      <Tabs.Screen
        name="health"
        options={{
          title: '건강',
          tabBarIcon: () => <Text style={{fontSize: 22}}>🏥</Text>,
        }}
      />
    </Tabs>
  );
}