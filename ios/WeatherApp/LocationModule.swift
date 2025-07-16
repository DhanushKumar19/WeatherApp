// TODO: - Link the file to the project from Xcode

import Foundation
import CoreLocation
import React

class LocationModule: NSObject, CLLocationManagerDelegate {
    private var locationManager: CLLocationManager?
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    private var timeoutTmer: Timer?

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    } 

    @objc
    func isLocationEnabled(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let enabled = CLLocationManager.isLocationEnabled() && (
            CLLocationManager.authorizationStatus() == .authorizedWhenInUse ||
            CLLocationManager.authorizationStatus() == .authorizedAlways
        )
        resolve(enabled)
    }

    @objc
    func getCurrentLocation(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        cleanup()

        self.resolve = resolve
        self.reject = reject

        guard CLLocationManager.locationServicesEnabled() else {
            reject("LOCATION_ERROR", "Location services are disabled", nil)
            return
        }

        locationManager = CLLocationManager()
        locationManager?.delegate = self
        locationManager?.desiredAccuracy = kCLLocationAccuracyBest

        let authorizationStatus = locationManager?.authorizationStatus ?? .notDetermined

        switch authorizationStatus {
        case .authorizedWhenInUse, .authorizedAlways:
            requestLocationTimeout()
        case .notDetermined:
            locationManager?.requestWhenInUseAuthorization()
        case .denied, .restricted:
            reject("LOCATION_ERROR", "Location access denied or restricted", nil)
        @unknown default:
            reject("LOCATION_ERROR", "Unknown location authorization status", nil)
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last, let resolve else { 
            reject?("LOCATION_ERROR", "No location data available", nil)
            cleanup()    
            return
        }

        resolve([
            "latitude": location.coordinate.latitude,
            "longitude": location.coordinate.longitude
        ])
        cleanup()
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        reject?("LOCATION_ERROR", "Failed to get location: \(error.localizedDescription)", error)
        cleanup()
    }

    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .authorizedWhenInUse, .authorizedAlways:
            requestLocationTimeout()
        case .denied, .restricted:
            reject?("LOCATION_ERROR", "Location access denied or restricted", nil)
            cleanup()
        default:
            break
        }
    }

    private func requestLocationTimeout() {
        timeoutTmer = Timer.scheduledTimer(withTimeInterval: 10, repeats: false) { [weak self] _ in
            self?.reject?("LOCATION_ERROR", "Location request timed out", nil)
            self?.cleanup()
        }

        locationManager?.requestLocation()
    }

    private func cleanup() {
        timeoutTmer?.invalidate()
        timeoutTmer = nil
        resolve = nil
        reject = nil
        locationManager?.delegate = nil
        locationManager = nil
    }
}