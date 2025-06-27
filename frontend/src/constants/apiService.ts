import { API_ENDPOINTS } from "./apiConfig";
import { getToken } from "./storageService"; // Sử dụng dịch vụ lưu trữ của bạn

const fetchAPI = async (endpoint: string, method = "GET", body?: any, token?: string) => {
  const authToken = token || getToken(); // Ưu tiên token truyền vào

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  try {
    const response = await fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("Content-Type");
    let data: any = null;

    // ✅ Chỉ parse JSON nếu có nội dung và là JSON
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data?.detail || data?.error || "Lỗi khi gọi API");
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



export const sendFirstLoginOtp = async () => {
  const token = getToken();
  console.log("Token gửi OTP:", token);

  if (!token) throw new Error("Không tìm thấy token!");

  return fetchAPI(API_ENDPOINTS.SEND_OTPS, "POST", null, token); // token lúc này chắc chắn là string
};

export const verifyFirstLoginOtp = async (otp: string) => {
  return fetchAPI(API_ENDPOINTS.VERIFY_OTP, "POST", { otp });
};

export const changeFirstLoginPassword = async (oldPassword: string, newPassword: string) => {
  return fetchAPI(API_ENDPOINTS.CHANGE_PASSWORD, "POST", {
    old_password: oldPassword,
    new_password: newPassword,
  });
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

export const sendOtp = async (email: string) => {
  try {
    const response = await fetch(API_ENDPOINTS.SEND_OTP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: "Lỗi kết nối đến máy chủ." };
  }
};

export const verifyOtpAndResetPassword = async (email: string, otp: string, newPassword: string) => {
  const res = await fetch(API_ENDPOINTS.VERIFY_OTP_RESET_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, new_password: newPassword }),
  });

  return await res.json();
};

type CreateStudentPayload = {
  student_id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string;
  classname: string;
  is_first_login: boolean;
};

export const createStudent = async (data: CreateStudentPayload) => {
  const res = await fetch(API_ENDPOINTS.CREATE_STUDENT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const getAllStudents = async (page: number = 1) => {
  const res = await fetch(`${API_ENDPOINTS.GET_ALL_USER}?page=${page}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });

  if (!res.ok) {
    throw new Error("Lỗi khi lấy danh sách người dùng");
  }

  return await res.json(); // Kết quả sẽ gồm: count, results, next, previous
};

export const importStudentsFromExcel = async (formData: FormData) => {
  const res = await fetch(API_ENDPOINTS.SEND_EXCEL, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  const data = await res.json();
  return data;
};

