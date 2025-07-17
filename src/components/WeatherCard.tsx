import { FC } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../types/weather';

interface Props {
    currentWeather: WeatherData;
    fadeAnim: any;
    setModalVisible: (v: boolean) => void;
    isFavorite: (id: string | number) => boolean;
    handleAddToFavorites: () => Promise<void>;
}

const WeatherCard: FC<Props> = ({ currentWeather, fadeAnim, setModalVisible, isFavorite, handleAddToFavorites }) => (
    <Animated.View style={[styles.weatherContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.weatherCity}>{currentWeather.name}</Text>
            <Text style={styles.weatherTemp}>{Math.round(currentWeather.main.temp)}°C</Text>
            <TouchableOpacity
                style={[
                    styles.favoritesButton,
                    isFavorite(currentWeather.id) && styles.favoritesButtonDisabled
                ]}
                onPress={handleAddToFavorites}
                disabled={isFavorite(currentWeather.id)}
            >
                <Text style={styles.favoritesButtonText}>
                    {isFavorite(currentWeather.id) ? 'Added to Favorites' : 'Add to Favorites'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    </Animated.View>
);

const styles = StyleSheet.create({
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
    favoritesButtonDisabled: {
        backgroundColor: 'gray',
    },
    favoritesButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WeatherCard;
