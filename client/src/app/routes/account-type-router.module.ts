import { Routes, RouterModule, ROUTES, Router } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/api/auth-service.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    {
      provide: ROUTES,
      useFactory: getRouterForAccountType,
      deps: [AuthService, Router],
      multi: true
    }
  ]
})
export class HandlerModule { }

export function getRouterForAccountType(sessionService: AuthService, router: Router) {
  let routes: Routes = [];
  const user = sessionService.getLoggedInUser();
  console.log(user);
  if (!user) {
    router.navigate(["/login"]);
    return;
  }

  if (user.userType === "Supplier") {
    routes = [
      {
        path: "", loadChildren: () => import("./supplier-routes.module").then(mod => mod.SupplierRoutingModule)
      }
    ];
  } else {
    routes = [
      {
        path: "", loadChildren: () => import("./client-routes.module").then(mod => mod.ClientRoutingModule)
      }
    ];
  }
  return routes;
}
