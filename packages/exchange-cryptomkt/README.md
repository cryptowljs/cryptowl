# @cryptolw/exchange-cryptomkt

Install this dependency with:

```sh
yarn add axios rxjs @cryptolw/error @cryptolw/exchange-cryptomkt
```

## Usage

```js
"use strict";

const CryptoMKT = require("@cryptolw/exchange-cryptomkt");
const CryptowlError = require("@cryptolw/error");

async function main() {
  const service = new CryptoMKT();

  try {
    const markets = await service.getMarkets();
    // ...
  } catch (err) {
    if (err instanceof CryptowlError) {
      // ...
    }
  }

  const observer = service.ticker$([["ETH", "CLP"], ["ETH", "ARS"]], { interval: "5 min" })
    .subscribe(data => {
      console.log(data);
      // ...
    });

  // ...
}
```
