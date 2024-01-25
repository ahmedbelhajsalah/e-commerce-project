import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductCategoryMenuComponent } from './products/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';

const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {provide: OKTA_CONFIG, useValue: {oktaAuth}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
