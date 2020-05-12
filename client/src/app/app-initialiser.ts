
import { SessionService } from "./services/session/session.service";

export function initApp(sessionService: SessionService) {
  return () => {
    return new Promise(async (resolve) => {
      // check for user session
      await sessionService.setUser();
      resolve();
    });
  };
}
