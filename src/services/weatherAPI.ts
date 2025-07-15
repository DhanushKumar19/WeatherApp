import { WeatherData, ForecastData, Coords } from "../types/weather";
import { checkNetworkConnection } from "../utils/networkUtils";
import Config from 'react-native-config';

const API_KEY = Config.OPEN_WEATHER_API_KEY;
const WEATHER_API_URL = Config.OPEN_WEATHER_API_URL;
const GEO_API_URL = Config.OPEN_WEATHER_GEO_API_URL;

export const weatherApi = {
    getCurrentWeather: async (location?: string | null, latitude?: number, longitude?: number): Promise<WeatherData> => {
        if (!(await checkNetworkConnection())) {
            throw new Error("No network connection");
        }

        let lat: number | undefined, lon: number | undefined;

        if (latitude !== undefined && longitude !== undefined) {
            lat = latitude;
            lon = longitude;
        } else if (location) {
            const coordsData = await weatherApi.getCoords(location);
            if (!coordsData || coordsData.length === 0) {
            throw new Error("Location not found");
            }
            lat = coordsData[0].lat;
            lon = coordsData[0].lon;
        } else {
            throw new Error("Either location or latitude/longitude must be provided");
        }

        // Fetch current weather data using coordinates
        const response = await fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }
        return response.json();
    },

    getForecast: async (location?: string | null, latitude?: number, longitude?: number): Promise<ForecastData> => {
        if (!(await checkNetworkConnection())) {
            throw new Error("No network connection");
        }

        let lat: number | undefined, lon: number | undefined;

        if (latitude !== undefined && longitude !== undefined) {
            lat = latitude;
            lon = longitude;
        } else if (location) {
            const coordsData = await weatherApi.getCoords(location);
            if (!coordsData || coordsData.length === 0) {
                throw new Error("Location not found");
            }
            lat = coordsData[0].lat;
            lon = coordsData[0].lon;
        } else {
            throw new Error("Either location or latitude/longitude must be provided");
        }

        // Fetch forecast data using coordinates
        const response = await fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`Error fetching forecast data: ${response.statusText}`);
        }
        return response.json();
    },

    getCoords: async (location: String): Promise<Array<Coords>> => {
        if (!(await checkNetworkConnection())) {
            throw new Error("No network connection");
        }

        const response = await fetch(`${GEO_API_URL}/direct?q=${location}&limit=1&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Error fetching coordinate: ${response.statusText}`);
        }
        return response.json();
    }
}