
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loadingStateChanged = new Subject<boolean>();
  constructor(
    private snackBar: MatSnackBar,
  ) { }

  showSnackBar(
    message: string,
    className: string = null,
    action: string = null,
    duration: number = 2000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'right'
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      panelClass: [className]
    });
  }

}
