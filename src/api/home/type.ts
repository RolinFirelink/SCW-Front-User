import type {
    ResponseData,
  } from '../type'
   interface WeatherData {
    id: number;
    shortReport: string;
    aqi: string;
    level: string;
    pollutants: string;
    pm: string;
    advice: string | null;
    maxTemperature: string;
    minTemperature: string;
    maxRainfall: string;
    minRainfall: string;
    maxSpeed: string;
    minSpeed: string;
    temperature: string;
    windLevel: string;
    windDirection: string;
    humidity: string;
    hourRainfall: string;
  }
  
  export interface WeatherResponse extends ResponseData  {
    data: WeatherData
  }