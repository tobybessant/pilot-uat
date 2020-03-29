import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsGridComponent } from "../components/client/projects-grid/projects-grid.component";
import { ClientProjectComponent } from "../components/client/project/project.component";

const routes: Routes = [
  {
    path: "",
    component: ProjectsGridComponent,
    pathMatch: "full"
  },
  {
    path: "project/:id",
    component: ClientProjectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
