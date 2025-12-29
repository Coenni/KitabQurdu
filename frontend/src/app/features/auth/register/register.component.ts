import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">{{ 'auth.register' | translate }}</h2>
              
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">{{ 'auth.username' | translate }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    formControlName="username"
                    [class.is-invalid]="submitted && f['username'].errors">
                  <div class="invalid-feedback" *ngIf="submitted && f['username'].errors">
                    <div *ngIf="f['username'].errors['required']">{{ 'validation.required' | translate }}</div>
                    <div *ngIf="f['username'].errors['minlength']">{{ 'validation.minLength' | translate: {min: 3} }}</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">{{ 'auth.email' | translate }}</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    formControlName="email"
                    [class.is-invalid]="submitted && f['email'].errors">
                  <div class="invalid-feedback" *ngIf="submitted && f['email'].errors">
                    <div *ngIf="f['email'].errors['required']">{{ 'validation.required' | translate }}</div>
                    <div *ngIf="f['email'].errors['email']">{{ 'validation.invalidEmail' | translate }}</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">{{ 'auth.password' | translate }}</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    formControlName="password"
                    [class.is-invalid]="submitted && f['password'].errors">
                  <div class="invalid-feedback" *ngIf="submitted && f['password'].errors">
                    <div *ngIf="f['password'].errors['required']">{{ 'validation.required' | translate }}</div>
                    <div *ngIf="f['password'].errors['minlength']">{{ 'validation.minLength' | translate: {min: 6} }}</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">{{ 'auth.confirmPassword' | translate }}</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    formControlName="confirmPassword"
                    [class.is-invalid]="submitted && f['confirmPassword'].errors">
                  <div class="invalid-feedback" *ngIf="submitted && f['confirmPassword'].errors">
                    <div *ngIf="f['confirmPassword'].errors['required']">{{ 'validation.required' | translate }}</div>
                    <div *ngIf="registerForm.errors?.['passwordMismatch']">{{ 'validation.passwordMismatch' | translate }}</div>
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  {{ errorMessage }}
                </div>

                <button type="submit" class="btn btn-primary w-100 mb-3" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? ('common.loading' | translate) : ('auth.register' | translate) }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    {{ 'auth.alreadyHaveAccount' | translate }}
                    <a routerLink="/auth/login" class="text-decoration-none">{{ 'auth.loginHere' | translate }}</a>
                  </p>
                </div>

                <hr class="my-4">

                <div class="d-grid gap-2">
                  <button type="button" class="btn btn-outline-danger" (click)="loginWithGoogle()">
                    <i class="material-icons align-middle">login</i>
                    {{ 'auth.continueWithGoogle' | translate }}
                  </button>
                  <button type="button" class="btn btn-outline-primary" (click)="loginWithFacebook()">
                    <i class="material-icons align-middle">login</i>
                    {{ 'auth.continueWithFacebook' | translate }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const { username, email, password } = this.registerForm.value;

    this.authService.register({ username, email, password }).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  loginWithGoogle() {
    window.location.href = '/api/auth/oauth2/authorize/google';
  }

  loginWithFacebook() {
    window.location.href = '/api/auth/oauth2/authorize/facebook';
  }
}
