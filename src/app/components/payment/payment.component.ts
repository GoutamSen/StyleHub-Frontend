import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PaymentService } from 'src/app/services/payment.service';
declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  
  appointmentId!: number;
  totalAmount = 2000;
  amountToPay = 0;

  constructor(
    private route: ActivatedRoute,
    private service: AppointmentService,
    private payment : PaymentService
  ) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.amountToPay = this.totalAmount;  // default full amount, you can apply your 30% / 100% logic
   
     this.service.getAppointment(this.appointmentId)
    .subscribe((res: any) => {
      if (res.status === 200 && res.data) {
        this.totalAmount = res.data.totalAmount;

        // Default logic: full payment
        this.amountToPay = this.totalAmount;
        
        // Optional: you can preset to 30% min
        // this.amountToPay = this.totalAmount * 0.3;
      }
    });
  
  }

  pay() {
    this.payment.createOrder(this.appointmentId, this.amountToPay)
      .subscribe((res: any) => {
        if (res.status === 200 && res.data) {
          const order = res.data;   // ✅ Extract order details from ApiResponse

          var options = {
            "key": "rzp_test_xxxxx",  // Replace with your Razorpay Key ID
            "amount": order.amount,
            "currency": order.currency,
            "name": "StyleHub Payment",
            "description": "Appointment ID: " + this.appointmentId,
            "order_id": order.id,
            "handler": (response: any) => {
              const verifyData = {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              };

              this.payment.verifyPayment(this.appointmentId, verifyData)
                .subscribe((verifyRes: any) => {
                  if (verifyRes.status === 200) {
                    alert("✅ " + verifyRes.message);
                  } else {
                    alert("❌ " + verifyRes.message);
                  }
                });
            },
            "prefill": {
              "name": "Patient Name", // optional
              "email": "patient@example.com", // optional
              "contact": "9999999999" // optional
            },
            "theme": {
              "color": "#3399cc"
            }
          };

          var rzp = new Razorpay(options);
          rzp.open();
        } else {
          alert("⚠️ Failed to create order: " + res.message);
        }
      });
  }
}
