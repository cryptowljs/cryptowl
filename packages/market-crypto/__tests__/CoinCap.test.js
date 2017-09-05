const { CoinCap } = require("../src");

describe("CoinCap", () => {
  it("exists", async () => {
    expect(CoinCap).toBeTruthy();
  });

  it("get currencies", async () => {
    const service = new CoinCap();
    const currencies = await service.getCurrencies();
    expect(currencies).toBeInstanceOf(Array);
  });

  it("get current tick state", async () => {
    const service = new CoinCap();
    const data = await service.getCurrent(["BTC", "ETH"]);
    expect(data).toBeTruthy();
  });
});
