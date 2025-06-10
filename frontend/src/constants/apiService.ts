import { API_ENDPOINTS } from "./apiConfig";
import { getToken } from "./storageService"; // Sử dụng dịch vụ lưu trữ của bạn

const fetchAPI = async (endpoint: string, method = "GET", body?: any) => {
  const token = getToken(); // Lấy token từ localStorage

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`; // Thêm token vào headers nếu có

  try {
    const response = await fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);

      if (response.status === 429) {
        throw new Error("Bạn đã thử OTP quá nhiều lần. Vui lòng thử lại sau!");
      }

      throw new Error(data.error || "Lỗi khi gọi API");
    }

    return data;
  } catch (error) {
    console.error("Error fetching API:", error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  return fetchAPI(API_ENDPOINTS.LOGIN, "POST", { username, password });
};

export const sendOtp = async (email: string) => {
    return fetchAPI(API_ENDPOINTS.SEND_OTP, "POST", { email });
  };

export const verifyBookCode = async (bookCode: string, email: string) => {
  const response = await fetch(API_ENDPOINTS.VERIFY_BOOK_CODE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_code: bookCode, email }),
  });

  if (!response.ok) throw new Error("Không thể xác nhận mã sách.");
  return await response.json();
};

export const registerUser = async (userData: any) => {
  const response = await fetch(API_ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Đăng ký thất bại.");
  return await response.json();
};