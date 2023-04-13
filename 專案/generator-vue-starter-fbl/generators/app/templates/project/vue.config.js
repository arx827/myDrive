const UglifyJsPlugin = require("terser-webpack-plugin");
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);

module.exports = {
  runtimeCompiler: true,
  publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
  configureWebpack: config => {
    // enable source-map
    config.devtool = 'source-map';

    config.output.filename = 'js/[name].[hash:8].js';
    config.output.chunkFilename = 'js/[name].[hash:8].js';

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
              drop_console: true,
              drop_debugger: true,
            }
          },
          parallel: true
        })
      );

      plugins.push(new ReplaceInFileWebpackPlugin([
        {
          dir: 'dist/js',
          test: [/\.js$/, /\.js\.map$/],
          rules: [
            // 套用 stringReplace.json 裡面的 替換列表
            ...stringReplace.options.map((i) => ({
              search: new RegExp(i.search, 'ig'),
              replace: i.replace,
            })),

            // ----- 若想使用 全局替代的話 可以改用以下語法 ------ //
            // // 針對 版本號 替換
            // {
            //   search: /(\w+)@((\d\.)+\d)/ig,
            //   replace: '$1_$2',
            // },
            // // 針對 Email 替換
            // {
            //   search: /(\w+)@(([\da-z.-]+)\.com)/ig,
            //   replace: '$1_$2',
            // },
          ],
        },
      ]));
      config.plugins = [...config.plugins, ...plugins];
    }

  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'border-radius-base': '0px',
            // For compacted styling:
            // 'padding-lg': '24px',
            // 'padding-md': '16px',
            // 'padding-sm': '12px',
            // 'padding-xs': '8px',
            // 'table-padding-vertical': '4px',
            // 'border-color-base': '#d9d9d9',
            // 'border-width-base': '1px',
          },
          javascriptEnabled: true
        }
      },
    }
  }
}