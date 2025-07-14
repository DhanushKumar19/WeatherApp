import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, StyleSheet, ScrollView, useAnimatedValue, Animated, TouchableOpacity, Alert } from 'react-native';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ForecastData, WeatherData } from '../types/weather';
import { useState, useEffect, lazy, Suspense } from 'react';
import { weatherApi } from '../services/weatherAPI';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addFavorite, saveFavorites } from '../store/favoriteSlice';

const DetailedWeatherModal = lazy(() => import('../components/DetailedWeatherModal'));

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
    // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchLocation, setSearchLocation] = useState<string>(route.params?.location || 'Bangalore');
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const fadeAnim = useAnimatedValue(0);

    const dispatch = useDispatch<AppDispatch>();
    const locations = useSelector((state: RootState) => state.favorites.locations);

    // Helper to check if a location is already a favorite
    const isFavorite = (id: string | number) => {
        return locations.some(fav => fav.id === id.toString());
    };

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
        const location = route.params?.location || 'Bangalore';

        const fetchWeather = async () => {
            setLoading(true);
            const weatherData = await weatherApi.getCurrentWeather(location)
            setCurrentWeather(weatherData);
            setLoading(false);
        };
        fetchWeather();

        const fetchWeatherForecast = async () => {
            setLoading(true);
            const forecastData = await weatherApi.getForecast(location);
            setForecast(forecastData);
            setLoading(false);
        }
        fetchWeatherForecast();

    }, [route]);

    const handleSearch = async () => {
        if (searchLocation.trim() === '') return;
        setLoading(true);
        try {
            const weatherData = await weatherApi.getCurrentWeather(searchLocation);
            setCurrentWeather(weatherData);
            const forecastData = await weatherApi.getForecast(searchLocation);
            setForecast(forecastData);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToFavorites = async () => {
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
    };

    const getDailyWeatherData = (forecastData: ForecastData | null): ForecastData['list'] | [] => {
        if (!forecastData || !forecastData.list) return [];
        return forecastData.list.filter((item, index) => index % 8 === 0).slice(1, 3);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Enter city"
                    value={searchLocation}
                    onChangeText={setSearchLocation}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            {
                currentWeather && (
                    <Animated.View style={[styles.weatherContainer, { opacity: fadeAnim }]}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={styles.weatherCity}>{currentWeather.name}</Text>
                            <Text style={styles.weatherTemp} >{Math.round(currentWeather.main.temp)}°C</Text>
                            <TouchableOpacity
                                style={[
                                    styles.favoritesButton,
                                    isFavorite(currentWeather.id) && { backgroundColor: 'gray' }
                                ]}
                                onPress={handleAddToFavorites}
                                disabled={isFavorite(currentWeather.id)}
                            >
                                <Text style={styles.favoritesButtonText}>
                                    {isFavorite(currentWeather.id)
                                        ? 'Added to Favorites'
                                        : 'Add to Favorites'}
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.favoritesButton} onPress={() => navigation.push('Favorites')}>
                            <Text style={styles.favoritesButtonText}>Move to Favorites</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )
            }
            {
                getDailyWeatherData(forecast).length > 0 && (
                    <View style={styles.forecastContainer}>
                        <Text style={styles.forecastTitle}>2-Day Forecast</Text>
                        <View style={styles.forecastGrid}>
                            {getDailyWeatherData(forecast).map((item, index) => (
                                <View key={index} style={styles.forecastItem}>
                                    <Text style={styles.forecastDate}>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
                                    <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
                                    <Text style={styles.forecastDesc}>{item.weather[0].description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )
            }

            <Suspense fallback={<Text>Loading...</Text>}>
                <DetailedWeatherModal
                    visible={modalVisible}
                    weather={currentWeather}
                    onClose={() => setModalVisible(false)}
                />
            </Suspense>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'whitesmoke',
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: 'royalblue',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    weatherContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    weatherCity: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    weatherTemp: {
        fontSize: 18,
        marginBottom: 10,
    },
    favoritesButton: {
        backgroundColor: 'royalblue',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    favoritesButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    forecastContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
    },
    forecastTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    forecastGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    forecastItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: 'lightgray',
        borderRadius: 8,
    },
    forecastDate: {
        fontSize: 12,
        marginBottom: 5,
    },
    forecastTemp: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    forecastDesc: {
        fontSize: 10,
        textAlign: 'center',
        textTransform: 'capitalize',
    }
});
