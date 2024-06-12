import { Component, Input } from '@angular/core';
import { User } from '../../../models/users';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss',
})
export class AddUserModalComponent {
  // @Input() public showUser: (user: User | null) => void;
}
