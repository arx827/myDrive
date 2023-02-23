const UglifyJsPlugin = require('terser-webpack-plugin');

const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);

module.exports = {
    runtimeCompiler: true,
    publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
    chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@assets', resolve('src/assets'))
			.set('@images', resolve('src/assets/images'))
			.set('@scss', resolve('src/style'))
			.set('@product', resolve('src/pages/cf/TransactionManagement/Product'));
	},
    configureWebpack: (config) => {
    // enable source-map
    config.devtool = 'source-map';

    config.output.chunkFilename = '[name].[hash].js';

    config.output.filename = '[name].[hash].js';

    // enable uglify
    if (IS_PROD || IS_UAT) {
      const plugins = [];
      plugins.push(
        new UglifyJsPlugin({
          terserOptions: {
            warnings: true,
            output: {
              comments: false,
              beautify: false,
            },
            compress: {
              drop_console: false,
              drop_debugger: false,
            },
          },
          parallel: true,
        }),
      );
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
            @import "@/style/_varibles.scss";
            @import "@/style/_mixin.scss";
            @import "@/style/_bsCustom.scss";
          `,
      },
      less: {
        lessOptions: {
          modifyVars: {
            hack: 'true; @import "~@/assets/less/base.less";',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
