import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// component imports
import { CreateAccountComponent } from "./components/common/create-account/create-account.component";
import { LoginComponent } from "./components/common/login/login.component";
import { AccountTypeGuard } from "./guards/account-type.guard";
import { ProjectsDashboardComponent } from "./components/supplier/projects-dashboard/projects-dashboard.component";

const routes: Routes = [
  { path: "signup", component: CreateAccountComponent },
  { path: "login", component: LoginComponent          },

  { path: "",
    loadChildren: () => import("./routes/account-type-router.module").then(mod => mod.HandlerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
