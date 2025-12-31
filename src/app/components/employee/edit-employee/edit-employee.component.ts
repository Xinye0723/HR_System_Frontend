import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // 1. 引入 ActivatedRoute
import { EmployeeApiService } from '../../../services/employee-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss',
})
export class EditEmployeeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // 注入路由參數取得工具

  currentId = ''; // 用來記住現在正在編輯誰

  // 表單定義 (跟新增一樣，但工號通常不給改)
  employeeForm: FormGroup = this.fb.group({
    employeeId: [{ value: '', disabled: true }], // 設定為 disabled (唯讀)
    name: ['', [Validators.required]],
    englishName: [''],
    account: ['', [Validators.required]],
    joinDate: ['', [Validators.required]],
    contactInfo: [''],
    role: ['', [Validators.required]],
    status: [true],
  });

  ngOnInit(): void {
    // 1. 從網址取得 ID (例如 /edit/E001 -> 拿到 E001)
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.currentId = id;
      this.loadEmployeeData(id);
    } else {
      // 如果沒 ID，代表路徑怪怪的，趕回列表
      Swal.fire('錯誤', '無效的員工 ID', 'error');
      this.router.navigate(['/']);
    }
  }

  // 2. 載入資料並填回表單
  loadEmployeeData(id: string) {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        // 使用 patchValue 自動把欄位對應填入
        this.employeeForm.patchValue({
          employeeId: data.employeeId,
          name: data.name,
          englishName: data.englishName,
          account: data.account,
          // 日期格式處理 (API 回傳可能是完整字串，Input date 需要 yyyy-MM-dd)
          joinDate: data.joinDate ? data.joinDate.split('T')[0] : '',
          contactInfo: data.contactInfo,
          role: data.role,
          status: data.status,
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('錯誤', '找不到該員工資料', 'error');
        this.router.navigate(['/']);
      },
    });
  }

  // 3. 送出更新
  onSubmit() {
    if (this.employeeForm.invalid) return;

    // 因為 employeeId 被 disabled，取 value 時會漏掉它，但更新通常需要 ID
    // 這裡我們直接用 this.currentId 搭配表單內容
    // getRawValue() 可以拿到包含 disabled 欄位的所有資料
    const formData = this.employeeForm.getRawValue();

    this.employeeService.updateEmployee(this.currentId, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '更新成功',
          text: '員工資料已儲存',
          confirmButtonText: '回列表',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/']);
          }
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('失敗', '更新失敗，請稍後再試', 'error');
      },
    });
  }
}
