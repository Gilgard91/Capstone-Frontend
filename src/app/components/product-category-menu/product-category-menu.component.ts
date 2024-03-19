import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from 'src/app/interfaces/product';

import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.scss'],
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategories: CategoryResponse[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.listProductCategories();
    console.log(this.productCategories);
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe({
      next: (res) => {
        this.productCategories = res;
        console.log('categories: ', res);
      },
    });
  }
}
