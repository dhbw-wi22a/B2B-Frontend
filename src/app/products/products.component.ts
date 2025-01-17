import { Component, OnInit, OnDestroy, Renderer2, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { environment } from '../../environments/environment';
import { interval, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

interface Image {
  image_id: number;
  image: string;
}

interface ItemDetails {
  item_details_id: number;
  item_name: string;
  item_description: string;
  images: Image[];
  categories: number[];
}

interface Product {
  item_id: number;
  item_price: string;
  item_details: ItemDetails;
  item_stock: number;
  article_id: string;
  quantity: number;
}

@Component({
  selector: 'an-products',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productForm: FormGroup;
  currentImages: { [key: number]: string } = {};
  private intervalSubscription?: Subscription;
  private routerSubscription?: Subscription;
  selectedProduct: Product | null = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.productForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.fetchProducts();
      }
    });
  }

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  fetchProducts(): void {
    const apiUrl = environment.apiUrl;
    this.http.get<Product[]>(`${apiUrl}/items/?format=json`).pipe(
      catchError((error) => {
        console.error('Fehler beim Laden der Produkte:', error);
        throw error;
      })
    ).subscribe(
      (data) => {
        this.products = data;
        console.log('Produkte geladen:', this.products);
        this.initializeFormAndImages();
        this.cdr.detectChanges();
        this.startImageRotation();
      }
    );
  }

  initializeFormAndImages(): void {
    this.products.forEach(product => {
      if (product.item_details.images.length > 0) {
        this.currentImages[product.item_id] = product.item_details.images[0].image;
      }
      this.productForm.addControl(`quantity-${product.item_id}`, this.fb.control(1));
    });
  }

  startImageRotation(): void {
    this.intervalSubscription = interval(10000).subscribe(() => {
      this.products.forEach(product => {
        const images = product.item_details.images;
        const currentImage = this.currentImages[product.item_id];
        const currentIndex = images.findIndex(img => img.image === currentImage);
        const nextIndex = (currentIndex + 1) % images.length;
        this.currentImages[product.item_id] = images[nextIndex].image;
      });
    });
  }

  openModal(product: Product): void {
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  addToCart(itemId: number): void {
    const product = this.products.find(p => p.item_id === itemId);
    const quantityControl = this.productForm.get(`quantity-${itemId}`);
    const quantity = quantityControl ? quantityControl.value : 1;

    if (product) {
      if (quantity > product.item_stock) {
        this.showPopupMessage('Nicht genügend Lagerbestand verfügbar.', true);
        return;
      }

      let cart: Product[] = [];
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        try {
          cart = JSON.parse(cartData) as Product[];
          if (!Array.isArray(cart)) {
            cart = [];
          }
        } catch (error) {
          console.error('Fehler beim Parsen des Warenkorbs:', error);
        }
      }

      const existingProduct = cart.find(p => p.item_id === product.item_id);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Produkt zum Warenkorb hinzugefügt:', { ...product, quantity });
      this.showPopupMessage('Erfolgreich zum Warenkorb hinzugefügt!');
    }
  }

  showPopupMessage(message: string, isError: boolean = false): void {
    const popup = this.renderer.createElement('div');
    const text = this.renderer.createText(message);

    this.renderer.appendChild(popup, text);
    this.renderer.addClass(popup, 'popup');
    this.renderer.setStyle(popup, 'background-color', isError ? 'rgb(213, 27, 21)' : '#4caf50');
    this.renderer.appendChild(document.body, popup);

    setTimeout(() => {
      this.renderer.removeChild(document.body, popup);
    }, 2000);
  }

  trackByItemId(index: number, post: Product): number {
    return post.item_id;
  }
}
