import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://localhost:8080/api/payment';

  constructor(private http: HttpClient) {}

  createOrder(id: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/create-order`, { amount });
  }

  verifyPayment(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/verify`, data);
  }
}
