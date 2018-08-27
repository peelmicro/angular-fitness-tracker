import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sidenavClose = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(
      authStatus => this.isAuth = authStatus
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  OnClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.OnClose();
    this.authService.logout();
  }
}
