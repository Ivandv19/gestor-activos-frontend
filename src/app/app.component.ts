import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from './login/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determina si la página actual es la de login.
   */
  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  /**
   * Determina si se debe mostrar la barra de navegación.
   */
  showNavbar(): boolean {
    return this.authService.isLoggedIn() && !this.isLoginPage();
  }
}
