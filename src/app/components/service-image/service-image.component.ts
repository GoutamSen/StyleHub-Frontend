import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

export interface ServiceImage {
  id: number;
  imageUrl: string;
  styleName: string;
  price: number;
  description: string;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}


@Component({
  selector: 'app-service-image',
  templateUrl: './service-image.component.html',
  styleUrls: ['./service-image.component.css'],
})
export class ServiceImageComponent {

  serviceType!: string;
  serviceImages: ServiceImage[] = [];
  baseUrl = "https://stylehub-1-degl.onrender.com/api/service/images";

  constructor(
    public cartService: CartService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.serviceType = params.get('type') || '';
      console.log("Service Type:", this.serviceType);
      this.http
        .get<ApiResponse<ServiceImage[]>>(
          `${this.baseUrl}/all/service/name?serviceName=${this.serviceType}`
        )
        .subscribe({
          next: (res) => {
            this.serviceImages = res.data;
          },
          error: () => {
            console.error("❌ Failed to fetch service images");
          }
        });
    });
  }

  addToCart(img: ServiceImage) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      this.router.navigate(['login']);
      return;
    }

    // Check if service of same type already exists
    const alreadySelected = this.cartService.getCart().find(i => i.styleName === img.styleName);
    if (alreadySelected) {
      alert(`You already added "${img.styleName}". Remove it first if you want to change.`);
      return;
    }

    this.cartService.addToCart(img);
  }

  removeFromCart(img: ServiceImage) {
    this.cartService.removeFromCart(img.id);
  }

  getTotal() {
    return this.cartService.getCart().reduce((sum, item) => sum + item.price, 0);
  }

  bookAppointment() {
    if (this.cartService.getCart().length === 0) {
      alert("Your cart is empty!");
      return;
    }
    this.router.navigate(['bookingappointment']);
  }

   isInCart(img: ServiceImage): boolean {
    return !!this.cartService.getCart().find(si => si.id === img.id);
  }

}

