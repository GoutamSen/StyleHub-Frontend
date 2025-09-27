import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {

  private baseUrl = "https://stylehub-1-degl.onrender.com/auth";
  constructor(private router: Router, private http: HttpClient) { }

  logout() {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("email");
    console.log("start login method");
    console.log("token ->"+token);
    console.log("email ->"+email)
    this.http.post(
      `${this.baseUrl}/logout?email=${email}`,
      {}, // empty body
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (res) => {
        console.log('✅ Logout success:', res);
        // clear storage only if backend confirmed logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("email");
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('❌ Logout failed:', err);
      }
    });
  }

}
