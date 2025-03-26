import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router'; // Import Routes
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/pages/login/login.component';
import { HomepageComponent } from './app/pages/homepage/homepage.component';
import { MembershipComponent } from './app/pages/membership-page/membership-page.component';
import { MembershipInfoComponent } from './app/membership-info-page/membership-info-page.component';
import { CourseOverviewComponent } from './app/course-overview/course-overview.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AccountComponent } from './app/account/account.component';
import { AuthService } from './app/services/auth.service';
import { QuestionComponent } from './app/question/question.component';
import { TermsAndConditionsComponent } from './app/terms-and-conditions/terms-and-conditions.component';
import { ForgotPasswordComponent } from './app/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './app/reset-password/reset-password.component';
import { PricingDetailsComponent } from './app/pricing-details/pricing-details.component';
import { ContactUsComponent } from './app/contact-us/contact-us.component';
import { PaymentSuccessComponent } from './app/payment-success/payment-success.component';
import { PaymentCancelComponent } from './app/payment-cancel/payment-cancel.component';

// Explicitly type the routes array as Routes
const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'terms', component: TermsAndConditionsComponent },
  { path: 'login', component: LoginComponent },
  { path : 'contact' , component: ContactUsComponent},
  {path : 'success', component:PaymentSuccessComponent},
  {path:'cancel',component:PaymentCancelComponent},
  { path: 'account', component: AccountComponent },
  { path: 'pricing-details', component: PricingDetailsComponent },
  { path: 'membership-info', component: MembershipInfoComponent },
  { path: 'membership/:category/:type', component: MembershipComponent },
  {
    path: 'membership-info/:category/:type',
    loadComponent: () =>
      import('./app/membership-info-page/membership-info-page.component').then(
        (m) => m.MembershipInfoComponent
      ),
  },
  { path: 'course-overview', component: CourseOverviewComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'course-overview/:courseName', component: CourseOverviewComponent },
  { path: '', redirectTo: '/account', pathMatch: 'full' as const },
  {
    path: 'questions/:topic/:membershipType',
    component: QuestionComponent,
  },
];
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    AuthService,
  ],
});