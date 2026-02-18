import { Platform } from 'react-native';

const CLIENT_ID = 'qnLdXahR_i0qp9EVF7by';
const CLIENT_SECRET = 'uSFdxeWEPB';

// [중요] 맛대장님이 챙겨주신 키워드 목록 유지!
export const NEWS_KEYWORDS = {
  POLITICS: "노인 복지 정책",
  TAX: "연금 절세",
  INVESTMENT: "고령자 자산관리",
  HEALTH: "어르신 건강 관리 비결"
};

export const fetchNaverNews = async (query: string) => {
  try {
    // 1. 확실하게 'web'일 때만 true가 되도록 판별
    const isWeb = Platform.OS === 'web';

    // 2. 환경에 따른 주소 결정 (프록시 vs 네이버 직접)
    const url = isWeb
      ? `/api/news?query=${encodeURIComponent(query)}`
      : `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=20&sort=date`;

    const options: RequestInit = { method: 'GET' };

    // 3. 앱(Android/iOS)일 때만 헤더에 신분증 정보를 넣음
    if (!isWeb) {
      options.headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
      };
    }

    // 4. 통신 시작 (중복 선언 제거 완료!)
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`서버 응답 에러: ${response.status}`);
    }

    const data = await response.json();

    if (data.items) {
      // 1. 먼저 데이터를 기존 방식대로 예쁘게 정리합니다.
      const newsList = data.items.map((item: any) => {
        const cleanTitle = item.title.replace(/<[^>]*>?/gm, '');
        const isNaverNews = item.link.includes("news.naver.com");

        return {
          title: cleanTitle,
          link: item.link,
          pubDate: formatDate(item.pubDate),
          publisher: isNaverNews ? "네이버뉴스" : "언론사 직접제공",
          description: item.description.replace(/<[^>]*>?/gm, ''),
        };
      });

      // ⭐ 2. 중복 제거 필터 (제목이 같은 뉴스는 처음 하나만 남깁니다)
      const uniqueNews = newsList.filter((news: any, index: number, self: any[]) =>
        index === self.findIndex((t) => t.title === news.title)
      );

      // 3. 중복이 사라진 깨끗한 리스트를 리턴!
      return uniqueNews;
    }

    return [];
    // ... 뒷부분 생략 (catch 블록 등)
  } catch (error) {
    console.error("뉴스 로딩 실패:", error);
    return [];
  }
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      const parts = dateStr.split(' ');
      if (parts.length >= 4) {
        const day = parts[1];
        const monthName = parts[2];
        const year = parts[3];
        const time = parts[4].substring(0, 5);

        const months: any = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
        const month = months[monthName] || '01';

        return `${year}.${month}.${day} ${time}`;
      }
      return "최근 소식";
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');

    return `${year}.${month}.${day} ${hour}:${min}`;
  } catch (e) {
    return "방금 전";
  }
};