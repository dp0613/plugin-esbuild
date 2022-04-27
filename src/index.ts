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
      const { target = 'esnext' } = api.config.esbuild || {};
      const { minify = false } = api.config.esbuild || {};
      const optsMap = {
        [BundlerConfigType.csr]: {
          minifyIdentifiers: minify,
          minifyWhitespace: minify,
          minifySyntax: minify,
          target
        },
        [BundlerConfigType.ssr]: {
          target: 'node10',
          minifyIdentifiers: minify,
          minifyWhitespace: minify,
          minifySyntax: minify
        },
      };
      const opts = optsMap[type] || optsMap[BundlerConfigType.csr];
      memo.optimization.minimize = minify;
      memo.optimization.minimizer = [new ESBuildMinifyPlugin(opts)];
    }
    if (memo.plugins) {
      memo.plugins.push(new ESBuildPlugin());
    }
    return memo;
  });
};
