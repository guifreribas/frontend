import { Component, OnInit, inject, signal } from '@angular/core';
import {
  GenderTypes,
  User,
  UserActionForm,
  UserResponse,
} from '../../models/users';
import { UsersService } from '../../services/users.service';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Toast } from 'bootstrap';
import { ExportToCsvService } from '../../services/export-to-csv.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private exportToCsvService = inject(ExportToCsvService);
  public userService = inject(UsersService);
  public usersResponse = signal<UserResponse | null>(null);
  public users = signal<User[]>([]);
  public user = signal<User | null>(null);
  public isUserAdded = signal<boolean>(false);
  public isUserEdited = signal<boolean>(false);
  public action = signal<UserActionForm>(null);
  public isSubmitted: boolean = false;
  public userForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    lastname: new FormControl<string>('', [Validators.required]),
    age: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^(?:[1-9]|[1-9][0-9]|1[0-9]{2}|200)$/),
    ]),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(
        /^(?:\+34\s?[6789]\d{8}|[6789]\d{8}|\+\d{1,3}\s?\d{4,14})$/
      ),
    ]),
    email: new FormControl<string>('', [Validators.required]),
    gender: new FormControl<GenderTypes>(null, []),
  });

  constructor() {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.usersResponse.set(res);
        this.users.set(res.users);
      },
      error: (err) => console.log(err),
    });
  }

  onDelete(event: Event, id: string) {
    event.stopPropagation();
    this.users.update((prevUsers) =>
      prevUsers.filter((user) => user._id !== id)
    );
    this.userService.deleteUser(id).subscribe({
      next: (res) => {
        alert('User deleted successfully');
        console.log(res);
      },
      error: (err) => {
        alert('Error deleting user');
        console.log(err);
      },
    });
  }

  onAddUser(e: Event) {
    e.preventDefault();
    this.isSubmitted = true;
    if (this.userForm.invalid) return;
    console.log('add!');
    this.userService.addUser(this.formDataValue).subscribe({
      next: (res) => {
        this.users.update((prevUsers) => [...prevUsers, res.user]);
        this.userForm.reset();
        this.isUserAdded.set(true);
        this.isSubmitted = false;
        setTimeout(() => {
          this.isUserAdded.set(false);
        }, 2000);
      },
      error: (err) => console.log(err),
    });
  }

  onEditUser() {
    this.isSubmitted = true;
    if (this.userForm.invalid) return;
    const userId = this.user()?._id || '';
    this.userService.updateUser(this.formDataValue, userId).subscribe({
      next: (res) => {
        this.users.update((prevUsers) => {
          return prevUsers.map((user) => {
            return user._id === res.user._id ? res.user : user;
          });
        });
        this.isUserEdited.set(true);
        setTimeout(() => {
          this.isUserEdited.set(false);
        }, 2000);
      },
      error: (err) => console.log(err),
    });
  }

  onEdit(event: Event, user: User) {
    event.stopPropagation();
    this.action.set('EDIT');
    this.user.set(user);
    this.userForm.setValue({
      name: user.name,
      lastname: user.lastname,
      age: user.age,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
    });
  }

  onClose(event: Event) {
    this.onShowUser(event, null);
    this.userForm.reset();
    this.isSubmitted = false;
  }

  onShowUser(event: Event, user: User | null) {
    return;
    event.stopPropagation();
    this.user.set(user);
  }

  resetUserForm() {
    this.userForm.reset();
  }

  get name() {
    return this.userForm.controls.name;
  }
  get lastname() {
    return this.userForm.controls.lastname;
  }
  get age() {
    return this.userForm.controls.age;
  }
  get phone() {
    return this.userForm.controls.phone;
  }
  get email() {
    return this.userForm.controls.email;
  }
  get gender() {
    return this.userForm.controls.gender;
  }

  get isNameInvalid() {
    return (
      this.name.hasError('required') && (this.name.touched || this.isSubmitted)
    );
  }
  get isLastnameInvalid() {
    return (
      this.lastname.hasError('required') &&
      (this.lastname.touched || this.isSubmitted)
    );
  }
  get isAgeInvalid() {
    return (
      this.age.hasError('required') && (this.age.touched || this.isSubmitted)
    );
  }
  get isPhoneInvalid() {
    return (
      (this.phone.hasError('required') || this.phone.hasError('pattern')) &&
      (this.phone.touched || this.isSubmitted)
    );
  }
  get isEmailInvalid() {
    return (
      (this.email.hasError('required') || this.email.hasError('pattern')) &&
      (this.email.touched || this.isSubmitted)
    );
  }

  get formDataValue() {
    return {
      name: this.name.value || '',
      lastname: this.lastname.value || '',
      age: this.age.value || 0,
      phone: this.phone.value || '',
      email: this.email.value || '',
      gender: this.gender.value || null,
    };
  }

  exportData() {
    this.exportToCsvService.exportToCsv(this.users(), 'users.csv');
  }
}
