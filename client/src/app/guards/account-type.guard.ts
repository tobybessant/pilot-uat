import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/api/auth-service.service";
import { SessionService } from "../services/session.service";

@Injectable({
  providedIn: "root"
})
export class AccountTypeGuard implements CanActivate {

  constructor(
    private router: Router,
    private sessionService: SessionService) {

    }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const loggedInUser = this.sessionService.getCurrentUser();

      if (loggedInUser) {
          // check if route is restricted by role
          if (next.data.permittedTypes && next.data.permittedTypes.indexOf(loggedInUser.userType.type) === -1) {
              // role not authorised so redirect to home page
              // this.router.navigate(["/"]);
              return false;
          }

          // authorised so return true
          return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(["/login"], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
