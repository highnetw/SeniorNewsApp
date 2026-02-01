// app/newsService.tsx (tsx로 만드셔도 무방합니다!)

const CLIENT_ID = '발급받으신_ID_넣기';
const CLIENT_SECRET = '발급받으신_Secret_넣기';

export const fetchNaverNews = async (query: string) => {
  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=20&sort=sim`,
      {
        headers: {
          'X-Naver-Client-Id':'qnLdXahR_i0qp9EVF7by',
          'X-Naver-Client-Secret':'uSFdxeWEPB',
        },
      }
    );
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("뉴스 불러오기 실패:", error);
    return [];
  }
};

export const NEWS_KEYWORDS = {
 // '노인 일자리'만 찾지 말고, '연금'이나 '복지'도 같이 찾아라! 라는 뜻입니다.
  POLITICS: "노인 복지 정책 기초연금 일자리",
  TAX: "고령자 상속세 증여세 부동산",  
  INVESTMENT: "실버 재테크 노후 자산 리츠",
  HEALTH: "어르신 운동 치매 예방 건강 식단",
};