import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef } from "@angular/core";
import { SessionService } from "src/app/services/session/session.service";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";
import { NbMenuService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { Event, RouterEvent, Router, NavigationStart } from "@angular/router";import { AuthService } from "src/app/services/api/auth/auth-service.service";
import { NavbarService } from "src/app/services/navbar/navbar.service";
import { LeftNavButton } from "./nav-left-button";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";

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
  public isDemoAccount: boolean;
  public isViewingProject: boolean;

  public get alternateAccountType() {
    return this.user?.type === "Supplier" ? "Client" : "Supplier";
  }

  public userContextMenuItems: any[] = [
    { title: "Logout", icon: "log-out-outline" },
    { title: "Terms", icon: "info-outline"     }
  ];
  private readonly userContextMenuActions: Map<string, () => void> = new Map<string, () => void>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private sessionService: SessionService,
    private router: Router,
    private authService: AuthService,
    private nbMenuService: NbMenuService,
    public navbarService: NavbarService,
    private localStorage: LocalStorageService
  ) {
    const user = this.sessionService.getCurrentUser();
    this.setDetails(user);
  }

  ngOnInit(): void {
    // setup menu actions
    this.setUserMenuActions();

    // subscribe to logged in user changes
    this.sessionService.getSubject().subscribe(user => {
      this.setDetails(user);
      this.isDemoAccount = !!this.localStorage.get("demo_account");
    });

    // subscribe to profile menu events
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "user-menu"),
        map(({ item }) => item),
      )
      .subscribe(async (item) => await this.userContextMenuActions.get(item.title)());

    this.navbarService.$leftButton.subscribe(btn => this.loadNavButton(btn));

    this.router.events
      .pipe(filter((e: Event): e is RouterEvent => e instanceof NavigationStart))
      .subscribe((e: RouterEvent) => {
        this.isViewingProject = e.url.includes("project");
      });
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

  private setUserMenuActions(): void {
    this.userContextMenuActions.set("Logout", async () => {
      this.authService.logout().then(() => {
        this.navbarService.resetHeader();
        this.localStorage.remove("demo_account");
        // NOTE: Completely reload to the login page - clearing any role-based
        // session state i.e. routes.
        window.location.assign(`${window.location.hostname}/signup`);
      });
    });

    this.userContextMenuActions.set("Terms", () => {
      this.router.navigate(["/terms"]);
    });
  }

  public async switchDemoAccountType() {
    const pathSegments = window.location.pathname.split("/");
    let url = "";

    // Take up-to the first 2 segments.
    for (let i = 1; i < pathSegments.length && i < 3; i++) {
      url += `/${pathSegments[i]}`;
    }

    window.location.assign(`/demo-account-switch?demoAccountSwitchRedirectUrl=${url}`);
  }
}
