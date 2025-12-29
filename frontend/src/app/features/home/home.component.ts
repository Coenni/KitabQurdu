import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PostService, Post } from '../../core/services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">{{ 'home.title' | translate }}</h1>
            <p class="lead mb-4">{{ 'home.subtitle' | translate }}</p>
            <div class="d-flex gap-3">
              <a routerLink="/posts" class="btn btn-light btn-lg">{{ 'home.browseBooks' | translate }}</a>
              <a routerLink="/posts/create" class="btn btn-outline-light btn-lg">{{ 'home.sellBook' | translate }}</a>
            </div>
          </div>
          <div class="col-lg-6 mt-4 mt-lg-0 text-center">
            <div class="hero-image">
              <i class="material-icons" style="font-size: 200px;">menu_book</i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <h2 class="text-center mb-5">{{ 'home.featuredPosts' | translate }}</h2>
      
      <div *ngIf="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" *ngIf="!loading">
        <div class="col" *ngFor="let post of featuredPosts">
          <div class="card h-100 shadow-sm">
            <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
              <i class="material-icons text-muted" style="font-size: 64px;">book</i>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text text-muted small">
                <span *ngIf="post.authorName">{{ 'post.by' | translate }} {{ post.authorName }}</span>
              </p>
              <p class="card-text" *ngIf="post.description">
                {{ post.description | slice:0:100 }}{{ post.description.length > 100 ? '...' : '' }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 mb-0 text-primary">{{ post.price | currency:'AZN' }}</span>
                <span class="badge bg-secondary">{{ post.condition }}</span>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <a [routerLink]="['/posts', post.id]" class="btn btn-primary w-100">
                {{ 'post.viewDetails' | translate }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-5" *ngIf="!loading && featuredPosts.length === 0">
        <p class="text-muted">{{ 'home.noPosts' | translate }}</p>
        <a routerLink="/posts/create" class="btn btn-primary">{{ 'home.createFirst' | translate }}</a>
      </div>
    </div>

    <div class="bg-light py-5">
      <div class="container">
        <h2 class="text-center mb-5">{{ 'home.howItWorks' | translate }}</h2>
        <div class="row">
          <div class="col-md-4 text-center mb-4">
            <i class="material-icons text-primary" style="font-size: 64px;">search</i>
            <h4 class="mt-3">{{ 'home.step1Title' | translate }}</h4>
            <p>{{ 'home.step1Desc' | translate }}</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <i class="material-icons text-primary" style="font-size: 64px;">chat</i>
            <h4 class="mt-3">{{ 'home.step2Title' | translate }}</h4>
            <p>{{ 'home.step2Desc' | translate }}</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <i class="material-icons text-primary" style="font-size: 64px;">local_shipping</i>
            <h4 class="mt-3">{{ 'home.step3Title' | translate }}</h4>
            <p>{{ 'home.step3Desc' | translate }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .hero-image {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredPosts: Post[] = [];
  loading = true;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadFeaturedPosts();
  }

  loadFeaturedPosts(): void {
    this.postService.getFeaturedPosts().subscribe({
      next: (posts) => {
        this.featuredPosts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured posts', error);
        this.loading = false;
      }
    });
  }
}
