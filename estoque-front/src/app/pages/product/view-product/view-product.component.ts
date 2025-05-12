import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Product } from '../../../shared/models/product';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'app-view-product',
  imports: [MatDialogModule, MatIcon, MatButtonModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<ViewProductComponent>,
    public utilsService: UtilsService,
  ) {}

  product: Product | null = null;

  ngOnInit(): void {
    this.initiateData();
  }

  initiateData(): void {
    this.product = this.data.product ?? null;
  }
}
