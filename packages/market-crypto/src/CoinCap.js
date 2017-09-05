const axios = require("axios");
const ms = require("millisecond");

const Observable = require("rxjs/Observable").Observable;
require("rxjs/add/observable/interval");
require("rxjs/add/operator/startWith");
require("rxjs/add/operator/mergeMap");

const parse = require("@cryptolw/money-parse");
const CryptowlError = require("@cryptolw/error");

class CoinCap {
  static identifier = "CoinCap";

  static defaults = {
    baseURL: "https://www.coincap.io/",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  constructor(options) {
    this.options = Object.assign({}, this.constructor.defaults, options);
    this.client = axios.create(this.options);
  }

  getCurrencies() {
    return this.client.get("/coins").then(({ data }) => data);
  }

  getCurrent(currencies = [], options = {}) {
    return this.client
      .get("/front")
      .then(({ data }) => {
        // TODO: performance can be improved (filtering).
        const result = {};
        for (const object of data) {
          const code = object["short"].toUpperCase();
          result[code] = {
            code,
            name: object["long"],
            supply: parse(object["supply"], code),
            volume: parse(object["volume"], code),
            rate: parse(object["price"], "USD"),
            cap: parse(object["mktcap"], "USD"),
            change: object["perc"],
            raw: options.raw === true ? object : undefined,
          };
        }
        return currencies.map(code => result[code]).filter(Boolean);
      })
      .catch(err => {
        if (err.response || err.request) {
          throw CryptowlError.fromAxiosError(err, "Error querying CoinCap.", { currencies });
        } else {
          throw err;
        }
      });
  }

  ticker$(currencies = [], options = {}) {
    return Observable.interval(ms(options.interval || "1 min"))
      .startWith(0)
      .mergeMap(() => this.getCurrent(currencies, options));
  }
}

module.exports = CoinCap;
