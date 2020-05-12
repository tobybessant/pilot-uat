import { assert } from "chai";
import { Bcrypt } from "../../../src/services/utils/bcryptHash";

suite("Bcrypt Service", () => {
  let bcrypt: Bcrypt;

  setup(() => {
    bcrypt = new Bcrypt();
  });

  suite("hash", () => {
    [
      "Password1",
      "CorrectHorseBatteryStaple",
      "FH12b4XXci0381!!::"
    ].forEach((password) => {
      suite(`Testing "${password}"`, () => {
        test("Hash output has a prefix of $2b", () => {
          const hashOutput = bcrypt.hash(password);
          const prefix = hashOutput.substring(0, 3);

          assert.equal("$2b", prefix);
        });

        test("Hash output is salted at least 10 times", () => {
          const hashOutput = bcrypt.hash(password);
          const segments = hashOutput.split("$");
          assert.equal(segments[2], "10");
        });

        test("Hash is 60 characters length", () => {
          const hashOutput = bcrypt.hash(password);
          assert.equal(hashOutput.length, 60);
        });
      });
    });
  });

  suite("verify", () => {
    const hashes = [
      { raw: "Password1",                 hash: "$2a$10$/XWxyV36socnEM9DGTsKEeh4eap9OO8Z4w4gUQCMJU8Z6DSrZH9Ii" },
      { raw: "CorrectHorseBatteryStaple", hash: "$2a$10$YdHXDxpSFNIWjUZH3x22v.blYDn750kd12yXOvmJn7UTYRdXHjS4." },
      { raw: "FH12b4XXci0381!!::",        hash: "$2a$10$35de2tNeVhCDOCoteW2SheeWTxgmbN8vB6yhDYNx9J0lv6ZQwlyMG" }
    ];

    hashes.forEach((password) => {
      suite(`Testing "${password.raw}"`, () => {
        test("Hash is validated correctly", () => {
          assert.isTrue(bcrypt.verify(password.raw, password.hash));
        });
      });
    });
  });
});