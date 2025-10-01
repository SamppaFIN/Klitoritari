/**
 * @fileoverview Supabase Client for Eldritch Sanctuary
 * @status [ACTIVE] - Error logging and analytics integration
 * @feature #feature-supabase-integration
 * @feature #feature-error-logging
 * @feature #feature-analytics
 * @last_updated 2025-01-29
 * @dependencies Supabase
 * 
 * Supabase Client for Eldritch Sanctuary
 * Provides error logging, analytics, and data persistence
 */

class SupabaseClient {
    constructor() {
        this.instanceId = 'supabase-client-' + Date.now();
        console.log('🗄️ Supabase Client initialized');
        
        // Supabase configuration
        this.config = {
            url: 'https://your-project.supabase.co',
            anonKey: 'your-anon-key',
            serviceKey: 'your-service-key'
        };
        
        // Initialize Supabase client
        this.client = null;
        this.isConnected = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        this.init();
    }
    
    async init() {
        try {
            // Check if Supabase is available
            if (typeof window !== 'undefined' && window.supabase) {
                this.client = window.supabase;
                this.isConnected = true;
                console.log('🗄️ Supabase client connected');
            } else {
                console.warn('🗄️ Supabase not available, using local storage fallback');
                this.setupLocalFallback();
            }
        } catch (error) {
            console.error('❌ Failed to initialize Supabase client:', error);
            this.setupLocalFallback();
        }
    }
    
    setupLocalFallback() {
        console.log('🗄️ Setting up local storage fallback for error logging');
        this.isConnected = false;
        this.localStorage = {
            errors: [],
            analytics: [],
            events: []
        };
    }
    
    // Error Logging Methods
    async logError(errorData) {
        const errorLog = {
            id: this.generateId(),
            player_id: this.getCurrentPlayerId(),
            error_type: errorData.type || 'unknown',
            error_message: errorData.message || 'Unknown error',
            stack_trace: errorData.stack || '',
            user_agent: navigator.userAgent,
            location_data: this.getLocationData(),
            game_state: this.getGameState(),
            severity: errorData.severity || 'medium',
            created_at: new Date().toISOString()
        };
        
        if (this.isConnected && this.client) {
            try {
                const { data, error } = await this.client
                    .from('error_logs')
                    .insert([errorLog]);
                
                if (error) {
                    console.error('❌ Failed to log error to Supabase:', error);
                    this.logErrorLocally(errorLog);
                } else {
                    console.log('✅ Error logged to Supabase:', errorLog.id);
                }
            } catch (error) {
                console.error('❌ Supabase error logging failed:', error);
                this.logErrorLocally(errorLog);
            }
        } else {
            this.logErrorLocally(errorLog);
        }
    }
    
    logErrorLocally(errorLog) {
        try {
            const errors = JSON.parse(localStorage.getItem('eldritch_errors') || '[]');
            errors.push(errorLog);
            
            // Keep only last 100 errors
            if (errors.length > 100) {
                errors.splice(0, errors.length - 100);
            }
            
            localStorage.setItem('eldritch_errors', JSON.stringify(errors));
            console.log('✅ Error logged locally:', errorLog.id);
        } catch (error) {
            console.error('❌ Failed to log error locally:', error);
        }
    }
    
    // Analytics Methods
    async logAnalytics(analyticsData) {
        const analytics = {
            id: this.generateId(),
            player_id: this.getCurrentPlayerId(),
            session_id: this.getSessionId(),
            step_count: analyticsData.stepCount || 0,
            base_established: analyticsData.baseEstablished || false,
            markers_created: analyticsData.markersCreated || 0,
            distance_traveled: analyticsData.distanceTraveled || 0,
            play_time_minutes: analyticsData.playTimeMinutes || 0,
            device_info: this.getDeviceInfo(),
            created_at: new Date().toISOString()
        };
        
        if (this.isConnected && this.client) {
            try {
                const { data, error } = await this.client
                    .from('player_analytics')
                    .insert([analytics]);
                
                if (error) {
                    console.error('❌ Failed to log analytics to Supabase:', error);
                    this.logAnalyticsLocally(analytics);
                } else {
                    console.log('✅ Analytics logged to Supabase:', analytics.id);
                }
            } catch (error) {
                console.error('❌ Supabase analytics logging failed:', error);
                this.logAnalyticsLocally(analytics);
            }
        } else {
            this.logAnalyticsLocally(analytics);
        }
    }
    
    logAnalyticsLocally(analytics) {
        try {
            const analyticsList = JSON.parse(localStorage.getItem('eldritch_analytics') || '[]');
            analyticsList.push(analytics);
            
            // Keep only last 50 analytics entries
            if (analyticsList.length > 50) {
                analyticsList.splice(0, analyticsList.length - 50);
            }
            
            localStorage.setItem('eldritch_analytics', JSON.stringify(analyticsList));
            console.log('✅ Analytics logged locally:', analytics.id);
        } catch (error) {
            console.error('❌ Failed to log analytics locally:', error);
        }
    }
    
