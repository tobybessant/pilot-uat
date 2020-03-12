import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbLayoutModule, NbButtonModule, NbThemeModule,
          NbCardModule, NbInputModule, NbAlertModule, NbUserModule, NbContextMenuModule,
          NbMenuModule, NbIconModule, NbSpinnerModule, NbDialogModule, NbTabsetModule, NbActionsModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";

import { NgxSpinnerModule } from "ngx-spinner";

import { HttpClientModule } from "@angular/common/http";

import { LoginComponent } from "./components/common/login/login.component";
import { CreateAccountComponent } from "./components/common/create-account/create-account.component";
import { ProjectsDashboardComponent } from "./components/supplier/projects-dashboard/projects-dashboard.component";
import { initApp } from "./app-initialiser";
import { SessionService } from "./services/session.service";
import { NavComponent } from "./components/common/nav/nav.component";
import { ProjectComponent } from "./components/supplier/project/project.component";
import { ConfirmationPromptComponent } from "./components/common/confirmation-prompt/confirmation-prompt.component";

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountComponent,
    LoginComponent,
    ProjectsDashboardComponent,
    NavComponent,
    ProjectComponent,
    ConfirmationPromptComponent
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
    NbMenuModule,
    NbEvaIconsModule,
    NbIconModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbActionsModule,
    NbMenuModule.forRoot(),
    NbDialogModule.forRoot(),
    NbThemeModule.forRoot({ name: "default" }),
    NbButtonModule,
    NgxSpinnerModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SessionService],
      multi: true
    }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
