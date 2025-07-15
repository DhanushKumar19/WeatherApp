import { NativeModules, PermissionsAndroid, Platform } from "react-native";

interface LocationModuleInterface {
    getCurrentLocation(): Promise<{ latitude: number; longitude: number }>;
}

class LocationService implements LocationModuleInterface {
    private nativeModule = NativeModules.LocationModule;

    async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
        if (!this.nativeModule) {
            throw new Error("LocationModule is not available");
        }

        if (Platform.OS === "android") {
            await this.requestAndroidPermissions();
        }
        try {
            return await this.nativeModule.getCurrentLocation();
        } catch (error: any) {
            if (error.code === "LOCATION_ERROR") {
                throw new Error(`Location error: ${error.message}`);
            }
            throw error;
        }
    }

    private async requestAndroidPermissions(): Promise<void> {
        if (Platform.OS !== "android") return;

        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const hasPermission =
            granted["android.permission.ACCESS_FINE_LOCATION"] === "granted" ||
            granted["android.permission.ACCESS_COARSE_LOCATION"] === "granted";

        if (!hasPermission) {
            throw new Error("Location permission denied");
        }
    }
}

export default new LocationService();