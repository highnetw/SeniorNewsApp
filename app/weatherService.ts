// app/weatherService.ts

// 공공데이터포털에서 받은 '인코딩된' 인증키를 넣으세요.
const WEATHER_API_KEY = '2e9f451052e484f5c32aa07acb20861bf132e23a950ebaf68b829b9fc3b53b7d'; 

export const fetchCurrentWeather = async () => {
  try {
    const now = new Date();
    // 기상청 포맷에 맞게 날짜(YYYYMMDD) 생성
    const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    // 기상청 초단기실황은 매시각 45분에 업데이트되므로, 안전하게 1시간 전 데이터를 요청합니다.
    const hours = now.getHours();
    const baseTime = `${(hours - 1).toString().padStart(2, '0')}00`;

    // 서울(강남) 기준 좌표 nx=60, ny=127 (나중에 위치 기반으로 바꿀 수 있어요!)
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${WEATHER_API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=60&ny=127`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.response?.header?.resultCode !== '00') {
      console.error("기상청 응답 에러:", data.response?.header?.resultMsg);
      return null;
    }

    const items = data.response.body.items.item;
    
    // T1H(기온), REH(습도) 등 필요한 정보만 추출
    const weatherInfo = {
      temp: items.find((i: any) => i.category === 'T1H')?.obsrValue,
      humidity: items.find((i: any) => i.category === 'REH')?.obsrValue,
    };

    return weatherInfo;
  } catch (error) {
    console.error("날씨 정보 호출 실패:", error);
    return null;
  }
};