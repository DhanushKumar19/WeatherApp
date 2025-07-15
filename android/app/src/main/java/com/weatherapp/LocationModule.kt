package com.weatherapp

import com.facebook.react.bridge.*
import android.location.*
import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.content.ContextCompat

class LocationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var locationManager: LocationManager? = null
    private var locationListener: LocationListener? = null
    private var timeoutHandler: Handler? = null

    override fun getName(): String = "LocationModule"

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        cleanup()

        try {
            if (!checkPermissions()) {
                promise.reject("LOCATION_ERROR", "Location permissions are not granted")
                return
            }

            locationManager = reactApplicationContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            if (!isLocationEnabled()) {
                promise.reject("LOCATION_ERROR", "Location services are disabled")
                return
            }
            getLastKnownLocation()?.let {
                promise.resolve(createLocationMap(it))
            } ?: run {
                requestLocationUpdate(promise)
            }
        } catch (e: SecurityException) {
            promise.reject("LOCATION_ERROR", "Denied Location permissions", e)
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", e.message ?: "Unknown error occurred while fetching location")
        }
    }

    private fun checkPermissions(): Boolean {
        val fineLocationPermission = ContextCompat.checkSelfPermission(
            reactApplicationContext,
            android.Manifest.permission.ACCESS_FINE_LOCATION
        )
        val coarseLocationPermission = ContextCompat.checkSelfPermission(
            reactApplicationContext,
            android.Manifest.permission.ACCESS_COARSE_LOCATION
        )
        return fineLocationPermission == PackageManager.PERMISSION_GRANTED ||
               coarseLocationPermission == PackageManager.PERMISSION_GRANTED
    }

    private fun isLocationEnabled(): Boolean {
        return (locationManager?.isProviderEnabled(LocationManager.GPS_PROVIDER) == true) ||
               (locationManager?.isProviderEnabled(LocationManager.NETWORK_PROVIDER) == true)
    }

    private fun getLastKnownLocation(): Location? {
        return try {
            locationManager?.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager?.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
        } catch (e: SecurityException) {
            null
        }
    }

    private fun requestLocationUpdate(promise: Promise) {
        locationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                promise.resolve(createLocationMap(location))
                cleanup()
            }
            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}
        }

        timeoutHandler = Handler(Looper.getMainLooper())
        timeoutHandler?.postDelayed({
            promise.reject("LOCATION_TIMEOUT", "Location request timed out")
            cleanup()
        }, 20000) // 20 seconds timeout

        // Request location updates
        val provider = if (locationManager?.isProviderEnabled(LocationManager.GPS_PROVIDER) == true) {
            LocationManager.GPS_PROVIDER
        } else {
            LocationManager.NETWORK_PROVIDER
        }

        locationManager?.requestLocationUpdates(provider, 0L, 0f, locationListener!!)
    }

    private fun createLocationMap(location: Location): WritableMap {
        return Arguments.createMap().apply {
            putDouble("latitude", location.latitude)
            putDouble("longitude", location.longitude)
        }
    }

    private fun cleanup() {
        try {
        locationListener?.let { locationManager?.removeUpdates(it) }
        } catch (e: Exception) {
            // Ignore any exceptions during cleanup
        }
        timeoutHandler?.removeCallbacksAndMessages(null)
        locationListener = null
        timeoutHandler = null
    }
}