import { Component, inject, OnInit, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeApiService } from '../../../services/employee-api';
import { Employee } from '../../../models/employee';
import Swal from 'sweetalert2';
// 1. 引入 Angular 提供的現代化 RxJS 操作符
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeApiService);
  private cdr = inject(ChangeDetectorRef);

  // 2. 注入 DestroyRef (它知道這個元件什麼時候會被銷毀)
  private destroyRef = inject(DestroyRef);

  employees: Employee[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.employeeService
      .getAllEmployees()
      .pipe(
        // 3. 神奇的一行！
        // 因為 loadData 是在 ngOnInit 裡被呼叫的 (非注入環境)，
        // 所以必須明確傳入 this.destroyRef 給它。
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          Swal.fire('錯誤', '無法讀取員工列表', 'error');
        },
      });
  }

  deleteEmployee(id: string) {
    Swal.fire({
      title: '確定要刪除嗎？',
      text: '刪除後無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '是的，刪除它！',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService
          .deleteEmployee(id)
          .pipe(
            // 4. 這裡也加上保護，防止使用者刪除中途切換頁面
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe({
            next: () => {
              Swal.fire('已刪除', '該員工資料已成功移除', 'success');
              this.loadData();
            },
            error: (err) => {
              console.error(err);
              Swal.fire('錯誤', '刪除失敗，請稍後再試', 'error');
            },
          });
      }
    });
  }
}
