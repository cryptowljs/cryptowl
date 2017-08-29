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
    last: [ 2868797, 'CLP' ],
    ask: [ 2850000, 'CLP' ],
    bid: [ 2820022, 'CLP' ],
    low: null,
    high: null,
    volume: [ 34.90968129, 'BTC' ],
    timestamp: 1503976550972,
    exchange: 'SurBTC',
    raw: undefined },
  { pair: [ 'BTC', 'COP' ],
    last: [ 11891014, 'COP' ],
    ask: [ 12299975, 'COP' ],
    bid: [ 11891014, 'COP' ],
    low: null,
    high: null,
    volume: [ 2.76326332, 'BTC' ],
    timestamp: 1503976550967,
    exchange: 'SurBTC',
    raw: undefined } ]
```
