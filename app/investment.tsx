// app/investment.tsx
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function InvestmentScreen() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyNews = Array.from({ length: 8 }, (_, i) => ({
        id: `investment-${i}`,
        title: `투자 관련 중요 뉴스 ${i + 1}`,
                summary: '75세 이상 어르신들에게 적합한 안전한 투자 정보를 담고 있습니다. 연금저축, ETF, 채권 등과 관련된 유익한 내용입니다.',
        source: '연합뉴스',
        date: `${i + 1}시간 전`,
        url: 'https://www.naver.com',
      }));
      
      setNews(dummyNews);
      setLoading(false);
    } catch (error) {
      console.error('뉴스 로딩 실패:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const openNews = (url: string) => {
    Linking.openURL(url);
  };

  const renderNewsItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => openNews(item.url)}
      activeOpacity={0.7}
    >
      <Text style={styles.newsTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.newsSummary} numberOfLines={3}>
        {item.summary}
      </Text>
      <View style={styles.newsFooter}>
        <Text style={styles.newsSource}>{item.source}</Text>
        <Text style={styles.newsDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>뉴스를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
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
  listContent: {
    padding: 15,
  },
  newsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 28,
  },
  newsSummary: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },
  newsSource: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 14,
    color: '#999',
  },
});