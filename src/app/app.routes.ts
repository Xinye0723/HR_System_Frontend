import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/employee/add-employee/add-employee.component';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
// 1. 引入編輯元件
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
export const routes: Routes = [
  // 設定登入頁
  { path: 'login', component: LoginComponent },

  // 設定首頁 (登入後跳轉的地方)
  { path: '', component: EmployeeListComponent },

  // 其他頁面
  { path: 'add', component: AddEmployeeComponent },
  { path: 'edit/:id', component: EditEmployeeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // 萬用字元：如果網址亂打，預設導回首頁或登入頁
  { path: '**', redirectTo: '' },
];
