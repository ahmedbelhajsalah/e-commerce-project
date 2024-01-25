import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingState: State[] = [];
  billingState: State[] = [];

  constructor(private formBuilder: FormBuilder, private shopService: ShopService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router){
  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAdress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
      }),
      billingAdress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('^[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('^[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.shopService.getCreditCardMonth(startMonth).subscribe(data =>{
      this.creditCardMonths = data;
    });

    this.shopService.getCreditCardYear().subscribe(data =>{
      this.creditCardYears = data;
    })

    this.shopService.getCountries().subscribe(
      data => this.countries = data
    )

    this.reviewCardDetails();
    
  }

  reviewCardDetails() {
    this.cartService.totalQuantity.subscribe(
      result => this.totalQuantity = result
    );
    this.cartService.totalPrice.subscribe(
      price => this.totalPrice = price
    );
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  get billingAdressCity(){
    return this.checkoutFormGroup.get('billingAdress.city');
  }

  get billingAdressState(){
    return this.checkoutFormGroup.get('billingAdress.state');
  }

  get billingAdressZipCode(){
    return this.checkoutFormGroup.get('billingAdress.zipCode');
  }

  get billingAdressCountry(){
    return this.checkoutFormGroup.get('billingAdress.country');
  }

  get billingAdressStreet(){
    return this.checkoutFormGroup.get('billingAdress.street');
  }

  get shippinAdressCity(){
    return this.checkoutFormGroup.get('shippingAdress.city');
  }

  get shippinAdressState(){
    return this.checkoutFormGroup.get('shippingAdress.state');
  }

  get shippinAdressZipCode(){
    return this.checkoutFormGroup.get('shippingAdress.zipCode');
  }

  get shippinAdressCountry(){
    return this.checkoutFormGroup.get('shippingAdress.country');
  }

  get shippinAdressStreet(){
    return this.checkoutFormGroup.get('shippingAdress.street');
  }

  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  onSubmit() {
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAdress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    if(purchase.shippingAddress){
      purchase.shippingAddress.state = shippingState.name;
    }
    if(purchase.shippingAddress?.country){
      purchase.shippingAddress.country = shippingCountry.name;
    }
    

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAdress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    if(purchase.billingAddress){
      purchase.billingAddress.state = billingState.name;
    }
    if(purchase.billingAddress?.country){
      purchase.billingAddress.country = billingCountry.name;
    }

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received. \n Order tracking number: ${response.orderTrackingNumber}`)
          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    )

    }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products")
  }

  getStates(stateForm: string) {

    const form = this.checkoutFormGroup.get(stateForm);
    const countryCode = form?.value.country.code;

      this.shopService.getStatesUrl(countryCode).subscribe(
        data =>{
          if(stateForm === 'shippingAdress'){
            this.shippingState = data;
         }else{
            this.billingState = data;
         }

         // select first item by default
         form?.get('state')?.setValue(data[0]);
        }
      )
    }

  copyShippingAdressToBillingAdress($event: Event) {
    if($event.target){
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAdress'].value);
      this.billingState = this.shippingState;
    }else{
      this.checkoutFormGroup.controls['billingAdress'].reset();
      this.billingState = [];
    }
    }

    handleMonthsAndYears() {
      const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

      const currentYear: Number = new Date().getFullYear();

      const chosenYear: Number = Number(creditCardFormGroup?.value.expirationYear);

      let startMonth: number;

      if(currentYear == chosenYear){
        startMonth = new Date().getMonth() + 1;
      }else{
        startMonth = 1;
      }

      this.shopService.getCreditCardMonth(startMonth).subscribe(data =>{
        this.creditCardMonths = data;
      })
    }

}
