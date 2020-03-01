import { AuthService } from "./services/api/auth-service.service";

export function initApp(authService: AuthService) {
  return () => {
    return new Promise(async (resolve) => {
      // check for user session
      await authService.setLoggedInUserFromSession();
      resolve();
    });
  };
}
