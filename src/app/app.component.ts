import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private auth: AuthService) {
    //   this.auth.login({
    //     username: 'admin',
    //     password: 'admin',
    //   });
    this.auth.logout();
  }
  title = 'medixcure';
}
