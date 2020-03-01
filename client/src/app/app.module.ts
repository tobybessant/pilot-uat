import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbThemeModule, NbCardModule, NbInputModule, NbAlertModule } from "@nebular/theme";
import { HttpClientModule } from "@angular/common/http";

import { LoginComponent } from "./components/common/login/login.component";
import { CreateAccountComponent } from "./components/common/create-account/create-account.component";
import { ProjectsDashboardComponent } from "./components/supplier/projects-dashboard/projects-dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountComponent,
    LoginComponent,
    ProjectsDashboardComponent
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
    NbAlertModule,
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot({ name: "default" }),
    NbButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
