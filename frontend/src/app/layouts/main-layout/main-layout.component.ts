import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <div class="logo-container me-2">
            <strong class="fs-3">KQ</strong>
          </div>
          <span class="fw-bold">KitabQurdu</span>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item">
              <a class="nav-link" routerLink="/posts" routerLinkActive="active">
                {{ 'nav.browse' | translate }}
              </a>
            </li>
            
            <li class="nav-item dropdown" *ngIf="!currentUser">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {{ currentLang.toUpperCase() }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" (click)="changeLang('az')">Azərbaycanca</a></li>
                <li><a class="dropdown-item" (click)="changeLang('en')">English</a></li>
                <li><a class="dropdown-item" (click)="changeLang('ru')">Русский</a></li>
              </ul>
            </li>
            
            <ng-container *ngIf="currentUser; else authLinks">
              <li class="nav-item">
                <a class="nav-link" routerLink="/posts/create">
                  <i class="material-icons align-middle">add</i>
                  {{ 'nav.createPost' | translate }}
                </a>
              </li>
              
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="material-icons align-middle">person</i>
                  {{ currentUser.username }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" routerLink="/profile">{{ 'nav.profile' | translate }}</a></li>
                  <li><a class="dropdown-item" routerLink="/profile/posts">{{ 'nav.myPosts' | translate }}</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" (click)="logout()">{{ 'nav.logout' | translate }}</a></li>
                </ul>
              </li>
              
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {{ currentLang.toUpperCase() }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" (click)="changeLang('az')">Azərbaycanca</a></li>
                  <li><a class="dropdown-item" (click)="changeLang('en')">English</a></li>
                  <li><a class="dropdown-item" (click)="changeLang('ru')">Русский</a></li>
                </ul>
              </li>
            </ng-container>
            
            <ng-template #authLinks>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/login">{{ 'nav.login' | translate }}</a>
              </li>
              <li class="nav-item">
                <a class="btn btn-light ms-lg-2" routerLink="/auth/register">{{ 'nav.register' | translate }}</a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
    
    <main>
      <router-outlet></router-outlet>
    </main>
    
    <footer class="bg-dark text-white mt-5 py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5>KitabQurdu</h5>
            <p>{{ 'footer.description' | translate }}</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p>&copy; 2024 KitabQurdu. {{ 'footer.rights' | translate }}</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .logo-container {
      background: white;
      color: #0d6efd;
      border-radius: 8px;
      padding: 4px 8px;
      font-weight: bold;
    }
    
    .navbar-brand {
      font-size: 1.5rem;
    }
    
    main {
      min-height: calc(100vh - 200px);
    }
    
    .nav-link {
      cursor: pointer;
    }
    
    .dropdown-item {
      cursor: pointer;
    }
    
    .material-icons {
      font-size: 18px;
      vertical-align: middle;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  currentUser: User | null = null;
  currentLang: string = 'en';

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  changeLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('language', lang);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
