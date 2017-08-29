# @cryptolw/exchange-surbtc

Install this dependency with:

```sh
yarn add axios rxjs @cryptolw/error @cryptolw/exchange-surbtc
```

## Usage

```js
"use strict";

const SurBTC = require("@cryptolw/exchange-surbtc");
const CryptowlError = require("@cryptolw/error");

async function main() {
  const service = new SurBTC();

  try {
    const markets = await service.getMarkets();
    // ...
  } catch (err) {
    if (err instanceof CryptowlError) {
      // ...
    }
  }

  const observer = service.ticker$([["BTC", "CLP"], ["BTC", "COP"]], { interval: "5 min" })
    .subscribe(data => {
      console.log(data);
      // ...
    });

  // ...
}
```

The response object is like:

```js
[ { pair: [ 'BTC', 'CLP' ],
    last: [ '2869998.0', 'CLP' ],
    ask: [ '2870000.0', 'CLP' ],
    bid: [ '2826472.0', 'CLP' ],
    low: null,
    high: null,
    volume: [ '33.67458301', 'BTC' ],
    timestamp: 1503965145983,
    exchange: 'SurBTC',
    raw: undefined },
  { pair: [ 'BTC', 'COP' ],
    last: [ '11891014.0', 'COP' ],
    ask: [ '12299998.0', 'COP' ],
    bid: [ '11891016.0', 'COP' ],
    low: null,
    high: null,
    volume: [ '2.5626085', 'BTC' ],
    timestamp: 1503965145987,
    exchange: 'SurBTC',
    raw: undefined } ]
```
