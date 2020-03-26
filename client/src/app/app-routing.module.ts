import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// component imports
import { CreateAccountComponent } from "./components/common/create-account/create-account.component";
import { LoginComponent } from "./components/common/login/login.component";
import { NotFoundComponent } from "./components/common/not-found/not-found.component";
import { InvitedAccountSetupComponent } from "./components/common/invited-account-setup/invited-account-setup.component";

const routes: Routes = [
  { path: "signup", component: CreateAccountComponent       },
  { path: "login",  component: LoginComponent               },
  { path: "setup",  component: InvitedAccountSetupComponent },

  {
    path: "",
    loadChildren: () => import("./routes/account-type-router.module").then(mod => mod.HandlerModule)
  },

  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
