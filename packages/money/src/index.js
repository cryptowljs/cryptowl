"use strict";

const money = require("./money");
const crypto = require("../data/crypto");
const fiat = require("../data/fiat");

const options = {
  decimal: ".",
  thousand: ",",
};

exports = module.exports = money(options, [crypto, fiat]);

exports.fiat = fiat;
exports.crypto = crypto;
