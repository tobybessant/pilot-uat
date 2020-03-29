import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbLayoutModule, NbButtonModule, NbThemeModule,
          NbCardModule, NbInputModule, NbAlertModule, NbUserModule, NbContextMenuModule,
          NbMenuModule, NbIconModule, NbSpinnerModule, NbDialogModule, NbTabsetModule,
          NbActionsModule, NbTreeGridModule, NbSelectModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";

import { NgxSpinnerModule } from "ngx-spinner";

import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from "@angular/material/chips";

import { HttpClientModule } from "@angular/common/http";

import { LoginComponent } from "./components/common/login/login.component";
import { CreateAccountComponent } from "./components/common/create-account/create-account.component";
import { ProjectsGridComponent } from "./components/supplier/projects-grid/projects-grid.component";
import { initApp } from "./app-initialiser";
import { SessionService } from "./services/session/session.service";
import { NavComponent } from "./components/common/nav/nav.component";
import { ProjectComponent } from "./components/supplier/project/project.component";
import { ConfirmationPromptComponent } from "./components/common/confirmation-prompt/confirmation-prompt.component";
import { TestSuiteListComponent } from "./components/supplier/test-suite-list/test-suite-list.component";
import { TestSuiteComponent } from "./components/supplier/test-suite/test-suite.component";
import { ProjectSettingsComponent } from "./components/supplier/project-settings/project-settings.component";
import { TestCaseComponent } from "./components/supplier/test-case/test-case.component";
import { TestStepListComponent } from "./components/supplier/test-step-list/test-step-list.component";
import { EditTestStepDialogComponent } from "./components/supplier/edit-test-step-dialog/edit-test-step-dialog.component";
import { StepStatusChipComponent } from "./components/supplier/step-status-chip/step-status-chip.component";
import { EditCaseDialogComponent } from "./components/supplier/edit-case-dialog/edit-case-dialog.component";
import { NotFoundComponent } from "./components/common/not-found/not-found.component";
import { InvitedAccountSetupComponent } from "./components/common/invited-account-setup/invited-account-setup.component";
import { UsersComponent } from "./components/supplier/users/users.component";
import { InviteUserDialogComponent } from "./components/supplier/invite-user-dialog/invite-user-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountComponent,
    LoginComponent,
    ProjectsGridComponent,
    NavComponent,
    ProjectComponent,
    ConfirmationPromptComponent,
    TestSuiteListComponent,
    TestSuiteComponent,
    ProjectSettingsComponent,
    TestCaseComponent,
    TestStepListComponent,
    EditTestStepDialogComponent,
    StepStatusChipComponent,
    EditCaseDialogComponent,
    NotFoundComponent,
    InvitedAccountSetupComponent,
    UsersComponent,
    InviteUserDialogComponent
  ],
  imports: [
    /* Angular */
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    /* NebularUI */
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
    NbTreeGridModule,
    NbSelectModule,
    NbMenuModule.forRoot(),
    NbDialogModule.forRoot(),
    NbThemeModule.forRoot({ name: "default" }),
    NbButtonModule,

    /* Other Libs */
    NgxSpinnerModule,
    MatExpansionModule,
    MatChipsModule
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
