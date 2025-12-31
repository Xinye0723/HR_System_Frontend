import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  showPassword = false;
  loginForm: FormGroup = this.fb.group({
    account: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  // 切換顯示狀態
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: '登入成功',
          text: `歡迎回來，${res.user.name}！`,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // 登入成功後，跳轉到首頁 (員工列表)
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: '帳號或密碼錯誤，請再試一次。',
        });
      },
    });
  }
}
