// services/weatherService.ts
import axios from 'axios';

const API_KEY = 'c39ca8c4afa7a5ec8ca3af173f872f35';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// [중요] 반드시 export const 형식을 유지해야 index에서 찾을 수 있습니다.
export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'en',
      },
    });

    return {
      temp: Math.round(response.data.main.temp),
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      city: response.data.name,
      // v3.0 필수 항목!
      timezone: response.data.timezone, 
    };
  } catch (error) {
    console.error("날씨 정보 호출 실패:", error);
    return null;
  }
};