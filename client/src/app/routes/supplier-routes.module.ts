import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsGridComponent } from "../components/supplier/projects-grid/projects-grid.component";
import { ProjectComponent } from "../components/supplier/project/project.component";
import { NbDialogModule } from "@nebular/theme";

const routes: Routes = [
  {
    path: "",
    component: ProjectsGridComponent,
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
