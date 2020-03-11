import { Component, OnInit } from "@angular/core";
import { SessionService } from "src/app/services/session.service";
import { IUserResponse } from "src/app/models/response/common/user.interface";
import { NbMenuService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  public user: IUserResponse = null;
  public pageTitle = "UATPlatform";
  public fullName = "";
  public items: any[] = [{ title: "Logout", url: "logout", icon: "log-out-outline"}];

  constructor(
    private sessionService: SessionService,
    private nbMenuService: NbMenuService,
    private router: Router
  ) {
    this.user = this.sessionService.getCurrentUser();
    if (this.user) {
      this.setDetails(this.user);
    }
  }

  ngOnInit(): void {
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
      .subscribe(item => this.router.navigate([ item.url ]));
  }

  private setDetails(user: IUserResponse) {
    this.user = user;
    this.fullName = `${this.user.firstName} ${this.user.lastName}`;
  }

}
