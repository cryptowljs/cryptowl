const axios = require("axios");
const ms = require("millisecond");

const Observable = require("rxjs/Observable").Observable;
require("rxjs/add/observable/interval");
require("rxjs/add/operator/startWith");
require("rxjs/add/operator/mergeMap");

const parse = require("@cryptolw/money-parse");
const CryptowlError = require("@cryptolw/error");

class APILayer {
  static identifier = "APILayer";

  static defaults = {
    baseURL: "http://apilayer.net/api/",
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
    const params = {
      access_key: this.options.apiKey,
    };
    return this.client.get("/list", { params }).then(({ data }) => {
      return Object.keys(data["currencies"]);
    });
  }

  getCurrent(currencies = [], options = {}) {
    const params = {
      access_key: this.options.apiKey,
      source: options.from || "USD",
      currencies: currencies.join(","),
      format: 0,
    };
    return this.client
      .get("/live", { params })
      .then(({ data }) => {
        if (data["success"]) {
          return data;
        } else {
          throw new CryptowlError("Error querying apilayer.net", data);
        }
      })
      .then(data => {
        const source = data["source"]; // equal to options["source"]
        return Object.entries(data["quotes"]).map(([currency, value]) => {
          return {
            code: currency.replace(source, ""),
            rate: parse(1 / value, source),
            raw: options.raw === true ? value : undefined,
          };
        });
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

module.exports = APILayer;
