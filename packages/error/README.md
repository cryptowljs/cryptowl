# @cryptolw/error

Install this dependency with:

```sh
yarn add @cryptolw/error
```

## Usage

```js
"use strict";

const CryptowlError = require("@cryptolw/error");

try {
  throw new CryptowlError("Message", { extra: [1, 2, 3] });
  // ...
} catch (err) {
  if (err.isCryptowlError || err instanceof CryptowlError) {
    // ...
  } else {
    throw err; // Unknown error.
  }
}
```
