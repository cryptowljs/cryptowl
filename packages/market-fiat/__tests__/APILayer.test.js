const dotenv = require("dotenv");
const { APILayer } = require("../src");

describe("APILayer", () => {
  beforeAll(() => {
    dotenv.config();
  });

  it("exists", async () => {
    expect(APILayer).toBeTruthy();
  });

  it("get currencies", async () => {
    const service = new APILayer({ apiKey: process.env["CURRENCYLAYER__KEY"] });
    const currencies = await service.getCurrencies();
    expect(currencies).toBeInstanceOf(Array);
  });

  it("get current tick state", async () => {
    const service = new APILayer({ apiKey: process.env["CURRENCYLAYER__KEY"] });
    const data = await service.getCurrent(["CLP", "USD", "EUR"]);
    expect(data).toBeTruthy();
  });
});
