// app/weatherService.ts

const WEATHER_API_KEY = '2e9f451052e484f5c32aa07acb20861bf132e23a950ebaf68b829b9fc3b53b7d'; 

export const fetchCurrentWeather = async () => {
  try {
    // 1. 한국 표준시(KST) 계산
    const kstNow = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
    
    let baseDate = kstNow.toISOString().split('T')[0].replace(/-/g, '');
    let hours = kstNow.getUTCHours();
    const minutes = kstNow.getUTCMinutes();

    // 2. 기상청 업데이트 기준(45분) 보정
    if (minutes < 45) {
      if (hours === 0) {
        const yesterday = new Date(kstNow.getTime() - (24 * 60 * 60 * 1000));
        baseDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');
        hours = 23;
      } else {
        hours = hours - 1;
      }
    }

    const baseTime = `${hours.toString().padStart(2, '0')}00`;

    // 3. API URL 조립
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${WEATHER_API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=60&ny=127`;

    console.log(`[한국 시간 요청] 날짜: ${baseDate}, 시간: ${baseTime}`);

    const response = await fetch(url);
    const data = await response.json();

    if (data.response?.header?.resultCode !== '00') {
      console.error("기상청 응답 에러:", data.response?.header?.resultMsg);
      return null;
    }

    const items = data.response.body.items.item;
    
    // 4. 필요한 데이터만 정제해서 리턴
    return {
      temp: items?.find((i: any) => i.category === 'T1H')?.obsrValue || "0",
      humidity: items?.find((i: any) => i.category === 'REH')?.obsrValue || "0",
    };
  } catch (error) {
    console.error("날씨 정보 호출 실패:", error);
    return null;
  }
};