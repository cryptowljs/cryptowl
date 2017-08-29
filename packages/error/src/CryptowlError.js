const ExtendableError = require("es6-error");

class CryptowlError extends ExtendableError {
  static fromAxiosError(err, message = "Axios error.", data = {}) {
    if (!err.response && !err.request) {
      throw new Error(`Error: ${err.message} is not an Axios error.`);
    }

    data.axios = {
      message: err.message,
      config: err.config,
      response: err.response,
      request: err.request,
    };
    return new CryptowlError(message, data);
  }

  constructor(message = "Unspecified Error", data = null) {
    super(message);
    this.data = data;
    this.isCryptowlError = true;
  }
}

module.exports = CryptowlError;
