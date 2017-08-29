const formatter = require("../src");

const data = require("@cryptolw/money-data");

describe("money", () => {
  it("formats", () => {
    const formatr = formatter([data.crypto, data.fiat]);

    expect(formatr.format([NaN, "CLP"])).toEqual("$ --");
    expect(formatr.format([null, "CLP"])).toEqual("$ --");
    expect(formatr.format([undefined, "CLP"])).toEqual("$ --"); // TODO: is this ok?
    expect(formatr.format(["AAA", "CLP"])).toEqual("$ --"); // TODO: is this ok?

    expect(formatr.format([0, "CLP"])).toEqual("$ --");
    expect(formatr.format([1, "CLP"])).toEqual("$ 1");
    expect(formatr.format([-1, "CLP"])).toEqual("$ -1");
    expect(formatr.format([1.0, "CLP"])).toEqual("$ 1");
    expect(formatr.format([1.12, "CLP"])).toEqual("$ 1");
    expect(formatr.format([1.122, "CLP"])).toEqual("$ 1");
    expect(formatr.format([100.122, "CLP"])).toEqual("$ 100");
    expect(formatr.format([1000.122, "CLP"])).toEqual("$ 1,000");
    expect(formatr.format([1000.122, "CLP"], { thousand: "." })).toEqual("$ 1.000");
    expect(formatr.format([1000.1, "CLP"], { thousand: ".", precision: 0 })).toEqual("$ 1.000");
    expect(formatr.format([1000.09, "CLP"], { thousand: ".", decimal: ",", precision: 1 })).toEqual(
      "$ 1.000,1"
    );
    expect(formatr.format([1000.09, "CLP"], { thousand: ".", decimal: ",", precision: 2 })).toEqual(
      "$ 1.000,09"
    );

    expect(formatr.format([0, "CLP"], { code: true })).toEqual("-- CLP");
    expect(formatr.format([1, "CLP"], { code: true })).toEqual("1 CLP");
    expect(formatr.format([-1, "CLP"], { code: true })).toEqual("-1 CLP");

    expect(formatr.format([1, "USD"])).toEqual("$ 1.00");
    expect(formatr.format([1.1, "USD"])).toEqual("$ 1.10");
    expect(formatr.format([1.1, "USD"])).toEqual("$ 1.10");
    expect(formatr.format([1.11, "USD"])).toEqual("$ 1.11");
    expect(formatr.format([1.111, "USD"])).toEqual("$ 1.11");
    expect(formatr.format([1.116, "USD"])).toEqual("$ 1.12");

    // expect(formatr.format([Infinity, "USD"])).toEqual("$ ∞"); // TODO: support infinity
    // expect(formatr.format([-Infinity, "USD"])).toEqual("$ -∞"); // TODO: support infinity
  });
});
