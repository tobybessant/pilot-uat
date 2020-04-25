import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsGridComponent } from "../components/client/projects-grid/projects-grid.component";
import { ClientProjectComponent } from "../components/client/project/project.component";
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
    component: ClientProjectComponent,
    children: [
      {
        path: "",
        component: ProjectTabsComponent
      },
      {
        path: "test/:caseId",
        component: StepWizardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
