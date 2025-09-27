/**
 * Statistics Manager
 * Lightweight event and morality logging for later AI analysis
 */

class StatisticsManager {
    constructor() {
        this.storageKey = 'eldritch-statistics-log';
        this.buffer = [];
        this.load();
    }

    init() {
        // Initialize statistics manager
        console.log('ðŸ“Š Statistics Manager initialized');
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            this.buffer = raw ? JSON.parse(raw) : [];
        } catch (_) {
            this.buffer = [];
        }
    }

    persist() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.buffer));
        } catch (_) {}
    }

    logEvent(type, data = {}) {
        const entry = { t: Date.now(), type, ...data };
        this.buffer.push(entry);
        // Trim to last 5000 entries to avoid unbounded growth
        if (this.buffer.length > 5000) this.buffer.splice(0, this.buffer.length - 5000);
        this.persist();
        return entry;
    }

    logMoralityChange(changes = {}, context = 'unknown') {
        return this.logEvent('morality_change', { changes, context });
    }

    exportAll() {
        return [...this.buffer];
    }
}

window.statistics = new StatisticsManager();




