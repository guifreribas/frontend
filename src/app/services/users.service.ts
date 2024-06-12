import { Injectable, inject, signal } from '@angular/core';
import {
  User,
  UserAddResponse,
  UserResponse,
  UserUpdateResponse,
} from '../models/users';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  public users = signal<User[]>([]);
  public user = signal<User | null>(null);

  getUsers() {
    return this.http.get<UserResponse>('http://localhost:4000/users');
  }
  addUser(user: Partial<User>): Observable<UserAddResponse> {
    return this.http.post<UserAddResponse>('http://localhost:4000/users', user);
  }
  updateUser(user: Partial<User>, userId: string) {
    console.log(user);
    return this.http.put<UserUpdateResponse>(
      `http://localhost:4000/users/${userId}`,
      user
    );
  }
  deleteUser(id: string) {
    return this.http.delete<User>('http://localhost:4000/users/' + id);
  }
  getUser(id: string) {
    return this.http.get<User>('http://localhost:4000/users/' + id);
  }

  getUserGender(user: User): String | null {
    if (user.gender === 'FEMALE') return 'Female';
    if (user.gender === 'MALE') return 'Male';
    if (user.gender === 'OTHER') return 'Other';
    return null;
  }
}
