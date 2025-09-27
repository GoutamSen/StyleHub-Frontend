import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

export interface User {
  username: string,
  email: string,
  role: string,
  status: string
}

export interface UpdateStatusRequest {
  email: string;
  newStatus: string;
}

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent {

  activeUsers: number = 0;
  numberOfAdmins: number = 0;
  role: string = "ADMIN";
  status: string = "ACTIVE";
  searchValue: string = "";

  users: User[] = [];
  selectRole: string = "USER";
  selectedRole: string = "USER";
  private baseUrl = "https://stylehub-1-degl.onrender.com/admin";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getNumberOfAdmins();
    this.getActiveUsers();
    this.getAllUsers();
    console.log("get Users ->" + this.users);
  }

  onRoleChange() {
    console.log("Selected Role:", this.selectedRole);
  }


  getActiveUsers() {
    const token = localStorage.getItem("authToken");
    this.http.get<ApiResponse<number>>(
      `${this.baseUrl}/users/count/active?status=${this.status}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (res) => {
        this.activeUsers = res.data; // ✅ strongly typed
      },
      error: (err) => {
        console.error("error fetching admins:", err);
      }
    });
  }

  getNumberOfAdmins() {
    const token = localStorage.getItem("authToken");
    this.http.get<ApiResponse<number>>(
      `${this.baseUrl}/count?role=${this.role}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (res) => {
        this.numberOfAdmins = res.data; // ✅ strongly typed
      },
      error: (err) => {
        console.error("error fetching admins:", err);
      }
    });
  }

  getAllUsers() {
    console.log("start get all users ");
    const token = localStorage.getItem("authToken");
    this.http.get<ApiResponse<User[]>>(
      `${this.baseUrl}/users/list?role=${this.selectRole}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (res) => {
        this.users = res.data; // ✅ only data array
      },
      error: (err) => {
        console.error("error fetching users:", err);
      }
    });
  }


  // manage-user.component.ts
  getInitials(username: string): string {
    if (!username) return '';
    const parts = username.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase(); // e.g. Ritik Sen -> RS
    }
    return username.substring(0, 2).toUpperCase(); // e.g. ritiksen -> RI
  }

  toggleStatus(user: User) {
    const token = localStorage.getItem("authToken");
    const newStatus = user.status == "BLOCK" ? "INACTIVE" : "BLOCK";
    const request: UpdateStatusRequest = {
      email: user.email,
      newStatus: newStatus
    };
    console.log("call toggle status");
    console.log("newStatus : " + user.status);
    this.http.put<ApiResponse<string>>(`${this.baseUrl}/user/status`, request,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (res) => {
        user.status = newStatus;
      }
    })
  }

  findUser() {
    const token = localStorage.getItem("authToken");
    if (!this.searchValue) {
      console.log("Search is empty");
      return;
    }
    this.http.get<ApiResponse<User>>(
      `${this.baseUrl}/user?UsernameOrEmail=${this.searchValue}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (res) => {
        // Replace users list with just this one user
        this.users = [res.data];
      },
      error: (err) => {
        console.error("Error finding user:", err);
      }
    });
  }


}
