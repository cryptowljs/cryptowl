const axios = require("axios");
const ms = require("millisecond");

const Observable = require("rxjs/Observable").Observable;
require("rxjs/add/observable/interval");
require("rxjs/add/operator/startWith");
require("rxjs/add/operator/mergeMap");

const CryptowlError = require("@cryptolw/error");

class SurBTC {
  static identifier = "SurBTC";

  static defaults = {
    baseURL: "https://www.surbtc.com/api/v2/",
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
    return this.client
      .get("/markets")
      .then(({ data }) => {
        return data["markets"].map(item => [item["base_currency"], item["quote_currency"]]);
      })
      .catch(err => {
        if (err.response || err.request) {
          throw CryptowlError.fromAxiosError(err, "Error getting SurBTC markets.");
        } else {
          throw err;
        }
      });
  }

  getCurrent(markets = [], options = {}) {
    return Promise.all(
      markets.map(pair => {
        const exchange = pair.join("-").toLowerCase();
        return this.client
          .get(`/markets/${exchange}/ticker`)
          .then(({ data }) => {
            const ticker = data["ticker"];

            if (!ticker) {
              throw new CryptowlError("Error querying SurBTC.", { pair });
            }

            return {
              pair,
              last: ticker["last_price"],
              ask: ticker["min_ask"],
              bid: ticker["max_bid"],
              low: null,
              high: null,
              volume: ticker["volume"],
              timestamp: Date.now(),
              exchange: this.constructor.identifier,
              raw: options.raw === true ? ticker : undefined,
            };
          })
          .catch(err => {
            if (err.response || err.request) {
              throw CryptowlError.fromAxiosError(err, "Error querying SurBTC.", { pair });
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

module.exports = SurBTC;
