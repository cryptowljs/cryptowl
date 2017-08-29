"use strict";

const numeral = require("numeral");

function parse(input = 0, currency = "USD") {
  if (input === undefined || input === null || isNaN(input)) {
    return null;
  }
  return [numeral(input).value(), currency.toUpperCase()];
}

module.exports = parse;
