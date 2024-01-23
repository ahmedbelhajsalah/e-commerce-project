import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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

  constructor(private formBuilder: FormBuilder, private shopService: ShopService){

  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAdress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAdress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
    
  }

  onSubmit() {
    console.log('hi', this.checkoutFormGroup.getRawValue())
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
