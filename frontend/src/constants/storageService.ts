// storageService.ts
export const getToken = (): string | null => {
    return localStorage.getItem("token"); // Lấy token từ localStorage
  };
  
  export const setToken = (token: string): void => {
    localStorage.setItem("token", token); // Lưu token vào localStorage
  };
  