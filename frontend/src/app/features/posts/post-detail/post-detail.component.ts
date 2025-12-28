import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="container py-5" *ngIf="!loading()">
      <div class="row" *ngIf="post()">
        <!-- Image Gallery -->
        <div class="col-md-7">
          <div class="card shadow-sm mb-3">
            <img 
              [src]="currentImage()" 
              class="card-img-top" 
              alt="{{ post().title }}"
              style="max-height: 500px; object-fit: contain;">
          </div>
          
          <div class="row g-2" *ngIf="post().images && post().images.length > 1">
            <div class="col-3" *ngFor="let image of post().images">
              <img 
                [src]="image" 
                class="img-thumbnail" 
                alt="Thumbnail"
                (click)="currentImage.set(image)"
                style="cursor: pointer; height: 80px; object-fit: cover;">
            </div>
          </div>
        </div>

        <!-- Post Details -->
        <div class="col-md-5">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h2 class="mb-0">{{ post().title }}</h2>
                <div *ngIf="isOwner()">
                  <button class="btn btn-sm btn-outline-primary me-2" (click)="editPost()">
                    <i class="material-icons align-middle" style="font-size: 18px;">edit</i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deletePost()">
                    <i class="material-icons align-middle" style="font-size: 18px;">delete</i>
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <h3 class="text-primary mb-0">{{ post().price }} AZN</h3>
              </div>

              <div class="mb-3">
                <h6 class="text-muted">{{ 'posts.description' | translate }}</h6>
                <p class="mb-0">{{ post().description }}</p>
              </div>

              <hr>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <small class="text-muted d-block">{{ 'posts.author' | translate }}</small>
                  <strong>{{ post().authorName }}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">{{ 'posts.genre' | translate }}</small>
                  <strong>{{ post().genre }}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">{{ 'posts.condition' | translate }}</small>
                  <strong>{{ post().condition }}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">{{ 'posts.city' | translate }}</small>
                  <strong>{{ post().city }}</strong>
                </div>
              </div>

              <hr>

              <div class="mb-3" *ngIf="post().contactInfo">
                <small class="text-muted d-block">{{ 'posts.contactInfo' | translate }}</small>
                <strong>{{ post().contactInfo }}</strong>
              </div>

              <div class="mb-3">
                <small class="text-muted d-block">{{ 'posts.seller' | translate }}</small>
                <a [routerLink]="['/profile', post().userId]">
                  {{ post().username }}
                </a>
              </div>

              <div class="mb-3">
                <small class="text-muted d-block">{{ 'posts.postedOn' | translate }}</small>
                <strong>{{ post().createdAt | date:'medium' }}</strong>
              </div>

              <div class="d-grid gap-2">
                <button class="btn btn-primary btn-lg" *ngIf="!isOwner()">
                  <i class="material-icons align-middle">message</i>
                  {{ 'posts.contactSeller' | translate }}
                </button>
                <a routerLink="/posts" class="btn btn-outline-secondary">
                  {{ 'posts.backToList' | translate }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="alert alert-danger" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>

    <div class="container py-5 text-center" *ngIf="loading()">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ 'common.loading' | translate }}</span>
      </div>
    </div>
  `
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private authService = inject(AuthService);

  post = signal<any>(null);
  loading = signal(true);
  errorMessage = '';
  currentImage = signal('');

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadPost(id);
  }

  loadPost(id: number) {
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.post.set(post);
        this.currentImage.set(post.images?.[0] || '/assets/images/placeholder.jpg');
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load post details.';
        this.loading.set(false);
      }
    });
  }

  isOwner(): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser && this.post() && currentUser.id === this.post().userId;
  }

  editPost() {
    this.router.navigate(['/posts', this.post().id, 'edit']);
  }

  deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post().id).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete post.';
        }
      });
    }
  }
}
