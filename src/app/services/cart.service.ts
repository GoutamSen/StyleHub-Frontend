import { Injectable } from '@angular/core';
import { ServiceImage } from '../components/service-image/service-image.component';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private selectedImages: ServiceImage[] = [];

  constructor() { }

  getCart() {
    return this.selectedImages;
  }

  addToCart(img: ServiceImage) {
    console.log("Add to cart:", img);

    // ❌ Prevent duplicates (only one style of each service allowed)
    const alreadySelected = this.selectedImages.find(si => si.styleName === img.styleName);
    if (alreadySelected) {
      return false; // indicates duplicate
    }

    this.selectedImages.push(img);
    return true;
  }

  removeFromCart(imgId: number) {
    this.selectedImages = this.selectedImages.filter(si => si.id !== imgId);
  }

  clearCart() {
    this.selectedImages = [];
  }
}
