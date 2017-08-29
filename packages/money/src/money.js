"use strict";

const numeral = require("numeral");
const accounting = require("accounting");

module.exports = function money(options = {}, sources = []) {
  const defaultCurrency = options.defaultCurrency || "USD";
  const formats = options.formats || {
    none: {
      pos: "%v",
      neg: "-%v",
      zero: "--",
    },
    code: {
      pos: "%v %s",
      neg: "-%v %s",
      zero: "-- %s",
    },
    symbol: {
      pos: "%s %v",
      neg: "%s -%v",
      zero: "%s --",
    },
  };

  function metadata(code) {
    for (let i = 0; i < sources.length; i++) {
      const result = sources[i][code];
      if (result !== undefined) {
        return result;
      }
    }
    return null;
  }

  function parse(input = 0, currency = defaultCurrency) {
    if (input === undefined || input === null || isNaN(input)) {
      return null;
    }
    return [numeral(input).value(), currency.toUpperCase()];
  }

  function format(money, opts = {}) {
    const [value, code] = money.constructor === Array ? money : [money, defaultCurrency];

    const meta = metadata(code) || {};

    const formatting = opts.format || opts.code ? formats.code : formats.symbol;
    const symbol = opts.code ? meta.code : meta.symbol;
    const decimal = opts.decimal || options.decimal || ".";
    const thousand = opts.thousand || options.thousand || ",";
    const precision =
      opts.precision !== undefined
        ? opts.precision
        : meta.precision !== undefined ? meta.precision : options.precision;

    return accounting.formatMoney(value, symbol, precision, thousand, decimal, formatting);
  }

  return { parse, format, metadata };
};
