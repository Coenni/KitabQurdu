import { Injectable, signal, computed } from '@angular/core';
import { Post } from './post.service';
import { User } from './auth.service';

export interface AppState {
  posts: Post[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  featuredPosts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Signals for state management
  private postsSignal = signal<Post[]>([]);
  private currentUserSignal = signal<User | null>(null);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private featuredPostsSignal = signal<Post[]>([]);

  // Computed values
  readonly posts = computed(() => this.postsSignal());
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isLoading = computed(() => this.isLoadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly featuredPosts = computed(() => this.featuredPostsSignal());
  
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly postsCount = computed(() => this.postsSignal().length);

  // Actions to update state
  setPosts(posts: Post[]): void {
    this.postsSignal.set(posts);
  }

  addPost(post: Post): void {
    this.postsSignal.update(posts => [...posts, post]);
  }

  updatePost(id: number, updates: Partial<Post>): void {
    this.postsSignal.update(posts =>
      posts.map(post => post.id === id ? { ...post, ...updates } : post)
    );
  }

  removePost(id: number): void {
    this.postsSignal.update(posts => posts.filter(post => post.id !== id));
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
  }

  setLoading(loading: boolean): void {
    this.isLoadingSignal.set(loading);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  setFeaturedPosts(posts: Post[]): void {
    this.featuredPostsSignal.set(posts);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  reset(): void {
    this.postsSignal.set([]);
    this.currentUserSignal.set(null);
    this.isLoadingSignal.set(false);
    this.errorSignal.set(null);
    this.featuredPostsSignal.set([]);
  }
}
