import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// component imports
import { CreateAccountComponent } from "./components/supplier/create-account/create-account.component";
import { LoginComponent } from "./components/supplier/login/login.component";

const routes: Routes = [
  { path: "signup", component: CreateAccountComponent },
  { path: "login", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
