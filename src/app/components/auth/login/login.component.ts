import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

interface ApiResponse<T> {
  token: string;
  message: string;
  role: string;
  email : string;
}

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient, private zone: NgZone) { }

  onLogin() {
    this.http.post<ApiResponse<any>>('https://stylehub-1-degl.onrender.com/auth/login', this.loginData).subscribe({
      next: (response) => {
        if (response.token) {
          // ✅ Save token in localStorage
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('email', this.loginData.email);

          this.successMessage = response.message || 'Login successful';
          this.errorMessage = '';

          // ✅ Navigate based on role
          if (response.role === "ADMIN") {
            this.router.navigate(['/admindashboard']);
          } else {
            this.router.navigate(['/userdashboard']);
          }

        } else {
          this.errorMessage = response.message || 'Login failed';
          this.successMessage = '';
        }
      },
      error: (err) => {
        console.error("Login error:", err);

        // ✅ Check status codes
        if (err.status === 403) {
          this.errorMessage = "User is blocked. Please contact admin.";
        } else if (err.status === 401) {
          this.errorMessage = "Invalid email or password.";
        } else {
          this.errorMessage = err.error?.message || "Login failed. Please try again.";
        }
        this.successMessage = '';
      }
    });
  }

  ngOnInit(): void {
    this.loginWithGoogle();
  }

  loginWithGoogle(): void {
    google.accounts.id.initialize({
      client_id: '573322799554-onuk5hovv6b5ksld3v4a3547hg7a6fk6.apps.googleusercontent.com',
      callback: (response: any) => this.handleLogin(response)
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  }

  handleLogin(response: any) {
    const token = response.credential;
    console.log("Google JWT Token:", token);

    // send token to backend for verification
    // send JWT to backend
    this.http.post<ApiResponse<any>>('https://stylehub-1-degl.onrender.com/auth/google', { token: response.credential })
      .subscribe({
        next: (res) => {
          console.log('Google Login success', res);

          // Save token from backend (your generated JWT)
          localStorage.setItem("authToken", res.token);
          localStorage.setItem("email", res.email);

          this.zone.run(() => this.router.navigate(['/userdashboard']));
        },
        error: (err) => console.error('Google Login failed', err)
      });

  }

}
