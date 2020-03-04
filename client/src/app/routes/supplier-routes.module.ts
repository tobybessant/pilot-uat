import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsDashboardComponent } from "../components/supplier/projects-dashboard/projects-dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: ProjectsDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
