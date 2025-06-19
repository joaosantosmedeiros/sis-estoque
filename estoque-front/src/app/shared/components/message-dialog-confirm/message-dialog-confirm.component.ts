import { Component, Inject, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-message-dialog-confirm',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogClose, MatDialogContent, MatDialogActions, MatDialogTitle],
  templateUrl: './message-dialog-confirm.component.html',
})
export class MessageDialogConfirmComponent {
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public msg: string) {}
}
