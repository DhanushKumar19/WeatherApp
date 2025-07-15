export interface Coords {
    lon: number;
    lat: number;
}

export interface WeatherDescription {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface MainWeather {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like?: number;
    pressure?: number;
    humidity?: number;
}

export interface Wind {
    speed: number;
    deg: number;
}

export interface WeatherData {
    coord: Coords;
    weather: WeatherDescription[];
    main: MainWeather & { feels_like: number; pressure: number; humidity: number };
    wind: Wind;
    name: string;
    sys: {
        country: string;
    };
    timezone: number;
    id: number;
}

export interface ForecastListItem {
    dt: number;
    main: MainWeather;
    weather: WeatherDescription[];
    dt_txt: string; // Date and time of the forecast
}

export interface ForecastData {
    list: ForecastListItem[];
    city: {
        id: number;
        name: string;
        country: string;
    };
}

export interface Location extends Coords {
    id: string;
    name: string;
    country: string;
}
