// ============================================
// BACKEND API CONFIGURATION
// ============================================
// Backend is live on Render - no local IP needed!
// ============================================

// Local IP from backend terminal: 10.142.6.58
const BACKEND_IP = process.env.EXPO_PUBLIC_BACKEND_IP || '10.142.6.58';
const BACKEND_PORT = process.env.EXPO_PUBLIC_BACKEND_PORT || '5000';

export const BACKEND_CONFIG = {
    IP_ADDRESS: BACKEND_IP,
    PORT: BACKEND_PORT,

    get BASE_URL() {
        // Use https for Render, http for local
        const isLocal = this.IP_ADDRESS.includes('.');
        const protocol = (this.IP_ADDRESS === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(this.IP_ADDRESS)) ? 'http' : 'https';
        const port = protocol === 'https' ? '' : `:${this.PORT}`;
        return `${protocol}://${this.IP_ADDRESS}${port}`;
    }
};

// Export for easy import
export const BACKEND_URL = BACKEND_CONFIG.BASE_URL;
