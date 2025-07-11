declare module 'react-native-config' {
    export interface NativeConfig {
        OPEN_WEATHER_API_KEY: string;
        OPEN_WEATHER_API_URL: string;
        OPEN_WEATHER_GEO_API_URL: string;
    }

    export const Config: NativeConfig
    export default Config
  }