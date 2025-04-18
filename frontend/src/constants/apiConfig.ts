export const API_URL = "http://localhost:8000";
export const API_ENDPOINTS = {
    LOGIN: `${API_URL}/api/auth/login/`,
    REGISTER: `${API_URL}/api/auth/register`,
    GET_USER: `${API_URL}/api/auth/me`,
    SEND_OTP: `${API_URL}/api/auth/send-otp`,
    CHANGE_PASSWORD: `${API_URL}/api/auth/change-password`,
    UPLOAD_AVATAR: `${API_URL}/upload-avatar`,
  };