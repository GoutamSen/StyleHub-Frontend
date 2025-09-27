import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent {


     
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  private baseUrl = 'https://stylehub-1-degl.onrender.com/auth';  // ✅ matches backend

  constructor(private http: HttpClient, private router: Router) {}

  onResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match!";
      this.successMessage = '';
      return;
    }

    const payload = {
      email: localStorage.getItem("email"),
      newPassword: this.newPassword
    };
    console.log(payload.email);
    console.log(payload.newPassword);
    
    this.http.post(`${this.baseUrl}/reset-password`, payload).subscribe({
      next: (response: any) => {
        console.log(response);
        this.successMessage = response.message || "Password reset successfully!";
        this.errorMessage = '';

        // ✅ Navigate to login page after reset
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || "Failed to reset password.";
        this.successMessage = '';
      }
    });
  }
}
