import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm : FormGroup;
  successMessage: string = '';
  errorMessage : string = '';

  constructor(private fb : FormBuilder,private http : HttpClient,private router : Router){
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      address : ['',Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;

      this.http.post<ApiResponse<void>>('https://stylehub-1-degl.onrender.com/auth/signup', userData)
        .subscribe({
          next: (response) => {
            this.successMessage = response.message;
            this.signupForm.reset();
            
            // Navigate to login page after signup
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Signup error:', err);
            // Try to extract message from error response
            this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
          }
        });
    } else {
      alert('Please fill all required fields');
    }
  }
}
