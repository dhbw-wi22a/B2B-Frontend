import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {} 

  ngOnInit(): void {
    this.loadCart();  
  }

  // Warenkorb aus localStorage laden
  loadCart(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart.items = JSON.parse(cartData);
      this.cart.items.forEach(item => {
        if (!item.quantity) {
          item.quantity = 1;  
        }
      });
      this.aggregateCartItems();
      console.log('Warenkorb geladen:', this.uniqueCartItems);  
    } else {
      console.log('Kein Warenkorb gefunden');
    }
  }

  // Produkte mit derselben ItemID zusammenfassen
  aggregateCartItems(): void {
    const itemMap = new Map<number, Product>();
  
    this.cart.items.forEach(product => {
      if (itemMap.has(product.item_id)) {
        const existingProduct = itemMap.get(product.item_id);
        if (existingProduct) {
          existingProduct.quantity += product.quantity;
        }
      } else {
        itemMap.set(product.item_id, { ...product });
      }
    });
  
    this.uniqueCartItems = Array.from(itemMap.values());
  }

  // Überprüfung, ob der Warenkorb leer ist
  isCartEmpty(): boolean {
    return this.uniqueCartItems.length === 0;
  }
  
  // Berechnung der Gesamtanzahl der Artikel im Warenkorb
  getTotalItems(): number {
    return this.uniqueCartItems.reduce((total, product) => total + (product.quantity || 1), 0);
  }

  // Berechnung des Gesamtpreises für ein einzelnes Produkt
  getTotalPrice(product: Product): string {
    return ((product.quantity || 1) * parseFloat(product.item_price)).toFixed(2);
  }

  // Entfernen eines Produkts aus dem Warenkorb
  removeFromCart(itemId: number): void {
    this.uniqueCartItems = this.uniqueCartItems.filter(item => item.item_id !== itemId);
    this.updateCart();  // Warenkorb nach Änderung aktualisieren
  }

  // Warenkorb leeren
  clearCart(): void {
    this.uniqueCartItems = [];
    this.updateCart();  // Warenkorb nach dem Leeren aktualisieren
  }

  // Warenkorb im localStorage speichern
  updateCart(): void {
    this.cart.items = this.uniqueCartItems; 
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // trackBy Funktion zur Optimierung der Rendering-Leistung
  trackByItemId(index: number, post: Product): number {
    return post.item_id;
  }

  // Methode zum Navigieren zur Kundenseite
  navigateToCustomerPage(): void {
    this.router.navigate(['/customer-check']);
  }
}
