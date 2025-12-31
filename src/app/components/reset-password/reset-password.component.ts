import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  // 定義表單，並掛上自定義的驗證器 (validators 選項)
  resetForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  email = '';
  token = '';

  // 控制兩顆眼睛的狀態
  showPassword = false;
  showConfirmPassword = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];

      if (!this.token || !this.email) {
        Swal.fire('錯誤', '無效的重設連結', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

  // 切換第一顆眼睛
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 切換第二顆眼睛
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // 自定義驗證器：檢查兩次密碼是否一致
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // 如果兩個都填了，但不一樣，就回傳 mismatch 錯誤
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      // 這裡把錯誤掛在 confirmPassword 欄位上，方便 HTML 顯示紅字
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // 如果原本有 mismatch 錯誤，要把它清掉 (但不要清掉 required 等其他錯誤)
      if (confirmPassword?.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    // 這裡不需要再手動檢查密碼一致性了，因為上面的 validator 已經做了
    const { password } = this.resetForm.value;

    const data = {
      email: this.email,
      token: this.token,
      newPassword: password,
    };

    this.authService.resetPassword(data).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '密碼重設成功',
          text: '請使用新密碼登入',
          confirmButtonText: '去登入',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('失敗', '重設密碼失敗 (可能是連結已過期)', 'error');
      },
    });
  }
}
