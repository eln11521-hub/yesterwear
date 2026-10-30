import CoreLocation

/// Asks for When-In-Use location access through the native iOS prompt and, if
/// granted, resolves a single fix plus its locality. Awaitable, so onboarding can
/// chain "location → notifications → done" the same way the web Welcome does.
@MainActor
final class OneShotLocation: NSObject, CLLocationManagerDelegate {
    struct Fix {
        let coordinate: CLLocationCoordinate2D
        let placeName: String?
        let timezone: String?
    }

    private let manager = CLLocationManager()
    private var authContinuation: CheckedContinuation<CLAuthorizationStatus, Never>?
    private var fixContinuation: CheckedContinuation<CLLocation?, Never>?

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyKilometer
    }

    /// Shows the permission prompt (if undetermined) and returns a fix, or nil
    /// when access is denied or no location arrives.
    func request() async -> Fix? {
        var status = manager.authorizationStatus
        if status == .notDetermined {
            status = await withCheckedContinuation { cont in
                authContinuation = cont
                manager.requestWhenInUseAuthorization()
            }
        }
        guard status == .authorizedWhenInUse || status == .authorizedAlways else { return nil }

        let location: CLLocation? = await withCheckedContinuation { cont in
            fixContinuation = cont
            manager.requestLocation()
        }
        guard let location else { return nil }

        let place = try? await CLGeocoder().reverseGeocodeLocation(location).first
        return Fix(
            coordinate: location.coordinate,
            placeName: (place?.locality ?? place?.name)?.traditional,
            timezone: place?.timeZone?.identifier
        )
    }

    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = manager.authorizationStatus
        guard status != .notDetermined else { return }
        Task { @MainActor in
            self.authContinuation?.resume(returning: status)
            self.authContinuation = nil
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let first = locations.first
        Task { @MainActor in
            self.fixContinuation?.resume(returning: first)
            self.fixContinuation = nil
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor in
            self.fixContinuation?.resume(returning: nil)
            self.fixContinuation = nil
        }
    }
}
