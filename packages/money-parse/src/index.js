"use strict";

const numeral = require("numeral");

function parse(input = 0, currency = "USD") {
  if (input === undefined || input === null) {
    return null;
  }
  const result = [numeral(input).value(), currency.toUpperCase()];
  return result[0] !== null ? result : null;
}

module.exports = parse;
