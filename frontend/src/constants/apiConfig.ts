export const API_URL = "http://localhost:8000";
export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login/`,
  VERIFY_BOOK_CODE: `${API_URL}/api/auth/verify-book-code/`,
  REGISTER: `${API_URL}/api/auth/register/`,
  GET_USER: `${API_URL}/api/auth/me`,
  SEND_OTP: `${API_URL}/api/auth/send-email-to-take-otp/`,
  VERIFY_OTP_RESET_PASSWORD: `${API_URL}/api/auth/verify-otp-reset-password/`,
  SEND_OTPS: `${API_URL}/api/auth/send-otp/`,
  CHANGE_PASSWORD: `${API_URL}/api/auth/change-password/`,
  UPLOAD_AVATAR: `${API_URL}/upload-avatar`,
  VERIFY_OTP: `${API_URL}/api/auth/verify-otp/`,
  CREATE_STUDENT: `${API_URL}/api/auth/register-student/`,
  GET_ALL_USER: `${API_URL}/api/auth/get-all-user/`
};