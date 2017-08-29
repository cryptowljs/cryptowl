"use strict";

const crypto = require("./crypto");
const fiat = require("./fiat");
const money = require("./money");

const options = {
  decimal: ".",
  thousand: ",",
};

exports = module.exports = money(options, [crypto, fiat]);

exports.fiat = fiat;
exports.crypto = crypto;
