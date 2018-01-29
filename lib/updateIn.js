"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

exports.__esModule = true;
exports.default = update;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/extends"));

var _propertyExpr = _interopRequireDefault(require("property-expr"));

var IS_ARRAY = /^\d+$/;

function update(model, path, value) {
  var parts = _propertyExpr.default.split(path),
      newModel = copy(model),
      part,
      islast;

  if (newModel == null) newModel = IS_ARRAY.test(parts[0]) ? [] : {};
  var current = newModel;

  for (var idx = 0; idx < parts.length; idx++) {
    islast = idx === parts.length - 1;
    part = clean(parts[idx]);
    if (islast) current[part] = value;else {
      current = current[part] = current[part] == null ? IS_ARRAY.test(parts[idx + 1]) ? [] : {} : copy(current[part]);
    }
  }

  return newModel;
}

function clean(part) {
  return isQuoted(part) ? part.substr(1, part.length - 2) : part;
}

function isQuoted(str) {
  return typeof str === 'string' && str && (str[0] === '"' || str[0] === "'");
}

function copy(value) {
  return Array.isArray(value) ? value.concat() : value !== null && typeof value === 'object' ? (0, _extends2.default)(new value.constructor(), value) : value;
}

module.exports = exports["default"];