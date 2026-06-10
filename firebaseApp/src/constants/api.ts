// Import centralized backend configuration
import { BACKEND_URL } from '../../app.config.env';

// Base URL for backend API
// To update IP address, edit .env file: EXPO_PUBLIC_BACKEND_IP
export const API_BASE_URL = BACKEND_URL;

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    MEMBER_LOGIN: `${API_BASE_URL}/member/login`,
    ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
    
    // Member
    MEMBER_WORKOUTS: `${API_BASE_URL}/member/workouts`,
    MEMBER_PROFILE: `${API_BASE_URL}/member/profile`,
    MEMBER_FEEDBACK: `${API_BASE_URL}/member/feedback`,
    
    // Admin
    ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    ADMIN_ANALYTICS: `${API_BASE_URL}/admin/analytics`,
    ADMIN_MEMBERS: `${API_BASE_URL}/admin/members`,
    ADMIN_FEEDBACK: `${API_BASE_URL}/admin/feedback`,
    
    // AI
    AI_CHAT: `${API_BASE_URL}/ai/chat`,
};
