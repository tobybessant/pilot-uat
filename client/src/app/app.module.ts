import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CreateAccountComponent } from "./components/create-account/create-account.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbThemeModule, NbCardModule, NbInputModule } from "@nebular/theme";
import { HttpClientModule } from "@angular/common/http";

import { LoginComponent } from "./components/login/login.component";

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NbLayoutModule,
    NbCardModule,
    NbInputModule,
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot({ name: "default" }),
    NbButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
