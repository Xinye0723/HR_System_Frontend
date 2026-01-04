import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. 引入表單模組 (ReactiveFormsModule)
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeApiService } from '../../../services/employee-api';
// 2. 引入 SweetAlert2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  // 3. 記得在這裡加入 ReactiveFormsModule
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent {
  // 依賴注入
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeApiService);
  private router = inject(Router);

  // 定義表單群組
  employeeForm: FormGroup = this.fb.group({
    // 欄位名稱: [預設值, [驗證規則]]
    employeeId: ['', [Validators.required]],
    name: ['', [Validators.required]],
    englishName: [''],
    account: ['', [Validators.required]],
    // password: ['123456'], // 暫時預設密碼，或是讓後端處理
    joinDate: [new Date().toISOString().split('T')[0], [Validators.required]], // 預設今天
    contactInfo: [''],
    role: ['User', [Validators.required]],
    status: [true], // 預設在職
  });

  // 送出表單的方法
  onSubmit() {
    // 檢查表單是否有效
    if (this.employeeForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: '資料不完整',
        text: '請檢查必填欄位是否都有填寫！',
      });
      return;
    }

    // 呼叫 Service 送出資料
    const formData = this.employeeForm.value;

    // 加入預設密碼 (如果後端沒有預設的話)
    const submitData = { ...formData, password: '1234' };

    this.employeeService.createEmployee(submitData).subscribe({
      next: (res) => {
        // 成功時跳出 SweetAlert
        Swal.fire({
          icon: 'success',
          title: '新增成功',
          text: `員工 ${formData.name} 已新增`,
          confirmButtonText: '回列表',
        }).then((result) => {
          if (result.isConfirmed) {
            // 使用者按確定後，導頁回列表 (目前先導回首頁或列表頁)
            // 假設我們之後會有列表頁，目前先導回 add 或是清空表單
            // this.router.navigate(['/']);

            // 暫時先重置表單
            this.employeeForm.reset({
              joinDate: new Date().toISOString().split('T')[0],
              role: 'User',
              status: true,
            });
          }
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: '新增失敗',
          text: '伺服器發生錯誤，請稍後再試。',
        });
      },
    });
  }
}
