const CryptowlError = require("../src");

describe("CryptowlError", () => {
  function throwError(msg, data) {
    throw new CryptowlError(msg, data);
  }

  it("throws", async () => {
    expect(throwError).toThrowError(CryptowlError);
  });
});
