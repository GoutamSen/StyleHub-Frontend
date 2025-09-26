import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

   private baseUrl = "http://localhost:8080/appointments";

   constructor(private http : HttpClient){}

  getAppointment(id: number) {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}
}
