import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef } from "@angular/core";
import { SessionService } from "src/app/services/session/session.service";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";
import { NbMenuService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/api/auth/auth-service.service";
import { NavbarService } from "src/app/services/navbar/navbar.service";
import { LeftNavButton } from "./nav-left-button";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {

  @ViewChild("leftNavButton", { static: true, read: ViewContainerRef })
  public navLeftButtonViewRef: ViewContainerRef;

  public viewingProject = false;

  public user: IUserResponse = null;
  public fullName = "";

  public userContextMenuItems: any[] = [{ title: "Logout", icon: "log-out-outline" }];
  private readonly userContextMenuActions: Map<string, () => void> = new Map<string, () => void>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private sessionService: SessionService,
    private authService: AuthService,
    private nbMenuService: NbMenuService,
    public navbarService: NavbarService
  ) {
    const user = this.sessionService.getCurrentUser();
    this.setDetails(user);
  }

  ngOnInit(): void {
    this.userContextMenuActions.set("Logout", async () => {
      this.authService.logout().then(() => {
        this.navbarService.resetHeader();

        // NOTE: Completely reload to the login page - clearing any role-based
        // session state i.e. routes.
        window.location.assign(`${window.location.hostname}/login`);
      });
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

    this.navbarService.$leftButton.subscribe(btn => this.loadNavButton(btn));
  }

  private loadNavButton(activeButton: LeftNavButton): void {
    this.navLeftButtonViewRef.clear();

    if (!activeButton) {
      return;
    }

    const navButtonComponentFactory = this.componentFactoryResolver.resolveComponentFactory(activeButton.component);

    const navButtonComponentRef = this.navLeftButtonViewRef.createComponent(navButtonComponentFactory);
    (navButtonComponentRef.instance as LeftNavButton).data = activeButton.data;
    this.cdr.detectChanges();
  }

  private setDetails(user: IUserResponse) {
    if (user) {
      this.fullName = `${user.firstName} ${user.lastName}`;
    }
    this.user = user;
  }
}
