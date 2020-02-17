import { Logger } from "@overnightjs/logger";
import { Strategy } from 'passport-local';

import * as data from "../../../user";

export class Local {
	public static init (_passport: any): any {
		_passport.use(new Strategy(
      {
        usernameField: "email"
      },
      function(email, password, done) {
        // check email
        const u = data.users.find(usr => usr.email === email);
        if (u === undefined) {
          return done(null, false);
        }
  
        // check password
        const identity = u.password === password;
        if (identity) {
          delete u.password;
          return done(null, u);
        }
  
        // wrong password
        return done(null, false);
      }
    ));
	}
}