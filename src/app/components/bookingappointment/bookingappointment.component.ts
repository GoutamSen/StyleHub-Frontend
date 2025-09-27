import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';


interface BookAppointment {
  date: string;   // yyyy-MM-dd
  time: string;   // HH:mm:ss
  notes: string;
  services: { id: number }[];
}

@Component({
  selector: 'app-bookingappointment',
  templateUrl: './bookingappointment.component.html',
  styleUrls: ['./bookingappointment.component.css']
})
export class BookingappointmentComponent {

  selectedDate: string = '';
  selectedTime: string = '';
  notes: string = '';
  email : string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    public cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  bookAppointment() {
    if (!this.selectedDate || !this.selectedTime) {
      this.snackBar.open('⚠️ Please select date and time!', 'Close', { duration: 3000 });
      return;
    }

    const appointment = {
      date: this.selectedDate,
      time: this.selectedTime,
      notes: this.notes,
      serviceImageIds: this.cartService.getCart().map(si => si.id),
      email : localStorage.getItem("email")
    };

    this.isLoading = true;
    this.http.post("https://stylehub-1-degl.onrender.com/appointments/book", appointment).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.snackBar.open('✅ Appointment booked successfully!', 'Close', { duration: 3000 });
        this.cartService.clearCart();
        this.router.navigate(['/userdashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("❌ Booking failed:", err);
        this.snackBar.open('❌ Failed to book appointment. Try again.', 'Close', { duration: 3000 });
      }
    });
  }
  
}