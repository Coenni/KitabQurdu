import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'posts',
    loadComponent: () => import('./user-posts/user-posts.component').then(m => m.UserPostsComponent)
  }
];
