import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbThemeModule,
          NbCardModule, NbInputModule, NbAlertModule, NbUserModule, NbContextMenuModule, NbMenuModule } from "@nebular/theme";
import { HttpClientModule } from "@angular/common/http";

import { LoginComponent } from "./components/common/login/login.component";
import { CreateAccountComponent } from "./components/common/create-account/create-account.component";
import { ProjectsDashboardComponent } from "./components/supplier/projects-dashboard/projects-dashboard.component";
import { initApp } from "./app-initialiser";
import { SessionService } from "./services/session.service";
import { NavComponent } from "./components/common/nav/nav.component";

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountComponent,
    LoginComponent,
    ProjectsDashboardComponent,
    NavComponent
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
    NbUserModule,
    NbAlertModule,
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot({ name: "default" }),
    NbButtonModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SessionService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
