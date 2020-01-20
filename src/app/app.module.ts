import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {Routes, RouterModule} from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { PrintComponent } from './print/print.component';
import { StorageService } from './storage.service';


const appRoutes: Routes =[
  { path: '', component: InputComponent},
  { path: 'input', component: InputComponent},
  { path: 'print', component: PrintComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    PrintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [StorageService], 
  bootstrap: [AppComponent]
})
export class AppModule { }