    // Event Logging Methods
    async logEvent(eventData) {
        const event = {
            id: this.generateId(),
            player_id: this.getCurrentPlayerId(),
            event_type: eventData.type || 'unknown',
            event_data: eventData.data || {},
            location_lat: eventData.lat || null,
            location_lng: eventData.lng || null,
            created_at: new Date().toISOString()
        };
        
        if (this.isConnected && this.client) {
            try {
                const { data, error } = await this.client
                    .from('cosmic_events')
                    .insert([event]);
                
                if (error) {
                    console.error('❌ Failed to log event to Supabase:', error);
                    this.logEventLocally(event);
                } else {
                    console.log('✅ Event logged to Supabase:', event.id);
                }
            } catch (error) {
                console.error('❌ Supabase event logging failed:', error);
                this.logEventLocally(event);
            }
        } else {
            this.logEventLocally(event);
        }
    }
    
    logEventLocally(event) {
        try {
            const events = JSON.parse(localStorage.getItem('eldritch_events') || '[]');
            events.push(event);
            
            // Keep only last 200 events
            if (events.length > 200) {
                events.splice(0, events.length - 200);
            }
            
            localStorage.setItem('eldritch_events', JSON.stringify(events));
            console.log('✅ Event logged locally:', event.id);
        } catch (error) {
            console.error('❌ Failed to log event locally:', error);
        }
    }
    
    // Utility Methods
    generateId() {
        return 'es_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getCurrentPlayerId() {
        return window.stepCurrencySystem?.playerId || 'unknown';
    }
    
    getSessionId() {
        return sessionStorage.getItem('eldritch_session_id') || this.generateId();
    }
    
    getLocationData() {
        return {
            lat: window.mapLayer?.map?.getCenter()?.lat || null,
            lng: window.mapLayer?.map?.getCenter()?.lng || null,
            zoom: window.mapLayer?.map?.getZoom() || null
        };
    }
    
    getGameState() {
        return {
            totalSteps: window.stepCurrencySystem?.totalSteps || 0,
            sessionSteps: window.stepCurrencySystem?.sessionSteps || 0,
            baseEstablished: window.stepCurrencySystem?.baseEstablished || false,
            markersCount: window.mapLayer?.markers?.length || 0
        };
    }
    
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: screen.width,
            screenHeight: screen.height,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isOnline: navigator.onLine
        };
    }
    
    // Export Methods
    async exportErrorLogs() {
        if (this.isConnected && this.client) {
            try {
                const { data, error } = await this.client
                    .from('error_logs')
                    .select('*')
                    .eq('player_id', this.getCurrentPlayerId());
                
                if (error) {
                    console.error('❌ Failed to export error logs:', error);
                    return null;
                }
                
                return data;
            } catch (error) {
                console.error('❌ Supabase export failed:', error);
                return null;
            }
        } else {
            return JSON.parse(localStorage.getItem('eldritch_errors') || '[]');
        }
    }
    
    async exportAnalytics() {
        if (this.isConnected && this.client) {
            try {
                const { data, error } = await this.client
                    .from('player_analytics')
                    .select('*')
                    .eq('player_id', this.getCurrentPlayerId());
                
                if (error) {
                    console.error('❌ Failed to export analytics:', error);
                    return null;
                }
                
                return data;
            } catch (error) {
                console.error('❌ Supabase export failed:', error);
                return null;
            }
        } else {
            return JSON.parse(localStorage.getItem('eldritch_analytics') || '[]');
        }
    }
    
    async exportEvents() {
        if (this.isConnected && this.client) {
            try {
                const { data, error } = await this.client
                    .from('cosmic_events')
                    .select('*')
                    .eq('player_id', this.getCurrentPlayerId());
                
                if (error) {
                    console.error('❌ Failed to export events:', error);
                    return null;
                }
                
                return data;
            } catch (error) {
                console.error('❌ Supabase export failed:', error);
                return null;
            }
        } else {
            return JSON.parse(localStorage.getItem('eldritch_events') || '[]');
        }
    }
    
    // Health Check
    async healthCheck() {
        if (this.isConnected && this.client) {
            try {
                const { data, error } = await this.client
                    .from('error_logs')
                    .select('count')
                    .limit(1);
                
                if (error) {
                    console.error('❌ Supabase health check failed:', error);
                    return false;
                }
                
                console.log('✅ Supabase health check passed');
                return true;
            } catch (error) {
                console.error('❌ Supabase health check error:', error);
                return false;
            }
        } else {
            console.log('ℹ️ Supabase not connected, using local storage');
            return true;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.supabaseClient = new SupabaseClient();
    });
} else {
    window.supabaseClient = new SupabaseClient();
}

console.log('🗄️ Supabase Client script loaded');
