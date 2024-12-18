import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-menuda',
  templateUrl: './menuda.component.html',
  styleUrl: './menuda.component.css',
})
export class MenudaComponent {
  @Input() user?: User;
}
