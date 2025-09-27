import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

export interface ServiceImages {
  id: number;
  styleName : string;
  imageUrl : string;
  price: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
}

export interface Appointment {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  appointmentStatus: string;
  serviceImages : ServiceImages[];
  user: User;
}

@Component({
  selector: 'app-appointmentlist',
  templateUrl: './appointmentlist.component.html',
  styleUrls: ['./appointmentlist.component.css']
})
export class AppointmentlistComponent {


  appointments: Appointment[] = [];
  userEmail: string = "";
  user!: User;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const email = localStorage.getItem("email");
    console.log("ngoninit method");
    console.log(email);
    if (email) {
      this.userEmail = email;
      this.loadAppointments();
    } else {
      console.warn("No email found in localStorage!");
    }
  }
  loadAppointments() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No token found. Please log in first.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    console.log("Loading appointments for email:", this.userEmail);

    this.http.get<ApiResponse<Appointment[]>>(
      `https://stylehub-1-degl.onrender.com/user/appointments?email=${this.userEmail}`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.appointments = res.data;
        this.user = res.data[0].user;
        
        this.appointments.forEach(appt => {
          if (appt.serviceImages && appt.serviceImages.length > 0) {
            appt.serviceImages.forEach(serviceImages => {
              console.log(`   - ${serviceImages.styleName} : ₹${serviceImages.price}`);
            });
          } else {
            console.log("   No services booked for this appointment.");
          }
        });
      },
      error: (err) => console.error("Error fetching appointments", err),
    });

  }

}
