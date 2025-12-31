import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { LoginRequest } from '../models/login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private loginUrl = `${environment.apiUrl}/Auth/Login`;
  private logoutUrl = `${environment.apiUrl}/Auth/Logout`; // 新增登出網址
  private forgotPasswordUrl = `${environment.apiUrl}/Auth/ForgotPassword`;
  private resetPasswordUrl = `${environment.apiUrl}/Auth/ResetPassword`;
  private readonly USER_KEY = 'auth_user';
  // 移除 TOKEN_KEY，因為我們碰不到它了

  login(data: LoginRequest): Observable<any> {
    // 加上 { withCredentials: true } 這是關鍵！
    // 這樣瀏覽器才會把 Cookie 存下來，並在之後的請求自動帶上
    return this.http.post<any>(this.loginUrl, data, { withCredentials: true }).pipe(
      tap((response) => {
        // 我們只存使用者資訊 (名字、角色)，不存 Token
        this.saveUser(response.user);
      })
    );
  }

  logout() {
    // 呼叫後端清除 Cookie
    this.http.post(this.logoutUrl, {}, { withCredentials: true }).subscribe(() => {
      localStorage.removeItem(this.USER_KEY);
      this.router.navigate(['/login']);
    });
  }

  private saveUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // 因為讀不到 Cookie，我們改用「有沒有使用者資訊」來判斷是否登入
  // (雖然這只是 UI 判斷，真正的驗證還是靠後端擋 Cookie)
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  // 1. 發送忘記密碼請求 (傳 Email)
  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.forgotPasswordUrl, { email });
  }
  // 2. 發送重設密碼請求 (傳 Email, Token, 新密碼)
  resetPassword(data: { email: string; token: string; newPassword: string }): Observable<any> {
    return this.http.post(this.resetPasswordUrl, data);
  }
}
