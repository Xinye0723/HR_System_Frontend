import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public authService = inject(AuthService);

  // 登出方法
  logout() {
    Swal.fire({
      title: '確定要登出嗎？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '登出',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }
}
