import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OrderItem } from 'src/app/interfaces/order-item';
import { Order } from 'src/app/interfaces/order';
import { Purchase } from 'src/app/interfaces/purchase';
import { Country, Region } from 'src/app/interfaces/region';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { shopValidators } from 'src/app/validators/shop-validators';
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutFormGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressRegions: Region[] = [];
  billingAddressRegions: Region[] = [];

  userEmail: string = '';
  userFirstName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private shopFormSrv: ShopFormService,
    private cartSrv: CartService,
    private checkoutSrv: CheckoutService,
    private router: Router,
    private userDetailsSrv: UserDetailsService
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),

        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),

        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),
        region: new FormControl('', [Validators.required]),
        country: new FormControl('Stato', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),
        region: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          shopValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    this.userDetailsSrv.userEmail$.subscribe((userEmail) => {
      this.userEmail = userEmail;
    });

    this.userDetailsSrv.userFirstName$.subscribe((userFirstName) => {
      this.userFirstName = userFirstName;
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.shopFormSrv.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });

    this.shopFormSrv.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    });

    this.shopFormSrv.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  ngOnDestroy() {
    console.log('componente distrutto');
  }

  reviewCartDetails() {
    this.cartSrv.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );

    this.cartSrv.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const targetElement = event.target as HTMLInputElement;

    if (targetElement.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormSrv.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  getRegions(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.shopFormSrv.getRegions(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressRegions = data;
      } else {
        this.billingAddressRegions = data;
      }

      formGroup?.get('region')?.setValue(data[0]);
    });
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartSrv.cartItems;

    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    let purchase = new Purchase();

    // cliente
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // indirizzo spedizione
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingRegion: Region = JSON.parse(
      JSON.stringify(purchase.shippingAddress.region)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.region = shippingRegion.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // indirizzo fatturazione
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingRegion: Region = JSON.parse(
      JSON.stringify(purchase.billingAddress.region)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.region = billingRegion.name;
    purchase.billingAddress.country = billingCountry.name;

    // order + orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutSrv.placeOrder(purchase).subscribe({
      next: (res) => {
        alert(`Codice tracking: ${res.orderTrackingNumber}`);

        this.resetCart();
      },
      error: (err) => {
        alert(`Error: ${err.message}`);
      },
    });
  }

  resetCart() {
    this.cartSrv.cartItems = [];
    this.cartSrv.totalPrice.next(0);
    this.cartSrv.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressRegion() {
    return this.checkoutFormGroup.get('shippingAddress.region');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressRegion() {
    return this.checkoutFormGroup.get('billingAddress.region');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
}
