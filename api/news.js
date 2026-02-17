// api/news.js
export default async function handler(req, res) {
  // 클라이언트(브라우저)에서 보낸 검색어(query)를 받습니다.
  const { query } = req.query;
  
  // 맛대장님의 네이버 API 키 정보입니다.
  const CLIENT_ID = 'qnLdXahR_i0qp9EVF7by';
  const CLIENT_SECRET = 'uSFdxeWEPB';

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=20&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id': CLIENT_ID,
          'X-Naver-Client-Secret': CLIENT_SECRET,
        },
      }
    );

    const data = await response.json();
    
    // 브라우저에게 "이 데이터는 안전해!"라고 알려주며 데이터를 전달합니다.
    res.status(200).json(data);
  } catch (error) {
    console.error('네이버 API 호출 에러:', error);
    res.status(500).json({ error: '뉴스 데이터를 가져오지 못했습니다.' });
  }
}