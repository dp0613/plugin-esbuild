"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _umi() {
  const data = require("umi");

  _umi = function _umi() {
    return data;
  };

  return data;
}

function _esbuildLoader() {
  const data = require("esbuild-loader");

  _esbuildLoader = function _esbuildLoader() {
    return data;
  };

  return data;
}

function _terserWebpackPlugin() {
  return require("terser-webpack-plugin");
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = api => {
  api.describe({
    key: 'esbuild',
    config: {
      schema(joi) {
        return joi.object({
          minify: joi.alternatives(joi.boolean())
        });
      }

    },
    enableBy: api.EnableBy.config
  });
  api.modifyBundleConfig((memo, {
    type
  }) => {
    if (memo.optimization) {
      const _ref = api.config.esbuild || {},
        _ref$minify = _ref.minify,
        minify = _ref$minify === void 0 ? true : _ref$minify;

      memo.optimization.minimize = minify;
      memo.optimization.minimizer = [new (_terserWebpackPlugin())()];
    }

    if (memo.plugins) {
      memo.plugins.push(new (_esbuildLoader().ESBuildPlugin)());
    }

    return memo;
  });
};

exports.default = _default;
