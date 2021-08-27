import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbSpinnerService } from "@nebular/theme";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "src/app/services/api/auth/auth-service.service";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { SessionService } from "src/app/services/session/session.service";

@Component({
  selector: "app-demo-switch",
  templateUrl: "./demo-switch.component.html",
  styleUrls: ["./demo-switch.component.scss"]
})
export class DemoSwitchComponent implements OnInit {
  private redirectUrl: string;
  public alternateAccountType: string = "";
  public readonly SPINNER_NAME: string = "switch_account";

  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.show(this.SPINNER_NAME);

    this.route.queryParamMap.subscribe(q => this.redirectUrl = q.get("demoAccountSwitchRedirectUrl"));
    const accounts = this.localStorage.get("demo_account");
    const user = this.sessionService.getCurrentUser();

    this.alternateAccountType = user.type === "Supplier" ? "Client" : "Supplier";

    setTimeout(async () => {
      await this.authService.logout(true);

      if (user.type === "Supplier") {
        await this.authService.login(accounts.client);
      } else {
        await this.authService.login(accounts.supplier);
      }

      this.router.navigate([this.redirectUrl]);
    }, 2500);
  }
}
