import { View, Text, StyleSheet, ScrollView, useAnimatedValue, Animated, Alert } from 'react-native';
import React from 'react';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ForecastData, WeatherData } from '../types/weather';
import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { weatherApi } from '../services/weatherAPI';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addFavorite, saveFavorites } from '../store/favoriteSlice';
import LocationModule from '../native/LocationModule';
import SearchBar from '../components/SearchBar';
import LocationErrorView from '../components/LocationErrorView';
import WeatherCard from '../components/WeatherCard';
import ForecastGrid from '../components/ForecastGrid';

const DetailedWeatherModal = lazy(() => import('../components/DetailedWeatherModal'));

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ route }) => {
    const [searchLocation, setSearchLocation] = useState<string>('');
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [searching, setSearching] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const fadeAnim = useAnimatedValue(0);

    const dispatch = useDispatch<AppDispatch>();
    const locations = useSelector((state: RootState) => state.favorites.locations);

    // Load current location weather data
    const loadCurrentLocationWeather = async () => {
        setLoading(true);
        setLocationError(null);

        try {
            const location = await LocationModule.getCurrentLocation();

            if (!location || !location.latitude || !location.longitude) {
                setLocationError("Could not get current location.");
                return;
            }

            const [weatherData, forecastData] = await Promise.all([
                weatherApi.getCurrentWeather(null, location.latitude, location.longitude),
                weatherApi.getForecast(null, location.latitude, location.longitude)
            ]);

            setCurrentWeather(weatherData);
            setForecast(forecastData);
        } catch (error: any) {
            console.error("Error fetching current location weather:", error);

            const message = error.message?.toLowerCase() || "";
            if (message.includes("permission")) {
                setLocationError("Location permission denied. Please allow location access.");
            } else if (message.includes("disabled")) {
                setLocationError("Location services are disabled. Please enable location services.");
            } else {
                setLocationError(error.message || "Unknown error fetching location.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch weather data based on location or coordinates
    const fetchWeatherData = async (location: string) => {
        setLoading(true);
        try {
            const weatherData = await weatherApi.getCurrentWeather(location);
            setCurrentWeather(weatherData);
            const forecastData = await weatherApi.getForecast(location);
            setForecast(forecastData);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            Alert.alert("Error", "Failed to fetch weather data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(
        async () => {
            console.log('Search Location:', searchLocation);
            if (searchLocation.trim() === '') return;
            setSearching(true);
            try {
                const weatherData = await weatherApi.getCurrentWeather(searchLocation);
                setCurrentWeather(weatherData);
                const forecastData = await weatherApi.getForecast(searchLocation);
                setForecast(forecastData);
            } catch (error) {
                console.error("Error fetching weather data:", error);
                Alert.alert("Error", "Failed to fetch weather data. Please check the city name and try again.");
            } finally {
                setSearching(false);
            }
        }, [searchLocation]);

    const isFavorite = useCallback((id: string | number) => {
        return locations.some(fav => fav.id === id.toString());
    }, [locations]);

    const handleAddToFavorites = useCallback(async () => {
        if (currentWeather) {
            const location = {
                id: currentWeather.id.toString(),
                name: currentWeather.name,
                country: currentWeather.sys.country,
                lat: currentWeather.coord.lat,
                lon: currentWeather.coord.lon,
            };

            if (!isFavorite(location.id)) {
                dispatch(addFavorite(location));
                await dispatch(saveFavorites([...locations, location]));
                Alert.alert(
                    "Success",
                    `${currentWeather.name} has been added to favorites.`,
                );
            } else {
                Alert.alert(
                    "Already Added",
                    `${currentWeather.name} is already in your favorites.`,
                );
            }
        }
    }, [currentWeather, dispatch, isFavorite, locations]);

    const dailyWeatherData = useMemo(() => {
        if (!forecast || !forecast.list) return [];
        return forecast.list.filter((item, index) => index % 8 === 0).slice(1, 3);
    }, [forecast]);

    const handleRequestLocationPermission = useCallback(async () => {
        setLocationError(null);
        await loadCurrentLocationWeather();
    }, []);

    // Animation for fade-in effect
    useEffect(() => {
        if (currentWeather) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [currentWeather, fadeAnim]);

    useEffect(() => {
        const location = route.params?.location;
        if (location) {
            fetchWeatherData(location);
        } else {
            loadCurrentLocationWeather();
        }
    }, [route?.params?.location]);

    return (
        <ScrollView style={styles.container}>
            <SearchBar
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
                handleSearch={handleSearch}
            />

            {loading ? (
                <Text>Loading...</Text>
            ) : searching ? (
                <Text>Searching...</Text>
            ) : locationError && !searchLocation ? (
                <LocationErrorView
                    locationError={locationError}
                    handleRequestLocationPermission={handleRequestLocationPermission}
                    handleRefresh={loadCurrentLocationWeather}
                />
            ) : (
                <View>
                    {currentWeather && (
                        <WeatherCard
                            currentWeather={currentWeather}
                            fadeAnim={fadeAnim}
                            setModalVisible={setModalVisible}
                            isFavorite={isFavorite}
                            handleAddToFavorites={handleAddToFavorites}
                        />
                    )}
                    <ForecastGrid dailyWeatherData={dailyWeatherData} />
                    <Suspense fallback={<Text>Loading...</Text>}>
                        <DetailedWeatherModal
                            visible={modalVisible}
                            weather={currentWeather}
                            onClose={() => setModalVisible(false)}
                        />
                    </Suspense>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'whitesmoke',
        padding: 20,
    }
});
