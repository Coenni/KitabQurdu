import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Post {
  id: number;
  user: any;
  title: string;
  description?: string;
  authorName?: string;
  bookTitle?: string;
  genre?: string;
  price: number;
  condition: string;
  city: string;
  area?: string;
  contactPhone?: string;
  contactEmail?: string;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostRequest {
  title: string;
  description?: string;
  authorName?: string;
  bookTitle?: string;
  genre?: string;
  price: number;
  condition: string;
  city: string;
  area?: string;
  contactPhone?: string;
  contactEmail?: string;
  images: string[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly API_URL = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getAllPosts(page: number = 0, size: number = 20, sortBy: string = 'createdAt', sortDir: string = 'DESC'): Observable<PageResponse<Post>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<Post>>(this.API_URL, { params });
  }

  getPosts(page: number = 0, size: number = 20, sortBy: string = 'createdAt', sortDir: string = 'DESC'): Observable<PageResponse<Post>> {
    return this.getAllPosts(page, size, sortBy, sortDir);
  }

  searchPosts(
    query?: string, 
    genre?: string, 
    city?: string, 
    minPrice?: number | null, 
    maxPrice?: number | null,
    condition?: string,
    page: number = 0, 
    size: number = 20,
    sortBy: string = 'createdAt',
    sortDir: string = 'DESC'
  ): Observable<PageResponse<Post>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (query) params = params.set('query', query);
    if (genre) params = params.set('genre', genre);
    if (city) params = params.set('city', city);
    if (minPrice !== null && minPrice !== undefined) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== null && maxPrice !== undefined) params = params.set('maxPrice', maxPrice.toString());
    if (condition) params = params.set('condition', condition);

    return this.http.get<PageResponse<Post>>(`${this.API_URL}/search`, { params });
  }

  getFeaturedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/featured`);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.API_URL}/${id}`);
  }

  getPost(id: number): Observable<Post> {
    return this.getPostById(id);
  }

  createPost(request: PostRequest): Observable<Post> {
    return this.http.post<Post>(this.API_URL, request);
  }

  updatePost(id: number, request: PostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.API_URL}/${id}`, request);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getUserPosts(userId: number, page: number = 0, size: number = 20): Observable<PageResponse<Post>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Post>>(`${this.API_URL}/user/${userId}`, { params });
  }
}
