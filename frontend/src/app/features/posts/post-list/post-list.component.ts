import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <!-- Filters Sidebar -->
        <div class="col-md-3">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ 'posts.filters' | translate }}</h5>
              
              <div class="mb-3">
                <label class="form-label">{{ 'posts.search' | translate }}</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="filters.query"
                  (ngModelChange)="applyFilters()"
                  placeholder="{{ 'posts.searchPlaceholder' | translate }}">
              </div>

              <div class="mb-3">
                <label class="form-label">{{ 'posts.genre' | translate }}</label>
                <select class="form-select" [(ngModel)]="filters.genre" (ngModelChange)="applyFilters()">
                  <option value="">{{ 'posts.allGenres' | translate }}</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Children">Children</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ 'posts.city' | translate }}</label>
                <select class="form-select" [(ngModel)]="filters.city" (ngModelChange)="applyFilters()">
                  <option value="">{{ 'posts.allCities' | translate }}</option>
                  <option value="Baku">Baku</option>
                  <option value="Ganja">Ganja</option>
                  <option value="Sumqayit">Sumqayit</option>
                  <option value="Mingachevir">Mingachevir</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ 'posts.condition' | translate }}</label>
                <select class="form-select" [(ngModel)]="filters.condition" (ngModelChange)="applyFilters()">
                  <option value="">{{ 'posts.anyCondition' | translate }}</option>
                  <option value="NEW">{{ 'posts.new' | translate }}</option>
                  <option value="LIKE_NEW">{{ 'posts.likeNew' | translate }}</option>
                  <option value="VERY_GOOD">{{ 'posts.veryGood' | translate }}</option>
                  <option value="GOOD">{{ 'posts.good' | translate }}</option>
                  <option value="ACCEPTABLE">{{ 'posts.acceptable' | translate }}</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ 'posts.priceRange' | translate }}</label>
                <div class="row g-2">
                  <div class="col-6">
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="filters.minPrice"
                      (ngModelChange)="applyFilters()"
                      placeholder="{{ 'posts.min' | translate }}">
                  </div>
                  <div class="col-6">
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="filters.maxPrice"
                      (ngModelChange)="applyFilters()"
                      placeholder="{{ 'posts.max' | translate }}">
                  </div>
                </div>
              </div>

              <button class="btn btn-secondary w-100" (click)="clearFilters()">
                {{ 'posts.clearFilters' | translate }}
              </button>
            </div>
          </div>
        </div>

        <!-- Posts Grid -->
        <div class="col-md-9">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>{{ 'posts.allPosts' | translate }}</h3>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" 
                      [class.active]="sortBy === 'createdAt'"
                      (click)="sortBy = 'createdAt'; loadPosts()">
                {{ 'posts.newest' | translate }}
              </button>
              <button class="btn btn-outline-primary btn-sm" 
                      [class.active]="sortBy === 'price'"
                      (click)="sortBy = 'price'; loadPosts()">
                {{ 'posts.price' | translate }}
              </button>
            </div>
          </div>

          <div class="row g-3" *ngIf="!loading()">
            <div class="col-md-4" *ngFor="let post of posts()">
              <div class="card h-100 shadow-sm hover-shadow" style="cursor: pointer" 
                   (click)="viewPost(post.id)">
                <div class="position-relative">
                  <img [src]="post.images?.length ? post.images[0] : '/assets/images/placeholder.jpg'" 
                       class="card-img-top" 
                       alt="{{ post.title }}"
                       style="height: 200px; object-fit: cover;">
                  <span class="badge bg-primary position-absolute top-0 end-0 m-2">
                    {{ post.price }} AZN
                  </span>
                </div>
                <div class="card-body">
                  <h5 class="card-title text-truncate">{{ post.title }}</h5>
                  <p class="card-text text-muted small mb-1">
                    <i class="material-icons align-middle" style="font-size: 16px;">person</i>
                    {{ post.authorName }}
                  </p>
                  <p class="card-text text-muted small mb-1">
                    <i class="material-icons align-middle" style="font-size: 16px;">location_on</i>
                    {{ post.city }}
                  </p>
                  <p class="card-text text-muted small">
                    <i class="material-icons align-middle" style="font-size: 16px;">label</i>
                    {{ post.condition }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center py-5" *ngIf="loading()">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ 'common.loading' | translate }}</span>
            </div>
          </div>

          <div class="alert alert-info text-center" *ngIf="!loading() && posts().length === 0">
            {{ 'posts.noPosts' | translate }}
          </div>

          <!-- Pagination -->
          <nav *ngIf="totalPages() > 1" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="currentPage === 0">
                <a class="page-link" (click)="changePage(currentPage - 1)">{{ 'common.previous' | translate }}</a>
              </li>
              <li class="page-item" *ngFor="let page of getPageNumbers()" 
                  [class.active]="page === currentPage">
                <a class="page-link" (click)="changePage(page)">{{ page + 1 }}</a>
              </li>
              <li class="page-item" [class.disabled]="currentPage === totalPages() - 1">
                <a class="page-link" (click)="changePage(currentPage + 1)">{{ 'common.next' | translate }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-shadow:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
      transition: box-shadow 0.3s ease-in-out;
    }
  `]
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);

  posts = signal<any[]>([]);
  loading = signal(false);
  totalPages = signal(0);
  currentPage = 0;
  pageSize = 12;
  sortBy = 'createdAt';
  sortDir = 'DESC';

  filters = {
    query: '',
    genre: '',
    city: '',
    condition: '',
    minPrice: null as number | null,
    maxPrice: null as number | null
  };

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    
    const hasFilters = this.filters.query || this.filters.genre || this.filters.city || 
                       this.filters.condition || this.filters.minPrice || this.filters.maxPrice;

    const request$ = hasFilters 
      ? this.postService.searchPosts(
          this.filters.query,
          this.filters.genre,
          this.filters.city,
          this.filters.minPrice,
          this.filters.maxPrice,
          this.filters.condition,
          this.currentPage,
          this.pageSize,
          this.sortBy,
          this.sortDir
        )
      : this.postService.getPosts(this.currentPage, this.pageSize, this.sortBy, this.sortDir);

    request$.subscribe({
      next: (response) => {
        this.posts.set(response.content);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadPosts();
  }

  clearFilters() {
    this.filters = {
      query: '',
      genre: '',
      city: '',
      condition: '',
      minPrice: null,
      maxPrice: null
    };
    this.applyFilters();
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage = page;
      this.loadPosts();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(0, this.currentPage - halfPages);
    let endPage = Math.min(this.totalPages() - 1, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  viewPost(id: number) {
    this.router.navigate(['/posts', id]);
  }
}
