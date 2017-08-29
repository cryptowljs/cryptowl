const SurBTC = require("../src");
require("rxjs");

const CryptowlError = require("@cryptolw/error");

describe("SurBTC", () => {
  it("exists", async () => {
    expect(SurBTC).toBeTruthy();
  });

  it("get markets", async () => {
    const service = new SurBTC();
    const markets = await service.getMarkets();
    expect(markets).toBeInstanceOf(Array);
  });

  it("get current tick state", async () => {
    const service = new SurBTC();
    const data = await service.getCurrent([["BTC", "CLP"]]);
    expect(data).toBeTruthy();
  });

  it("throws CryptowlError on invalid query.", async () => {
    expect.assertions(2);
    try {
      const service = new SurBTC();
      await service.getCurrent([["BTC", "AAA"]]);
    } catch (e) {
      expect(e.isCryptowlError).toBeTruthy();
      expect(e).toBeInstanceOf(CryptowlError);
    }
  });

  it("has an observable ticker", async () => {
    const service = new SurBTC();
    const data = await service
      .ticker$([["BTC", "CLP"], ["BTC", "COP"]])
      .first()
      .toPromise();

    expect(data).toBeTruthy();
  });
});
