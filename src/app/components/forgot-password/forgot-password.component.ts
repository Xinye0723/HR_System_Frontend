import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.forgotForm.invalid) return;

    const email = this.forgotForm.value.email;

    // 顯示 Loading
    Swal.fire({
      title: '發送中...',
      didOpen: () => Swal.showLoading(),
    });

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: '信件已發送',
          text: res.message || '請檢查您的信箱 (包含垃圾郵件匣)。',
          confirmButtonText: '回登入頁', // 修改按鈕文字，引導使用者
        }).then(() => {
          // 3. 使用者按下「好的」之後，帶他回登入頁
          this.router.navigate(['/reset-password'], { queryParams: { email: email } });
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('錯誤', '發送失敗，請稍後再試', 'error');
      },
    });
  }
}
