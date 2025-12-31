import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 為了讓按鈕可以跳轉
import { EmployeeApiService } from '../../../services/employee-api'; // 注意你的路徑
import { Employee } from '../../../models/employee';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // 引入 RouterLink 供 HTML 使用
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeApiService);
  private cdr = inject(ChangeDetectorRef);
  // 存放員工資料的陣列
  employees: Employee[] = [];

  // 載入狀態 (為了讓 UX 更好，我們可以顯示 Loading)
  isLoading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;

        // 3. 加入這行！強制告訴 Angular：「畫面該更新了！」
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;

        // 這裡也要加，確保錯誤時圈圈會消失
        this.cdr.detectChanges();

        Swal.fire('錯誤', '無法讀取員工列表', 'error');
      },
    });
  }

  // 先預留刪除功能的骨架
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
        // 之後這裡要呼叫 API 進行刪除

        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            Swal.fire('已刪除', '該員工資料已成功移除', 'success');
            // 重要：刪除成功後，重新載入列表，讓畫面更新
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
