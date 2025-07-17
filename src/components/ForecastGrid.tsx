import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ForecastData } from '../types/weather';

interface Props {
    dailyWeatherData: ForecastData['list'] | [];
}

const ForecastGrid: FC<Props> = ({ dailyWeatherData }) => (
    dailyWeatherData.length > 0 ? (
        <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>2-Day Forecast</Text>
            <View style={styles.forecastGrid}>
                {dailyWeatherData.map((item, index) => (
                    <View key={index} style={styles.forecastItem}>
                        <Text style={styles.forecastDate}>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
                        <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
                        <Text style={styles.forecastDesc}>{item.weather[0].description}</Text>
                    </View>
                ))}
            </View>
        </View>
    ) : null
);

const styles = StyleSheet.create({
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
    },
});

export default ForecastGrid;
