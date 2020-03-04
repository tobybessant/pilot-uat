
import { SessionService } from "./services/session.service";

export function initApp(sessionService: SessionService) {
  return () => {
    return new Promise(async (resolve) => {
      // check for user session
      await sessionService.setLoggedInUserFromSession();
      resolve();
    });
  };
}
