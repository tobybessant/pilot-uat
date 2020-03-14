import { Component, OnInit } from "@angular/core";
import { SessionService } from "src/app/services/session.service";
import { IUserResponse } from "src/app/models/response/common/user.interface";
import { NbMenuService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/api/auth-service.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  public user: IUserResponse = null;
  public pageTitle = "Pilot";
  public fullName = "";
  public userContextMenuItems: any[] = [{ title: "Logout", icon: "log-out-outline" }];
  private readonly userContextMenuActions: Map<string, () => void> = new Map<string, () => void>();

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private nbMenuService: NbMenuService,
    private router: Router
  ) {
    const user = this.sessionService.getCurrentUser();
    this.setDetails(user);
  }

  ngOnInit(): void {
    this.userContextMenuActions.set("Logout", async () => {
      this.authService.logout().then(() => this.router.navigate(["/login"]));
    });

    // subscribe to logged in user changes
    this.sessionService.getSubject().subscribe(user => {
      this.setDetails(user);
    });

    // subscribe to profile menu events
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "user-menu"),
        map(({ item }) => item),
      )
      .subscribe(async (item) => await this.userContextMenuActions.get(item.title)());
  }

  private setDetails(user: IUserResponse) {
    if (user) {
      this.fullName = `${user.firstName} ${user.lastName}`;
    }
    this.user = user;
  }

}
