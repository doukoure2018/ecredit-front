import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RoleState } from '../../enum/rolestate.enum';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  @Input() user?: User;

  public readonly RoleState = RoleState;

  constructor(private userService: UserService, private router: Router) {}

  logOut(): void {
    this.userService.logOut();
    this.router.navigate(['/login']);
  }
}
