'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = update;

var _propertyExpr = require('property-expr');

var _propertyExpr2 = _interopRequireDefault(_propertyExpr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IS_ARRAY = /^\d+$/;

function update(model, path, value) {
  var parts = _propertyExpr2.default.split(path),
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
  return Array.isArray(value) ? value.concat() : value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? Object.assign(new value.constructor(), value) : value;
}