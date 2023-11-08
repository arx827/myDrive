const UglifyJsPlugin = require('terser-webpack-plugin');

const resolve = (dir) => path.join(__dirname, dir);

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const path = require('path');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const stringReplace = require('./stringReplace.json');

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);

// 編譯 打包設定 類似POM
module.exports = {
    publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
    runtimeCompiler: true,

    // 設定import路徑轉換
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@imgs', resolve('src/assets/imgs'))
            .set('@components', resolve('src/components'))
            .set('@shared', resolve('src/components/shared'))
            .set('@pages', resolve('src/pages'))
            .set('@plugins', resolve('src/plugins'))
            .set('@less', resolve('src/assets/less'))
            .set('@scss', resolve('src/assets/scss'));
    },

    configureWebpack: (config) => {
        // enable source-map
        config.devtool = 'source-map';

        config.output.filename = 'js/[name].[hash:8].js';
        config.output.chunkFilename = 'js/[name].[hash:8].js';
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
                new UglifyJsPlugin({ // 輕量化套件
                    terserOptions: {
                        warnings: true,
                        output: {
                            comments: false,
                            beautify: false,
                        },
                        compress: {
                            drop_console: true, // 忽略cosole log
                            drop_debugger: true,
                        },
                    },
                    parallel: true,
                }),
            );
            config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions));

            // 替換套件打包後的個資資訊..
            plugins.push(new ReplaceInFileWebpackPlugin([
                {
                  // 此處的路徑，要對照 編譯後的檔案路徑
                  dir: 'dist/js',
                  test: [/\.js$/, /\.js\.map$/],
                  rules: [
                    // 套用 stringReplace.json 裡面的 替換列表
                    ...stringReplace.options,
                  ],
                },
            ]));
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
        // 將 CSS 單獨抽離出來
        extract: {
            filename: 'css/[name].[hash:8].css',
            chunkFilename: 'css/[name].[hash:8].css',
        },
        loaderOptions: {
            scss: {
                additionalData: `
                    @import "~@scss/_varibles.scss";
					@import "~@scss/_mixin.scss";
                `,
            },
            less: {
                lessOptions: {
                    // https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
                    modifyVars: { // 定義樣式檔案在哪裡，可以定義一個less檔案囊括全部
                        'font-family': '"Source Sans Pro", sans-serif',
                        'primary-color': '#51B7A3',
                        'table-header-bg': '#FAFAFA',
                        'table-header-bg-sm': '#FAFAFA',
                        'table-padding-vertical': '16px',
                        'table-padding-horizontal': '16px',
                        hack: 'true; @import "~@/assets/less/base.less";',
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
    // 僅限local 為解決跨域問題，也要確認env.local
    productionSourceMap: false,
    devServer: { // url: /api/XXX/ -> http://localhost:8181
        proxy: {
            '/api': {
                target: 'http://localhost:8181',
                // target: process.env.VUE_APP_API_BASE_URL,
                ws: true,
                changOrigin: true,
                logLevel: 'debug',
            },
        },
    },
};
