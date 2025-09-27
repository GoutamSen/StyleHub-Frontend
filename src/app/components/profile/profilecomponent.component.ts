import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: number;
  address: string;
  image?: string; // optional, safe against missing field
}

export interface UploadImageRequest {
  email: string;
  imageUrl: string;
}

@Component({
  selector: 'app-profilecomponent',
  templateUrl: './profilecomponent.component.html',
  styleUrls: ['./profilecomponent.component.css']
})
export class ProfilecomponentComponent {
  private baseUrl = "https://stylehub-1-degl.onrender.com/user";
  user?: User;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("authToken");
    if (!email || !token) {
      console.warn("⚠️ Email or token missing in localStorage.");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<ApiResponse<User>>(`${this.baseUrl}?email=${email}`, { headers }).subscribe({
      next: (res) => {
        this.user = res.data;
        this.imagePreview = this.user.image || null;
        console.log("✅ User fetched successfully:", this.user);
      },
      error: (error) => {
        console.error("❌ Failed to fetch user", error);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = e => this.imagePreview = reader.result;
    reader.readAsDataURL(this.selectedFile);

    // Upload to Cloudinary
    this.uploadToCloudinary(this.selectedFile);
  }

  uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'PROFILE_IMAGES'); // replace with your Cloudinary preset
    formData.append('folder', `users/${this.user?.id || 'unknown'}`);

    fetch('https://api.cloudinary.com/v1_1/di984y22a/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          console.log("✅ Cloudinary upload success:", data.secure_url);

          const uploadRequest: UploadImageRequest = {
            email: this.user?.email || '',
            imageUrl: data.secure_url
          };

          this.updateUserProfileImage(uploadRequest);
        } else {
          console.error("❌ Cloudinary did not return a secure_url", data);
        }
      })
      .catch(err => console.error('❌ Cloudinary upload failed:', err));
  }

  updateUserProfileImage(uploadRequest: UploadImageRequest) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("⚠️ Missing authToken");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put<ApiResponse<User>>(`${this.baseUrl}/upload/image`, uploadRequest, { headers })
      .subscribe({
        next: (res) => {
          console.log('✅ Profile image updated:', res);
          if (this.user) {
            this.user.image = res.data.image;
          }
        },
        error: (err) => {
          console.error('❌ Failed to update profile image in backend:', err);
        }
      });
  }

  getImage(): string {
    return this.user?.image || 'assets/DemoProfile.webp';
  }
}
