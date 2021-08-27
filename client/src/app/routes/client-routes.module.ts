import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsGridComponent } from "../components/client/projects-grid/projects-grid.component";
import { ProjectTabsComponent } from "../components/client/project-tabs/project-tabs.component";
import { StepWizardComponent } from "../components/client/step-wizard/step-wizard.component";

const routes: Routes = [
  {
    path: "",
    component: ProjectsGridComponent,
    pathMatch: "full"
  },
  {
    path: "project/:id",
    component: ProjectTabsComponent,
    pathMatch: "full",
  },
  {
    path: "project/:id/case/:caseId",
    component: StepWizardComponent,
    pathMatch: "full"
  },
  {
    path: "project/:id/:tab",
    component: ProjectTabsComponent,
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
