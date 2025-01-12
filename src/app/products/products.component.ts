import { Component, OnInit, OnDestroy, Renderer2, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { environment } from '../../../src/enviroments/environment';
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
}

interface Product {
  item_id: number;
  item_price: string;
  item_details: ItemDetails;
  quantity: number; // Menge des Produkts hinzufügen
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
  selectedProduct: Product | null = null; // Hinzugefügt für Modal-Funktion

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

    // Router-Ereignis überwachen und Produkte neu laden
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.fetchProducts();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Methode zur Datenabfrage
  fetchProducts(): void {
    const apiUrl = environment.apiUrl;
    this.http.get<Product[]>(`${apiUrl}/items/?format=json`).pipe(
      catchError((error) => {
        console.error('Fehler beim Laden der Produkte:', error);
        throw error; // Fehler weiterwerfen
      })
    ).subscribe(
      (data) => {
        this.products = data;
        console.log('Produkte geladen:', this.products);

        this.products.forEach(product => {
          if (product.item_details.images.length > 0) {
            this.currentImages[product.item_id] = product.item_details.images[0].image;
          }
          this.productForm.addControl(`quantity-${product.item_id}`, this.fb.control(1));
        });

        this.cdr.detectChanges(); // Manuelle Veränderungserkennung auslösen
        this.startImageRotation();
      }
    );
  }

  // Methode zum Starten des Bildwechsel-Intervalls
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

  // Methode zum Öffnen des Modals
  openModal(product: Product): void {
    this.selectedProduct = product;
  }

  // Methode zum Schließen des Modals
  closeModal(): void {
    this.selectedProduct = null;
  }

  // Methode zum Hinzufügen eines Produkts zum Warenkorb (localStorage)
  addToCart(itemId: number): void {
    const product = this.products.find(p => p.item_id === itemId);
    const quantityControl = this.productForm.get(`quantity-${itemId}`);
    const quantity = quantityControl ? quantityControl.value : 1;

    if (product) {
      if (!quantity || quantity <= 0) {
        alert("Bitte eine gültige Anzahl eingeben.");
        return;
      }

      let cart: Product[] = [];
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        try {
          cart = JSON.parse(cartData);
          if (!Array.isArray(cart)) {
            cart = [];
          }
        } catch (error) {
          console.error('Fehler beim Parsen des Warenkorbs:', error);
        }
      }

      // Prüfen, ob das Produkt bereits im Warenkorb ist
      const existingProduct = cart.find(p => p.item_id === product.item_id);

      if (existingProduct) {
        // Wenn das Produkt bereits im Warenkorb ist, die Menge erhöhen
        existingProduct.quantity += quantity;
      } else {
        // Neues Produkt zum Warenkorb hinzufügen
        cart.push({ ...product, quantity });
      }

      // Speichere den aktualisierten Warenkorb wieder im localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      console.log('Produkt zum Warenkorb hinzugefügt:', { ...product, quantity });
      
      // Pop-up-Fenster anzeigen
      this.showPopupMessage('Erfolgreich zum Warenkorb hinzugefügt!');
    }
  }

  // Methode zum Anzeigen des Pop-up-Fensters
  showPopupMessage(message: string): void {
    const popup = this.renderer.createElement('div');
    const text = this.renderer.createText(message);
    
    this.renderer.appendChild(popup, text);
    this.renderer.addClass(popup, 'popup');
    this.renderer.appendChild(document.body, popup);

    setTimeout(() => {
      this.renderer.removeChild(document.body, popup);
    }, 2000); 
  }

  // trackBy Funktion zur Optimierung der Rendering-Leistung
  trackByItemId(index: number, post: Product): number {
    return post.item_id;
  }
}
