const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const UglifyJsPlugin = require("terser-webpack-plugin");

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_UAT = process.env.NODE_ENV === 'uat';


module.exports = {
  publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@shared', resolve('src/components/shared'))
      .set('@less', resolve('src/assets/less'))
  },
  configureWebpack: config => {
    // enable source-map
    config.devtool = 'source-map'

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
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  css: {
    // 將 CSS 單獨抽離出來
    extract: {
      chunkFilename: 'css/[name].css',
    },
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'hack': `true; @import "~@/assets/less/themes.less";`
          },
          javascriptEnabled: true
        }
      },
    }
  },
  crossorigin:"",
  devServer: {
    proxy: {
      '/api': {
        target : 'http://localhost:8181',
        // target: 'http://sdtwlvx00343/obd-api/',        
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}