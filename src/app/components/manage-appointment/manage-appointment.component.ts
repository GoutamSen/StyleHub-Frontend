import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

export interface Appointment {
  id: number;
  customerName: string;
  email: string;
  appointmentStatus: string;   // PENDING, CANCELLED, CONFIRMED, COMPLETED
  date?: string;               // LocalDate
  time?: string;               // LocalTime
  services: SaloonService[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface SaloonService {
  id: number;
  serviceName: string;
  price: number;
}

@Component({
  selector: 'app-manage-appointment',
  templateUrl: './manage-appointment.component.html',
  styleUrls: ['./manage-appointment.component.css']
})
export class ManageAppointmentComponent {

  appointments: Appointment[] = [];
  todayAppointmentCount = 0;
  weekAppointmentCount = 0;
  monthAppointmentCount = 0;
  yearAppointmentCount = 0;
  errorMessage: string = '';
  searchValueByEmailOrUsername: string = '';
  private baseUrl = 'https://stylehub-1-degl.onrender.com/admin/appointments';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAppointments();
  //  this.loadAppointmentCount("day");
    this.loadAppointmentCount("year");
  }

  
  loadAppointments(): void {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<ApiResponse<any[]>>(this.baseUrl, { headers })
      .subscribe({
        next: (res) => {
          // 🔹 Map backend response to match frontend Appointment interface
          console.log("Response ->" + res);
          this.appointments = res.data.map(a => ({
            id: a.id,      
            customerName: a.user?.username || 'N/A',
            email: a.user?.email || 'N/A',
            appointmentStatus: a.appointmentStatus,
            date: a.date,
            time: a.time,
            services: a.serviceImages.map((s: any) => ({
              id: s.id,
              serviceName: s.styleName,
              price: s.price
            }))
          }));
          console.log('Appointments:', this.appointments);
        },
        error: (err) => {
          console.error('Error fetching appointments:', err);
          this.errorMessage = err.error?.message || 'Failed to load appointments';
        }
      });
  }

  updateStatus(id: number, status: string): void {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const request = { id: id, newStatus: status }; // matches backend DTO

    this.http.put<ApiResponse<void>>(`${this.baseUrl}/status`, request, { headers })
      .subscribe({
        next: () => {
          const appointment = this.appointments.find(a => a.id === id);
          if (appointment) {
            appointment.appointmentStatus = status;
          }
          console.log(`Appointment ${id} updated to ${status}`);
        },
        error: (err) => {
          console.error('Error updating status', err);
        }
      });
  }

  searchAppointment(): void {
    console.log("SearchValueByEmailOrUsername ->" + this.searchValueByEmailOrUsername);
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/usernameoremail?usernameOrEmail=${this.searchValueByEmailOrUsername}`, 
      { headers }
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.appointments = res.data.map(a => ({
          id: a.id,
          customerName: a.user?.username || 'N/A',
          email: a.user?.email || 'N/A',
          appointmentStatus: a.appointmentStatus,
          date: a.date,
          time: a.time,
          services: a.serviceImages.map((s: any) => ({
            id: s.id,
            serviceName: s.styleName,
            price: s.price
          }))
        }));
      },
      error: (err) => {
        console.error('Error in searching appointment:', err);
      }
    });
  }

  loadAppointmentCount(filter: string): void {
  const token = localStorage.getItem("authToken");
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<ApiResponse<number>>(
    `http://localhost:8080/appointments/count?filter=${filter}`,
    { headers }
  ).subscribe({
    next: (res) => {
      const count = res.data;

      switch (filter) {
        case 'day':
          this.todayAppointmentCount = count;
          break;
        case 'week':
          this.weekAppointmentCount = count;
          break;
        case 'month':
          this.monthAppointmentCount = count;
          break;
        case 'year':
          this.yearAppointmentCount = count;
          break;
      }
    },
    error: (err) => {
      console.error(`Error fetching ${filter} appointment count:`, err);
    }
  });
}


  formatTime(timeString: string | undefined): string {
    if (!timeString) return '';
    const date = new Date(`1970-01-01T${timeString}`);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
 

}

