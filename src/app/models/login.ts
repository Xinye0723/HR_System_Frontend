// 定義登入時要傳出去的資料
export interface LoginRequest {
  account: string;
  password: string;
}

// 定義登入成功後收到的資料 (包含 Token 和使用者資訊)
export interface LoginResponse {
  token: string;
  user: {
    account: string;
    name: string;
    role: string;
  };
}
