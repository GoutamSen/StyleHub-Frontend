import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';


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
  appointmentStatus: string;  // PENDING, CANCELLED, CONFIRMED, COMPLETED
  date?: string;
  time?: string;
  totalAmount: Number;
  paymentStatus: string;
  serviceImages: ServiceImages[];
  user : User;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ServiceImages {
  id: number;
  styleName : string;
  imageUrl : string;
  price: number;
}


@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent {

  todayRevenue: Number = 0;
  weekRevenue: Number = 0;
  monthRevenue: Number = 0;
  yearRevenue: Number = 0;

  appointments: Appointment[] = [];
  user? : User;
  private baseUrl = "https://stylehub-1-degl.onrender.com/admin";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.totalRevenueByDay();
    this.totalRevenueByWeek();
    this.totalRevenueByMonth();
    this.totalRevenueByYear();
    this.totalAppointment();
  }

  private getHeaders() {
    const token = localStorage.getItem("authToken");
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  totalRevenueByDay() {
    this.http.get<ApiResponse<Number>>(`${this.baseUrl}/revenue?filter=day`, { headers: this.getHeaders() }).subscribe({
      next: (res) => this.todayRevenue = res.data,
      error: () => console.error("Not Fetch Today Revenue")
    });
  }

  totalRevenueByWeek() {
    this.http.get<ApiResponse<Number>>(`${this.baseUrl}/revenue?filter=week`, { headers: this.getHeaders() }).subscribe({
      next: (res) => this.weekRevenue = res.data,
      error: () => console.error("Not Fetch Week Revenue")
    });
  }

  totalRevenueByMonth() {
    this.http.get<ApiResponse<Number>>(`${this.baseUrl}/revenue?filter=month`, { headers: this.getHeaders() }).subscribe({
      next: (res) => this.monthRevenue = res.data,
      error: () => console.error("Not Fetch Month Revenue")
    });
  }

  totalRevenueByYear() {
    this.http.get<ApiResponse<Number>>(`${this.baseUrl}/revenue?filter=year`, { headers: this.getHeaders() }).subscribe({
      next: (res) => this.yearRevenue = res.data,
      error: () => console.error("Not Fetch Year Revenue")
    });
  }

  
 totalAppointment() {
  const token = localStorage.getItem("authToken");
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get<ApiResponse<Appointment[]>>(`${this.baseUrl}/appointments`, { headers }).subscribe({
    next: (res) => {
      this.appointments=res.data;
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
    error: () => console.error("Not Fetch All Appointments")
  });
}

}
