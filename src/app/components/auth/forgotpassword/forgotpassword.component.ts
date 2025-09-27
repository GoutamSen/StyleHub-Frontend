import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {

  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  private baseUrl = 'https://stylehub-1-degl.onrender.com/auth';  // ✅ fixed

  constructor(private router: Router, private http: HttpClient) {}

  onGenerateOtp() {
    console.log("start");
    console.log(this.email);

    // ✅ send JSON object instead of raw string
    this.http.post(`${this.baseUrl}/generate-otp`, { email: this.email }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.successMessage = response.message; // ✅ "OTP sent successfully!"
        this.errorMessage = '';
        localStorage.setItem("email",this.email);
        // ✅ Navigate to OTP verification page
        this.router.navigate(['/generateotp']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.successMessage = '';
      }
    });
  }
}
