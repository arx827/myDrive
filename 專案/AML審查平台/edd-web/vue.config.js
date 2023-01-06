const UglifyJsPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

const IS_PROD = process.env.NODE_ENV === "production";
const IS_UAT = process.env.NODE_ENV === "uat";

module.exports = {
  runtimeCompiler: true,
  configureWebpack: (config) => {
    // enable source-map
    config.devtool = "source-map";

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
        })
      );
      plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  //Eslint忽略npm link資料夾
  // chainWebpack: (config) => {
  //   config.module
  //       .rule('eslint')
  //       .exclude
  //       .add('D:\\source_code\\repo_bitbucket\\edd-backend\\edd-api\\target\\sdk\\axios\\dist')
  //       .end()
  // },

  publicPath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : '/',
  css: {
    extract: true,
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            //=== For compacted styling ===//
            // "body-background": "#F0F2F5",
            // "border-radius-base": "0px",
            // "layout-header-background": "#fff",
            // "layout-header-height": "60px",

            //=== For compacted menu styling ===//
            // "menu-item-vertical-margin": "0",
            // "menu-item-boundary-margin": "0",
            // "menu-dark-color": "#fff",
            // "menu-dark-bg": "transparent",

            //=== reference ===//
            // https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: "tw",
      fallbackLocale: "tw",
      localeDir: "locales",
      enableInSFC: false,
    },
  },
};
