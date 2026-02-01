import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2', // 활성화된 메뉴는 파란색
        tabBarStyle: {
          // 안드로이드 하단 버튼과 겹치지 않게 높이를 충분히 올렸습니다 (8mm 상승 효과)
          height: Platform.OS === 'android' ? 85 : 90,
          paddingBottom: Platform.OS === 'android' ? 25 : 30,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        },
      }}
    >
      {/* 1. 홈/날씨 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '날씨',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>☀️</Text>,
        }}
      />

      {/* 2. 정치 */}
      <Tabs.Screen
        name="politics"
        options={{
          title: '정치',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚖️</Text>,
        }}
      />

      {/* 3. 세금 */}
      <Tabs.Screen
        name="tax"
        options={{
          title: '세금',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💸</Text>,
        }}
      />

      {/* 4. 투자 */}
      <Tabs.Screen
        name="investment"
        options={{
          title: '투자',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>📈</Text>,
        }}
      />

      {/* 5. 건강 */}
      <Tabs.Screen
        name="health"
        options={{
          title: '건강',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏥</Text>,
        }}

      />
      <Tabs.Screen 
      name="weatherService" 
      options={{ href: null }} // 탭 바에서 숨김
      />

      {/* 범인 검거: 뉴스 서비스 파일도 숨겨야 합니다! */}
      <Tabs.Screen 
        name="newsService" 
        options={{ href: null }} 
      />
      
      {/* 혹시 +not-found.tsx 같은 파일이 있다면 그것도 숨겨주세요 */}
      <Tabs.Screen 
      name="+not-found" 
      options={{ href: null }} 
      />
    </Tabs>
  );
}