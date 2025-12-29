import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="mb-4">{{ 'posts.createPost' | translate }}</h2>

              <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">{{ 'posts.title' | translate }} *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      formControlName="title"
                      [class.is-invalid]="submitted && f['title'].errors">
                    <div class="invalid-feedback" *ngIf="submitted && f['title'].errors">
                      {{ 'validation.required' | translate }}
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">{{ 'posts.authorName' | translate }} *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      formControlName="authorName"
                      (input)="onAuthorInput($event)"
                      [class.is-invalid]="submitted && f['authorName'].errors">
                    <ul class="list-group position-absolute w-100" style="z-index: 1000" 
                        *ngIf="authorSuggestions().length > 0">
                      <li class="list-group-item list-group-item-action" 
                          *ngFor="let suggestion of authorSuggestions()"
                          (click)="selectAuthor(suggestion)"
                          style="cursor: pointer;">
                        {{ suggestion }}
                      </li>
                    </ul>
                    <div class="invalid-feedback" *ngIf="submitted && f['authorName'].errors">
                      {{ 'validation.required' | translate }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">{{ 'posts.description' | translate }} *</label>
                  <textarea 
                    class="form-control" 
                    rows="4" 
                    formControlName="description"
                    [class.is-invalid]="submitted && f['description'].errors"></textarea>
                  <div class="invalid-feedback" *ngIf="submitted && f['description'].errors">
                    {{ 'validation.required' | translate }}
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">{{ 'posts.genre' | translate }} *</label>
                    <select class="form-select" formControlName="genre"
                            [class.is-invalid]="submitted && f['genre'].errors">
                      <option value="">{{ 'posts.selectGenre' | translate }}</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="Biography">Biography</option>
                      <option value="Children">Children</option>
                      <option value="Other">Other</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="submitted && f['genre'].errors">
                      {{ 'validation.required' | translate }}
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">{{ 'posts.condition' | translate }} *</label>
                    <select class="form-select" formControlName="condition"
                            [class.is-invalid]="submitted && f['condition'].errors">
                      <option value="">{{ 'posts.selectCondition' | translate }}</option>
                      <option value="NEW">{{ 'posts.new' | translate }}</option>
                      <option value="LIKE_NEW">{{ 'posts.likeNew' | translate }}</option>
                      <option value="VERY_GOOD">{{ 'posts.veryGood' | translate }}</option>
                      <option value="GOOD">{{ 'posts.good' | translate }}</option>
                      <option value="ACCEPTABLE">{{ 'posts.acceptable' | translate }}</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="submitted && f['condition'].errors">
                      {{ 'validation.required' | translate }}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">{{ 'posts.price' | translate }} (AZN) *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      formControlName="price"
                      step="0.01"
                      [class.is-invalid]="submitted && f['price'].errors">
                    <div class="invalid-feedback" *ngIf="submitted && f['price'].errors">
                      {{ 'validation.required' | translate }}
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">{{ 'posts.city' | translate }} *</label>
                    <select class="form-select" formControlName="city"
                            [class.is-invalid]="submitted && f['city'].errors">
                      <option value="">{{ 'posts.selectCity' | translate }}</option>
                      <option value="Baku">Baku</option>
                      <option value="Ganja">Ganja</option>
                      <option value="Sumqayit">Sumqayit</option>
                      <option value="Mingachevir">Mingachevir</option>
                      <option value="Other">Other</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="submitted && f['city'].errors">
                      {{ 'validation.required' | translate }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">{{ 'posts.contactInfo' | translate }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="contactInfo"
                    placeholder="{{ 'posts.contactInfoPlaceholder' | translate }}">
                </div>

                <div class="mb-4">
                  <label class="form-label">{{ 'posts.images' | translate }}</label>
                  <input 
                    type="file" 
                    class="form-control" 
                    (change)="onFileSelected($event)"
                    accept="image/*"
                    multiple>
                  <small class="form-text text-muted">
                    {{ 'posts.imageHint' | translate }}
                  </small>
                  
                  <div class="row g-2 mt-2" *ngIf="selectedFiles.length > 0">
                    <div class="col-md-3" *ngFor="let file of selectedFiles; let i = index">
                      <div class="position-relative">
                        <img [src]="file.preview" class="img-thumbnail" alt="Preview">
                        <button 
                          type="button" 
                          class="btn btn-sm btn-danger position-absolute top-0 end-0"
                          (click)="removeFile(i)">
                          <i class="material-icons" style="font-size: 16px;">close</i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  {{ errorMessage }}
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? ('common.saving' | translate) : ('posts.createPost' | translate) }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancel()">
                    {{ 'common.cancel' | translate }}
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
export class PostCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private router = inject(Router);
  private http = inject(HttpClient);

  postForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  selectedFiles: Array<{file: File, preview: string}> = [];
  authorSuggestions = signal<string[]>([]);

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      authorName: ['', Validators.required],
      description: ['', Validators.required],
      genre: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      city: ['', Validators.required],
      contactInfo: ['']
    });
  }

  get f() {
    return this.postForm.controls;
  }

  onAuthorInput(event: any) {
    const query = event.target.value;
    if (query.length >= 2) {
      this.http.get<any>(`/api/autocomplete/authors?q=${query}`)
        .subscribe({
          next: (response) => {
            this.authorSuggestions.set(response.suggestions || []);
          },
          error: () => {
            this.authorSuggestions.set([]);
          }
        });
    } else {
      this.authorSuggestions.set([]);
    }
  }

  selectAuthor(author: string) {
    this.postForm.patchValue({ authorName: author });
    this.authorSuggestions.set([]);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.selectedFiles.push({
          file: file,
          preview: e.target.result
        });
      };
      
      reader.readAsDataURL(file);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.postForm.invalid) {
      return;
    }

    this.loading = true;

    const postData = {
      ...this.postForm.value,
      images: [] // Will be uploaded separately
    };

    this.postService.createPost(postData).subscribe({
      next: (post) => {
        // If there are files, upload them
        if (this.selectedFiles.length > 0) {
          this.uploadImages(post.id);
        } else {
          this.router.navigate(['/posts', post.id]);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to create post. Please try again.';
      }
    });
  }

  uploadImages(postId: number) {
    const formData = new FormData();
    this.selectedFiles.forEach((item) => {
      formData.append('files', item.file);
    });

    this.http.post(`/api/posts/${postId}/images`, formData).subscribe({
      next: () => {
        this.router.navigate(['/posts', postId]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Post created but failed to upload images. You can try uploading them later.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/posts']);
  }
}
