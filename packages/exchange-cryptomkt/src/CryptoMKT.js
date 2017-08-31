const axios = require("axios");
const ms = require("millisecond");

const Observable = require("rxjs/Observable").Observable;
require("rxjs/add/observable/interval");
require("rxjs/add/operator/startWith");
require("rxjs/add/operator/mergeMap");

const parse = require("@cryptolw/money-parse");
const CryptowlError = require("@cryptolw/error");

function min(...values) {
  return Math.min(...values.map(Number));
}

class CryptoMKT {
  static identifier = "CryptoMKT";

  static defaults = {
    baseURL: "https://www.cryptomkt.com/api/",
    timeout: 3000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  constructor(options) {
    this.options = Object.assign({}, this.constructor.defaults, options);
    this.client = axios.create(this.options);
  }

  getMarkets() {
    return Promise.resolve([["ETH", "CLP"], ["ETH", "ARS"], ["ETH", "BRL"], ["ETH", "EUR"]]);
  }

  getCurrent(markets = [], options = {}) {
    return Promise.all(
      markets.map(pair => {
        const exchange = pair.join("").toLowerCase();
        return this.client
          .get(`/${exchange}/1440.json`)
          .then(({ data }) => {
            if (data["status"] !== "success") {
              throw new CryptowlError("Error querying CryptoMKT.", { pair });
            }

            const [coin, fiat] = pair;
            const timeline = {
              ask: data["data"]["prices_ask"]["values"],
              bid: data["data"]["prices_bid"]["values"],
            };
            const bidding = timeline.bid[0];
            const asking = timeline.ask[0];

            const ask = parse(asking["close_price"], fiat);
            const bid = parse(bidding["close_price"], fiat);

            return {
              pair,
              last: parse((ask[0] + bid[0]) / 2, fiat), // TODO.
              ask,
              bid,
              low: parse(min(asking["low_price"], bidding["low_price"]), fiat),
              high: parse(min(asking["hight_price"], bidding["hight_price"]), fiat),
              volume: parse(asking["volume_sum"], coin),
              timestamp: Date.now(),
              exchange: this.constructor.identifier,
              raw: options.raw === true ? data["data"] : undefined,
            };
          })
          .catch(err => {
            if (err.response || err.request) {
              throw CryptowlError.fromAxiosError(err, "Error querying CryptoMKT.", { pair });
            } else {
              throw err;
            }
          });
      })
    );
  }

  ticker$(markets = [], options = {}) {
    return Observable.interval(ms(options.interval || "1 min"))
      .startWith(0)
      .mergeMap(() => this.getCurrent(markets, options));
  }
}

module.exports = CryptoMKT;
