import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedOrderDetails = localStorage.getItem('orderDetails');
    if (storedOrderDetails) {
      try {
        const parsedOrderDetails = JSON.parse(storedOrderDetails);
        if (parsedOrderDetails && parsedOrderDetails.order_info) {
          this.orderDetails = parsedOrderDetails;
        } else {
          console.error('Order details have an unexpected structure:', parsedOrderDetails);
        }
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
  }
  

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
