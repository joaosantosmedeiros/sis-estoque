import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink, NgIf, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    this.isLoggedIn$ = authService.isLoggedIn$;
  }
}
