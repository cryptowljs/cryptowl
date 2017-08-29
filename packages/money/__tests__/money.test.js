const money = require("../src");

describe("money", () => {
  it("parses", () => {
    expect(money.parse("123", "clp")).toEqual([123, "CLP"]);
    expect(money.parse("123.0", "clp")).toEqual([123, "CLP"]);
    expect(money.parse("123.00", "clp")).toEqual([123, "CLP"]);
    expect(money.parse("123.001", "clp")).toEqual([123.001, "CLP"]);
    expect(money.parse(123, "clp")).toEqual([123, "CLP"]);
    expect(money.parse(123, "CLP")).toEqual([123, "CLP"]);
    expect(money.parse(123)).toEqual([123, "USD"]);
    expect(money.parse(0)).toEqual([0, "USD"]);
    expect(money.parse()).toEqual([0, "USD"]);
    expect(money.parse(undefined)).toEqual([0, "USD"]);
    expect(money.parse(null)).toEqual(null);
    expect(money.parse(NaN)).toEqual(null);
    expect(money.parse(Infinity)).toEqual([Infinity, "USD"]);
    expect(money.parse(-Infinity)).toEqual([-Infinity, "USD"]);
  });

  it("formats", () => {
    expect(money.format([NaN, "CLP"])).toEqual("$ --");
    expect(money.format([null, "CLP"])).toEqual("$ --");
    expect(money.format([undefined, "CLP"])).toEqual("$ --"); // TODO: is this ok?
    expect(money.format(["AAA", "CLP"])).toEqual("$ --"); // TODO: is this ok?

    expect(money.format([0, "CLP"])).toEqual("$ --");
    expect(money.format([1, "CLP"])).toEqual("$ 1");
    expect(money.format([-1, "CLP"])).toEqual("$ -1");
    expect(money.format([1.0, "CLP"])).toEqual("$ 1");
    expect(money.format([1.12, "CLP"])).toEqual("$ 1");
    expect(money.format([1.122, "CLP"])).toEqual("$ 1");
    expect(money.format([100.122, "CLP"])).toEqual("$ 100");
    expect(money.format([1000.122, "CLP"])).toEqual("$ 1,000");
    expect(money.format([1000.122, "CLP"], { thousand: "." })).toEqual("$ 1.000");
    expect(money.format([1000.1, "CLP"], { thousand: ".", precision: 0 })).toEqual("$ 1.000");
    expect(money.format([1000.09, "CLP"], { thousand: ".", decimal: ",", precision: 1 })).toEqual(
      "$ 1.000,1"
    );
    expect(money.format([1000.09, "CLP"], { thousand: ".", decimal: ",", precision: 2 })).toEqual(
      "$ 1.000,09"
    );

    expect(money.format([0, "CLP"], { code: true })).toEqual("-- CLP");
    expect(money.format([1, "CLP"], { code: true })).toEqual("1 CLP");
    expect(money.format([-1, "CLP"], { code: true })).toEqual("-1 CLP");

    expect(money.format([1, "USD"])).toEqual("$ 1.00");
    expect(money.format([1.1, "USD"])).toEqual("$ 1.10");
    expect(money.format([1.1, "USD"])).toEqual("$ 1.10");
    expect(money.format([1.11, "USD"])).toEqual("$ 1.11");
    expect(money.format([1.111, "USD"])).toEqual("$ 1.11");
    expect(money.format([1.116, "USD"])).toEqual("$ 1.12");

    // expect(money.format([Infinity, "USD"])).toEqual("$ ∞"); // TODO: support infinity
    // expect(money.format([-Infinity, "USD"])).toEqual("$ -∞"); // TODO: support infinity
  });
});
