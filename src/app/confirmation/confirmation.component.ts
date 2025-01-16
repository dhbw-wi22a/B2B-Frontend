import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { DarkModeService } from '../services/dark-mode.service';

interface CartItem {
  item_id: number;
  item_name: string;
  quantity: number;
  item_price: number;
}

interface OrderInfo {
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_address: string;
}

interface OrderDetails {
  order_info: OrderInfo;
  items: CartItem[];
}

@Component({
  selector: 'app-confirmation',
  imports: [NgIf, NgFor],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  orderDetails: OrderDetails | null = null;

  constructor(private router: Router, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    const storedOrderDetails = localStorage.getItem('orderDetails');
    if (storedOrderDetails) {
      try {
        const parsedOrderDetails: OrderDetails = JSON.parse(storedOrderDetails);
        if (parsedOrderDetails?.order_info) {
          this.orderDetails = parsedOrderDetails;
        } else {
          console.error('Unerwartete Struktur der Bestelldetails:', parsedOrderDetails);
        }
      } catch (error) {
        console.error('Fehler beim Parsen der Bestelldetails:', error);
      }
    }

    if (this.darkModeService.isDarkModeEnabled()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
