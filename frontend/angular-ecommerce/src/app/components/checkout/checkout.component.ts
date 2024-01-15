import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopService } from '../../services/shop.service';

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
    console.log('startonth', startMonth)

    this.shopService.getCreditCardMonth(startMonth).subscribe(data =>{
      this.creditCardMonths = data;
    });

    this.shopService.getCreditCardYear().subscribe(data =>{
      this.creditCardYears = data;
    })
  }

  onSubmit() {
    console.log('hi', this.checkoutFormGroup.getRawValue())
    }

  copyShippingAdressToBillingAdress($event: Event) {
    if($event.target){
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAdress'].value);
    }else{
      this.checkoutFormGroup.controls['billingAdress'].reset();
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
