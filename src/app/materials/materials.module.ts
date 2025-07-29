import { NgModule } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    exports: [
        MatToolbarModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class AppMaterialModule { }

/*

Iconos:

https://fonts.google.com/icons?icon.set=Material+Icons&icon.style=Filled&selected=Material+Icons:add_shopping_cart:&icon.query=shopping&icon.size=24&icon.color=%23e3e3e3

*/