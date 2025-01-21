import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';

interface Image {
  image_id: number;
  image: string;
}

interface ItemDetails {
  item_details_id: number;
  item_name: string;
  item_description: string;
  images: Image[];
}

interface Product {
  item_id: number;
  item_price: string;
  item_details: ItemDetails;
  quantity: number;
}

interface Cart {
  cart_id: number;
  items: Product[];
}

@Component({
  selector: 'an-shopping-cart',
  standalone: true,
  imports: [NgFor, FormsModule, RouterModule, NgIf],  
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart: Cart = { cart_id: 0, items: [] };
  uniqueCartItems: Product[] = [];

  constructor(private readonly router: Router, private darkModeService: DarkModeService) {}  

  ngOnInit(): void {
    this.loadCart();  
    const isDarkModeEnabled = this.darkModeService.isDarkModeEnabled();
    if (isDarkModeEnabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    console.log('Dark Mode Status:', isDarkModeEnabled);
  }

  get totalItems(): number {
    return this.uniqueCartItems.reduce((total, product) => total + (product.quantity || 1), 0);
  }

  get totalPrice(): string {
    return this.uniqueCartItems.reduce((total, product) => total + (product.quantity || 1) * parseFloat(product.item_price), 0).toFixed(2);
  }

  loadCart(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart.items = JSON.parse(cartData);
      this.cart.items.forEach(item => item.quantity = item.quantity || 1);
      this.aggregateCartItems();
      console.log('Warenkorb geladen:', this.uniqueCartItems);  
    } else {
      console.log('Kein Warenkorb gefunden');
    }
  }

  
  aggregateCartItems(): void {
    const itemMap = new Map<number, Product>();
  
    this.cart.items.forEach(product => {
      const existingProduct = itemMap.get(product.item_id);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        itemMap.set(product.item_id, { ...product });
      }
    });
  
    this.uniqueCartItems = Array.from(itemMap.values());
  }

  
  isCartEmpty(): boolean {
    return this.uniqueCartItems.length === 0;
  }
  
  getTotalItems(): number {
    return this.uniqueCartItems.reduce((total, product) => total + (product.quantity || 1), 0);
  }

  getTotalPrice(product: Product): string {
    return ((product.quantity || 1) * parseFloat(product.item_price)).toFixed(2);
  }

  removeFromCart(itemId: number): void {
    this.uniqueCartItems = this.uniqueCartItems.filter(item => item.item_id !== itemId);
    this.updateCart(); 
  }

  clearCart(): void {
    this.uniqueCartItems = [];
    this.updateCart(); 
  }

  updateCart(): void {
    this.cart.items = this.uniqueCartItems; 
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  trackByItemId(index: number, post: Product): number {
    return post.item_id;
  }

  navigateToCustomerPage(): void {
    this.router.navigate(['/customer-check']);
  }

  sanitizeDescription(description: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = description;
    return tempElement.textContent || tempElement.innerText || '';
  }
}
