import { IApi, BundlerConfigType } from 'umi';
import { ESBuildPlugin } from 'esbuild-loader';
import { TerserPlugin } from 'terser-webpack-plugin';

export default (api: IApi) => {
  api.describe({
    key: 'esbuild',
    config: {
      schema(joi) {
        return joi.object({
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
      const { minify = true } = api.config.esbuild || {};
      memo.optimization.minimize = minify;
      memo.optimization.minimizer = [new TerserPlugin()];
    }
    if (memo.plugins) {
      memo.plugins.push(new ESBuildPlugin());
    }
    return memo;
  });
};
