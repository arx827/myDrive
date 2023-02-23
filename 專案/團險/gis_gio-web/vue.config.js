const UglifyJsPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);

module.exports = {
  publicPath: (process.env.VUE_APP_PUBLIC_PATH) ? process.env.VUE_APP_PUBLIC_PATH : '/',
  lintOnSave: true,
  runtimeCompiler: true,
  chainWebpack: (config) => {
    // 打包分析
    // if (process.env.IS_ANALY) {
    //   config.plugin('webpack-report').use(BundleAnalyzerPlugin, [{
    //     analyzerMode: 'static',
    //   }]);
    // }
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@helpers', resolve('src/assets/helpers'))
      .set('@images', resolve('src/assets/images'))
      .set('@compononts', resolve('src/components'))
      .set('@scss', resolve('src/style'));
  },
  configureWebpack: (config) => {
    // enable source-map
    config.devtool = 'source-map';

    config.output.filename = '[name].[hash:8].js';
    config.output.chunkFilename = '[name].[hash:8].js';

    // enable uglify
    if (IS_PROD || IS_UAT) {
      const plugins = [];
      // get a reference to the existing ForkTsCheckerWebpackPlugin
      const existingForkTsChecker = config.plugins.filter(
        (p) => p instanceof ForkTsCheckerWebpackPlugin,
      )[0];

      // remove the existing ForkTsCheckerWebpackPlugin
      // so that we can replace it with our modified version
      config.plugins = config.plugins.filter(
        (p) => !(p instanceof ForkTsCheckerWebpackPlugin),
      );

      // copy the options from the original ForkTsCheckerWebpackPlugin
      // instance and add the memoryLimit property
      // 調整包版記憶體
      const forkTsCheckerOptions = existingForkTsChecker.options;
      forkTsCheckerOptions.workers = 4;
      forkTsCheckerOptions.memoryLimit = 8192;

      plugins.push(
        new UglifyJsPlugin({
          terserOptions: {
            warnings: true,
            output: {
              comments: false,
              beautify: false,
            },
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
          parallel: true,
        }),
      );
      config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions));
      config.plugins = [...config.plugins, ...plugins];
    }
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          bootstrap: {
            name: 'bootstrap',
            test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
            priority: 10,
          },
          antDesignVue: {
            name: 'chunk-ant-design-vue',
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            chunks: 'initial',
            priority: 3,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };
  },
  css: {
    extract: {
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name].[hash:8].css',
    },
    sourceMap: IS_PROD,
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@helpers/_var.scss";
          @import "~@helpers/_mixins.scss";
        `,
      },
      less: {
        lessOptions: {
          modifyVars: {
            'border-radius-base': '0px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  productionSourceMap: false,
  devServer: {
    proxy: {
      '^/api': {
        port: process.env.VUE_APP_API_BASE_URL_PORT,
        target: process.env.VUE_APP_AXIOS_API_BASE_URL,
        ws: true,
        changOrigin: true,
      },
    },
  },
};
