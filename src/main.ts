import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/pages/login/login.component';
import { HomepageComponent } from './app/pages/homepage/homepage.component';
import { MembershipComponent } from './app/pages/membership-page/membership-page.component';
import { MembershipInfoComponent } from './app/membership-info-page/membership-info-page.component';
import { CourseOverviewComponent } from './app/course-overview/course-overview.component';
import path from 'path';
import { Component } from '@angular/core';

const routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'membership/:category/:type', component: MembershipComponent },
  {
    path: 'membership-info/:category/:type',
    loadComponent: () => import('./app/membership-info-page/membership-info-page.component').then(m => m.MembershipInfoComponent)
  },
  { path: 'course-overview', component: CourseOverviewComponent },
  { path: 'course-overview/:courseName', component: CourseOverviewComponent } 

  
];
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
});