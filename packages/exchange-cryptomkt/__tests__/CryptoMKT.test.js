const CryptoMKT = require("../src");
require("rxjs");

const CryptowlError = require("@cryptolw/error");

describe("CryptoMKT", () => {
  it("exists", async () => {
    expect(CryptoMKT).toBeTruthy();
  });

  it("get markets", async () => {
    const service = new CryptoMKT();
    const markets = await service.getMarkets();
    expect(markets).toBeInstanceOf(Array);
  });

  it("get current tick state", async () => {
    const service = new CryptoMKT();
    const data = await service.getCurrent([["ETH", "CLP"]]);
    expect(data).toBeTruthy();
  });

  it("throws CryptowlError on invalid query.", async () => {
    expect.assertions(2);
    try {
      const service = new CryptoMKT();
      await service.getCurrent([["ETH", "AAA"]]);
    } catch (e) {
      expect(e.isCryptowlError).toBeTruthy();
      expect(e).toBeInstanceOf(CryptowlError);
    }
  });

  it("has an observable ticker", async () => {
    const service = new CryptoMKT();
    const data = await service
      .ticker$([["ETH", "CLP"], ["ETH", "ARS"]])
      .first()
      .toPromise();

    expect(data).toBeTruthy();
  });
});
