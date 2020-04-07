import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response } from "express";
import { EmailService } from "../../../src/services/utils/emailService";
import { JwtService } from "../../../src/services/utils/jwtService";
import { InviteService } from "../../../src/services/invite/inviteService";
import { IProjectInviteToken } from "../../../src/dto/request/common/inviteToken";
import { string } from "joi";

suite("InviteService", () => {
  let emailService: IMock<EmailService>;
  let jwtService: IMock<JwtService>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: InviteService;

  setup(() => {
    emailService = Mock.ofType<EmailService>();
    jwtService = Mock.ofType<JwtService>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new InviteService(emailService.object, jwtService.object);
  });

  suite("decodeInviteToken", () => {
    let token: string;
    let decodedToken: IProjectInviteToken;

    suite("Valid conditions", () => {
      setup(() => {
        token = "hello!";

        decodedToken = {
          id: "60"
        };
      });

      test("Token is given to jwtService.decode", () => {
        given_jwtService_decode_returns_whenGiven(decodedToken, token);

        subject.decodeInviteToken(token);

        jwtService.verify(j => j.decode(token), Times.once());
      });
    });
  });

  suite("inviteClient", () => {
    let token: string;
    let email: string;
    let inviteId: string;
    let decodedToken: IProjectInviteToken;

    suite("Valid conditions", () => {
      setup(() => {
        token = "hello!";

        inviteId = "5";
        email = "hello@me.com";

        decodedToken = {
          id: inviteId
        };
      });

      test("User email is given to emailService as recipient", async () => {
        given_jwtService_encode_returns_whenGiven(token, { id: inviteId });

        await subject.inviteClient(email, inviteId);

        emailService.verify(e => e.sendHtml(It.isAny(), email, It.isAny()), Times.once());
      });

      test("Email contains link to '/:token'", async () => {
        given_jwtService_encode_returns_whenGiven(token, { id: inviteId });

        await subject.inviteClient(email, inviteId);

        emailService.verify(e => e.sendHtml(It.isAny(), It.isAny(), It.is(b => b.includes(`/${token}`))), Times.once());
      });
    });

  });

  function given_jwtService_decode_returns_whenGiven(returns: IProjectInviteToken, whenGiven: string) {
    jwtService
      .setup(j => j.decode(whenGiven))
      .returns(() => returns);
  }

  function given_jwtService_encode_returns_whenGiven(returns: string, whenGiven: IProjectInviteToken) {
    jwtService
      .setup(j => j.encode(whenGiven))
      .returns(() => returns);
  }
});
