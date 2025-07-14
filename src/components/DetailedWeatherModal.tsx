import { FC } from "react";
import { WeatherData } from "../types/weather";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    visible: boolean;
    weather: WeatherData | null;
    onClose: () => void;
}

const DetailedWetherModal: FC<Props> = ({ visible, weather, onClose }) => {
    if (!weather) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide' transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Detailed Weather</Text>
                    <Text style={styles.location}>{weather.name}, {weather.sys.country}</Text>
                    <Text style={styles.temp}>Temperature: {weather.main.temp}°C</Text>
                    <Text style={styles.description}>{weather.weather[0].description}</Text>

                    <View style={styles.details}>
                        <Text style={styles.detailItem}>Feels Like: {weather.main.feels_like}°C</Text>
                        <Text style={styles.detailItem}>Humidity: {weather.main.humidity}%</Text>
                        <Text style={styles.detailItem}>Pressure: {weather.main.pressure} hPa</Text>
                        <Text style={styles.detailItem}>Wind Speed: {weather.wind.speed} m/s</Text>
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    location: {
        fontSize: 18,
        marginBottom: 10,
    },
    temp: {
        fontSize: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    details: {
        width: '100%',
        marginBottom: 20,
    },
    detailItem: {
        fontSize: 16,
        marginVertical: 5,
    },
    closeButton: {
        backgroundColor: 'royalblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default DetailedWetherModal;