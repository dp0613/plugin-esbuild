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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = api => {
  api.describe({
    key: 'esbuild',
    config: {
      schema(joi) {
        return joi.object({
          target: joi.alternatives(joi.string(), joi.array().items(joi.string())),
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
            _ref$target = _ref.target,
            _ref$minify = _ref.minify,
            target = _ref$target === void 0 ? 'esnext' : _ref$target,
            minify = _ref$minify === void 0 ? false : _ref$minify;

      const optsMap = {
        [_umi().BundlerConfigType.csr]: {
          minify,
          target
        },
        [_umi().BundlerConfigType.ssr]: {
          target: 'node10',
          minify
        }
      };

      const opts = optsMap[type] || optsMap[_umi().BundlerConfigType.csr];

      memo.optimization.minimize = true;
      memo.optimization.minimizer = [new (_esbuildLoader().ESBuildMinifyPlugin)(opts)];
    }

    if (memo.plugins) {
      memo.plugins.push(new (_esbuildLoader().ESBuildPlugin)());
    }

    return memo;
  });
};

exports.default = _default;
