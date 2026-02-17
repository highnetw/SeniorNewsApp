// services/weatherService.ts
import axios from 'axios';

const API_KEY = 'c39ca8c4afa7a5ec8ca3af173f872f35';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric', // 섭씨 온도로 설정
        lang: 'kr',    // 한국어 설명
      },
    });

    return {
      temp: Math.round(response.data.main.temp), // 소수점 반올림
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      city: response.data.name,
    };
  } catch (error) {
    console.error("날씨 정보 호출 실패:", error);
    return null;
  }
};