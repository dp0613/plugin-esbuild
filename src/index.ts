import { IApi, BundlerConfigType } from 'umi';
import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader';

export default (api: IApi) => {
  api.describe({
    key: 'esbuild',
    config: {
      schema(joi) {
        return joi.object({
          target: joi.alternatives(
            joi.string(),
            joi.array().items(joi.string()),
          ),
          minify: joi.alternatives(
            joi.boolean(),
          ),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.modifyBundleConfig((memo, { type }) => {
    if (memo.optimization) {
      const { target = 'es2015' } = api.config.esbuild || {};
      const { minify = true } = api.config.esbuild || {};
      const optsMap = {
        [BundlerConfigType.csr]: {
          minify,
          target,
          exclude: 'node_modules/umi/node_modules/core-js/modules/es.number.to-fixed.js'
        },
        [BundlerConfigType.ssr]: {
          target: 'node10',
          minify,
          exclude: 'node_modules/umi/node_modules/core-js/modules/es.number.to-fixed.js'
        },
      };
      const opts = optsMap[type] || optsMap[BundlerConfigType.csr];
      memo.optimization.minimize = true;
      memo.optimization.minimizer = [new ESBuildMinifyPlugin(opts)];
    }
    if (memo.plugins) {
      memo.plugins.push(new ESBuildPlugin());
    }
    return memo;
  });
};
