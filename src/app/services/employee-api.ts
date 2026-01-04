import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { environment } from '../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class EmployeeApiService {
  // 注入 HttpClient
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/EmployeeInfos`;

  constructor() {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, { withCredentials: true });
  }
  createEmployee(data: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, data, { withCredentials: true });
  }
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
  // 1. 取得單一員工資料 (用在編輯頁面初始化)
  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // 2. 更新員工資料
  // 後端通常是用 PUT 方法，路徑為 /api/EmployeeInfos/{id}
  updateEmployee(id: string, data: Employee): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }
}
