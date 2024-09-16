import { NgModule } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { HomeComponent } from './app/components/home/home.component';
import { LoginComponent } from './app/components/login/login.component';
import { SignupComponent } from './app/components/signup/signup.component';
import { DoctorsComponent } from './app/components/doctors/doctors.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    DoctorsComponent,
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes), ReactiveFormsModule],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
})
export class AppModule {}
