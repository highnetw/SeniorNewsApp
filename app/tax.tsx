// app/tax.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. 우리가 만든 중앙 공급소에서 도구와 키워드 가져오기
import { fetchNaverNews, NEWS_KEYWORDS } from './newsService';

export default function TaxScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. 'TAX' 키워드를 사용해서 뉴스 데이터 요청
    fetchNaverNews(NEWS_KEYWORDS.TAX).then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  // 뉴스를 눌렀을 때 해당 사이트로 이동하는 함수
  const openNews = (url: string) => {
    Linking.openURL(url);
  };

  const renderNewsItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => openNews(item.link)} // 1. url 대신 link!
      activeOpacity={0.7}
    >
      <Text style={styles.newsTitle} numberOfLines={2}>
        {/* 2. 네이버 API는 title이라는 이름으로 제목을 줍니다. */}
        {item.title.replace(/<[^>]*>?/gm, '')} 
      </Text>
      <Text style={styles.newsSummary} numberOfLines={3}>
        {/* 3. summary 대신 description이라는 이름으로 요약을 줍니다. */}
        {item.description ? item.description.replace(/<[^>]*>?/gm, '') : '내용 없음'}
      </Text>
      <View style={styles.newsFooter}>
        <Text style={styles.newsSource}>네이버 뉴스</Text>
        <Text style={styles.newsDate}>
          {new Date(item.pubDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>
    );
  }

  // ... (중략: return 문 안의 FlatList 부분부터)
  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        keyExtractor={(item, index) => item.link || index.toString()}
        renderItem={renderNewsItem} // 이름 맞춤!
        ListHeaderComponent={<Text style={styles.header}>💸 시니어 세금 뉴스</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', margin: 20, color: '#333' },
  // renderNewsItem에서 사용하는 이름들로 통일했습니다!
  newsCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginHorizontal: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  newsTitle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 10, lineHeight: 28 },
  newsSummary: { fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 12 },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  newsSource: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  newsDate: { fontSize: 14, color: '#999' }
});