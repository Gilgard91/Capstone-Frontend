import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductResponse } from 'src/app/interfaces/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from 'src/app/interfaces/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getSingleProduct(productId).subscribe({
      next: (res: any) => {
        this.product = res;
        console.log('product: ', res);
      },
    });
  }

  addToCart() {
    console.log(
      `Adding to cart: ${this.product?.name}, ${this.product?.unitPrice}`
    );
    const theCartItem = new CartItem(this.product!);
    this.cartService.addToCart(theCartItem);
  }
}
