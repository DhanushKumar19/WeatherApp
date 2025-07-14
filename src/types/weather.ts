export interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    name: string;
    sys: {
        country: string;
    };
    timezone: number;
    id: number;
}

export interface ForecastData {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            temp_min: number;
            temp_max: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        dt_txt: string; // Date and time of the forecast
    }>;
    city: {
        id: number;
        name: string;
        country: string;
    };
}

export interface Coords {
    lat: number;
    lon: number;
}

export interface Location extends Coords {
    id: string;
    name: string;
    country: string;
}
