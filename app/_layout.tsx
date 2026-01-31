// app/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '날씨',
          tabBarIcon: () => <Text style={{ fontSize: 28 }}>🌤️</Text>,
        }}
      />
      <Tabs.Screen
        name="politics"
        options={{
          title: '정치',
          tabBarIcon: () => <Text style={{ fontSize: 28 }}>🏛️</Text>,
        }}
      />
      <Tabs.Screen
        name="tax"
        options={{
          title: '세금',
          tabBarIcon: () => <Text style={{ fontSize: 28 }}>💰</Text>,
        }}
      />
      <Tabs.Screen
        name="investment"
        options={{
          title: '투자',
          tabBarIcon: () => <Text style={{ fontSize: 28 }}>📈</Text>,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: '건강',
          tabBarIcon: () => <Text style={{ fontSize: 28 }}>🏥</Text>,
        }}
      />
    </Tabs>
  );
}