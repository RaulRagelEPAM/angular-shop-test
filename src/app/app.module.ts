import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from './modules/materials.module';

import { AppComponent } from './app.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/products/product/product.component';
import { HeaderComponent } from './components/header/header.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CartComponent } from './components/shopping-cart/details/details.component';
import { FiltersComponent } from './components/filters/filters.component';
import { CloudsComponent } from './components/clouds/clouds.component';
import { SearchComponent } from './components/search/search.component';
import { GoUpComponent } from './components/go-up/go-up.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductComponent,
    HeaderComponent,
    ShoppingCartComponent,
    CartComponent,
    FiltersComponent,
    CloudsComponent,
    SearchComponent,
    GoUpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
