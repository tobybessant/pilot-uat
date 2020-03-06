import { Component, OnInit } from "@angular/core";
import { SessionService } from "src/app/services/session.service";
import { IUserResponse } from "src/app/models/response/common/user.interface";
import { NbMenuService } from "@nebular/theme";
import { filter, map } from 'rxjs/operators';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  public user: IUserResponse = null;
  public pageTitle = "UATPlatform";
  public fullName = "";
  public items: any[] = [{ title: "hello", }];

  constructor(
    private sessionService: SessionService,
    private nbMenuService: NbMenuService
  ) { }

  ngOnInit(): void {
    // subscribe to logged in user changes
    this.sessionService.getSubject().subscribe(user => {
      console.log("new user!", user);
      this.user = user;
      this.fullName = this.user.firstName + " " + this.user.lastName;
    });

    // subscribe to profile menu events
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "user-menu"),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => alert(`${title} was clicked!`));
  }
}
