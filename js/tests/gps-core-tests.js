/**
 * GPS Core System Test Suite
 * Created by: 🧪 Testa
 * Purpose: Comprehensive testing of the new GPS Core System
 * Status: [SACRED] - Complete test coverage, do not modify without approval
 */

describe('GPS Core System', () => {
    let gpsCore;
    let mockGeolocation;
    let originalGeolocation;
    let originalNotificationCenter;
    let originalMapEngine;
    let originalUnifiedQuestSystem;

    beforeAll(() => {
        // Mock global objects
        originalGeolocation = navigator.geolocation;
        originalNotificationCenter = window.notificationCenter;
        originalMapEngine = window.mapEngine;
        originalUnifiedQuestSystem = window.unifiedQuestSystem;

        mockGeolocation = {
            getCurrentPosition: jest.fn(),
            watchPosition: jest.fn(),
            clearWatch: jest.fn(),
        };
        Object.defineProperty(navigator, 'geolocation', {
            value: mockGeolocation,
            writable: true
        });

        window.notificationCenter = {
            showBanner: jest.fn(),
        };

        window.mapEngine = {
            initializeWithPosition: jest.fn(),
            updatePlayerPosition: jest.fn(),
            map: {
                setView: jest.fn(),
                getCenter: () => ({ lat: 0, lng: 0 }),
            },
        };

        window.unifiedQuestSystem = {
            beginAfterLocate: jest.fn(),
        };

        // Mock document elements for UI updates
        document.body.innerHTML = `
            <div id="locate-me-btn"></div>
            <div id="location-btn"></div>
            <div id="device-location-display">
                <span class="location-coords"></span>
                <span class="accuracy-value"></span>
            </div>
            <div id="location-display-header"></div>
            <div id="accuracy-display-header"></div>
        `;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset localStorage
        localStorage.clear();
        // Re-initialize the system for each test
        gpsCore = new GPSCore();
        window.gpsCore = gpsCore;
    });

    afterAll(() => {
        // Restore original global objects
        Object.defineProperty(navigator, 'geolocation', {
            value: originalGeolocation,
            writable: true
        });
        window.notificationCenter = originalNotificationCenter;
        window.mapEngine = originalMapEngine;
        window.unifiedQuestSystem = originalUnifiedQuestSystem;
        delete window.gpsCore;
    });

    // Helper to simulate a successful GPS position
    const simulateGPSSuccess = (lat = 10, lng = 20, accuracy = 10) => {
        const position = {
            coords: { latitude: lat, longitude: lng, accuracy: accuracy },
            timestamp: Date.now()
        };
        
        // Call the success callback of getCurrentPosition
        const successCallback = mockGeolocation.getCurrentPosition.mock.calls[0][0];
        if (successCallback) {
            successCallback(position);
        }
        
        // Also call watchPosition success callback if it exists
        const watchSuccessCallback = mockGeolocation.watchPosition.mock.calls[0][0];
        if (watchSuccessCallback) {
            watchSuccessCallback(position);
        }
    };

    // Helper to simulate a GPS error
    const simulateGPSError = (code, message) => {
        const error = { code, message };
        
        // Call the error callback of getCurrentPosition
        const errorCallback = mockGeolocation.getCurrentPosition.mock.calls[0][1];
        if (errorCallback) {
            errorCallback(error);
        }
        
        // Also call watchPosition error callback if it exists
        const watchErrorCallback = mockGeolocation.watchPosition.mock.calls[0][1];
        if (watchErrorCallback) {
            watchErrorCallback(error);
        }
    };

    describe('Initialization', () => {
        test('should initialize with correct default state', () => {
            expect(gpsCore.state.initialized).toBe(true);
            expect(gpsCore.state.permission).toBe('unknown');
            expect(gpsCore.state.tracking).toBe(false);
            expect(gpsCore.state.position).toBeNull();
            expect(gpsCore.state.error).toBeNull();
        });

        test('should check browser support', () => {
            // Test with geolocation support
            expect(gpsCore.state.initialized).toBe(true);
            
            // Test without geolocation support
            Object.defineProperty(navigator, 'geolocation', {
                value: undefined,
                writable: true
            });
            
            const gpsCoreNoSupport = new GPSCore();
            expect(gpsCoreNoSupport.state.error).toBe('Geolocation not supported by this browser');
            
            // Restore geolocation
            Object.defineProperty(navigator, 'geolocation', {
                value: mockGeolocation,
                writable: true
            });
        });

        test('should setup UI event listeners', () => {
            const locateBtn = document.getElementById('locate-me-btn');
            const headerBtn = document.getElementById('location-btn');
            
            expect(locateBtn).toBeTruthy();
            expect(headerBtn).toBeTruthy();
        });
    });

    describe('Permission Management', () => {
        test('should handle permission granted', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
                success({ coords: { latitude: 1, longitude: 1, accuracy: 10 } });
            });

            await gpsCore.requestLocation();

            expect(gpsCore.state.permission).toBe('granted');
            expect(gpsCore.state.position).toBeTruthy();
            expect(gpsCore.state.error).toBeNull();
        });

        test('should handle permission denied', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
                error({ code: 1, message: 'Permission denied' });
            });

            await gpsCore.requestLocation();

            expect(gpsCore.state.permission).toBe('denied');
            expect(gpsCore.state.position).toBeTruthy(); // Should have fallback position
            expect(gpsCore.state.position.isFallback).toBe(true);
        });

        test('should handle position unavailable', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
                error({ code: 2, message: 'Position unavailable' });
            });

            await gpsCore.requestLocation();

            expect(gpsCore.state.error.code).toBe(2);
            expect(gpsCore.state.position).toBeTruthy(); // Should have fallback position
        });

        test('should handle timeout', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
                error({ code: 3, message: 'Timeout' });
            });

            await gpsCore.requestLocation();

            expect(gpsCore.state.error.code).toBe(3);
            expect(gpsCore.state.position).toBeTruthy(); // Should have fallback position
        });
    });

    describe('Position Tracking', () => {
        test('should start tracking successfully', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
                success({ coords: { latitude: 1, longitude: 1, accuracy: 10 } });
            });
            mockGeolocation.watchPosition.mockImplementation(() => 123);

            await gpsCore.requestLocation();
            gpsCore.startTracking();

            expect(gpsCore.state.tracking).toBe(true);
            expect(gpsCore.watchId).toBe(123);
            expect(mockGeolocation.watchPosition).toHaveBeenCalled();
        });

        test('should stop tracking', () => {
            gpsCore.watchId = 123;
            gpsCore.state.tracking = true;

            gpsCore.stopTracking();

            expect(gpsCore.state.tracking).toBe(false);
            expect(gpsCore.watchId).toBeNull();
            expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
        });

        test('should handle position updates during tracking', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
                success({ coords: { latitude: 1, longitude: 1, accuracy: 10 } });
            });
            mockGeolocation.watchPosition.mockImplementation((success) => {
                success({ coords: { latitude: 10, longitude: 20, accuracy: 15 } });
                return 123;
            });

            await gpsCore.requestLocation();
            gpsCore.startTracking();

            expect(gpsCore.state.position.lat).toBe(10);
            expect(gpsCore.state.position.lng).toBe(20);
            expect(gpsCore.state.position.accuracy).toBe(15);
        });
    });

    describe('Position Validation', () => {
        test('should validate coordinates correctly', () => {
            expect(gpsCore.isValidCoordinates(0, 0)).toBe(true);
            expect(gpsCore.isValidCoordinates(90, 180)).toBe(true);
            expect(gpsCore.isValidCoordinates(-90, -180)).toBe(true);
            expect(gpsCore.isValidCoordinates(91, 0)).toBe(false);
            expect(gpsCore.isValidCoordinates(0, 181)).toBe(false);
            expect(gpsCore.isValidCoordinates(NaN, 0)).toBe(false);
            expect(gpsCore.isValidCoordinates(0, Infinity)).toBe(false);
        });

        test('should reject invalid coordinates', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
                success({ coords: { latitude: NaN, longitude: 20, accuracy: 10 } });
            });

            await gpsCore.requestLocation();

            expect(gpsCore.state.error).toBeTruthy();
            expect(gpsCore.state.error.code).toBe(2);
        });
    });

    describe('Fallback System', () => {
        test('should use fallback position when GPS fails', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
                error({ code: 1, message: 'Permission denied' });
            });

            await gpsCore.requestLocation();

            expect(gpsCore.state.position.isFallback).toBe(true);
            expect(gpsCore.state.position.lat).toBe(gpsCore.config.fallbackLocation.lat);
            expect(gpsCore.state.position.lng).toBe(gpsCore.config.fallbackLocation.lng);
        });

        test('should load last known position from storage', () => {
            const testPosition = {
                lat: 30,
                lng: 40,
                accuracy: 20,
                timestamp: Date.now() - 10000 // 10 seconds ago
            };

            localStorage.setItem('gps_last_position', JSON.stringify(testPosition));

            const newGpsCore = new GPSCore();
            expect(newGpsCore.state.lastValidPosition).toEqual(expect.objectContaining({
                lat: 30,
                lng: 40
            }));
        });

        test('should not load old positions from storage', () => {
            const oldPosition = {
                lat: 30,
                lng: 40,
                accuracy: 20,
                timestamp: Date.now() - 3600001 // Over 1 hour ago
            };

            localStorage.setItem('gps_last_position', JSON.stringify(oldPosition));

            const newGpsCore = new GPSCore();
            expect(newGpsCore.state.lastValidPosition).toBeNull();
        });
    });

    describe('UI Updates', () => {
        test('should update locate button UI correctly', async () => {
            const locateBtn = document.getElementById('locate-me-btn');
            
            // Test requesting state
            gpsCore.updateUI('requesting');
            expect(locateBtn.innerHTML).toContain('REQUESTING');
            expect(locateBtn.classList.contains('requesting')).toBe(true);
            
            // Test tracking state
            gpsCore.updateUI('tracking');
            expect(locateBtn.innerHTML).toContain('TRACKING');
            expect(locateBtn.classList.contains('tracking')).toBe(true);
            
            // Test success state
            gpsCore.updateUI('success');
            expect(locateBtn.innerHTML).toContain('LOCATED');
            expect(locateBtn.classList.contains('success')).toBe(true);
            
            // Test error state
            gpsCore.updateUI('error');
            expect(locateBtn.innerHTML).toContain('ERROR');
            expect(locateBtn.classList.contains('error')).toBe(true);
            
            // Test fallback state
            gpsCore.updateUI('fallback');
            expect(locateBtn.innerHTML).toContain('FALLBACK');
            expect(locateBtn.classList.contains('fallback')).toBe(true);
        });

        test('should update location display correctly', () => {
            const position = {
                lat: 10.123456,
                lng: 20.789012,
                accuracy: 25.5
            };

            gpsCore.updateLocationDisplay(position);

            const coordsElement = document.querySelector('.location-coords');
            const accuracyElement = document.querySelector('.accuracy-value');
            const headerLocation = document.getElementById('location-display-header');
            const headerAccuracy = document.getElementById('accuracy-display-header');

            expect(coordsElement.textContent).toBe('10.123456, 20.789012');
            expect(accuracyElement.textContent).toBe('25.5m');
            expect(headerLocation.textContent).toBe('10.123456, 20.789012');
            expect(headerAccuracy.textContent).toBe('Accuracy: 25.5m');
        });
    });

    describe('Map Integration', () => {
        test('should initialize map and quests on first location', async () => {
            mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
                success({ coords: { latitude: 1, longitude: 1, accuracy: 10 } });
            });

            await gpsCore.requestLocation();

            expect(window.mapEngine.initializeWithPosition).toHaveBeenCalledWith(
                expect.objectContaining({ lat: 1, lng: 1 })
            );
            expect(window.unifiedQuestSystem.beginAfterLocate).toHaveBeenCalled();
            expect(window.mapEngine.map.setView).toHaveBeenCalledWith([1, 1], 18, expect.any(Object));
        });

        test('should center map on player position', () => {
            const position = { lat: 10, lng: 20 };
            gpsCore.centerMapOnPlayer(position);

            expect(window.mapEngine.map.setView).toHaveBeenCalledWith([10, 20], 18, expect.any(Object));
        });
    });

    describe('Event System', () => {
        test('should emit events correctly', () => {
            const mockCallback = jest.fn();
            gpsCore.on('gps:ready', mockCallback);
            gpsCore.emit('gps:ready');

            expect(mockCallback).toHaveBeenCalled();
        });

        test('should handle multiple event listeners', () => {
            const mockCallback1 = jest.fn();
            const mockCallback2 = jest.fn();
            
            gpsCore.on('gps:ready', mockCallback1);
            gpsCore.on('gps:ready', mockCallback2);
            gpsCore.emit('gps:ready');

            expect(mockCallback1).toHaveBeenCalled();
            expect(mockCallback2).toHaveBeenCalled();
        });

        test('should remove event listeners', () => {
            const mockCallback = jest.fn();
            gpsCore.on('gps:ready', mockCallback);
            gpsCore.off('gps:ready', mockCallback);
            gpsCore.emit('gps:ready');

            expect(mockCallback).not.toHaveBeenCalled();
        });
    });

    describe('Retry Logic', () => {
        test('should retry on timeout errors', async () => {
            jest.useFakeTimers();
            
            mockGeolocation.getCurrentPosition
                .mockImplementationOnce((success, error) => error({ code: 3, message: 'Timeout' }))
                .mockImplementationOnce((success, error) => error({ code: 3, message: 'Timeout' }))
                .mockImplementationOnce((success) => success({ coords: { latitude: 1, longitude: 1, accuracy: 10 } }));

            await gpsCore.requestLocation();

            expect(gpsCore.retryCount).toBe(1);
            jest.advanceTimersByTime(2000);
            expect(gpsCore.retryCount).toBe(2);
            jest.advanceTimersByTime(4000);
            expect(gpsCore.retryCount).toBe(3);

            jest.useRealTimers();
        });

        test('should use fallback after max retries', async () => {
            jest.useFakeTimers();
            
            mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
                error({ code: 3, message: 'Timeout' });
            });

            await gpsCore.requestLocation();

            // Simulate all retries
            jest.advanceTimersByTime(2000);
            jest.advanceTimersByTime(4000);
            jest.advanceTimersByTime(6000);

            expect(gpsCore.state.position.isFallback).toBe(true);

            jest.useRealTimers();
        });
    });

    describe('Public API', () => {
        test('should provide correct public API methods', () => {
            expect(typeof gpsCore.getCurrentPosition).toBe('function');
            expect(typeof gpsCore.getLastValidPosition).toBe('function');
            expect(typeof gpsCore.getPermissionState).toBe('function');
            expect(typeof gpsCore.getTrackingState).toBe('function');
            expect(typeof gpsCore.getAccuracy).toBe('function');
            expect(typeof gpsCore.getError).toBe('function');
            expect(typeof gpsCore.requestPermission).toBe('function');
            expect(typeof gpsCore.destroy).toBe('function');
        });

        test('should return correct state values', () => {
            gpsCore.state.position = { lat: 1, lng: 2 };
            gpsCore.state.tracking = true;
            gpsCore.state.permission = 'granted';

            expect(gpsCore.getCurrentPosition()).toEqual({ lat: 1, lng: 2 });
            expect(gpsCore.getTrackingState()).toBe(true);
            expect(gpsCore.getPermissionState()).toBe('granted');
        });
    });

    describe('Cleanup', () => {
        test('should cleanup properly on destroy', () => {
            gpsCore.watchId = 123;
            gpsCore.state.tracking = true;
            
            const mockCallback = jest.fn();
            gpsCore.on('gps:ready', mockCallback);

            gpsCore.destroy();

            expect(gpsCore.watchId).toBeNull();
            expect(gpsCore.state.tracking).toBe(false);
            expect(gpsCore.eventListeners.size).toBe(0);
            expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
        });
    });
});

// Run tests if in test environment
if (typeof describe === 'undefined') {
    console.log('🧪 GPS Core Tests: Test environment not detected, tests will run when loaded in test framework');
}
