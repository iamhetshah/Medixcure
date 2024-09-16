import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../constants';
import { MedicinesResponse } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private auth: AuthService, private http: HttpClient) {}
  title = 'medixcure';
}
