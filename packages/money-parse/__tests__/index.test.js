const parse = require("../src");

describe("money", () => {
  it("parses", () => {
    expect(parse("123", "clp")).toEqual([123, "CLP"]);
    expect(parse("123.0", "clp")).toEqual([123, "CLP"]);
    expect(parse("123.00", "clp")).toEqual([123, "CLP"]);
    expect(parse("123.001", "clp")).toEqual([123.001, "CLP"]);
    expect(parse(123, "clp")).toEqual([123, "CLP"]);
    expect(parse(123, "CLP")).toEqual([123, "CLP"]);
    expect(parse(123)).toEqual([123, "USD"]);
    expect(parse(0)).toEqual([0, "USD"]);
    expect(parse()).toEqual([0, "USD"]);
    expect(parse(undefined)).toEqual([0, "USD"]);
    expect(parse(null)).toEqual(null);
    expect(parse(NaN)).toEqual(null);
    expect(parse(Infinity)).toEqual([Infinity, "USD"]);
    expect(parse(-Infinity)).toEqual([-Infinity, "USD"]);
  });
});
