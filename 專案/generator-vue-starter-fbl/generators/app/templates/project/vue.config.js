const UglifyJsPlugin = require("terser-webpack-plugin");

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_UAT = process.env.NODE_ENV === 'uat';


module.exports = {
    runtimeCompiler: true,
    publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
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
                            drop_console: false,
                            drop_debugger: false,
                        }
                    },
                    parallel: true
                })
            );
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