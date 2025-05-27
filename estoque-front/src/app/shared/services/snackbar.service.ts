import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarSuccessComponent } from '../components/snackbar-success/snackbar-success.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private readonly snackBar: MatSnackBar) {}

  open(message: string) {
    this.snackBar.openFromComponent(SnackbarSuccessComponent, {
      panelClass: ['custom-snackbar', 'snackbar-success'],
      data: message,
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
