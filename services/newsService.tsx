// app/newsService.tsx

const CLIENT_ID = 'qnLdXahR_i0qp9EVF7by';
const CLIENT_SECRET = 'uSFdxeWEPB';

// 1. 키워드 목록 추가 (investment.tsx에서 이걸 찾고 있었습니다!)
export const NEWS_KEYWORDS = {
  POLITICS: "노인 복지 정책",
  TAX: "연금 절세",
  INVESTMENT: "고령자 자산관리",
  HEALTH: "어르신 건강 관리 비결"
};

// 2. 함수 이름을 fetchNaverNews로 변경 (investment.tsx와 이름 맞춤)
// 2. 함수 이름을 fetchNaverNews로 유지하며, 중계 서버 로직을 추가합니다.
export const fetchNaverNews = async (query: string) => {
  try {
    const isWeb = typeof window !== 'undefined';
    
    // [변경점 1] 웹이면 Vercel 대리인 주소로, 앱이면 네이버 직접 주소로 결정
    const url = isWeb
      ? `/api/news?query=${encodeURIComponent(query)}`
      : `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=20&sort=date`;

    const options: RequestInit = { method: 'GET' };

    // [변경점 2] 앱(APK)일 때만 헤더에 신분증(ID/Secret)을 넣습니다.
    if (!isWeb) {
      options.headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
      };
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.items) {
      // 맛대장님의 기존 '데이터 가공' 로직을 그대로 유지합니다!
      return data.items.map((item: any) => {
        const cleanTitle = item.title.replace(/<[^>]*>?/gm, ''); // HTML 태그 제거
        const isNaverNews = item.link.includes("news.naver.com");

        return {
          title: cleanTitle,
          link: item.link,
          pubDate: formatDate(item.pubDate), // 맛대장님의 날짜 변환 함수 사용
          publisher: isNaverNews ? "네이버뉴스" : "언론사 직접제공",
          description: item.description.replace(/<[^>]*>?/gm, ''), // 설명 태그 제거
        };
      });
    }
    return [];
  } catch (error) {
    console.error("뉴스 로딩 실패:", error);
    return [];
  }
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    
    // 만약 날짜 변환에 실패하면 (Invalid Date)
    if (isNaN(date.getTime())) {
      // 수동으로 문자열을 잘라서 분석 (네이버 날짜 예: "Mon, 02 Feb 2026 00:50:00 +0900")
      const parts = dateStr.split(' ');
      if (parts.length >= 4) {
        const day = parts[1];
        const monthName = parts[2];
        const year = parts[3];
        const time = parts[4].substring(0, 5); // "00:50" 추출
        
        // 월 이름 변환기
        const months: any = { Jan:'01', Feb:'02', Mar:'03', Apr:'04', May:'05', Jun:'06', Jul:'07', Aug:'08', Sep:'09', Oct:'10', Nov:'11', Dec:'12' };
        const month = months[monthName] || '01';
        
        return `${year}.${month}.${day} ${time}`;
      }
      return "최근 소식"; 
    }

    // 정상적으로 변환된 경우
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