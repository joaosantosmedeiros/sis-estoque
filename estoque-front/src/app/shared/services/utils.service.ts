import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private dialog: MatDialog) {}

  onError(message: string) {
    return this.dialog.open(ErrorDialogComponent, {
      data: message,
    });
  }

  openDialog({
    component,
    data,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  }: {
    component: ComponentType<any>;
    data: any;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    disableClose?: boolean;
  }): Promise<any> {
    const dialogRef = this.dialog.open(component, {
      data: data,
      minWidth: minWidth,
      minHeight: minHeight,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }
}
