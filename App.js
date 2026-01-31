// App.js

import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>시니어 뉴스앱</Text>
      <Text style={styles.subtext}>개발 중입니다...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
});