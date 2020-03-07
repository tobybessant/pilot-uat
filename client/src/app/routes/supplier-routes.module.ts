import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsDashboardComponent } from "../components/supplier/projects-dashboard/projects-dashboard.component";
import { ProjectComponent } from "../components/supplier/project/project.component";

const routes: Routes = [
  {
    path: "",
    component: ProjectsDashboardComponent,
    pathMatch: "full"
  },
  {
    path: "project/:id",
    component: ProjectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
