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
import { NavbarComponent } from './app/components/nav-menu/nav-menu.component';
import { AppointmentCardComponent } from './app/components/appointment-card/appointment-card.component';
import { PrescriptionCardComponent } from './app/components/prescription-card/prescription-card.component';
import { PrescriptionModalComponent } from './app/components/prescription-modal/prescription-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    DoctorsComponent,
    NavbarComponent,
    AppointmentCardComponent,
    PrescriptionCardComponent,
    PrescriptionModalComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
})
export class AppModule {}
