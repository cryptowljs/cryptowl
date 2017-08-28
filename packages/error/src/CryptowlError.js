const ExtendableError = require("es6-error");

class CryptowlError extends ExtendableError {
  constructor(message = "Unspecified Error", data = null) {
    super(message);
    this.data = data;
    this.isCryptowlError = true;
  }
}

module.exports = CryptowlError;
