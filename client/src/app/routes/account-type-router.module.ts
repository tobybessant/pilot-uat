import { Routes, RouterModule, ROUTES, Router } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SessionService } from "../services/session/session.service";
import { DemoSwitchComponent } from "../components/common/demo-switch/demo-switch.component";

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
      deps: [SessionService, Router],
      multi: true
    }
  ]
})
export class HandlerModule { }

export function getRouterForAccountType(sessionService: SessionService, router: Router) {
  let routes: Routes = [];
  const user = sessionService.getCurrentUser();
  if (!user) {
    router.navigate(["/signup"]);
    return routes;
  }

  if (user.type === "Supplier") {
    routes = [
      {
        path: "", loadChildren: () => import("./supplier-routes.module").then(mod => mod.SupplierRoutingModule),
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
