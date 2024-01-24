import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { CartService } from '../../services/cart.service';

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
              private cartService: CartService){
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
