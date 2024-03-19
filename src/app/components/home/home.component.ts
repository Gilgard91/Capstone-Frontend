import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/interfaces/cart-item';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
declare var $: any;
import 'node_modules/nivo-slider/jquery.nivo.slider.js';
declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  productsNewArrival: Product[] = [];
  productsTopSelling: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 10;

  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {}

  // initCarouselBanner() {
  //   $(document).ready(() => {
  //     $('.fade').slick({
  //       dots: false,
  //       infinite: false,
  //       speed: 500,
  //       fade: true,
  //       rows: 1,
  //       cssEase: 'linear',
  //     });
  //   });
  // }

  initCarouselBanner() {
    $('.slick-carousel').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 1500,
      infinite: true,
      fade: true,
      rows: 1,
      arrows: false,
      speed: 1250,
    });
  }

  initCarousel() {
    $('.slick-carousel-topselling').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      infinite: true,
      rows: 1,
      arrows: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }

  // initSlider() {
  //   jQuery('#slider').nivoSlider({
  //     effect: 'fade',
  //     directionNav: false,
  //     controlNav: false,
  //   });
  // }

  ngOnInit(): void {
    this.initCarouselBanner();
    console.log('TEST JQUERY: ', $);
    this.route.paramMap.subscribe(() => {
      this.getProducts();
    });

    this.productService.getProductListNewArrivals().subscribe({
      next: (res) => {
        console.log('prova ', res);
        this.productsNewArrival = res.content;
      },
    });

    this.productService.getProductListTopSelling().subscribe({
      next: (res) => {
        console.log('prova 222 ', res);
        this.productsTopSelling = res.content;
      },
    });
  }

  getProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleProductList();
    }
  }

  handleProductList() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    this.productService
      .getProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currentCategoryId
      )
      .subscribe({
        next: (res) => {
          this.products = res.content;
          this.pageNumber = res.number + 1;
          this.pageSize = res.size;
          this.totalElements = res.totalElements;
          if (this.products.length > 0)
            setTimeout(() => {
              this.initCarousel();
            }, 10);
        },
      });
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    this.productService
      .searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword)
      .subscribe({
        next: (res) => {
          this.products = res.content;
          this.pageNumber = res.number + 1;
          this.pageSize = res.size;
          this.totalElements = res.totalElements;
        },
      });
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

  updatePageSize(pageSize: string) {
    this.pageNumber = 1;
    this.pageSize = +pageSize;
    this.getProducts();
  }
}
