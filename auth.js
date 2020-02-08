var dotenv = require("dotenv");
dotenv.config()

function define(obj, name, value) {
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: true,
    writable: false,
    configurable: false
  });
}

exports.config = {};

define(exports.config, "HOST", 'localhost:10002');
define(exports.config, "CERT", process.env.CERT);
define(exports.config, "AUTH", process.env.AUTH);