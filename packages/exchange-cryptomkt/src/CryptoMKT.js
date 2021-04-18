const axios = require("axios");
const ms = require("millisecond");

const Observable = require("rxjs/Observable").Observable;
require("rxjs/add/observable/interval");
require("rxjs/add/operator/startWith");
require("rxjs/add/operator/mergeMap");

const parse = require("@cryptolw/money-parse");
const CryptowlError = require("@cryptolw/error");

class CryptoMKT {
  static identifier = "CryptoMKT";

  static defaults = {
    baseURL: "https://api.cryptomkt.com/",
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
          .get(`/v1/ticker?market=${exchange}`)
          .then(({ data }) => {
            if (data["status"] !== "success") {
              throw new CryptowlError("Error querying CryptoMKT.", { pair });
            }

            const [coin, fiat] = pair;
            const timeline = {
              ask: data["data"]["ask"],
              bid: data["data"]["bid"],
            };
            const bidding = timeline.bid;
            const asking = timeline.ask;

            const ask = parse(asking, fiat);
            const bid = parse(bidding, fiat);

            return {
              pair,
              last: parse((ask[0] + bid[0]) / 2, fiat), // TODO.
              ask,
              bid,
              low: parse(data["low"], fiat),
              high: parse(data["high"], fiat),
              volume: parse(data["volume"], coin),
              timestamp: data["timestamp"],
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
